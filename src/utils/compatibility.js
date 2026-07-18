import { defaultProjects, projectTypes } from '../data/projects.js'
import { siteClassifications } from '../data/siteClassifications.js'
import { createDefaultSiteConfig } from '../core/config/defaultSiteConfig.js'
import { normalizeSiteConfig } from '../core/config/normalizeSiteConfig.js'
import { PUBLIC_TEMPLATE_ID } from '../core/site-engine/publicTemplatePolicy.js'
import {
  CONTACT_STORAGE_KEY,
  createLocalStorageAdapter,
  localStorageAdapter,
  PROJECTS_STORAGE_KEY,
  SITE_STORAGE_KEY,
} from '../core/persistence/localStorageAdapter.js'

export { createDefaultSiteConfig, normalizeSiteConfig }
export { CONTACT_STORAGE_KEY, PROJECTS_STORAGE_KEY, SITE_STORAGE_KEY }
export const AI_MIGRATION_KEY = 'jd-portfolio-ai-category-v1'
export const PUBLIC_SITE_CLASSIFICATION_ID = PUBLIC_TEMPLATE_ID

const resolveStorageAdapter = (storage) => storage === undefined
  ? localStorageAdapter
  : createLocalStorageAdapter(storage)

export const readSiteCache = (storage) => {
  const result = resolveStorageAdapter(storage).readJson(SITE_STORAGE_KEY)
  return result.ok && result.found ? normalizeSiteConfig(result.value) : normalizeSiteConfig()
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

export const readProjectsCache = (storage) => {
  const adapter = resolveStorageAdapter(storage)
  const cached = adapter.readJson(PROJECTS_STORAGE_KEY)
  if (!cached.ok) return cloneDefaultProjects()
  if (!cached.found) {
    adapter.writeRaw(AI_MIGRATION_KEY, '1')
    return cloneDefaultProjects()
  }
  if (!Array.isArray(cached.value) || !cached.value.length) return cloneDefaultProjects()
  const normalized = cached.value.map(normalizeProjectData)
  if (adapter.readRaw(AI_MIGRATION_KEY).value !== '1') {
    const aiTemplate = defaultProjects.find((project) => project.type === 'ai')
    if (aiTemplate && !normalized.some((project) => project.type === 'ai')) normalized.push(normalizeProjectData(aiTemplate))
    adapter.writeRaw(AI_MIGRATION_KEY, '1')
    adapter.writeJson(PROJECTS_STORAGE_KEY, normalized)
  }
  return normalized
}

export const selectPublicProjects = (projects = []) => (
  Array.isArray(projects) ? projects.filter((project) => project?.featured !== false) : []
)

export const getPublicClassification = () => (
  siteClassifications.find((item) => item.id === PUBLIC_SITE_CLASSIFICATION_ID)
)
