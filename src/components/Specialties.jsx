import { BarChart3, Bot, Braces, Database, LineChart, Workflow, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { SectionTitle } from './ui/SectionTitle'

const specialties = [
  {
    icon: BarChart3,
    number: '01',
    title: 'Business Intelligence',
    text: 'Dashboards, indicadores e modelagem de dados para acompanhar o que realmente importa.',
    detail: 'Transforma dados de diferentes fontes em indicadores, relatórios e dashboards visuais para acompanhar resultados e apoiar decisões.',
  },
  {
    icon: LineChart,
    number: '02',
    title: 'Analytics',
    text: 'Análise de dados e geração de insights para decisões mais rápidas e bem fundamentadas.',
    detail: 'Investiga os dados para encontrar padrões, tendências, causas e oportunidades, convertendo números em respostas úteis para o negócio.',
  },
  {
    icon: Braces,
    number: '03',
    title: 'Sistemas Web',
    text: 'Aplicações simples e funcionais para digitalizar rotinas e reduzir trabalho manual.',
    detail: 'Cria ferramentas online leves e funcionais para organizar cadastros, automatizar rotinas e facilitar o trabalho das equipes.',
  },
  {
    icon: Database,
    number: '04',
    title: 'Dados & Processos',
    text: 'ETL, organização e apoio à melhoria contínua dos processos operacionais.',
    detail: 'Organiza, integra e padroniza dados e fluxos de trabalho para reduzir erros e tornar os processos mais claros e eficientes.',
  },
  {
    icon: Bot,
    number: '05',
    title: 'GPTs Personalizados',
    text: 'Assistentes no ChatGPT configurados para uma finalidade específica, com escopo claro e conteúdo selecionado.',
    detail: 'GPTs são versões do ChatGPT configuradas para um objetivo definido. Podem combinar instruções, arquivos de conhecimento e recursos selecionados para orientar respostas e tarefas.',
  },
  {
    icon: Workflow,
    number: '06',
    title: 'Agentes de IA Básicos',
    text: 'Fluxos simples que usam IA e ferramentas para apoiar tarefas em etapas, com limites e supervisão.',
    detail: 'Um agente de IA combina um modelo, instruções e ferramentas para conduzir etapas de uma tarefa. O foco aqui está em soluções básicas, delimitadas e revisáveis.',
  },
]

export function Specialties() {
  const [guideOpen, setGuideOpen] = useState(false)
  const [selectedSpecialty, setSelectedSpecialty] = useState(null)
  const SelectedIcon = selectedSpecialty?.icon
  const closeRef = useRef(null)

  const openGuide = (specialty = null) => {
    setSelectedSpecialty(specialty)
    setGuideOpen(true)
  }

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
    <section className="section" id="servicos">
      <div className="container">
        <SectionTitle
          eyebrow="Especialidades"
          title="Do dado bruto à solução que funciona."
          text="Estratégia, análise e desenvolvimento reunidos em entregas objetivas."
        />
        <div className="specialties-guide">
          <button type="button" onClick={() => openGuide()} aria-haspopup="dialog">
            <span className="specialties-guide__hand" aria-hidden="true">☝️</span>
            Clique e entenda cada especialidade
          </button>
        </div>
        <div className="specialties-grid">
          {specialties.map((specialty) => {
            const { icon: Icon, number, title, text } = specialty
            return (
              <button className="specialty-card" type="button" key={title} onClick={() => openGuide(specialty)} aria-label={`Entender ${title}`}>
                <div className="specialty-card__top">
                  <div className="specialty-card__icon"><Icon size={24} /></div>
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
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setGuideOpen(false)}>
          <section className="specialties-modal" role="dialog" aria-modal="true" aria-labelledby="specialties-modal-title">
            <button ref={closeRef} className="modal-close" type="button" onClick={() => setGuideOpen(false)} aria-label="Fechar explicação"><X size={21} /></button>
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
                <div className="specialties-modal__single-icon"><SelectedIcon size={27} /></div>
                <div><span>Na prática</span><p>{selectedSpecialty.text}</p></div>
              </article>
            ) : (
              <div className="specialties-modal__grid">
                {specialties.map(({ icon: Icon, number, title, detail }, index) => (
                  <article key={title} style={{ '--specialty-index': index }}>
                    <div><Icon size={21} /><span>{number}</span></div>
                    <h3>{title}</h3>
                    <p>{detail}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </section>
  )
}
