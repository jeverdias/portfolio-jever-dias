import { normalizeSiteConfig } from '../core/config/normalizeSiteConfig.js'
import { PortfolioTemplate } from '../templates/portfolio/PortfolioTemplate.jsx'
import { createPublicRenderPlan } from '../templates/portfolio/portfolioSections.js'
import { getPublicSectionComponentIds } from './publicSectionComponents.js'

export function PublicSiteRenderer({ requestedTemplateId, siteConfig, projects = [], handlers = {} }) {
  const safeSiteConfig = normalizeSiteConfig(siteConfig)
  const safeHandlers = handlers && typeof handlers === 'object' && !Array.isArray(handlers) ? handlers : {}
  const registeredSectionIds = getPublicSectionComponentIds()
  const plan = createPublicRenderPlan({ requestedTemplateId, siteConfig: safeSiteConfig, registeredSectionIds })

  return <PortfolioTemplate template={plan.template} sectionIds={plan.sectionIds} siteConfig={safeSiteConfig} projects={projects} handlers={safeHandlers} />
}
