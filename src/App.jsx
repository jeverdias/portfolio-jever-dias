import { useEffect, useState } from 'react'
import { About } from './components/About'
import { AdminPanel } from './components/AdminPanel'
import { Contact } from './components/Contact'
import { ContactModal } from './components/ContactModal'
import { Credibility } from './components/Credibility'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { LandingHighlights } from './components/LandingHighlights'
import { ProjectModal } from './components/ProjectModal'
import { ProjectDetail } from './components/ProjectDetail'
import { Projects } from './components/Projects'
import { Resume } from './components/Resume'
import { Specialties } from './components/Specialties'
import { useProjectStore } from './hooks/useProjectStore'
import { useSiteStore } from './hooks/useSiteStore'
import { useAdminAuth } from './hooks/useAdminAuth'
import { applyAppearance } from './data/appearance'

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

  useEffect(() => {
    if (!adminAuth.user) return
    void refreshProjects()
    void refreshSite()
  }, [adminAuth.user, refreshProjects, refreshSite])

  useEffect(() => {
    applyAppearance(siteStore.site.appearance)
    document.documentElement.dataset.siteClassification = siteStore.site.siteClassificationId || 'portfolio-app'
  }, [siteStore.site.appearance, siteStore.site.siteClassificationId])

  useEffect(() => {
    const description = siteStore.site.siteClassificationDescription || 'Portfólio profissional de Jever Dias.'
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('meta[name="category"]')?.setAttribute('content', siteStore.site.siteClassification || 'Portfolio Website')
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description)
  }, [siteStore.site.siteClassification, siteStore.site.siteClassificationDescription])

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
      <ProjectDetail project={routeProject} siteName={siteStore.site.name} onBack={closeProjectPage} onDemo={() => setSelectedProject(routeProject)} />
      <ProjectModal key={currentProject?.id || 'project-modal'} project={currentProject} onClose={() => setSelectedProject(null)} />
    </>
  }

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <div className="site-shell">
        <Header site={siteStore.site} visibility={visibility} onLogin={() => setAdminOpen(true)} />
        <main id="conteudo">
          {visibility.hero !== false && <Hero site={siteStore.site} onContact={() => setContactOpen(true)} />}
          {siteStore.site.siteClassificationId === 'landing-conversion' && <LandingHighlights site={siteStore.site} />}
          {visibility.specialties !== false && <Specialties items={siteStore.site.specialties} classificationId={siteStore.site.siteClassificationId} />}
          {visibility.projects !== false && <Projects projects={projectStore.projects.filter((project) => project.featured)} classificationId={siteStore.site.siteClassificationId} onOpen={openProjectPage} />}
          {visibility.about !== false && <About />}
          {visibility.credibility !== false && <Credibility site={siteStore.site} />}
          {visibility.resume !== false && <Resume site={siteStore.site} />}
          {visibility.contact !== false && <Contact site={siteStore.site} onOpen={() => setContactOpen(true)} />}
        </main>
        {visibility.footer !== false && <Footer site={siteStore.site} />}
      </div>
      <ProjectModal key={currentProject?.id || 'project-modal'} project={currentProject} onClose={() => setSelectedProject(null)} />
      <ContactModal open={contactOpen} site={siteStore.site} onClose={() => setContactOpen(false)} />
      <AdminPanel
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        projectStore={projectStore}
        siteStore={siteStore}
        adminAuth={adminAuth}
      />
    </>
  )
}

export default App
