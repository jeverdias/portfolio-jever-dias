import { ArrowRight, Award, BarChart3, Bot, Braces, BriefcaseBusiness, Code2, Database, DatabaseZap, LayoutDashboard, Send, Sigma, Sparkles, Users, Workflow } from 'lucide-react'
import { useState } from 'react'

const iconMap = { chart: BarChart3, sigma: Sigma, code: Braces, database: DatabaseZap, bot: Bot, workflow: Workflow }
const metricIconMap = { chart: BarChart3, code: Code2, database: Database, award: Award, users: Users, briefcase: BriefcaseBusiness, bot: Bot, sparkles: Sparkles }

export function Hero({ site, onContact }) {
  const [selectedTech, setSelectedTech] = useState(null)
  const [firstName, ...lastNameParts] = site.name.split(' ')
  const lastName = lastNameParts.join(' ')
  const stats = (site.metrics || []).filter((item) => item.visible !== false).slice(0, 2)
  const roles = site.role.split('|').map((role) => role.trim()).filter(Boolean)
  const techItems = site.techItems || []

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
            {stats.map((stat) => {
              const Icon = metricIconMap[stat.icon] || LayoutDashboard
              return (
              <div className="mini-stat" key={stat.label}>
                <div className="mini-stat__icon" style={{ color: stat.color }}>
                  {stat.image ? <img src={stat.image} alt="" /> : <Icon size={21} />}
                </div>
                <div><strong>{stat.value}</strong><span>{stat.label}</span></div>
              </div>
            )})}
          </div>
          <div className="expertise-card__divider" />
          <div className="tech-grid">
            {techItems.map(({ id, name, icon, color, description, image }) => {
              const Icon = iconMap[icon] || Sparkles
              return <button className={`tech-item ${selectedTech?.name === name ? 'is-active' : ''}`} type="button" key={id || name} onClick={() => setSelectedTech({ name, description })} aria-label={`${name}: ${description}`}>
                {image ? <img className="tech-item__image" src={image} alt="" /> : <Icon size={25} style={{ color }} aria-hidden="true" />}
                <span>{name}</span>
              </button>
            })}
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
