import { useCallback, useState } from 'react'
import { defaultProjects } from '../data/projects'

const STORAGE_KEY = 'jd-portfolio-projects-v1'

const cloneDefaults = () => defaultProjects.map((project) => ({ ...project, tags: [...project.tags] }))

const readProjects = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return cloneDefaults()
    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) && parsed.length ? parsed : cloneDefaults()
  } catch {
    return cloneDefaults()
  }
}

export function useProjectStore() {
  const [projects, setProjects] = useState(readProjects)

  const persist = useCallback((next) => {
    setProjects(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const addProject = useCallback(() => {
    const id = `projeto-${Date.now()}`
    const project = {
      id,
      title: 'Novo projeto',
      category: 'Projetos',
      type: 'website',
      description: 'Escreva uma descrição curta e objetiva para este projeto.',
      details: 'Conte o desafio, a solução criada e o resultado alcançado.',
      tags: ['Nova tecnologia'],
      image: '',
      preview: 'system',
      embedUrl: '',
      externalUrl: '',
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

  const removeProject = useCallback(
    (id) => persist(projects.filter((project) => project.id !== id)),
    [persist, projects],
  )

  const moveProject = useCallback(
    (id, direction) => {
      const index = projects.findIndex((project) => project.id === id)
      const target = index + direction
      if (index < 0 || target < 0 || target >= projects.length) return
      const next = [...projects]
      ;[next[index], next[target]] = [next[target], next[index]]
      persist(next)
    },
    [persist, projects],
  )

  const importProjects = useCallback(
    (payload) => {
      const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload
      if (!Array.isArray(parsed) || !parsed.every((item) => item.id && item.title && item.type)) {
        throw new Error('O arquivo não contém uma lista válida de projetos.')
      }
      persist(parsed)
    },
    [persist],
  )

  const resetProjects = useCallback(() => persist(cloneDefaults()), [persist])

  return { projects, addProject, updateProject, removeProject, moveProject, importProjects, resetProjects }
}
