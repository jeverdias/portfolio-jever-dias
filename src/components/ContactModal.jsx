import { ArrowUpRight, AtSign, BookOpen, BriefcaseBusiness, Camera, Code2, Mail, MessageCircle, Users, X } from 'lucide-react'
import { useRef } from 'react'
import { useModalA11y } from '../hooks/useModalA11y'

const validHttpUrl = (value) => /^https?:\/\//i.test(value || '')
const getWhatsAppHref = (value) => {
  if (validHttpUrl(value)) return value
  const number = (value || '').replace(/\D/g, '')
  return number ? `https://wa.me/${number}` : ''
}

export function ContactModal({ open, site, onClose }) {
  const closeRef = useRef(null)
  const modalRef = useRef(null)
  useModalA11y({ active: open, containerRef: modalRef, initialFocusRef: closeRef, onClose })

  if (!open) return null

  const contacts = [
    site.email && { label: 'Email principal', detail: site.email, href: `mailto:${site.email}`, icon: Mail },
    site.emailSecondary && { label: 'Email alternativo', detail: site.emailSecondary, href: `mailto:${site.emailSecondary}`, icon: Mail },
    validHttpUrl(site.linkedin) && { label: 'LinkedIn', detail: 'Perfil profissional', href: site.linkedin, icon: BriefcaseBusiness },
    validHttpUrl(site.instagram) && { label: 'Instagram', detail: 'Perfil no Instagram', href: site.instagram, icon: Camera },
    validHttpUrl(site.x) && { label: 'X (Twitter)', detail: 'Perfil no X', href: site.x, icon: AtSign },
    validHttpUrl(site.facebook) && { label: 'Facebook', detail: 'Perfil no Facebook', href: site.facebook, icon: Users },
    getWhatsAppHref(site.whatsapp) && { label: 'WhatsApp', detail: 'Conversa direta', href: getWhatsAppHref(site.whatsapp), icon: MessageCircle },
    validHttpUrl(site.github) && { label: 'GitHub', detail: 'Projetos e códigos', href: site.github, icon: Code2 },
    validHttpUrl(site.lattes) && { label: 'Currículo Lattes', detail: 'Formação e produção acadêmica', href: site.lattes, icon: BookOpen },
  ].filter(Boolean)

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={modalRef} className="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title" aria-describedby="contact-modal-description">
        <button ref={closeRef} className="modal-close" type="button" onClick={onClose} aria-label="Fechar contatos"><X size={21} /></button>
        <span className="contact-modal__eyebrow">Vamos conversar</span>
        <h2 id="contact-modal-title">Fale com {site.name.split(' ')[0]}</h2>
        <p id="contact-modal-description">Escolha o canal mais conveniente para entrar em contato ou conhecer meu trabalho.</p>

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
