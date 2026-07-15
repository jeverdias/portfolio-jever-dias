import { ArrowLeft, ArrowUpRight, BarChart3, BookOpen, Bot, CheckCircle2, Clock3, ExternalLink, Globe2, Images, Lightbulb, Share2, Target, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getProjectTypeLabel, projectTypes } from '../data/projects'
import { ProjectVisual } from './ProjectVisual'

const typeIcons = { powerbi: BarChart3, website: Globe2, content: BookOpen, ai: Bot }
const validLink = (value) => /^https?:\/\//i.test(value || '')
const validImage = (value) => validLink(value) || /^data:image\//i.test(value || '')

export function ProjectDetail({ project, onBack, onDemo }) {
  const [shared, setShared] = useState(false)
  const Icon = typeIcons[project.type] || Globe2
  const gallery = (project.gallery || []).filter(validImage)

  useEffect(() => {
    const previousTitle = document.title
    const description = document.querySelector('meta[name="description"]')
    const previousDescription = description?.getAttribute('content')
    document.title = `${project.title} | Portfólio Jever Dias`
    description?.setAttribute('content', project.description)
    return () => {
      document.title = previousTitle
      if (previousDescription) description?.setAttribute('content', previousDescription)
    }
  }, [project])

  const share = async () => {
    const data = { title: project.title, text: project.description, url: window.location.href }
    try {
      if (navigator.share) await navigator.share(data)
      else await navigator.clipboard.writeText(window.location.href)
      setShared(true)
      window.setTimeout(() => setShared(false), 1800)
    } catch {
      setShared(false)
    }
  }

  return (
    <main className="case-page" id="conteudo">
      <header className="case-page__nav">
        <button type="button" onClick={onBack}><ArrowLeft size={17} /> Voltar ao portfólio</button>
        <a className="brand" href="/" onClick={(event) => { event.preventDefault(); onBack() }}>JD<span className="brand__dot" /></a>
        <button type="button" onClick={share}><Share2 size={16} /> {shared ? 'Link copiado' : 'Compartilhar'}</button>
      </header>

      <section className="case-hero" style={{ '--project-accent': project.accent }}>
        <div className="container case-hero__grid">
          <div className="case-hero__copy">
            <span className="case-eyebrow"><Icon size={16} /> História do projeto · {getProjectTypeLabel(project)}</span>
            {project.status && <span className="case-status"><i /> {project.status}</span>}
            <h1>{project.title}</h1>
            <p>{project.description}</p>
            <div className="tag-list tag-list--large">{(project.tags || []).map((tag) => <span key={tag}>{tag}</span>)}</div>
            <div className="case-hero__actions">
              <button className="button button--primary" type="button" onClick={onDemo}><ExternalLink size={17} /> Ver demonstração</button>
              <a className="button button--secondary" href="#estudo-de-caso">Conhecer o projeto</a>
              {project.type !== 'powerbi' && validLink(project.externalUrl) && <a className="button button--secondary" href={project.externalUrl} target="_blank" rel="noreferrer">Abrir projeto <ArrowUpRight size={17} /></a>}
            </div>
          </div>
          <div className="case-hero__visual"><ProjectVisual project={project} large /></div>
        </div>
      </section>

      <section className="case-content container">
        <div className="case-summary">
          <article><Target size={20} /><span>Contexto</span><strong>{project.theme || 'Projeto profissional'}</strong></article>
          <article><UserRound size={20} /><span>Público</span><strong>{project.audience || 'Público a definir'}</strong></article>
          <article><Clock3 size={20} /><span>Duração</span><strong>{project.duration || 'A informar'}</strong></article>
          <article><Images size={20} /><span>Formato</span><strong>{project.contentFormat || projectTypes[project.type]}</strong></article>
        </div>

        <div className="case-story" id="estudo-de-caso">
          <div className="case-story__intro"><span>Conte um pouco sobre o projeto</span><h2>Do problema ao resultado, em linguagem simples.</h2><p>{project.details || project.description}</p></div>
          <div className="case-story__steps">
            <article><div><Target size={21} /></div><span>01 · Desafio</span><h3>O que precisava ser resolvido?</h3><p>{project.challenge || 'O desafio será detalhado quando as informações reais do projeto forem cadastradas.'}</p></article>
            <article><div><Lightbulb size={21} /></div><span>02 · Solução</span><h3>O que foi criado?</h3><p>{project.solution || project.details || 'A solução será descrita de forma simples e objetiva.'}</p></article>
            <article><div><CheckCircle2 size={21} /></div><span>03 · Resultado</span><h3>Qual foi o benefício?</h3><p>{project.results || 'Os resultados e benefícios serão adicionados após a validação do projeto.'}</p></article>
          </div>
        </div>

        {project.contribution && <div className="case-contribution"><UserRound size={20} /><div><span>Minha participação</span><p>{project.contribution}</p></div></div>}

        <div className="case-gallery">
          <div><span>Galeria do projeto</span><h2>Imagens e detalhes da entrega</h2><p>As imagens são carregadas apenas quando se aproximam da tela para manter a página leve.</p></div>
          {gallery.length ? <div className="case-gallery__grid">{gallery.map((image, index) => <button type="button" key={`${image}-${index}`} onClick={onDemo} aria-label={`Ampliar imagem ${index + 1}`}><img src={image} alt={`Imagem ${index + 1} de ${project.title}`} loading="lazy" decoding="async" /></button>)}</div> : <div className="case-gallery__empty"><Images size={27} /><p>Os prints reais deste projeto serão adicionados pelo painel administrativo.</p></div>}
        </div>

        <div className="case-cta"><div><span>Tem um projeto parecido?</span><h2>Vamos transformar sua ideia em uma entrega clara.</h2></div><a className="button button--light" href="/#contato">Falar com Jever <ArrowUpRight size={17} /></a></div>
      </section>
    </main>
  )
}
