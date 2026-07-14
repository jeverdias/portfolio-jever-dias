import { useState } from 'react'
import { About } from './components/About'
import { AdminPanel } from './components/AdminPanel'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ProjectModal } from './components/ProjectModal'
import { Projects } from './components/Projects'
import { Specialties } from './components/Specialties'
import { useProjectStore } from './hooks/useProjectStore'

function App() {
  const store = useProjectStore()
  const [selectedProject, setSelectedProject] = useState(null)
  const [adminOpen, setAdminOpen] = useState(false)

  const currentProject = selectedProject
    ? store.projects.find((project) => project.id === selectedProject.id) || selectedProject
    : null

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <div className="site-shell">
        <Header />
        <main id="conteudo">
          <Hero />
          <Specialties />
          <Projects projects={store.projects.filter((project) => project.featured)} onOpen={setSelectedProject} />
          <About />
          <Contact />
        </main>
        <Footer onAdmin={() => setAdminOpen(true)} />
      </div>
      <ProjectModal project={currentProject} onClose={() => setSelectedProject(null)} />
      <AdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} store={store} />
    </>
  )
}

export default App
