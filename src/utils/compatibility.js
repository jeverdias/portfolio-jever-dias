import { defaultProjects, projectTypes } from '../data/projects.js'
import { defaultSiteClassification, siteClassifications } from '../data/siteClassifications.js'
import { createDefaultSiteConfig } from '../core/config/defaultSiteConfig.js'
import { normalizeSiteConfig } from '../core/config/normalizeSiteConfig.js'

export { createDefaultSiteConfig, normalizeSiteConfig }

export const SITE_STORAGE_KEY = 'jd-portfolio-site-v1'
export const PROJECTS_STORAGE_KEY = 'jd-portfolio-projects-v1'
export const CONTACT_STORAGE_KEY = 'jd-contact-last-submit'
export const AI_MIGRATION_KEY = 'jd-portfolio-ai-category-v1'
export const PUBLIC_SITE_CLASSIFICATION_ID = defaultSiteClassification

export const readSiteCache = (storage = globalThis.localStorage) => {
  try {
    const saved = storage?.getItem(SITE_STORAGE_KEY)
    return saved ? normalizeSiteConfig(JSON.parse(saved)) : normalizeSiteConfig()
  } catch {
    return normalizeSiteConfig()
  }
}

export const normalizeProjectData = (project = {}) => {
  const categoryLooksLikeStatus = /^(em andamento|conclu[ií]do|em prepara[cç][aã]o|planejado|pausado|rascunho)$/i.test(project.category?.trim() || '')
  const normalized = {
    theme: '',
    contentFormat: '',
    audience: '',
    challenge: '',
    solution: '',
    results: '',
    duration: '',
    contribution: '',
    typeLabel: projectTypes[project.type] || 'Projeto',
    displayModelId: project.type || 'website',
    presentation: project.type === 'powerbi' ? 'embed' : project.type === 'website' ? 'live' : project.type === 'ai' ? 'assistant' : 'gallery',
    status: categoryLooksLikeStatus ? project.category : 'Concluído',
    ...project,
    category: categoryLooksLikeStatus ? 'Projetos' : (project.category || 'Projetos'),
    featured: project.featured !== false,
  }
  return {
    ...normalized,
    tags: Array.isArray(project.tags) ? [...project.tags] : [],
    gallery: Array.isArray(project.gallery) ? [...project.gallery] : [],
  }
}

export const cloneDefaultProjects = () => defaultProjects.map(normalizeProjectData)

export const readProjectsCache = (storage = globalThis.localStorage) => {
  try {
    const saved = storage?.getItem(PROJECTS_STORAGE_KEY)
    if (!saved) {
      storage?.setItem(AI_MIGRATION_KEY, '1')
      return cloneDefaultProjects()
    }
    const parsed = JSON.parse(saved)
    if (!Array.isArray(parsed) || !parsed.length) return cloneDefaultProjects()
    const normalized = parsed.map(normalizeProjectData)
    if (storage?.getItem(AI_MIGRATION_KEY) !== '1') {
      const aiTemplate = defaultProjects.find((project) => project.type === 'ai')
      if (aiTemplate && !normalized.some((project) => project.type === 'ai')) normalized.push(normalizeProjectData(aiTemplate))
      storage?.setItem(AI_MIGRATION_KEY, '1')
      storage?.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(normalized))
    }
    return normalized
  } catch {
    return cloneDefaultProjects()
  }
}

export const selectPublicProjects = (projects = []) => (
  Array.isArray(projects) ? projects.filter((project) => project?.featured !== false) : []
)

export const getPublicClassification = () => (
  siteClassifications.find((item) => item.id === PUBLIC_SITE_CLASSIFICATION_ID)
)
