import { BarChart3, Bot, Braces, Database, LineChart, Sparkles, Workflow, X } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { SectionTitle } from './ui/SectionTitle'
import { getClassificationPresentation } from '../data/classificationPresentation'
import { useModalA11y } from '../hooks/useModalA11y'

const iconMap = { chart: BarChart3, analytics: LineChart, code: Braces, database: Database, bot: Bot, workflow: Workflow, sparkles: Sparkles }

export function Specialties({ items = [], classificationId }) {
  const specialties = items.filter((item) => item.visible !== false)
  const [guideOpen, setGuideOpen] = useState(false)
  const [selectedSpecialty, setSelectedSpecialty] = useState(null)
  const SelectedIcon = iconMap[selectedSpecialty?.icon] || Sparkles
  const closeRef = useRef(null)
  const modalRef = useRef(null)
  const copy = getClassificationPresentation(classificationId)
  const closeGuide = useCallback(() => setGuideOpen(false), [])
  useModalA11y({ active: guideOpen, containerRef: modalRef, initialFocusRef: closeRef, onClose: closeGuide })

  const openGuide = (specialty = null) => {
    setSelectedSpecialty(specialty)
    setGuideOpen(true)
  }

  return (
    <section className="section" id="servicos">
      <div className="container">
        <SectionTitle
          eyebrow={copy.servicesEyebrow}
          title={copy.servicesTitle}
          text={copy.servicesText}
        />
        <div className="specialties-guide">
          <button type="button" onClick={() => openGuide()} aria-haspopup="dialog">
            <span className="specialties-guide__hand" aria-hidden="true">☝️</span>
            Clique e entenda cada especialidade
          </button>
        </div>
        <div className="specialties-grid">
          {specialties.map((specialty) => {
            const { number, title, text, image, color } = specialty
            const Icon = iconMap[specialty.icon] || Sparkles
            return (
              <button className="specialty-card" type="button" key={title} onClick={() => openGuide(specialty)} aria-label={`Entender ${title}`}>
                <div className="specialty-card__top">
                  <div className="specialty-card__icon" style={{ color }}>{image ? <img src={image} alt="" /> : <Icon size={24} />}</div>
                  <span>{number}</span>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="specialty-card__hint">Clique para saber mais <span aria-hidden="true">→</span></span>
                <div className="specialty-card__line" />
              </button>
            )
          })}
        </div>
      </div>
      {guideOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeGuide()}>
          <section ref={modalRef} className="specialties-modal" role="dialog" aria-modal="true" aria-labelledby="specialties-modal-title">
            <button ref={closeRef} className="modal-close" type="button" onClick={closeGuide} aria-label="Fechar explicação"><X size={21} /></button>
            <span className="contact-modal__eyebrow">Guia rápido</span>
            <div className="specialties-assistant" aria-hidden="true">
              <span className="specialties-assistant__robot">🤖</span>
              <div className="specialties-assistant__speech">
                {selectedSpecialty ? `Vamos entender ${selectedSpecialty.title}!` : 'Vou explicar cada especialidade!'}
                <span><i /><i /><i /></span>
              </div>
            </div>
            <h2 id="specialties-modal-title">{selectedSpecialty ? selectedSpecialty.title : 'O que significa cada especialidade?'}</h2>
            <p>{selectedSpecialty ? selectedSpecialty.detail : 'Uma explicação simples de como cada área pode ajudar um projeto.'}</p>
            {selectedSpecialty ? (
              <article className="specialties-modal__single">
                <div className="specialties-modal__single-icon">{selectedSpecialty.image ? <img src={selectedSpecialty.image} alt="" /> : <SelectedIcon size={27} />}</div>
                <div><span>Em palavras simples</span><p>{selectedSpecialty.plain}</p><strong className="specialty-example">{selectedSpecialty.example}</strong></div>
              </article>
            ) : (
              <div className="specialties-modal__grid">
                {specialties.map(({ icon, number, title, plain, example, image }, index) => {
                  const Icon = iconMap[icon] || Sparkles
                  return (
                  <article key={title} style={{ '--specialty-index': index }}>
                    <div>{image ? <img src={image} alt="" /> : <Icon size={21} />}<span>{number}</span></div>
                    <h3>{title}</h3>
                    <p>{plain}</p><strong className="specialty-example">{example}</strong>
                  </article>
                )})}
              </div>
            )}
          </section>
        </div>
      )}
    </section>
  )
}
