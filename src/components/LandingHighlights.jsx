import { CheckCircle2 } from 'lucide-react'

const parseBenefits = (text = '') => text.split('\n').filter(Boolean).map((line, index) => {
  const [title, description] = line.split('|').map((value) => value?.trim())
  return { id: `${index}-${title}`, title: title || `Benefício ${index + 1}`, description: description || '' }
})

export function LandingHighlights({ site }) {
  const benefits = parseBenefits(site.landingBenefitsText)
  if (!benefits.length) return null
  return <section className="landing-highlights" aria-label="Benefícios da oferta"><div className="container"><div className="landing-highlights__grid">{benefits.map((item) => <article key={item.id}><CheckCircle2 size={20} /><div><h2>{item.title}</h2><p>{item.description}</p></div></article>)}</div></div></section>
}
