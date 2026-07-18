import { ArrowUpRight, BookOpen, Download, FileText } from 'lucide-react'

const validHttpUrl = (value) => /^https?:\/\//i.test(value || '')

export function Resume({ site }) {
  const hasResume = validHttpUrl(site.resumeUrl)
  const hasLattes = validHttpUrl(site.lattes)
  if (!hasResume && !hasLattes) return null

  return (
    <section className="section resume-section" id="curriculo">
      <div className="container resume-card">
        <div className="resume-card__icon"><FileText size={31} /></div>
        <div>
          <span className="section-heading__eyebrow">Currículo</span>
          <h2>Experiência, formação e competências.</h2>
          <p>{site.resumeSummary || 'Consulte meu currículo profissional e minha trajetória acadêmica.'}</p>
        </div>
        <div className="resume-card__actions">
          {hasResume && <a className="button button--primary" href={site.resumeUrl} target="_blank" rel="noreferrer"><ArrowUpRight size={17} /> Visualizar currículo</a>}
          {hasResume && <a className="button button--secondary" href={site.resumeUrl} download><Download size={17} /> Baixar PDF</a>}
          {hasLattes && <a className="button button--secondary" href={site.lattes} target="_blank" rel="noreferrer"><BookOpen size={17} /> Currículo Lattes</a>}
        </div>
      </div>
    </section>
  )
}
