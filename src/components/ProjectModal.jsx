import { ArrowUpRight, BarChart3, BookOpen, Globe2, MonitorPlay, X } from 'lucide-react'
import { useEffect } from 'react'
import { projectTypes } from '../data/projects'
import { ProjectVisual } from './ProjectVisual'

const typeIcons = { powerbi: BarChart3, website: Globe2, content: BookOpen }

const validLink = (value) => /^https?:\/\//i.test(value || '')

export function ProjectModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return undefined
    const closeOnEscape = (event) => event.key === 'Escape' && onClose()
    document.body.classList.add('modal-open')
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [project, onClose])

  if (!project) return null

  const Icon = typeIcons[project.type] || Globe2
  const previewUrl = project.type === 'powerbi' ? project.embedUrl : project.externalUrl
  const canEmbed = validLink(previewUrl) && project.type !== 'content'

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
        <button className="modal-close" type="button" onClick={onClose} aria-label="Fechar projeto"><X size={21} /></button>
        <div className="project-modal__viewer">
          {canEmbed ? (
            <iframe
              src={previewUrl}
              title={`Visualização de ${project.title}`}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <div className="project-modal__placeholder">
              <ProjectVisual project={project} large />
              {!validLink(previewUrl) && (
                <div className="preview-notice"><MonitorPlay size={18} /> Demonstração pronta para receber o link no modo administrador.</div>
              )}
            </div>
          )}
        </div>
        <div className="project-modal__content">
          <div className="project-modal__type"><Icon size={16} /> {projectTypes[project.type]}</div>
          <h2 id="project-modal-title">{project.title}</h2>
          <p>{project.details || project.description}</p>
          <div className="tag-list tag-list--large">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <div className="project-modal__actions">
            {project.type !== 'powerbi' && validLink(project.externalUrl) && (
              <a className="button button--primary" href={project.externalUrl} target="_blank" rel="noreferrer">
                Abrir em nova aba <ArrowUpRight size={17} />
              </a>
            )}
            <button className="button button--secondary" type="button" onClick={onClose}>Voltar aos projetos</button>
          </div>
        </div>
      </section>
    </div>
  )
}
