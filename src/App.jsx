import { lazy, Suspense, useEffect, useState } from 'react'
import { PublicSiteRenderer } from './app/PublicSiteRenderer'
import { createPortfolioReturnPath, createProjectPath, readProjectIdFromPath } from './app/appNavigation'
import { useProjectStore } from './hooks/useProjectStore'
import { useSiteStore } from './hooks/useSiteStore'
import { useAdminAuth } from './hooks/useAdminAuth'
import { applyAppearance } from './data/appearance'
import { getPublicClassification } from './utils/compatibility'
import { PUBLIC_TEMPLATE_ID } from './core/site-engine/publicTemplatePolicy'

const AdminPanel = lazy(() => import('./components/AdminPanel').then((module) => ({ default: module.AdminPanel })))
const ContactModal = lazy(() => import('./components/ContactModal').then((module) => ({ default: module.ContactModal })))
const ProjectDetail = lazy(() => import('./components/ProjectDetail').then((module) => ({ default: module.ProjectDetail })))
const ProjectModal = lazy(() => import('./components/ProjectModal').then((module) => ({ default: module.ProjectModal })))

function App() {
  const projectStore = useProjectStore()
  const siteStore = useSiteStore()
  const adminAuth = useAdminAuth()
  const refreshProjects = projectStore.refresh
  const refreshSite = siteStore.refresh
  const [routeProjectId, setRouteProjectId] = useState(() => readProjectIdFromPath(window.location.pathname))
  const [selectedProject, setSelectedProject] = useState(null)
  const [adminOpen, setAdminOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const publicClassification = getPublicClassification()

  useEffect(() => {
    if (!adminAuth.user) return
    void refreshProjects()
    void refreshSite()
  }, [adminAuth.user, refreshProjects, refreshSite])

  useEffect(() => {
    applyAppearance(siteStore.site.appearance)
    document.documentElement.dataset.siteClassification = PUBLIC_TEMPLATE_ID
  }, [siteStore.site.appearance])

  useEffect(() => {
    const description = publicClassification?.goal || 'Portfólio profissional de Jever Dias.'
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('meta[name="category"]')?.setAttribute('content', publicClassification?.classification || 'Portfolio Website')
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description)
  }, [publicClassification])

  useEffect(() => {
    const syncRoute = () => setRouteProjectId(readProjectIdFromPath(window.location.pathname))
    window.addEventListener('popstate', syncRoute)
    return () => window.removeEventListener('popstate', syncRoute)
  }, [])

  const openProjectPage = (project) => {
    window.history.pushState({}, '', createProjectPath(project.id))
    setRouteProjectId(project.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const closeProjectPage = () => {
    window.history.replaceState({}, '', createPortfolioReturnPath())
    setRouteProjectId('')
    window.setTimeout(() => document.querySelector('#projetos')?.scrollIntoView(), 0)
  }

  const currentProject = selectedProject
    ? projectStore.projects.find((project) => project.id === selectedProject.id) || selectedProject
    : null

  const routeProject = projectStore.projects.find((project) => project.id === routeProjectId)

  if (routeProject) {
    return <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Suspense fallback={<div className="route-loading" role="status">Carregando projeto...</div>}><ProjectDetail project={routeProject} siteName={siteStore.site.name} onBack={closeProjectPage} onDemo={() => setSelectedProject(routeProject)} /></Suspense>
      {currentProject && <Suspense fallback={null}><ProjectModal key={currentProject.id} project={currentProject} onClose={() => setSelectedProject(null)} /></Suspense>}
    </>
  }

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <PublicSiteRenderer
        requestedTemplateId={siteStore.site.siteClassificationId}
        siteConfig={siteStore.site}
        projects={projectStore.projects}
        handlers={{
          onLogin: () => setAdminOpen(true),
          onContact: () => setContactOpen(true),
          onOpenProject: openProjectPage,
        }}
      />
      {currentProject && <Suspense fallback={null}><ProjectModal key={currentProject.id} project={currentProject} onClose={() => setSelectedProject(null)} /></Suspense>}
      {contactOpen && <Suspense fallback={null}><ContactModal open site={siteStore.site} onClose={() => setContactOpen(false)} /></Suspense>}
      {adminOpen && <Suspense fallback={<div className="admin-backdrop"><div className="admin-route-loading" role="status">Abrindo painel seguro...</div></div>}><AdminPanel
          open
          onClose={() => setAdminOpen(false)}
          projectStore={projectStore}
          siteStore={siteStore}
          adminAuth={adminAuth}
        /></Suspense>}
    </>
  )
}

export default App
