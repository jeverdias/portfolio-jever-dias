import { useCallback, useEffect, useRef, useState } from 'react'
import { isSupabaseConfigured, removePortfolioAsset, supabase, uploadPortfolioAsset } from '../lib/supabase.js'
import { validateProjectsImport } from '../utils/validation.js'
import {
  cloneDefaultProjects,
  normalizeProjectData,
  PROJECTS_STORAGE_KEY,
  readProjectsCache,
} from '../utils/compatibility.js'
import { localStorageAdapter } from '../core/persistence/localStorageAdapter.js'
import { createPersistenceQueue } from '../core/persistence/persistenceQueue.js'
import { PERSISTENCE_STATUS } from '../core/persistence/persistenceStatus.js'
import { createSupabaseAdapter, isTransientPersistenceError } from '../core/persistence/supabaseAdapter.js'

const SAVE_DELAY = 700
const remotePersistence = createSupabaseAdapter(supabase)

export const coalesceProjectOperations = (current = [], incoming = []) => {
  const operations = new Map(current.map((operation) => [operation.id, operation]))
  incoming.forEach((operation) => operations.set(operation.id, operation))
  return [...operations.values()]
}

export function useProjectStore() {
  const [projects, setProjects] = useState(readProjectsCache)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState('')
  const [saveStatus, setSaveStatus] = useState(PERSISTENCE_STATUS.IDLE)
  const queueRef = useRef(null)

  const createQueue = useCallback(() => createPersistenceQueue({
    delay: SAVE_DELAY,
    coalesce: coalesceProjectOperations,
    isRetryable: isTransientPersistenceError,
    save: async (operations) => {
      const rows = operations.filter((item) => item.kind === 'upsert').map((item) => item.row)
      const removals = operations.filter((item) => item.kind === 'delete')
      if (rows.length) await remotePersistence.saveProjects(rows)
      for (const removal of removals) {
        await remotePersistence.deleteProject(removal.id)
        await Promise.allSettled((removal.assets || []).map((url) => removePortfolioAsset(url)))
      }
    },
    onStatus: (status) => {
      setSaveStatus(status)
      if (status === PERSISTENCE_STATUS.ERROR) setError('A alteração ficou local, mas ainda não foi salva no Supabase.')
      if (status === PERSISTENCE_STATUS.SAVED) setError('')
    },
  }), [])

  const ensureQueue = useCallback(() => {
    if (!supabase) return null
    if (!queueRef.current || queueRef.current.isDisposed()) queueRef.current = createQueue()
    return queueRef.current
  }, [createQueue])

  useEffect(() => {
    ensureQueue()
    return () => {
      queueRef.current?.dispose()
      queueRef.current = null
    }
  }, [ensureQueue])

  const writeCache = useCallback((next) => {
    const result = localStorageAdapter.writeJson(PROJECTS_STORAGE_KEY, next)
    if (!result.ok) setError('As alterações estão nesta sessão, mas não puderam ser armazenadas neste navegador.')
    return result.ok
  }, [])

  const refresh = useCallback(async () => {
    if (!supabase) {
      setLoading(false)
      return
    }
    try {
      const data = await remotePersistence.loadProjects()
      if (data.length) {
        const next = data.map((row) => normalizeProjectData({ ...row.data, id: row.id, featured: row.featured }))
        setProjects(next)
        writeCache(next)
      }
    } catch {
      setError('Não foi possível carregar os projetos online.')
    } finally {
      setLoading(false)
    }
  }, [writeCache])

  // A hidratação apenas lê e normaliza; ela não entra na fila de salvamento.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void refresh() }, [refresh])

  const queueOperations = useCallback((operations, options) => {
    if (!operations.length) return
    void ensureQueue()?.enqueue(operations, options)
  }, [ensureQueue])

  const persist = useCallback((next, changedIds = next.map((project) => project.id)) => {
    setProjects(next)
    writeCache(next)
    const changed = new Set(changedIds)
    const operations = next.flatMap((project, position) => changed.has(project.id) ? [{
      kind: 'upsert',
      id: project.id,
      row: {
        id: project.id,
        data: project,
        featured: Boolean(project.featured),
        position,
        updated_at: new Date().toISOString(),
      },
    }] : [])
    queueOperations(operations)
  }, [queueOperations, writeCache])

  const addProject = useCallback(() => {
    const id = `projeto-${Date.now()}`
    const project = {
      id,
      title: 'Novo projeto',
      theme: 'Tema do projeto',
      category: 'Projetos',
      type: 'website',
      typeLabel: 'Sistema Web',
      displayModelId: 'website',
      presentation: 'live',
      status: 'Em andamento',
      description: 'Escreva uma descrição curta e objetiva para este projeto.',
      details: 'Conte o desafio, a solução criada e o resultado alcançado.',
      tags: ['Nova tecnologia'],
      image: '',
      gallery: [],
      preview: 'system',
      embedUrl: '',
      externalUrl: '',
      contentFormat: '',
      audience: '',
      challenge: '',
      solution: '',
      results: '',
      duration: '',
      contribution: '',
      featured: true,
      accent: '#6f7cff',
    }
    persist([...projects, project], [id])
    return id
  }, [persist, projects])

  const updateProject = useCallback(
    (id, changes) => persist(projects.map((project) => (project.id === id ? { ...project, ...changes } : project)), [id]),
    [persist, projects],
  )

  const removeProject = useCallback((id) => {
    const removed = projects.find((project) => project.id === id)
    const next = projects.filter((project) => project.id !== id)
    setProjects(next)
    writeCache(next)
    queueOperations([{
      kind: 'delete',
      id,
      assets: [removed?.image, ...(removed?.gallery || [])].filter(Boolean),
    }], { immediate: true })
  }, [projects, queueOperations, writeCache])

  const moveProject = useCallback((id, direction) => {
    const index = projects.findIndex((project) => project.id === id)
    const target = index + direction
    if (index < 0 || target < 0 || target >= projects.length) return
    const next = [...projects]
    ;[next[index], next[target]] = [next[target], next[index]]
    persist(next, [next[index].id, next[target].id])
  }, [persist, projects])

  const replaceDisplayModel = useCallback((modelId, fallback) => {
    const previews = { powerbi: 'dashboard', website: 'system', content: 'content', ai: 'ai' }
    const affected = projects.filter((project) => project.displayModelId === modelId).map((project) => project.id)
    persist(projects.map((project) => project.displayModelId === modelId ? {
      ...project,
      displayModelId: fallback.id,
      type: fallback.behavior,
      presentation: fallback.presentation,
      preview: previews[fallback.behavior],
    } : project), affected)
  }, [persist, projects])

  const importProjects = useCallback((payload) => {
    persist(validateProjectsImport(payload).map(normalizeProjectData))
  }, [persist])

  const resetProjects = useCallback(() => persist(cloneDefaultProjects()), [persist])

  const uploadImage = useCallback((file, projectId, purpose = 'galeria') => (
    uploadPortfolioAsset(file, `projetos/${projectId}/${purpose}`)
  ), [])
  const removeImage = useCallback((url) => removePortfolioAsset(url), [])

  return {
    projects,
    loading,
    error,
    saveStatus,
    mode: isSupabaseConfigured ? 'supabase' : 'local',
    addProject,
    updateProject,
    removeProject,
    moveProject,
    replaceDisplayModel,
    importProjects,
    resetProjects,
    uploadImage,
    removeImage,
    refresh,
  }
}
