import { AtSign, BriefcaseBusiness, Camera, Code2, Mail, MapPin, MessageCircle, Users } from 'lucide-react'

const validHttpUrl = (value) => /^https?:\/\//i.test(value || '')
const getWhatsAppHref = (value) => {
  if (validHttpUrl(value)) return value
  const number = (value || '').replace(/\D/g, '')
  return number ? `https://wa.me/${number}` : ''
}

export function Footer({ site }) {
  return (
    <footer className="footer">
      <div className="container footer__top">
        <div className="footer__brand">
          <a className="brand" href="#inicio">JD<span className="brand__dot" /></a>
          <p>BI, Analytics e sistemas web com clareza, função e impacto.</p>
          <span><MapPin size={15} /> {site.location}</span>
        </div>
        <div className="footer__links">
          <div><strong>Navegação</strong><a href="#projetos">Portfólio</a><a href="#servicos">Serviços</a><a href="#sobre">Sobre</a></div>
          <div>
            <strong>Contato</strong>
            {validHttpUrl(site.linkedin) && <a href={site.linkedin} target="_blank" rel="noreferrer"><BriefcaseBusiness size={15} /> LinkedIn</a>}
            {validHttpUrl(site.instagram) && <a href={site.instagram} target="_blank" rel="noreferrer"><Camera size={15} /> Instagram</a>}
            {validHttpUrl(site.x) && <a href={site.x} target="_blank" rel="noreferrer"><AtSign size={15} /> X (Twitter)</a>}
            {validHttpUrl(site.facebook) && <a href={site.facebook} target="_blank" rel="noreferrer"><Users size={15} /> Facebook</a>}
            {getWhatsAppHref(site.whatsapp) && <a href={getWhatsAppHref(site.whatsapp)} target="_blank" rel="noreferrer"><MessageCircle size={15} /> WhatsApp</a>}
            {validHttpUrl(site.github) && <a href={site.github} target="_blank" rel="noreferrer"><Code2 size={15} /> GitHub</a>}
            <a href={`mailto:${site.email}`}><Mail size={15} /> Email</a>
          </div>
        </div>
      </div>
      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} {site.name}. Todos os direitos reservados.</span>
        <span>Portfólio profissional · BI, Analytics e Sistemas Web</span>
      </div>
    </footer>
  )
}
