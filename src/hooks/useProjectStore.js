import { useCallback, useEffect, useState } from 'react'
import { defaultProjects } from '../data/projects'
import { isSupabaseConfigured, supabase, uploadPortfolioAsset } from '../lib/supabase'

const STORAGE_KEY = 'jd-portfolio-projects-v1'
const AI_MIGRATION_KEY = 'jd-portfolio-ai-category-v1'

const normalizeProject = (project) => {
  const normalized = { theme: '', contentFormat: '', audience: '', ...project }
  return {
    ...normalized,
    tags: Array.isArray(project.tags) ? [...project.tags] : [],
    gallery: Array.isArray(project.gallery) ? [...project.gallery] : [],
  }
}

const cloneDefaults = () => defaultProjects.map(normalizeProject)

const readProjects = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) {
      localStorage.setItem(AI_MIGRATION_KEY, '1')
      return cloneDefaults()
    }
    const parsed = JSON.parse(saved)
    if (!Array.isArray(parsed) || !parsed.length) return cloneDefaults()
    const normalized = parsed.map(normalizeProject)
    if (localStorage.getItem(AI_MIGRATION_KEY) !== '1') {
      const aiTemplate = defaultProjects.find((project) => project.type === 'ai')
      if (aiTemplate && !normalized.some((project) => project.type === 'ai')) normalized.push(normalizeProject(aiTemplate))
      localStorage.setItem(AI_MIGRATION_KEY, '1')
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
    }
    return normalized
  } catch {
    return cloneDefaults()
  }
}

export function useProjectStore() {
  const [projects, setProjects] = useState(readProjects)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    if (!supabase) return
    const { data, error: loadError } = await supabase.from('portfolio_projects').select('id, data, featured, position').order('position')
    if (loadError) setError('Não foi possível carregar os projetos online.')
    if (data?.length) {
      const next = data.map((row) => normalizeProject({ ...row.data, id: row.id, featured: row.featured }))
      setProjects(next)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    }
    setLoading(false)
  }, [])

  // A leitura é assíncrona; não há atualização síncrona de estado dentro do efeito.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void refresh() }, [refresh])

  const saveOnline = useCallback(async (project, position) => {
    if (!supabase) return
    const { error: saveError } = await supabase.from('portfolio_projects').upsert({
      id: project.id,
      data: project,
      featured: Boolean(project.featured),
      position,
      updated_at: new Date().toISOString(),
    })
    setError(saveError ? 'A alteração ficou local, mas ainda não foi salva no Supabase.' : '')
  }, [])

  const persist = useCallback((next) => {
    setProjects(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    next.forEach((project, index) => { void saveOnline(project, index) })
  }, [saveOnline])

  const addProject = useCallback(() => {
    const id = `projeto-${Date.now()}`
    const project = {
      id,
      title: 'Novo projeto',
      theme: 'Tema do projeto',
      category: 'Projetos',
      type: 'website',
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
      featured: true,
      accent: '#6f7cff',
    }
    persist([...projects, project])
    return id
  }, [persist, projects])

  const updateProject = useCallback(
    (id, changes) => persist(projects.map((project) => (project.id === id ? { ...project, ...changes } : project))),
    [persist, projects],
  )

  const removeProject = useCallback((id) => {
    persist(projects.filter((project) => project.id !== id))
    if (supabase) void supabase.from('portfolio_projects').delete().eq('id', id)
  }, [persist, projects])

  const moveProject = useCallback((id, direction) => {
    const index = projects.findIndex((project) => project.id === id)
    const target = index + direction
    if (index < 0 || target < 0 || target >= projects.length) return
    const next = [...projects]
    ;[next[index], next[target]] = [next[target], next[index]]
    persist(next)
  }, [persist, projects])

  const importProjects = useCallback((payload) => {
    const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload
    if (!Array.isArray(parsed) || !parsed.every((item) => item.id && item.title && item.type)) {
      throw new Error('O arquivo não contém uma lista válida de projetos.')
    }
    persist(parsed.map(normalizeProject))
  }, [persist])

  const resetProjects = useCallback(() => persist(cloneDefaults()), [persist])

  const uploadImage = useCallback((file, projectId, purpose = 'galeria') => (
    uploadPortfolioAsset(file, `projetos/${projectId}/${purpose}`)
  ), [])

  return {
    projects,
    loading,
    error,
    mode: isSupabaseConfigured ? 'supabase' : 'local',
    addProject,
    updateProject,
    removeProject,
    moveProject,
    importProjects,
    resetProjects,
    uploadImage,
    refresh,
  }
}
