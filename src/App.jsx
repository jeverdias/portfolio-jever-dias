import { lazy, Suspense, useEffect, useState } from 'react'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Credibility } from './components/Credibility'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { LandingHighlights } from './components/LandingHighlights'
import { Projects } from './components/Projects'
import { Resume } from './components/Resume'
import { Specialties } from './components/Specialties'
import { useProjectStore } from './hooks/useProjectStore'
import { useSiteStore } from './hooks/useSiteStore'
import { useAdminAuth } from './hooks/useAdminAuth'
import { applyAppearance } from './data/appearance'
import { getPublicClassification, selectPublicProjects } from './utils/compatibility'
import { resolvePublicTemplate } from './core/site-engine/publicTemplatePolicy'

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
  const projectIdFromPath = () => decodeURIComponent(window.location.pathname.match(/^\/portfolio\/([^/]+)\/?$/)?.[1] || '')
  const [routeProjectId, setRouteProjectId] = useState(projectIdFromPath)
  const [selectedProject, setSelectedProject] = useState(null)
  const [adminOpen, setAdminOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const publicTemplate = resolvePublicTemplate(siteStore.site.siteClassificationId)
  const publicClassification = getPublicClassification()

  useEffect(() => {
    if (!adminAuth.user) return
    void refreshProjects()
    void refreshSite()
  }, [adminAuth.user, refreshProjects, refreshSite])

  useEffect(() => {
    applyAppearance(siteStore.site.appearance)
    document.documentElement.dataset.siteClassification = publicTemplate.id
  }, [siteStore.site.appearance, publicTemplate.id])

  useEffect(() => {
    const description = publicClassification?.goal || 'Portfólio profissional de Jever Dias.'
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('meta[name="category"]')?.setAttribute('content', publicClassification?.classification || 'Portfolio Website')
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description)
  }, [publicClassification])

  useEffect(() => {
    const syncRoute = () => setRouteProjectId(projectIdFromPath())
    window.addEventListener('popstate', syncRoute)
    return () => window.removeEventListener('popstate', syncRoute)
  }, [])

  const openProjectPage = (project) => {
    window.history.pushState({}, '', `/portfolio/${encodeURIComponent(project.id)}`)
    setRouteProjectId(project.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const closeProjectPage = () => {
    window.history.replaceState({}, '', '/#projetos')
    setRouteProjectId('')
    window.setTimeout(() => document.querySelector('#projetos')?.scrollIntoView(), 0)
  }

  const currentProject = selectedProject
    ? projectStore.projects.find((project) => project.id === selectedProject.id) || selectedProject
    : null

  const routeProject = projectStore.projects.find((project) => project.id === routeProjectId)
  const visibility = siteStore.site.sectionVisibility || {}

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
      <div className="site-shell">
        <Header site={siteStore.site} visibility={visibility} classificationId={publicTemplate.id} onLogin={() => setAdminOpen(true)} />
        <main id="conteudo">
          {visibility.hero !== false && <Hero site={siteStore.site} classificationId={publicTemplate.id} onContact={() => setContactOpen(true)} />}
          {publicTemplate.id === 'landing-conversion' && <LandingHighlights site={siteStore.site} />}
          {visibility.specialties !== false && <Specialties items={siteStore.site.specialties} classificationId={publicTemplate.id} />}
          {visibility.projects !== false && <Projects projects={selectPublicProjects(projectStore.projects)} classificationId={publicTemplate.id} onOpen={openProjectPage} />}
          {visibility.about !== false && <About />}
          {visibility.credibility !== false && <Credibility site={siteStore.site} />}
          {visibility.resume !== false && <Resume site={siteStore.site} />}
          {visibility.contact !== false && <Contact site={siteStore.site} classificationId={publicTemplate.id} onOpen={() => setContactOpen(true)} />}
        </main>
        {visibility.footer !== false && <Footer site={siteStore.site} />}
      </div>
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
