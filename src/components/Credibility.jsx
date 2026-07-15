import { Award, BarChart3, Bot, BriefcaseBusiness, CalendarDays, Code2, Database, Quote, Sparkles, Users } from 'lucide-react'
import { SectionTitle } from './ui/SectionTitle'

const parseLines = (value, fields) => (value || '').split('\n').map((line) => {
  const parts = line.split('|').map((part) => part.trim())
  return Object.fromEntries(fields.map((field, index) => [field, parts[index] || '']))
}).filter((item) => item[fields[0]])
const metricIconMap = { chart: BarChart3, code: Code2, database: Database, award: Award, users: Users, briefcase: BriefcaseBusiness, bot: Bot, sparkles: Sparkles }

export function Credibility({ site }) {
  const timeline = parseLines(site.timelineText, ['period', 'title', 'text'])
  const testimonials = parseLines(site.testimonialsText, ['name', 'role', 'quote'])
  const metrics = (site.metrics || []).filter((item) => item.visible !== false)

  return (
    <section className="section credibility-section" id="trajetoria">
      <div className="container">
        <SectionTitle eyebrow="Experiência e confiança" title="Resultados construídos com clareza." text="Tecnologias, entregas e trajetória reunidas em uma visão objetiva." />
        <div className="credibility-metrics">
          {metrics.map((metric) => { const Icon = metricIconMap[metric.icon] || Sparkles; return <article key={metric.id}>{metric.image ? <img className="metric-image" src={metric.image} alt="" /> : <Icon size={21} style={{ color: metric.color }} />}<strong>{metric.value}</strong><span>{metric.label}</span></article> })}
          <article className="credibility-tech"><span>Tecnologias</span><div>{(site.techItems || []).map((technology) => <i key={technology.id || technology.name}>{technology.name}</i>)}</div></article>
        </div>

        {timeline.length > 0 && <div className="credibility-block"><div className="credibility-block__title"><CalendarDays size={19} /><h3>Linha do tempo profissional</h3></div><div className="career-timeline">{timeline.map((item, index) => <article key={`${item.period}-${index}`}><span>{item.period}</span><div><h4>{item.title}</h4><p>{item.text}</p></div></article>)}</div></div>}

        {testimonials.length > 0 && <div className="credibility-block"><div className="credibility-block__title"><Quote size={19} /><h3>Depoimentos</h3></div><div className="testimonials-grid">{testimonials.map((item, index) => <blockquote key={`${item.name}-${index}`}><Quote size={20} /><p>{item.quote}</p><footer><strong>{item.name}</strong><span>{item.role}</span></footer></blockquote>)}</div></div>}
      </div>
    </section>
  )
}
