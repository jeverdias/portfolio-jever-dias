import { ArrowUpRight, BarChart3, BookOpen, Bot, Globe2 } from 'lucide-react'
import { projectTypes } from '../data/projects'
import { ProjectVisual } from './ProjectVisual'

const typeIcons = { powerbi: BarChart3, website: Globe2, content: BookOpen, ai: Bot }

export function ProjectCard({ project, onOpen }) {
  const Icon = typeIcons[project.type] || Globe2

  return (
    <article className="project-card" style={{ '--project-accent': project.accent }}>
      <button type="button" className="project-card__preview" onClick={() => onOpen(project)} aria-label={`Ver detalhes de ${project.title}`}>
        <ProjectVisual project={project} />
        <span className="project-card__open"><ArrowUpRight size={18} /> Abrir projeto</span>
      </button>
      <div className="project-card__body">
        <div className="project-card__meta"><Icon size={15} /> {projectTypes[project.type] || project.category}</div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="tag-list">
          {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </div>
    </article>
  )
}
