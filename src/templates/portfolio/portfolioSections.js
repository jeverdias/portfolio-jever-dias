import { resolveSections } from '../../core/site-engine/resolveSections.js'
import { resolvePublicTemplate } from '../../core/site-engine/publicTemplatePolicy.js'
import { getPublicSectionIds, getRequiredPublicSectionIds, listPublicSections } from '../../core/site-engine/publicSectionRegistry.js'

export const PORTFOLIO_PUBLIC_SECTION_IDS = Object.freeze(getPublicSectionIds())

export const PORTFOLIO_SECTION_ANCHORS = Object.freeze(Object.fromEntries(listPublicSections().map(({ id, anchorId }) => [id, anchorId])))

const asVisibility = (visibility) => (
  visibility && typeof visibility === 'object' && !Array.isArray(visibility) ? visibility : {}
)

const asRegisteredSections = (sectionIds) => (
  Array.isArray(sectionIds) ? [...new Set(sectionIds.filter((id) => typeof id === 'string'))] : [...PORTFOLIO_PUBLIC_SECTION_IDS]
)

export function createPublicRenderPlan({ requestedTemplateId, siteConfig, registeredSectionIds } = {}) {
  const config = siteConfig && typeof siteConfig === 'object' && !Array.isArray(siteConfig) ? siteConfig : {}
  const template = resolvePublicTemplate(requestedTemplateId ?? config.siteClassificationId)
  const visibility = asVisibility(config.sectionVisibility)
  const registered = asRegisteredSections(registeredSectionIds)
  const availableSections = registered.filter((id) => visibility[id] !== false)
  const preferredOrder = Array.isArray(config.sectionOrder) ? config.sectionOrder : undefined
  const sectionIds = resolveSections({
    template,
    visibility,
    preferredOrder,
    availableSections,
    knownSectionIds: PORTFOLIO_PUBLIC_SECTION_IDS,
    requiredSectionIds: getRequiredPublicSectionIds(),
  })

  return {
    template,
    sectionIds,
    visibility: { ...visibility },
  }
}
