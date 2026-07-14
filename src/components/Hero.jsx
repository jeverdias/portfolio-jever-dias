import { ArrowRight, BarChart3, Braces, DatabaseZap, LayoutDashboard, Send, Sigma, Sparkles } from 'lucide-react'

const techItems = [
  { name: 'Power BI', icon: BarChart3, color: '#f9c74f' },
  { name: 'DAX', icon: Sigma, color: '#56d4ff' },
  { name: 'JavaScript', icon: Braces, color: '#ffd84d' },
  { name: 'Supabase', icon: DatabaseZap, color: '#45e0a8' },
]

const roleDescriptions = {
  'bi developer': 'Business Intelligence: transforma dados em dashboards e indicadores para apoiar decisões.',
  analytics: 'Análise de dados para encontrar padrões, tendências e oportunidades.',
  'sistemas web básicos': 'Criação de aplicações web simples para organizar processos e rotinas.',
}

export function Hero({ site }) {
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
              const description = roleDescriptions[role.toLocaleLowerCase('pt-BR')]
              const tooltipId = `role-tooltip-${index}`

              return (
                <span className="role-item" key={role}>
                  <span>{role}</span>
                  {description && (
                    <button
                      className="role-info"
                      type="button"
                      aria-label={`O que significa ${role}?`}
                      aria-describedby={tooltipId}
                    >
                      !
                    </button>
                  )}
                  {description && (
                    <span className="role-tooltip" id={tooltipId} role="tooltip">
                      {description}
                    </span>
                  )}
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
            <a className="button button--secondary" href={`mailto:${site.email}`}>
              <Send size={17} /> Falar comigo
            </a>
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
            {techItems.map(({ name, icon: Icon, color }) => (
              <div className="tech-item" key={name}>
                <Icon size={25} style={{ color }} aria-hidden="true" />
                <span>{name}</span>
              </div>
            ))}
          </div>
          <div className="expertise-card__footer">
            <span className="pulse" /> Dados claros. Decisões melhores.
          </div>
        </aside>
      </div>
    </section>
  )
}
