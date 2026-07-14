import { ArrowUpRight, BookOpen, BriefcaseBusiness, Camera, Code2, Mail, X } from 'lucide-react'
import { useEffect, useRef } from 'react'

const validHttpUrl = (value) => /^https?:\/\//i.test(value || '')

export function ContactModal({ open, site, onClose }) {
  const closeRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const closeOnEscape = (event) => event.key === 'Escape' && onClose()
    document.body.classList.add('modal-open')
    window.addEventListener('keydown', closeOnEscape)
    closeRef.current?.focus()

    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [open, onClose])

  if (!open) return null

  const contacts = [
    site.email && { label: 'Email principal', detail: site.email, href: `mailto:${site.email}`, icon: Mail },
    site.emailSecondary && { label: 'Email alternativo', detail: site.emailSecondary, href: `mailto:${site.emailSecondary}`, icon: Mail },
    validHttpUrl(site.linkedin) && { label: 'LinkedIn', detail: 'Perfil profissional', href: site.linkedin, icon: BriefcaseBusiness },
    validHttpUrl(site.instagram) && { label: 'Instagram', detail: 'Perfil no Instagram', href: site.instagram, icon: Camera },
    validHttpUrl(site.github) && { label: 'GitHub', detail: 'Projetos e códigos', href: site.github, icon: Code2 },
    validHttpUrl(site.lattes) && { label: 'Currículo Lattes', detail: 'Formação e produção acadêmica', href: site.lattes, icon: BookOpen },
  ].filter(Boolean)

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
        <button ref={closeRef} className="modal-close" type="button" onClick={onClose} aria-label="Fechar contatos"><X size={21} /></button>
        <span className="contact-modal__eyebrow">Vamos conversar</span>
        <h2 id="contact-modal-title">Fale com {site.name.split(' ')[0]}</h2>
        <p>Escolha o canal mais conveniente para entrar em contato ou conhecer meu trabalho.</p>

        <div className="contact-modal__grid">
          {contacts.map(({ label, detail, href, icon: Icon }) => (
            <a key={`${label}-${href}`} href={href} target={href.startsWith('mailto:') ? undefined : '_blank'} rel={href.startsWith('mailto:') ? undefined : 'noreferrer'}>
              <span className="contact-modal__icon"><Icon size={20} /></span>
              <span><strong>{label}</strong><small>{detail}</small></span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
