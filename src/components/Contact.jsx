import { ArrowUpRight, Mail } from 'lucide-react'

export function Contact({ site }) {
  return (
    <section className="contact-section" id="contato">
      <div className="container">
        <div className="contact-card">
          <div className="contact-card__orb" />
          <div>
            <span className="contact-card__eyebrow">Vamos tirar a ideia do papel?</span>
            <h2>Dados e sistemas podem ser mais simples.</h2>
            <p>Conte o que você precisa. Eu retorno para conversarmos sobre o cenário e o melhor caminho.</p>
          </div>
          <a className="button button--light" href={`mailto:${site.email}`}>
            <Mail size={18} /> Falar com {site.name.split(' ')[0]} <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
    </section>
  )
}
