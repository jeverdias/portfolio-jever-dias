import { useState } from 'react'
import { About } from './components/About'
import { AdminPanel } from './components/AdminPanel'
import { Contact } from './components/Contact'
import { ContactModal } from './components/ContactModal'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ProjectModal } from './components/ProjectModal'
import { Projects } from './components/Projects'
import { Specialties } from './components/Specialties'
import { useProjectStore } from './hooks/useProjectStore'
import { useSiteStore } from './hooks/useSiteStore'

function App() {
  const projectStore = useProjectStore()
  const siteStore = useSiteStore()
  const [selectedProject, setSelectedProject] = useState(null)
  const [adminOpen, setAdminOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  const currentProject = selectedProject
    ? projectStore.projects.find((project) => project.id === selectedProject.id) || selectedProject
    : null

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <div className="site-shell">
        <Header onLogin={() => setAdminOpen(true)} />
        <main id="conteudo">
          <Hero site={siteStore.site} onContact={() => setContactOpen(true)} />
          <Specialties />
          <Projects projects={projectStore.projects.filter((project) => project.featured)} onOpen={setSelectedProject} />
          <About />
          <Contact site={siteStore.site} onOpen={() => setContactOpen(true)} />
        </main>
        <Footer site={siteStore.site} />
      </div>
      <ProjectModal key={currentProject?.id || 'project-modal'} project={currentProject} onClose={() => setSelectedProject(null)} />
      <ContactModal open={contactOpen} site={siteStore.site} onClose={() => setContactOpen(false)} />
      <AdminPanel
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        projectStore={projectStore}
        siteStore={siteStore}
      />
    </>
  )
}

export default App
