import { ArrowRight, BarChart3, Bot, Braces, DatabaseZap, LayoutDashboard, Send, Sigma, Sparkles, Workflow } from 'lucide-react'
import { useState } from 'react'

const techItems = [
  { name: 'Power BI', icon: BarChart3, color: '#f9c74f', description: 'Ferramenta para criar dashboards e relatórios interativos a partir de dados.' },
  { name: 'DAX', icon: Sigma, color: '#56d4ff', description: 'Linguagem de fórmulas usada para criar cálculos e medidas no Power BI.' },
  { name: 'JavaScript', icon: Braces, color: '#ffd84d', description: 'Linguagem usada para criar lógica e interações em sites e sistemas web.' },
  { name: 'Supabase', icon: DatabaseZap, color: '#45e0a8', description: 'Serviço de banco de dados, autenticação e arquivos para aplicações.' },
  { name: 'GPTs', icon: Bot, color: '#a98bff', description: 'Versões do ChatGPT configuradas com instruções e recursos para uma finalidade específica.' },
  { name: 'Agentes de IA', icon: Workflow, color: '#ff7ad9', description: 'Soluções que combinam IA, instruções e ferramentas para apoiar tarefas em etapas.' },
]

export function Hero({ site, onContact }) {
  const [selectedTech, setSelectedTech] = useState(null)
  const [firstName, ...lastNameParts] = site.name.split(' ')
  const lastName = lastNameParts.join(' ')
  const stats = [
    { value: site.dashboardsCount, label: site.dashboardsLabel },
    { value: site.systemsCount, label: site.systemsLabel },
  ]
  const roles = site.role.split('|').map((role) => role.trim()).filter(Boolean)

  return (
    <section className="hero" id="inicio">
      <div className="hero__glow hero__glow--one" />
      <div className="hero__glow hero__glow--two" />
      <div className="container hero__grid">
        <div className="hero__copy">
          <div className="eyebrow-pill"><Sparkles size={14} /> {site.eyebrow}</div>
          <h1>
            {firstName} <span>{lastName}</span>
          </h1>
          <p className="hero__role">
            {roles.map((role, index) => {
              return (
                <span className="role-item" key={role}>
                  <span>{role}</span>
                  {index < roles.length - 1 && <span className="role-separator" aria-hidden="true">|</span>}
                </span>
              )
            })}
          </p>
          <p className="hero__intro">{site.intro}</p>
          <div className="hero__actions">
            <a className="button button--primary" href="#projetos">
              Ver portfólio <ArrowRight size={18} />
            </a>
            <button className="button button--secondary" type="button" onClick={onContact}>
              <Send size={17} /> Falar comigo
            </button>
          </div>
          <div className="availability"><span /> Disponível para novos projetos</div>
        </div>

        <aside className="expertise-card" aria-label="Resumo de experiência e tecnologias">
          <div className="expertise-card__shine" />
          <div className="expertise-card__stats">
            {stats.map((stat, index) => (
              <div className="mini-stat" key={stat.label}>
                <div className="mini-stat__icon">
                  {index === 0 ? <LayoutDashboard size={21} /> : <Braces size={21} />}
                </div>
                <div><strong>{stat.value}</strong><span>{stat.label}</span></div>
              </div>
            ))}
          </div>
          <div className="expertise-card__divider" />
          <div className="tech-grid">
            {techItems.map(({ name, icon: Icon, color, description }) => (
              <button className={`tech-item ${selectedTech?.name === name ? 'is-active' : ''}`} type="button" key={name} onClick={() => setSelectedTech({ name, description })} aria-label={`${name}: ${description}`}>
                <Icon size={25} style={{ color }} aria-hidden="true" />
                <span>{name}</span>
              </button>
            ))}
          </div>
          <div className={`expertise-card__footer ${selectedTech ? 'has-explanation' : ''}`} aria-live="polite">
            <span className="pulse" />
            <span>{selectedTech ? <><strong>{selectedTech.name}:</strong> {selectedTech.description}</> : 'Clique em uma tecnologia para entender.'}</span>
          </div>
        </aside>
      </div>
    </section>
  )
}
