import { hasTemplateCapability } from './templateCapabilities.js'
import { listSections } from './sectionRegistry.js'
import { DEFAULT_TEMPLATE_ID, getTemplateDefinition } from './templateRegistry.js'
import { resolveSections as resolveSectionsFromDefinition } from './resolveSections.js'

const registeredSections = listSections()
const knownSectionIds = registeredSections.map(({ id }) => id)
const requiredSectionIds = registeredSections.filter(({ required }) => required).map(({ id }) => id)
const knownSections = new Set(knownSectionIds)

export const TEMPLATE_CONTEXT = Object.freeze({
  PUBLIC: 'public',
  ADMIN_PREVIEW: 'admin-preview',
  ADMIN_EDITOR: 'admin-editor',
})

export function resolveTemplate({ requestedTemplateId, context = TEMPLATE_CONTEXT.PUBLIC } = {}) {
  const fallback = getTemplateDefinition(DEFAULT_TEMPLATE_ID)
  if (context === TEMPLATE_CONTEXT.PUBLIC) return fallback

  const requested = getTemplateDefinition(requestedTemplateId)
  if (!requested) return fallback
  if (context === TEMPLATE_CONTEXT.ADMIN_PREVIEW && !requested.previewEnabled) return fallback
  if (context === TEMPLATE_CONTEXT.ADMIN_EDITOR) return requested
  if (context !== TEMPLATE_CONTEXT.ADMIN_PREVIEW) return fallback
  return requested
}

export const templateSupportsCapability = (templateOrId, capability) => {
  const template = typeof templateOrId === 'string' ? getTemplateDefinition(templateOrId) : templateOrId
  return hasTemplateCapability(template, capability)
}

export const templateAllowsSection = (templateOrId, sectionId) => {
  const template = typeof templateOrId === 'string' ? getTemplateDefinition(templateOrId) : templateOrId
  return Boolean(template && knownSections.has(sectionId) && template.sections.includes(sectionId))
}

export const getDefaultTemplateSections = (templateOrId) => {
  const template = typeof templateOrId === 'string' ? getTemplateDefinition(templateOrId) : templateOrId
  return template ? [...template.defaultSectionOrder] : []
}

export const resolveSections = ({ template: templateOrId, ...options } = {}) => {
  const template = typeof templateOrId === 'string' ? getTemplateDefinition(templateOrId) : templateOrId
  return resolveSectionsFromDefinition({ knownSectionIds, requiredSectionIds, ...options, template })
}
