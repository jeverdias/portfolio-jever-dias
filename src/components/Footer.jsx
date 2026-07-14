import { BriefcaseBusiness, Code2, LockKeyhole, Mail, MapPin } from 'lucide-react'
import { siteConfig } from '../data/site'

export function Footer({ onAdmin }) {
  return (
    <footer className="footer">
      <div className="container footer__top">
        <div className="footer__brand">
          <a className="brand" href="#inicio">JD<span className="brand__dot" /></a>
          <p>BI, Analytics e sistemas web com clareza, função e impacto.</p>
          <span><MapPin size={15} /> {siteConfig.location}</span>
        </div>
        <div className="footer__links">
          <div><strong>Navegação</strong><a href="#projetos">Projetos</a><a href="#servicos">Serviços</a><a href="#sobre">Sobre</a></div>
          <div>
            <strong>Contato</strong>
            <a href={siteConfig.linkedin} target="_blank" rel="noreferrer"><BriefcaseBusiness size={15} /> LinkedIn</a>
            <a href={siteConfig.github} target="_blank" rel="noreferrer"><Code2 size={15} /> GitHub</a>
            <a href={`mailto:${siteConfig.email}`}><Mail size={15} /> Email</a>
          </div>
        </div>
      </div>
      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} Jever Dias. Todos os direitos reservados.</span>
        <button type="button" onClick={onAdmin}><LockKeyhole size={13} /> Administrar portfólio</button>
      </div>
    </footer>
  )
}
