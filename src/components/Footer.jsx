import { BriefcaseBusiness, Camera, Code2, Mail, MapPin } from 'lucide-react'

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
          <div><strong>Navegação</strong><a href="#projetos">Projetos</a><a href="#servicos">Serviços</a><a href="#sobre">Sobre</a></div>
          <div>
            <strong>Contato</strong>
            <a href={site.linkedin} target="_blank" rel="noreferrer"><BriefcaseBusiness size={15} /> LinkedIn</a>
            <a href={site.instagram} target="_blank" rel="noreferrer"><Camera size={15} /> Instagram</a>
            <a href={site.github} target="_blank" rel="noreferrer"><Code2 size={15} /> GitHub</a>
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
