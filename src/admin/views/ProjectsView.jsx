import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BarChart3,
  Bot,
  Download,
  Eye,
  GalleryHorizontal,
  Globe2,
  ImagePlus,
  Link2,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { AdminProjectPreview } from '../../components/AdminProjectPreview'
import { AdminSaveStatus } from '../../components/admin/AdminSaveStatus'
import { DisplayModelPreview } from '../../components/DisplayModelPreview'
import { getProjectTypeLabel, projectTypes } from '../../data/projects'
import { optimizeImage } from '../../utils/optimizeImage'
import { isHttpUrl } from '../../utils/validation'
import { createAdminBackup, downloadAdminBackup, parseAdminBackup } from '../adminBackup'
import { readAsDataUrl, validateLocalImageSize } from '../adminUploads'

const projectStatusOptions = ['Concluído', 'Em andamento', 'Parado']

export function ProjectsView({ projectStore, siteStore }) {
  const [selectedId, setSelectedId] = useState(projectStore.projects[0]?.id || '')
  const [galleryUrl, setGalleryUrl] = useState('')
  const [repositorySearch, setRepositorySearch] = useState('')
  const [repositoryType, setRepositoryType] = useState('all')
  const [showModelBuilder, setShowModelBuilder] = useState(false)
  const [newModelName, setNewModelName] = useState('')
  const [newModelBehavior, setNewModelBehavior] = useState('website')
  const [newModelPresentation, setNewModelPresentation] = useState('live')
  const [editingModelId, setEditingModelId] = useState('')
  const [projectPreview, setProjectPreview] = useState('')
  const [error, setError] = useState('')
  const importRef = useRef(null)
  const coverRef = useRef(null)
  const galleryRef = useRef(null)

  const selected = useMemo(
    () => projectStore.projects.find((project) => project.id === selectedId) || projectStore.projects[0],
    [selectedId, projectStore.projects],
  )
  const filteredProjects = useMemo(() => {
    const query = repositorySearch.trim().toLocaleLowerCase('pt-BR')
    return projectStore.projects.map((project, index) => ({ project, index })).filter(({ project, index }) => {
      const matchesType = repositoryType === 'all' || getProjectTypeLabel(project) === repositoryType
      const searchable = [
        String(index + 1).padStart(2, '0'), String(index + 1), project.title, project.theme, project.category,
        getProjectTypeLabel(project), projectTypes[project.type], ...(project.tags || []),
      ].filter(Boolean).join(' ').toLocaleLowerCase('pt-BR')
      return matchesType && (!query || searchable.includes(query))
    })
  }, [projectStore.projects, repositorySearch, repositoryType])
  const savedProjectTypes = useMemo(
    () => [...new Set(projectStore.projects.map(getProjectTypeLabel).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR')),
    [projectStore.projects],
  )
  const displayModels = siteStore.site.displayModels || []
  const updateProject = (field, value) => selected && projectStore.updateProject(selected.id, { [field]: value })

  const selectDisplayModel = (modelId) => {
    const model = displayModels.find((item) => item.id === modelId)
    if (!selected || !model) return
    const previews = { powerbi: 'dashboard', website: 'system', content: 'content', ai: 'ai' }
    projectStore.updateProject(selected.id, { displayModelId: model.id, type: model.behavior, presentation: model.presentation, preview: previews[model.behavior] })
  }

  const addDisplayModel = () => {
    const name = newModelName.trim()
    if (!name) return setError('Digite um nome para o novo modelo de exibição.')
    if (editingModelId) {
      siteStore.updateSite({ displayModels: displayModels.map((model) => model.id === editingModelId ? { ...model, name, behavior: newModelBehavior, presentation: newModelPresentation } : model) })
      projectStore.replaceDisplayModel(editingModelId, { id: editingModelId, behavior: newModelBehavior, presentation: newModelPresentation })
      setEditingModelId('')
      setNewModelName('')
      setShowModelBuilder(false)
      setError('')
      return
    }
    const id = `modelo-${name.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${Date.now()}`
    const model = { id, name, behavior: newModelBehavior, presentation: newModelPresentation, builtIn: false }
    siteStore.updateSite({ displayModels: [...displayModels, model] })
    const previews = { powerbi: 'dashboard', website: 'system', content: 'content', ai: 'ai' }
    projectStore.updateProject(selected.id, { displayModelId: id, type: newModelBehavior, presentation: newModelPresentation, preview: previews[newModelBehavior] })
    setNewModelName('')
    setShowModelBuilder(false)
    setError('')
  }

  const editDisplayModel = (model) => {
    setEditingModelId(model.id)
    setNewModelName(model.name)
    setNewModelBehavior(model.behavior)
    setNewModelPresentation(model.presentation || 'case')
    setShowModelBuilder(true)
  }
  const removeDisplayModel = (model) => {
    const usedBy = projectStore.projects.filter((project) => project.displayModelId === model.id)
    const fallback = displayModels.find((item) => item.builtIn && item.behavior === model.behavior) || displayModels.find((item) => item.builtIn)
    if (!window.confirm(`Excluir o modelo “${model.name}”? ${usedBy.length ? `${usedBy.length} projeto(s) serão transferidos para “${fallback.name}”.` : ''}`)) return
    if (usedBy.length) projectStore.replaceDisplayModel(model.id, fallback)
    siteStore.updateSite({ displayModels: displayModels.filter((item) => item.id !== model.id) })
    setError('')
  }
  const addProject = () => setSelectedId(projectStore.addProject())
  const removeProject = () => {
    if (!selected || !window.confirm(`Excluir o projeto “${selected.title}”?`)) return
    const index = projectStore.projects.findIndex((project) => project.id === selected.id)
    const fallback = projectStore.projects[index - 1]?.id || projectStore.projects[index + 1]?.id || ''
    projectStore.removeProject(selected.id)
    setSelectedId(fallback)
  }
  const exportBackup = () => downloadAdminBackup(createAdminBackup(siteStore.site, projectStore.projects))
  const importBackup = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const parsed = parseAdminBackup(await file.text())
      if (parsed.site) siteStore.importSite(parsed.site)
      if (parsed.projects) projectStore.importProjects(parsed.projects)
      setSelectedId('')
      setError('')
    } catch (importError) {
      setError(importError.message || 'Arquivo de backup inválido.')
    } finally {
      event.target.value = ''
    }
  }
  const uploadCover = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const optimizedFile = await optimizeImage(file, { maxWidth: 1600, maxHeight: 1000, quality: 0.82 })
      if (projectStore.mode === 'local') validateLocalImageSize(optimizedFile, 800_000, 'Para o modo local, use uma capa com até 800 KB.')
      const previousImage = selected.image
      const image = projectStore.mode === 'supabase' ? await projectStore.uploadImage(optimizedFile, selected.id, 'capa') : await readAsDataUrl(optimizedFile)
      updateProject('image', image)
      if (projectStore.mode === 'supabase' && previousImage && previousImage !== image) void projectStore.removeImage(previousImage).catch(() => undefined)
      setError('')
    } catch (uploadError) {
      setError(uploadError.message)
    } finally {
      event.target.value = ''
    }
  }
  const uploadGallery = async (event) => {
    const currentGallery = selected?.gallery || []
    const files = Array.from(event.target.files || []).slice(0, 4 - currentGallery.length)
    if (!files.length) return
    try {
      const optimizedFiles = await Promise.all(files.map((file) => optimizeImage(file, { maxWidth: 1600, maxHeight: 1200, quality: 0.82 })))
      if (projectStore.mode === 'local') optimizedFiles.forEach((file) => validateLocalImageSize(file, 600_000, 'No modo local, cada print deve ter até 600 KB. Para arquivos maiores, use URLs ou Supabase Storage.'))
      const images = await Promise.all(optimizedFiles.map((file) => projectStore.mode === 'supabase' ? projectStore.uploadImage(file, selected.id, 'galeria') : readAsDataUrl(file)))
      updateProject('gallery', [...currentGallery, ...images].slice(0, 4))
      setError('')
    } catch (uploadError) {
      setError(uploadError.message)
    } finally {
      event.target.value = ''
    }
  }
  const addGalleryUrl = () => {
    const currentGallery = selected?.gallery || []
    if (!isHttpUrl(galleryUrl)) return setError('Informe uma URL de imagem iniciada por http:// ou https://.')
    if (currentGallery.length >= 4) return setError('Cada projeto pode ter até quatro prints.')
    updateProject('gallery', [...currentGallery, galleryUrl])
    setGalleryUrl('')
    setError('')
  }
  const removeGalleryImage = (index) => {
    const image = selected.gallery?.[index]
    updateProject('gallery', (selected.gallery || []).filter((_, imageIndex) => imageIndex !== index))
    if (projectStore.mode === 'supabase' && image) void projectStore.removeImage(image).catch(() => undefined)
  }
  const removeCoverImage = () => {
    const image = selected.image
    updateProject('image', '')
    if (projectStore.mode === 'supabase' && image) void projectStore.removeImage(image).catch(() => undefined)
  }

  return (
    <div className="admin-repositories">
      <aside className="admin-repository-list">
        <div className="admin-repository-list__head"><div><span>Repositórios</span><strong>{filteredProjects.length} de {projectStore.projects.length} projetos</strong></div><button type="button" onClick={addProject} aria-label="Adicionar projeto"><Plus size={17} /></button></div>
        <div className="admin-repository-tools"><label><span>Buscar projeto</span><input type="search" placeholder="Índice, nome ou tecnologia" value={repositorySearch} onChange={(event) => setRepositorySearch(event.target.value)} /></label><label><span>Filtrar por tipo</span><select value={repositoryType} onChange={(event) => setRepositoryType(event.target.value)}><option value="all">Todos os tipos</option>{savedProjectTypes.map((label) => <option key={label} value={label}>{label}</option>)}</select></label></div>
        <div className="admin-projects">{filteredProjects.map(({ project, index }) => <button className={selected?.id === project.id ? 'is-active' : ''} type="button" key={project.id} onClick={() => setSelectedId(project.id)}><i style={{ background: project.accent }} /><span><strong>{project.title}</strong><small>{getProjectTypeLabel(project)}</small></span><em>{String(index + 1).padStart(2, '0')}</em></button>)}{filteredProjects.length === 0 && <p className="admin-projects__empty">Nenhum projeto encontrado.</p>}</div>
        <div className="admin-sidebar__actions"><button type="button" onClick={exportBackup}><Download size={15} /> Backup</button><button type="button" onClick={() => importRef.current?.click()}><Upload size={15} /> Importar</button><input ref={importRef} type="file" accept="application/json" onChange={importBackup} hidden /></div>
      </aside>
      <main className="admin-editor">
        {selected ? <>
          <div className="admin-editor__head"><div><AdminSaveStatus status={projectStore.saveStatus} /><h3>{selected.title}</h3></div><div><button type="button" onClick={() => projectStore.moveProject(selected.id, -1)} aria-label="Mover projeto para cima"><ArrowUp size={17} /></button><button type="button" onClick={() => projectStore.moveProject(selected.id, 1)} aria-label="Mover projeto para baixo"><ArrowDown size={17} /></button><button className="danger" type="button" onClick={removeProject} aria-label="Excluir projeto"><Trash2 size={17} /></button></div></div>
          {error && <div className="form-error form-error--block">{error}</div>}
          <div className={`project-type-note project-type-note--${selected.type}`}>
            {selected.type === 'powerbi' && <><BarChart3 size={18} /><span><strong>Power BI</strong> Use o link incorporado. O visitante vê o dashboard, sem botão que exponha o endereço.</span></>}
            {selected.type === 'website' && <><Globe2 size={18} /><span><strong>Sistema web</strong> Cadastre o link para prévia no modal e acesso em nova aba.</span></>}
            {selected.type === 'content' && <><GalleryHorizontal size={18} /><span><strong>Conteúdo digital</strong> Informe formato, público, link de leitura/download e prints das páginas.</span></>}
            {selected.type === 'ai' && <><Bot size={18} /><span><strong>GPTs & Agentes de IA</strong> Explique o objetivo, as instruções, os recursos usados, a supervisão necessária e os limites da solução. Inclua um link público somente se houver uma demonstração segura.</span></>}
          </div>
          <div className="admin-form">
            <div className="admin-form-preview-heading field--wide"><div><span>Identificação e apresentação</span><small>Nome, tipo, tema, categoria e status</small></div><button type="button" onClick={() => setProjectPreview('identity')}><Eye size={15} /> Visualizar</button></div>
            <label className="field field--wide">Nome do projeto<input value={selected.title} onChange={(event) => updateProject('title', event.target.value)} /></label>
            <div className="field field--wide project-type-builder"><span>Tipo do portfólio <small>Selecione um existente ou escreva um novo. Ele aparecerá nos filtros e na lista lateral.</small></span><input list="portfolio-type-suggestions" placeholder="Ex.: Dashboard Financeiro, Sistema Web, Cartilha..." value={selected.typeLabel || ''} onChange={(event) => updateProject('typeLabel', event.target.value)} /><datalist id="portfolio-type-suggestions">{savedProjectTypes.map((label) => <option value={label} key={label} />)}</datalist><div className="project-type-builder__choices" role="group" aria-label="Tipos já cadastrados">{savedProjectTypes.map((label) => <button className={getProjectTypeLabel(selected) === label ? 'is-active' : ''} type="button" key={label} onClick={() => updateProject('typeLabel', label)}>{label}</button>)}</div></div>
            <label className="field field--wide">Tema / contexto<input value={selected.theme || ''} onChange={(event) => updateProject('theme', event.target.value)} /></label>
            <div className="field display-model-manager"><span>Modelo de exibição <small>Define tecnicamente como o link e a demonstração abrem</small></span><select value={selected.displayModelId || selected.type} onChange={(event) => selectDisplayModel(event.target.value)}>{displayModels.map((model) => <option value={model.id} key={model.id}>{model.name}</option>)}</select><button type="button" onClick={() => { setEditingModelId(''); setNewModelName(''); setNewModelBehavior('website'); setNewModelPresentation('live'); setShowModelBuilder((current) => !current) }}><Plus size={14} /> Criar modelo</button></div>
            <label className="field">Área / categoria <small>Assunto ou setor: BI, Saúde, Educação...</small><input value={selected.category || ''} onChange={(event) => updateProject('category', event.target.value)} /></label>
            <div className="field project-status-editor"><span>Status do projeto <small>Como está o andamento da entrega</small></span><select value={projectStatusOptions.includes(selected.status) ? selected.status : 'Outro'} onChange={(event) => updateProject('status', event.target.value === 'Outro' ? '' : event.target.value)}>{projectStatusOptions.map((status) => <option value={status} key={status}>{status}</option>)}<option value="Outro">Outro</option></select>{!projectStatusOptions.includes(selected.status) && <input autoFocus placeholder="Digite o motivo ou outro status" value={selected.status || ''} onChange={(event) => updateProject('status', event.target.value)} />}</div>
            {showModelBuilder && <div className="field field--wide display-model-builder"><div><label>{editingModelId ? 'Editar nome' : 'Nome do novo modelo'}<input placeholder="Ex.: Aplicativo com login" value={newModelName} onChange={(event) => setNewModelName(event.target.value)} /></label><label>Comportamento<select value={newModelBehavior} onChange={(event) => setNewModelBehavior(event.target.value)}>{Object.entries(projectTypes).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label><label>Apresentação<select value={newModelPresentation} onChange={(event) => setNewModelPresentation(event.target.value)}>{[...new Map(displayModels.filter((model) => model.builtIn).map((model) => [model.presentation, model])).values()].map((model) => <option value={model.presentation} key={model.presentation}>{model.name}</option>)}</select></label><button type="button" onClick={addDisplayModel}>{editingModelId ? 'Salvar alterações' : 'Adicionar modelo'}</button></div><p>Um modelo personalizado pode mudar de nome e escolher uma das apresentações prontas. Uma apresentação totalmente nova exige desenvolvimento no código.</p></div>}
            <div className="field field--wide display-model-library"><span>10 apresentações prontas e modelos personalizados <small>Passe o mouse ou use o teclado para ver a prévia.</small></span><div>{displayModels.map((model) => <span className="display-model-library__item" key={model.id}><button type="button" onClick={() => selectDisplayModel(model.id)}>{model.name}<small>{projectTypes[model.behavior]} · {model.presentation}</small><DisplayModelPreview model={model} /></button>{model.builtIn ? <i title="Apresentação pronta protegida">Pronto</i> : <><button className="edit" type="button" onClick={() => editDisplayModel(model)} aria-label={`Editar ${model.name}`}><Pencil size={13} /></button><button className="danger" type="button" onClick={() => removeDisplayModel(model)} aria-label={`Excluir ${model.name}`}><Trash2 size={13} /></button></>}</span>)}</div></div>
            <div className="admin-form-preview-heading field--wide"><div><span>Modelo de exibição selecionado</span><small>Prévia contextual da apresentação escolhida</small></div><button type="button" onClick={() => setProjectPreview('presentation')}><Eye size={15} /> Visualizar</button></div>
            <div className="admin-form-preview-heading field--wide"><div><span>Card público</span><small>Resumo, detalhes e tecnologias</small></div><button type="button" onClick={() => setProjectPreview('card')}><Eye size={15} /> Visualizar</button></div>
            <label className="field field--wide">Resumo para o card<textarea rows="3" value={selected.description} onChange={(event) => updateProject('description', event.target.value)} /></label>
            <label className="field field--wide">Detalhes do projeto<textarea rows="4" value={selected.details || ''} onChange={(event) => updateProject('details', event.target.value)} /></label>
            <div className="admin-settings-section-title admin-form-preview-heading field--wide"><span>Conte um pouco sobre o projeto <span className="admin-settings-info"><button type="button" aria-label="O que é um estudo de caso">!</button><span role="tooltip">Esta é a parte chamada estudo de caso: a história resumida do trabalho, mostrando o problema, o que você fez e o resultado alcançado.</span></span></span><button type="button" onClick={() => setProjectPreview('case')}><Eye size={15} /> Visualizar</button></div>
            <label className="field field--wide">Desafio / problema<textarea rows="3" placeholder="O que precisava ser resolvido?" value={selected.challenge || ''} onChange={(event) => updateProject('challenge', event.target.value)} /></label>
            <label className="field field--wide">Solução criada<textarea rows="3" placeholder="O que foi construído e como ajudou?" value={selected.solution || ''} onChange={(event) => updateProject('solution', event.target.value)} /></label>
            <label className="field field--wide">Resultados / benefícios<textarea rows="3" placeholder="Ex.: reduziu tempo, organizou dados, facilitou decisões..." value={selected.results || ''} onChange={(event) => updateProject('results', event.target.value)} /></label>
            <label className="field">Duração do projeto<input placeholder="Ex.: 3 semanas" value={selected.duration || ''} onChange={(event) => updateProject('duration', event.target.value)} /></label>
            <label className="field">Minha participação<input placeholder="Ex.: análise, design e desenvolvimento" value={selected.contribution || ''} onChange={(event) => updateProject('contribution', event.target.value)} /></label>
            <label className="field">Formato<input placeholder="Dashboard, site, cartilha..." value={selected.contentFormat || ''} onChange={(event) => updateProject('contentFormat', event.target.value)} /></label>
            <label className="field">Público-alvo<input value={selected.audience || ''} onChange={(event) => updateProject('audience', event.target.value)} /></label>
            <label className="field field--wide">Tecnologias <small>Separe com vírgulas</small><input value={selected.tags.join(', ')} onChange={(event) => updateProject('tags', event.target.value.split(',').map((tag) => tag.trim()).filter(Boolean))} /></label>
            <div className="admin-form-preview-heading field--wide"><div><span>Demonstração e imagens</span><small>Links, capa e prints do projeto</small></div><button type="button" onClick={() => setProjectPreview('media')}><Eye size={15} /> Visualizar</button></div>
            {selected.type === 'powerbi' ? <label className="field field--wide">Link incorporado do Power BI <small>Não haverá botão externo no projeto público</small><input type="url" placeholder="https://app.powerbi.com/view?..." value={selected.embedUrl || ''} onChange={(event) => updateProject('embedUrl', event.target.value)} /></label> : <label className="field field--wide">Link do projeto <small>{selected.type === 'content' ? 'Link de leitura, download ou página interativa' : selected.type === 'ai' ? 'Link público e seguro da demonstração, se existir' : 'Link público do sistema'}</small><input type="url" placeholder="https://..." value={selected.externalUrl || ''} onChange={(event) => updateProject('externalUrl', event.target.value)} /></label>}
            {selected.presentation === 'video' && <label className="field field--wide">Link do vídeo <small>YouTube, Vimeo ou arquivo público de vídeo</small><input type="url" placeholder="https://www.youtube.com/watch?v=..." value={selected.videoUrl || ''} onChange={(event) => updateProject('videoUrl', event.target.value)} /></label>}
            <label className="field field--wide">URL da imagem de capa<small>Esta imagem aparece no card. Se não houver capa, o primeiro print será usado.</small><input type="url" placeholder="https://.../capa.webp" value={selected.image?.startsWith('data:') ? '' : selected.image || ''} onChange={(event) => updateProject('image', event.target.value)} /></label>
            <div className="field field--wide image-upload"><span>Ou envie uma capa local <small>PNG/JPG são reduzidos e convertidos para WebP automaticamente, quando isso deixar o arquivo mais leve.</small></span><button type="button" onClick={() => coverRef.current?.click()}><ImagePlus size={17} /> Selecionar capa</button>{selected.image && <button type="button" onClick={removeCoverImage}>Remover capa</button>}<input ref={coverRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadCover} hidden /></div>
            <div className="field field--wide gallery-editor"><div className="gallery-editor__head"><span>Prints do projeto</span><small>{(selected.gallery || []).length}/4 imagens</small></div>{(selected.gallery || []).length > 0 && <div className="gallery-editor__grid">{selected.gallery.map((image, index) => <div key={`${image}-${index}`}><img src={image} alt={`Print ${index + 1}`} /><button type="button" onClick={() => removeGalleryImage(index)} aria-label={`Remover print ${index + 1}`}><X size={13} /></button></div>)}</div>}<div className="gallery-editor__actions"><div><Link2 size={15} /><input type="url" placeholder="URL de um print" value={galleryUrl} onChange={(event) => setGalleryUrl(event.target.value)} /><button type="button" onClick={addGalleryUrl}>Adicionar</button></div><button type="button" disabled={(selected.gallery || []).length >= 4} onClick={() => galleryRef.current?.click()}><Upload size={15} /> Enviar imagens</button><input ref={galleryRef} type="file" multiple accept="image/png,image/jpeg,image/webp" onChange={uploadGallery} hidden /></div></div>
            <label className="field">Cor de destaque<input type="color" value={selected.accent || '#6f7cff'} onChange={(event) => updateProject('accent', event.target.value)} /></label>
            <label className="field checkbox-field"><input type="checkbox" checked={selected.featured} onChange={(event) => updateProject('featured', event.target.checked)} /> Exibir no portfólio</label>
          </div>
          <div className="admin-note"><AlertTriangle size={15} /> {projectStore.mode === 'supabase' ? 'Alterações sincronizadas com o projeto Supabase exclusivo do portfólio.' : 'Sem banco, estas alterações ficam apenas neste navegador. Exporte o backup para não perder o trabalho.'}</div>
          <AdminProjectPreview project={selected} mode={projectPreview} model={displayModels.find((item) => item.id === (selected.displayModelId || selected.type))} onClose={() => setProjectPreview('')} />
        </> : <div className="admin-empty"><p>Nenhum projeto cadastrado.</p><button className="button button--primary" type="button" onClick={addProject}><Plus size={17} /> Criar projeto</button></div>}
      </main>
    </div>
  )
}
