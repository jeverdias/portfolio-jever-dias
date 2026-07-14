import { ArrowRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { projectTypes } from '../data/projects'
import { ProjectCard } from './ProjectCard'
import { SectionTitle } from './ui/SectionTitle'

export function Projects({ projects, onOpen }) {
  const [filter, setFilter] = useState('all')
  const filters = useMemo(() => ['all', ...new Set(projects.map((project) => project.type))], [projects])
  const visibleProjects = filter === 'all' ? projects : projects.filter((project) => project.type === filter)

  return (
    <section className="section section--projects" id="projetos">
      <div className="container">
        <SectionTitle
          eyebrow="Projetos em destaque"
          title="Soluções feitas para gerar clareza."
          text="Selecione um projeto para conhecer a proposta e explorar a entrega."
          action={<a className="text-link" href="#contato">Tem um projeto? <ArrowRight size={16} /></a>}
        />
        <div className="project-filters" role="group" aria-label="Filtrar projetos por tipo">
          {filters.map((item) => (
            <button key={item} className={filter === item ? 'is-active' : ''} type="button" onClick={() => setFilter(item)}>
              {item === 'all' ? 'Todos' : projectTypes[item]}
            </button>
          ))}
        </div>
        <div className="projects-grid">
          {visibleProjects.map((project) => <ProjectCard key={project.id} project={project} onOpen={onOpen} />)}
        </div>
      </div>
    </section>
  )
}
