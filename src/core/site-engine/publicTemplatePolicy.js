import { cloneConfigValue, deepFreezeConfig } from '../config/siteSchema.js'
import { portfolioTemplate } from '../../templates/portfolio/portfolioTemplate.js'

export const PUBLIC_TEMPLATE_ID = 'portfolio-app'
const publicTemplate = deepFreezeConfig(cloneConfigValue(portfolioTemplate))

export const resolvePublicTemplate = () => cloneConfigValue(publicTemplate)

export const isTemplatePubliclyAllowed = (templateId) => (
  resolvePublicTemplate(templateId).id === templateId && templateId === PUBLIC_TEMPLATE_ID
)
