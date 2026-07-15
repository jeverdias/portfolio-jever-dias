import { Award, CalendarDays, Quote, Sparkles } from 'lucide-react'
import { technologies } from '../data/site'
import { SectionTitle } from './ui/SectionTitle'

const parseLines = (value, fields) => (value || '').split('\n').map((line) => {
  const parts = line.split('|').map((part) => part.trim())
  return Object.fromEntries(fields.map((field, index) => [field, parts[index] || '']))
}).filter((item) => item[fields[0]])

export function Credibility({ site }) {
  const timeline = parseLines(site.timelineText, ['period', 'title', 'text'])
  const testimonials = parseLines(site.testimonialsText, ['name', 'role', 'quote'])

  return (
    <section className="section credibility-section" id="trajetoria">
      <div className="container">
        <SectionTitle eyebrow="Experiência e confiança" title="Resultados construídos com clareza." text="Tecnologias, entregas e trajetória reunidas em uma visão objetiva." />
        <div className="credibility-metrics">
          <article><Award size={21} /><strong>{site.dashboardsCount}</strong><span>{site.dashboardsLabel}</span></article>
          <article><Sparkles size={21} /><strong>{site.systemsCount}</strong><span>{site.systemsLabel}</span></article>
          <article className="credibility-tech"><span>Tecnologias</span><div>{technologies.map((technology) => <i key={technology}>{technology}</i>)}</div></article>
        </div>

        {timeline.length > 0 && <div className="credibility-block"><div className="credibility-block__title"><CalendarDays size={19} /><h3>Linha do tempo profissional</h3></div><div className="career-timeline">{timeline.map((item, index) => <article key={`${item.period}-${index}`}><span>{item.period}</span><div><h4>{item.title}</h4><p>{item.text}</p></div></article>)}</div></div>}

        {testimonials.length > 0 && <div className="credibility-block"><div className="credibility-block__title"><Quote size={19} /><h3>Depoimentos</h3></div><div className="testimonials-grid">{testimonials.map((item, index) => <blockquote key={`${item.name}-${index}`}><Quote size={20} /><p>{item.quote}</p><footer><strong>{item.name}</strong><span>{item.role}</span></footer></blockquote>)}</div></div>}
      </div>
    </section>
  )
}
