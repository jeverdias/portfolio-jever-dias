import { cloneConfigValue, deepFreezeConfig } from '../config/siteSchema.js'
import { portfolioTemplate } from '../../templates/portfolio/portfolioTemplate.js'
import { landingPageTemplate } from '../../templates/landing-page/landingPageTemplate.js'
import { institutionalTemplate } from '../../templates/institutional/institutionalTemplate.js'
import { professionalServicesTemplate } from '../../templates/professional-services/professionalServicesTemplate.js'

export const DEFAULT_TEMPLATE_ID = 'portfolio-app'

export const TEMPLATE_ALIASES = Object.freeze({
  'landing-conversion': 'landing-page',
})

const definitions = [portfolioTemplate, landingPageTemplate, institutionalTemplate, professionalServicesTemplate]
const frozenTemplates = definitions.map((definition) => deepFreezeConfig(cloneConfigValue(definition)))
const templatesById = new Map(frozenTemplates.map((definition) => [definition.id, definition]))

export const getCanonicalTemplateId = (id) => TEMPLATE_ALIASES[id] || id
export const getTemplateDefinition = (id) => {
  const template = templatesById.get(getCanonicalTemplateId(id))
  return template ? cloneConfigValue(template) : null
}
export const listTemplates = ({ previewOnly = false, publicOnly = false } = {}) => frozenTemplates
  .filter((template) => (!previewOnly || template.previewEnabled) && (!publicOnly || template.publicEnabled))
  .map(cloneConfigValue)
export const getTemplateIds = () => frozenTemplates.map((template) => template.id)
export const isTemplateAvailableForPreview = (id) => getTemplateDefinition(id)?.previewEnabled === true
