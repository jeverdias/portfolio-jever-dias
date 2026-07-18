import { Fragment } from 'react'
import { Header } from '../../components/Header.jsx'
import { renderPublicSection } from '../../app/publicSectionComponents.js'

export function PortfolioTemplate({ template, sectionIds = [], siteConfig, projects = [], handlers = {} }) {
  const context = { siteConfig, projects, handlers, templateId: template.id }
  const mainSections = sectionIds.filter((sectionId) => sectionId !== 'footer')

  return <div className="site-shell">
    <Header site={siteConfig} visibility={siteConfig.sectionVisibility || {}} classificationId={template.id} onLogin={handlers.onLogin} />
    <main id="conteudo">
      {mainSections.map((sectionId) => <Fragment key={sectionId}>{renderPublicSection(sectionId, context)}</Fragment>)}
    </main>
    {sectionIds.includes('footer') && renderPublicSection('footer', context)}
  </div>
}
