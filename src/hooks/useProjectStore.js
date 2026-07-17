import { useCallback, useEffect, useRef, useState } from 'react'
import { isSupabaseConfigured, removePortfolioAsset, supabase, uploadPortfolioAsset } from '../lib/supabase'
import { validateProjectsImport } from '../utils/validation'
import {
  cloneDefaultProjects,
  normalizeProjectData,
  PROJECTS_STORAGE_KEY,
  readProjectsCache,
} from '../utils/compatibility'

const SAVE_DELAY = 700

export function useProjectStore() {
  const [projects, setProjects] = useState(readProjectsCache)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState('')
  const [saveStatus, setSaveStatus] = useState('idle')
  const saveTimerRef = useRef(null)
  const pendingRowsRef = useRef(new Map())

  const refresh = useCallback(async () => {
    if (!supabase) return
    const { data, error: loadError } = await supabase.from('portfolio_projects').select('id, data, featured, position').order('position')
    if (loadError) setError('Não foi possível carregar os projetos online.')
    if (data?.length) {
      const next = data.map((row) => normalizeProjectData({ ...row.data, id: row.id, featured: row.featured }))
      setProjects(next)
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(next))
    }
    setLoading(false)
  }, [])

  // A leitura é assíncrona; não há atualização síncrona de estado dentro do efeito.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void refresh() }, [refresh])

  const flushOnline = useCallback(async () => {
    if (!supabase || !pendingRowsRef.current.size) return
    const rows = [...pendingRowsRef.current.values()]
    pendingRowsRef.current.clear()
    setSaveStatus('saving')
    let saveError = null
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const response = await supabase.from('portfolio_projects').upsert(rows)
      saveError = response.error
      if (!saveError) break
      if (attempt < 2) await new Promise((resolve) => window.setTimeout(resolve, 2000 * (attempt + 1)))
    }
    if (saveError) {
      rows.forEach((row) => {
        if (!pendingRowsRef.current.has(row.id)) pendingRowsRef.current.set(row.id, row)
      })
    }
    setError(saveError ? 'A alteração ficou local, mas ainda não foi salva no Supabase.' : '')
    setSaveStatus(saveError ? 'error' : pendingRowsRef.current.size ? 'pending' : 'saved')
  }, [])

  const queueOnlineRows = useCallback((next, changedIds = next.map((project) => project.id)) => {
    if (!supabase || !changedIds.length) return
    const changed = new Set(changedIds)
    next.forEach((project, position) => {
      if (!changed.has(project.id)) return
      pendingRowsRef.current.set(project.id, {
        id: project.id,
        data: project,
        featured: Boolean(project.featured),
        position,
        updated_at: new Date().toISOString(),
      })
    })
    window.clearTimeout(saveTimerRef.current)
    setSaveStatus('pending')
    saveTimerRef.current = window.setTimeout(() => { void flushOnline() }, SAVE_DELAY)
  }, [flushOnline])

  useEffect(() => () => window.clearTimeout(saveTimerRef.current), [])

  const persist = useCallback((next, changedIds) => {
    setProjects(next)
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(next))
    queueOnlineRows(next, changedIds)
  }, [queueOnlineRows])

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
    pendingRowsRef.current.delete(id)
    persist(projects.filter((project) => project.id !== id), [])
    if (supabase) {
      setSaveStatus('saving')
      void supabase.from('portfolio_projects').delete().eq('id', id).then(({ error: deleteError }) => {
        setError(deleteError ? 'O projeto foi removido localmente, mas não foi excluído do Supabase.' : '')
        setSaveStatus(deleteError ? 'error' : pendingRowsRef.current.size ? 'pending' : 'saved')
        if (!deleteError) {
          const assets = [removed?.image, ...(removed?.gallery || [])].filter(Boolean)
          void Promise.allSettled(assets.map((url) => removePortfolioAsset(url)))
        }
      })
    }
  }, [persist, projects])

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
