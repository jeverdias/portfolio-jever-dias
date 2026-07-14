import { ArrowUpRight, BarChart3, BookOpen, GalleryHorizontal, Globe2, MonitorPlay, Play, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { projectTypes } from '../data/projects'
import { ProjectVisual } from './ProjectVisual'

const typeIcons = { powerbi: BarChart3, website: Globe2, content: BookOpen }
const validLink = (value) => /^https?:\/\//i.test(value || '')
const validImage = (value) => validLink(value) || /^data:image\//i.test(value || '')

export function ProjectModal({ project, onClose }) {
  const [activeTab, setActiveTab] = useState('demo')

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
  const gallery = Array.isArray(project.gallery) ? project.gallery.filter(validImage) : []
  const previewUrl = project.type === 'powerbi' ? project.embedUrl : project.externalUrl
  const canEmbed = validLink(previewUrl) && project.type !== 'content'

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
        <button className="modal-close" type="button" onClick={onClose} aria-label="Fechar projeto"><X size={21} /></button>

        <div className="project-modal__viewer">
          {activeTab === 'gallery' ? (
            <div className="project-gallery">
              {gallery.length ? gallery.map((image, index) => (
                <img key={`${image}-${index}`} src={image} alt={`Print ${index + 1} do projeto ${project.title}`} />
              )) : (
                <div className="project-gallery__empty"><GalleryHorizontal size={28} /><span>Os prints deste projeto serão adicionados em breve.</span></div>
              )}
            </div>
          ) : canEmbed ? (
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
                <div className="preview-notice"><MonitorPlay size={18} /> Demonstração pronta para receber o link no painel administrativo.</div>
              )}
            </div>
          )}
        </div>

        <div className="project-modal__content">
          <div className="project-modal__type"><Icon size={16} /> {projectTypes[project.type]}</div>
          <h2 id="project-modal-title">{project.title}</h2>
          {project.theme && <div className="project-modal__theme">{project.theme}</div>}
          <p>{project.details || project.description}</p>

          <div className="project-modal__tabs" role="tablist" aria-label="Conteúdo do projeto">
            <button className={activeTab === 'demo' ? 'is-active' : ''} type="button" onClick={() => setActiveTab('demo')}>
              <Play size={14} /> {project.type === 'powerbi' ? 'Abrir dashboard' : 'Demonstração'}
            </button>
            <button className={activeTab === 'gallery' ? 'is-active' : ''} type="button" onClick={() => setActiveTab('gallery')}>
              <GalleryHorizontal size={14} /> Prints {gallery.length ? `(${gallery.length})` : ''}
            </button>
          </div>

          {(project.contentFormat || project.audience) && (
            <dl className="project-modal__facts">
              {project.contentFormat && <div><dt>Formato</dt><dd>{project.contentFormat}</dd></div>}
              {project.audience && <div><dt>Público</dt><dd>{project.audience}</dd></div>}
            </dl>
          )}

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
