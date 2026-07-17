import { hasTemplateCapability } from './templateCapabilities.js'
import { getSectionDefinition, isKnownSection } from './sectionRegistry.js'
import { DEFAULT_TEMPLATE_ID, getTemplateDefinition } from './templateRegistry.js'

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
  return Boolean(template && isKnownSection(sectionId) && template.sections.includes(sectionId))
}

export const getDefaultTemplateSections = (templateOrId) => {
  const template = typeof templateOrId === 'string' ? getTemplateDefinition(templateOrId) : templateOrId
  return template ? [...template.defaultSectionOrder] : []
}

export function resolveSections({ template: templateOrId, visibility = {}, preferredOrder, availableSections } = {}) {
  const template = typeof templateOrId === 'string' ? getTemplateDefinition(templateOrId) : templateOrId
  if (!template) return []

  const allowed = new Set(template.sections.filter(isKnownSection))
  const available = Array.isArray(availableSections) ? new Set(availableSections) : allowed
  const required = new Set([...allowed].filter((id) => getSectionDefinition(id)?.required))
  const emptyOrderIsIntentional = Array.isArray(preferredOrder) && preferredOrder.length === 0
  const sourceOrder = Array.isArray(preferredOrder) && preferredOrder.length
    ? [...preferredOrder, ...template.defaultSectionOrder]
    : emptyOrderIsIntentional
      ? [...required]
      : template.defaultSectionOrder

  const result = []
  for (const id of sourceOrder) {
    if (!allowed.has(id) || !available.has(id) || result.includes(id)) continue
    if (visibility?.[id] === false && !required.has(id)) continue
    result.push(id)
  }
  for (const id of required) {
    if (available.has(id) && !result.includes(id)) result.push(id)
  }
  return result
}
