import { ArrowRight, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { projectTypes } from '../data/projects'
import { ProjectCard } from './ProjectCard'
import { SectionTitle } from './ui/SectionTitle'

export function Projects({ projects, onOpen }) {
  const [filter, setFilter] = useState('all')
  const [guideOpen, setGuideOpen] = useState(false)
  const closeRef = useRef(null)
  const filters = useMemo(() => ['all', ...new Set(projects.map((project) => project.type))], [projects])
  const visibleProjects = filter === 'all' ? projects : projects.filter((project) => project.type === filter)

  useEffect(() => {
    if (!guideOpen) return undefined
    const closeOnEscape = (event) => event.key === 'Escape' && setGuideOpen(false)
    document.body.classList.add('modal-open')
    window.addEventListener('keydown', closeOnEscape)
    closeRef.current?.focus()
    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [guideOpen])

  return (
    <section className="section section--projects" id="projetos">
      <div className="container">
        <SectionTitle
          eyebrow="Portfólio em destaque"
          title="Soluções feitas para gerar clareza."
          text="Selecione um projeto para conhecer a proposta e explorar a entrega."
          action={(
            <div className="project-heading-actions">
              <a className="text-link" href="#contato">Tem um projeto? <ArrowRight size={16} /></a>
              <button className="project-guide-trigger" type="button" onClick={() => setGuideOpen(true)} aria-haspopup="dialog">
                <span className="specialties-guide__hand" aria-hidden="true">☝️</span>
                Clique e entenda o portfólio
              </button>
            </div>
          )}
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
      {guideOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setGuideOpen(false)}>
          <section className="portfolio-guide-modal" role="dialog" aria-modal="true" aria-labelledby="portfolio-guide-title">
            <button ref={closeRef} className="modal-close" type="button" onClick={() => setGuideOpen(false)} aria-label="Fechar guia do portfólio"><X size={21} /></button>
            <span className="contact-modal__eyebrow">Como explorar</span>
            <h2 id="portfolio-guide-title">Conheça as entregas do portfólio</h2>
            <p>O portfólio foi organizado para você encontrar rapidamente o tipo de solução e entender cada projeto.</p>
            <div className="portfolio-guide-modal__steps">
              <article><span>01</span><div><h3>Escolha uma categoria</h3><p>Use os filtros para visualizar projetos de Power BI, Sistemas Web, Conteúdo Digital ou GPTs & Agentes de IA.</p></div></article>
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
