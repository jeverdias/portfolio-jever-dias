import { X } from 'lucide-react'
import { getProjectTypeLabel } from '../data/projects'
import { DisplayModelExample } from './DisplayModelPreview'
import { ProjectVisual } from './ProjectVisual'

export function AdminProjectPreview({ project, mode, model, onClose }) {
  if (!project || !mode) return null
  const title = { identity: 'Identificação e apresentação', card: 'Card público', case: 'Estudo de caso', media: 'Demonstração e imagens', presentation: 'Modelo de exibição' }[mode]
  return <div className="admin-submodal" role="dialog" aria-modal="true" aria-label={`Prévia: ${title}`} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <div className="admin-submodal__panel project-change-preview"><header><div><span>VEJA COMO FICOU</span><h3>{title}</h3></div><button type="button" onClick={onClose} aria-label="Fechar"><X size={19} /></button></header>
      {mode === 'identity' && <main className="project-preview-identity"><small>{getProjectTypeLabel(project)} · {project.status || 'Sem status'}</small><h2>{project.title}</h2><p>{project.theme || 'O tema/contexto aparecerá aqui.'}</p><span>{project.category || 'Área ainda não informada'}</span></main>}
      {mode === 'card' && <main className="project-preview-card"><ProjectVisual project={project} /><small>{getProjectTypeLabel(project)}</small><h2>{project.title}</h2><p>{project.description || 'O resumo do card aparecerá aqui.'}</p><div>{(project.tags || []).map((tag) => <span key={tag}>{tag}</span>)}</div></main>}
      {mode === 'case' && <main className="project-preview-case"><h2>{project.title}</h2>{[['Desafio', project.challenge], ['Solução', project.solution], ['Resultado', project.results]].map(([label, value]) => <section key={label}><small>{label}</small><p>{value || `${label} ainda não preenchido.`}</p></section>)}<footer><span>{project.duration || 'Duração não informada'}</span><span>{project.contribution || 'Participação não informada'}</span></footer></main>}
      {mode === 'media' && <main className="project-preview-media"><ProjectVisual project={project} large /><div>{(project.gallery || []).map((image, index) => <img src={image} alt={`Print ${index + 1}`} key={`${image}-${index}`} />)}</div><p>{project.externalUrl || project.embedUrl || project.videoUrl || 'Nenhum link de demonstração informado.'}</p></main>}
      {mode === 'presentation' && <main className="project-preview-presentation"><DisplayModelExample presentation={model?.presentation} /><h2>{model?.name || 'Modelo selecionado'}</h2><p>Esta é uma amostra contextual de como esse tipo de projeto será apresentado.</p></main>}
    </div>
  </div>
}
