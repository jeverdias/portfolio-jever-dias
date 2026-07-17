import { ArrowRight, X } from 'lucide-react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { getProjectTypeLabel } from '../data/projects'
import { ProjectCard } from './ProjectCard'
import { SectionTitle } from './ui/SectionTitle'
import { getClassificationPresentation } from '../data/classificationPresentation'
import { useModalA11y } from '../hooks/useModalA11y'

export function Projects({ projects, onOpen, classificationId }) {
  const [filter, setFilter] = useState('all')
  const [guideOpen, setGuideOpen] = useState(false)
  const closeRef = useRef(null)
  const modalRef = useRef(null)
  const filters = useMemo(() => ['all', ...new Set(projects.map(getProjectTypeLabel))], [projects])
  const visibleProjects = filter === 'all' ? projects : projects.filter((project) => getProjectTypeLabel(project) === filter)
  const copy = getClassificationPresentation(classificationId)
  const closeGuide = useCallback(() => setGuideOpen(false), [])
  useModalA11y({ active: guideOpen, containerRef: modalRef, initialFocusRef: closeRef, onClose: closeGuide })

  return (
    <section className="section section--projects" id="projetos">
      <div className="container">
        <SectionTitle
          eyebrow={copy.projectsEyebrow}
          title={copy.projectsTitle}
          text={copy.projectsText}
          action={(
            <div className="project-heading-actions">
              <a className="text-link" href="#contato">{copy.projectsAction} <ArrowRight size={16} /></a>
              <button className="project-guide-trigger" type="button" onClick={() => setGuideOpen(true)} aria-haspopup="dialog">
                <span className="specialties-guide__hand" aria-hidden="true">☝️</span>
                {copy.projectsGuide}
              </button>
            </div>
          )}
        />
        <div className="project-filters" role="group" aria-label="Filtrar projetos por tipo">
          {filters.map((item) => (
            <button key={item} className={filter === item ? 'is-active' : ''} type="button" onClick={() => setFilter(item)}>
              {item === 'all' ? 'Todos' : item}
            </button>
          ))}
        </div>
        <div className="projects-grid">
          {visibleProjects.map((project) => <ProjectCard key={project.id} project={project} onOpen={onOpen} />)}
        </div>
      </div>
      {guideOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeGuide()}>
          <section ref={modalRef} className="portfolio-guide-modal" role="dialog" aria-modal="true" aria-labelledby="portfolio-guide-title">
            <button ref={closeRef} className="modal-close" type="button" onClick={closeGuide} aria-label="Fechar guia do portfólio"><X size={21} /></button>
            <span className="contact-modal__eyebrow">Como explorar</span>
            <h2 id="portfolio-guide-title">Conheça as entregas do portfólio</h2>
            <p>O portfólio foi organizado para você encontrar rapidamente o tipo de solução e entender cada projeto.</p>
            <div className="portfolio-guide-modal__steps">
              <article><span>01</span><div><h3>Escolha um tipo</h3><p>Os filtros são criados automaticamente a partir dos tipos cadastrados no painel, como Power BI, Sistemas Web, Conteúdo Digital ou novos grupos.</p></div></article>
              <article><span>02</span><div><h3>Abra um projeto</h3><p>Clique na imagem ou no card para conhecer contexto, objetivo, tecnologias e detalhes da entrega.</p></div></article>
              <article><span>03</span><div><h3>Explore o resultado</h3><p>Veja prints e demonstrações. Power BI abre incorporado; projetos de IA explicam objetivo, instruções, recursos usados e limites da solução.</p></div></article>
              <article><span>04</span><div><h3>Vamos conversar</h3><p>Se uma solução combinar com sua necessidade, use “Tem um projeto?” para acessar os canais de contato.</p></div></article>
            </div>
          </section>
        </div>
      )}
    </section>
  )
}
