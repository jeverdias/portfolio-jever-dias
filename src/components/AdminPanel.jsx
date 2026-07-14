import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BarChart3,
  CheckCircle2,
  Database,
  Download,
  FolderKanban,
  GalleryHorizontal,
  Globe2,
  ImagePlus,
  LayoutDashboard,
  Link2,
  LogOut,
  Plus,
  RotateCcw,
  Save,
  Settings,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { projectTypes } from '../data/projects'

const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || 'jd2026'
const validHttpUrl = (value) => /^https?:\/\//i.test(value || '')

const readAsDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(reader.result)
  reader.onerror = () => reject(new Error('Não foi possível ler a imagem.'))
  reader.readAsDataURL(file)
})

export function AdminPanel({ open, onClose, projectStore, siteStore }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [view, setView] = useState('overview')
  const [selectedId, setSelectedId] = useState(projectStore.projects[0]?.id || '')
  const [galleryUrl, setGalleryUrl] = useState('')
  const importRef = useRef(null)
  const coverRef = useRef(null)
  const galleryRef = useRef(null)

  const selected = useMemo(
    () => projectStore.projects.find((project) => project.id === selectedId) || projectStore.projects[0],
    [selectedId, projectStore.projects],
  )

  useEffect(() => {
    if (!open) return undefined
    const closeOnEscape = (event) => event.key === 'Escape' && onClose()
    document.body.classList.add('modal-open')
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [open, onClose])

  if (!open) return null

  const login = (event) => {
    event.preventDefault()
    if (pin === ADMIN_PIN) {
      setAuthenticated(true)
      setPin('')
      setError('')
    } else {
      setError('PIN incorreto. Confira o arquivo .env do projeto.')
    }
  }

  const updateProject = (field, value) => selected && projectStore.updateProject(selected.id, { [field]: value })

  const addProject = () => {
    const id = projectStore.addProject()
    setSelectedId(id)
    setView('repositories')
  }

  const removeProject = () => {
    if (!selected || !window.confirm(`Excluir o projeto “${selected.title}”?`)) return
    const index = projectStore.projects.findIndex((project) => project.id === selected.id)
    const fallback = projectStore.projects[index - 1]?.id || projectStore.projects[index + 1]?.id || ''
    projectStore.removeProject(selected.id)
    setSelectedId(fallback)
  }

  const exportBackup = () => {
    const payload = {
      version: 2,
      exportedAt: new Date().toISOString(),
      site: siteStore.site,
      projects: projectStore.projects,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `portfolio-jever-backup-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const importBackup = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const parsed = JSON.parse(await file.text())
      if (Array.isArray(parsed)) {
        projectStore.importProjects(parsed)
      } else {
        if (parsed.site) siteStore.importSite(parsed.site)
        if (parsed.projects) projectStore.importProjects(parsed.projects)
      }
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
    if (file.size > 800_000) {
      setError('Para o modo local, use uma capa com até 800 KB.')
      event.target.value = ''
      return
    }
    try {
      updateProject('image', await readAsDataUrl(file))
      setError('')
    } catch (uploadError) {
      setError(uploadError.message)
    } finally {
      event.target.value = ''
    }
  }

  const uploadGallery = async (event) => {
    const currentGallery = selected?.gallery || []
    const remaining = 4 - currentGallery.length
    const files = Array.from(event.target.files || []).slice(0, remaining)
    if (!files.length) return
    if (files.some((file) => file.size > 600_000)) {
      setError('No modo local, cada print deve ter até 600 KB. Para arquivos maiores, use URLs ou Supabase Storage.')
      event.target.value = ''
      return
    }
    try {
      const images = await Promise.all(files.map(readAsDataUrl))
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
    if (!validHttpUrl(galleryUrl)) {
      setError('Informe uma URL de imagem iniciada por http:// ou https://.')
      return
    }
    if (currentGallery.length >= 4) {
      setError('Cada projeto pode ter até quatro prints.')
      return
    }
    updateProject('gallery', [...currentGallery, galleryUrl])
    setGalleryUrl('')
    setError('')
  }

  const removeGalleryImage = (index) => {
    updateProject('gallery', (selected.gallery || []).filter((_, imageIndex) => imageIndex !== index))
  }

  const renderOverview = () => {
    const counts = projectStore.projects.reduce((result, project) => ({
      ...result,
      [project.type]: (result[project.type] || 0) + 1,
    }), {})

    return (
      <div className="admin-page">
        <div className="admin-page__heading"><span>Visão geral</span><h3>Seu portfólio em um só lugar.</h3><p>Acompanhe o conteúdo cadastrado e escolha o que deseja editar.</p></div>
        <div className="admin-metrics">
          <article><BarChart3 size={20} /><strong>{counts.powerbi || 0}</strong><span>Projetos Power BI</span></article>
          <article><Globe2 size={20} /><strong>{counts.website || 0}</strong><span>Sistemas web</span></article>
          <article><GalleryHorizontal size={20} /><strong>{counts.content || 0}</strong><span>Conteúdos digitais</span></article>
          <article><CheckCircle2 size={20} /><strong>{projectStore.projects.filter((project) => project.featured).length}</strong><span>Projetos publicados</span></article>
        </div>
        <div className="admin-overview-grid">
          <article className="admin-overview-card">
            <div className="admin-overview-card__icon"><FolderKanban size={21} /></div>
            <div><h4>Repositórios</h4><p>Edite títulos, resumos, links, tecnologias e até quatro prints por projeto.</p></div>
            <button type="button" onClick={() => setView('repositories')}>Gerenciar projetos</button>
          </article>
          <article className="admin-overview-card">
            <div className="admin-overview-card__icon"><Settings size={21} /></div>
            <div><h4>Configurações</h4><p>Atualize sua apresentação, contatos, redes e números exibidos no site.</p></div>
            <button type="button" onClick={() => setView('settings')}>Editar o site</button>
          </article>
        </div>
        <div className="admin-storage-card">
          <Database size={22} />
          <div><strong>Modo local ativo</strong><p>Os dados estão neste navegador. Para edição online segura e fotos maiores, a próxima etapa é conectar Supabase Auth, Database e Storage.</p></div>
          <span>Preparado para evolução</span>
        </div>
      </div>
    )
  }

  const renderSettings = () => (
    <div className="admin-page">
      <div className="admin-page__heading"><span>Configurações</span><h3>Detalhes do site</h3><p>As mudanças abaixo aparecem imediatamente no portfólio deste navegador.</p></div>
      <div className="admin-form admin-form--settings">
        <label className="field">Nome profissional<input value={siteStore.site.name} onChange={(event) => siteStore.updateSite({ name: event.target.value })} /></label>
        <label className="field">Cargo / especialidades<input value={siteStore.site.role} onChange={(event) => siteStore.updateSite({ role: event.target.value })} /></label>
        <label className="field field--wide">Selo acima do nome<input value={siteStore.site.eyebrow} onChange={(event) => siteStore.updateSite({ eyebrow: event.target.value })} /></label>
        <label className="field field--wide">Texto de apresentação<textarea rows="4" value={siteStore.site.intro} onChange={(event) => siteStore.updateSite({ intro: event.target.value })} /></label>
        <label className="field">Email<input type="email" value={siteStore.site.email} onChange={(event) => siteStore.updateSite({ email: event.target.value })} /></label>
        <label className="field">Email alternativo<input type="email" placeholder="Opcional" value={siteStore.site.emailSecondary || ''} onChange={(event) => siteStore.updateSite({ emailSecondary: event.target.value })} /></label>
        <label className="field">Localização<input value={siteStore.site.location} onChange={(event) => siteStore.updateSite({ location: event.target.value })} /></label>
        <label className="field">LinkedIn<input type="url" value={siteStore.site.linkedin} onChange={(event) => siteStore.updateSite({ linkedin: event.target.value })} /></label>
        <label className="field">GitHub<input type="url" value={siteStore.site.github} onChange={(event) => siteStore.updateSite({ github: event.target.value })} /></label>
        <label className="field field--wide">Instagram<input type="url" placeholder="https://www.instagram.com/seuusuario/" value={siteStore.site.instagram} onChange={(event) => siteStore.updateSite({ instagram: event.target.value })} /></label>
        <label className="field field--wide">Currículo Lattes<input type="url" placeholder="http://lattes.cnpq.br/0000000000000000" value={siteStore.site.lattes || ''} onChange={(event) => siteStore.updateSite({ lattes: event.target.value })} /></label>
        <label className="field">Número de dashboards<input value={siteStore.site.dashboardsCount} onChange={(event) => siteStore.updateSite({ dashboardsCount: event.target.value })} /></label>
        <label className="field">Legenda dos dashboards<input value={siteStore.site.dashboardsLabel} onChange={(event) => siteStore.updateSite({ dashboardsLabel: event.target.value })} /></label>
        <label className="field">Número de sistemas<input value={siteStore.site.systemsCount} onChange={(event) => siteStore.updateSite({ systemsCount: event.target.value })} /></label>
        <label className="field">Legenda dos sistemas<input value={siteStore.site.systemsLabel} onChange={(event) => siteStore.updateSite({ systemsLabel: event.target.value })} /></label>
      </div>
      <button className="admin-inline-action" type="button" onClick={() => window.confirm('Restaurar os textos originais do site?') && siteStore.resetSite()}><RotateCcw size={14} /> Restaurar configurações</button>
    </div>
  )

  const renderRepositories = () => (
    <div className="admin-repositories">
      <aside className="admin-repository-list">
        <div className="admin-repository-list__head"><div><span>Repositórios</span><strong>{projectStore.projects.length} projetos</strong></div><button type="button" onClick={addProject} aria-label="Adicionar projeto"><Plus size={17} /></button></div>
        <div className="admin-projects">
          {projectStore.projects.map((project, index) => (
            <button className={selected?.id === project.id ? 'is-active' : ''} type="button" key={project.id} onClick={() => setSelectedId(project.id)}>
              <i style={{ background: project.accent }} />
              <span><strong>{project.title}</strong><small>{projectTypes[project.type]}</small></span>
              <em>{String(index + 1).padStart(2, '0')}</em>
            </button>
          ))}
        </div>
        <div className="admin-sidebar__actions">
          <button type="button" onClick={exportBackup}><Download size={15} /> Backup</button>
          <button type="button" onClick={() => importRef.current?.click()}><Upload size={15} /> Importar</button>
          <input ref={importRef} type="file" accept="application/json" onChange={importBackup} hidden />
        </div>
      </aside>

      <main className="admin-editor">
        {selected ? (
          <>
            <div className="admin-editor__head">
              <div><span><Save size={14} /> Salvo automaticamente</span><h3>{selected.title}</h3></div>
              <div>
                <button type="button" onClick={() => projectStore.moveProject(selected.id, -1)} aria-label="Mover projeto para cima"><ArrowUp size={17} /></button>
                <button type="button" onClick={() => projectStore.moveProject(selected.id, 1)} aria-label="Mover projeto para baixo"><ArrowDown size={17} /></button>
                <button className="danger" type="button" onClick={removeProject} aria-label="Excluir projeto"><Trash2 size={17} /></button>
              </div>
            </div>

            {error && <div className="form-error form-error--block">{error}</div>}
            <div className={`project-type-note project-type-note--${selected.type}`}>
              {selected.type === 'powerbi' && <><BarChart3 size={18} /><span><strong>Power BI</strong> Use o link incorporado. O visitante vê o dashboard, sem botão que exponha o endereço.</span></>}
              {selected.type === 'website' && <><Globe2 size={18} /><span><strong>Sistema web</strong> Cadastre o link para prévia no modal e acesso em nova aba.</span></>}
              {selected.type === 'content' && <><GalleryHorizontal size={18} /><span><strong>Conteúdo digital</strong> Informe formato, público, link de leitura/download e prints das páginas.</span></>}
            </div>

            <div className="admin-form">
              <label className="field field--wide">Nome do projeto<input value={selected.title} onChange={(event) => updateProject('title', event.target.value)} /></label>
              <label className="field field--wide">Tema / contexto<input value={selected.theme || ''} onChange={(event) => updateProject('theme', event.target.value)} /></label>
              <label className="field">Tipo
                <select value={selected.type} onChange={(event) => updateProject('type', event.target.value)}>
                  {Object.entries(projectTypes).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
                </select>
              </label>
              <label className="field">Categoria<input value={selected.category} onChange={(event) => updateProject('category', event.target.value)} /></label>
              <label className="field field--wide">Resumo para o card<textarea rows="3" value={selected.description} onChange={(event) => updateProject('description', event.target.value)} /></label>
              <label className="field field--wide">Detalhes do projeto<textarea rows="4" value={selected.details || ''} onChange={(event) => updateProject('details', event.target.value)} /></label>
              <label className="field">Formato<input placeholder="Dashboard, site, cartilha..." value={selected.contentFormat || ''} onChange={(event) => updateProject('contentFormat', event.target.value)} /></label>
              <label className="field">Público-alvo<input value={selected.audience || ''} onChange={(event) => updateProject('audience', event.target.value)} /></label>
              <label className="field field--wide">Tecnologias <small>Separe com vírgulas</small><input value={selected.tags.join(', ')} onChange={(event) => updateProject('tags', event.target.value.split(',').map((tag) => tag.trim()).filter(Boolean))} /></label>

              {selected.type === 'powerbi' ? (
                <label className="field field--wide">Link incorporado do Power BI <small>Não haverá botão externo no projeto público</small><input type="url" placeholder="https://app.powerbi.com/view?..." value={selected.embedUrl || ''} onChange={(event) => updateProject('embedUrl', event.target.value)} /></label>
              ) : (
                <label className="field field--wide">Link do projeto <small>{selected.type === 'content' ? 'Link de leitura, download ou página interativa' : 'Link público do sistema'}</small><input type="url" placeholder="https://..." value={selected.externalUrl || ''} onChange={(event) => updateProject('externalUrl', event.target.value)} /></label>
              )}

              <label className="field field--wide">URL da imagem de capa<input type="url" placeholder="https://.../capa.webp" value={selected.image?.startsWith('data:') ? '' : selected.image || ''} onChange={(event) => updateProject('image', event.target.value)} /></label>
              <div className="field field--wide image-upload">
                <span>Ou envie uma capa local</span>
                <button type="button" onClick={() => coverRef.current?.click()}><ImagePlus size={17} /> Selecionar capa</button>
                {selected.image && <button type="button" onClick={() => updateProject('image', '')}>Remover capa</button>}
                <input ref={coverRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadCover} hidden />
              </div>

              <div className="field field--wide gallery-editor">
                <div className="gallery-editor__head"><span>Prints do projeto</span><small>{(selected.gallery || []).length}/4 imagens</small></div>
                {(selected.gallery || []).length > 0 && (
                  <div className="gallery-editor__grid">
                    {selected.gallery.map((image, index) => (
                      <div key={`${image}-${index}`}><img src={image} alt={`Print ${index + 1}`} /><button type="button" onClick={() => removeGalleryImage(index)} aria-label={`Remover print ${index + 1}`}><X size={13} /></button></div>
                    ))}
                  </div>
                )}
                <div className="gallery-editor__actions">
                  <div><Link2 size={15} /><input type="url" placeholder="URL de um print" value={galleryUrl} onChange={(event) => setGalleryUrl(event.target.value)} /><button type="button" onClick={addGalleryUrl}>Adicionar</button></div>
                  <button type="button" disabled={(selected.gallery || []).length >= 4} onClick={() => galleryRef.current?.click()}><Upload size={15} /> Enviar imagens</button>
                  <input ref={galleryRef} type="file" multiple accept="image/png,image/jpeg,image/webp" onChange={uploadGallery} hidden />
                </div>
              </div>

              <label className="field">Cor de destaque<input type="color" value={selected.accent || '#6f7cff'} onChange={(event) => updateProject('accent', event.target.value)} /></label>
              <label className="field checkbox-field"><input type="checkbox" checked={selected.featured} onChange={(event) => updateProject('featured', event.target.checked)} /> Exibir no portfólio</label>
            </div>
            <div className="admin-note"><AlertTriangle size={15} /> Sem banco, estas alterações ficam apenas neste navegador. Exporte o backup para não perder o trabalho.</div>
          </>
        ) : (
          <div className="admin-empty"><p>Nenhum projeto cadastrado.</p><button className="button button--primary" type="button" onClick={addProject}><Plus size={17} /> Criar projeto</button></div>
        )}
      </main>
    </div>
  )

  return (
    <div className="admin-backdrop">
      <section className="admin-panel admin-panel--console" role="dialog" aria-modal="true" aria-labelledby="admin-title">
        <button className="modal-close" type="button" onClick={onClose} aria-label="Fechar administração"><X size={21} /></button>

        {!authenticated ? (
          <div className="admin-login">
            <div className="admin-login__mark">JD</div>
            <span>Área administrativa</span>
            <h2 id="admin-title">Login</h2>
            <p>Entre para configurar o site e gerenciar seus repositórios.</p>
            <form onSubmit={login}>
              <label htmlFor="admin-pin">PIN de acesso</label>
              <input id="admin-pin" type="password" value={pin} onChange={(event) => setPin(event.target.value)} autoFocus />
              {error && <div className="form-error">{error}</div>}
              <button className="button button--primary" type="submit">Entrar no painel</button>
            </form>
            <small>Primeiro acesso: <strong>jd2026</strong>. Este login é local e será substituído por autenticação segura ao conectar o Supabase.</small>
          </div>
        ) : (
          <div className="admin-console">
            <aside className="admin-console__nav">
              <div className="admin-console__brand"><div>JD</div><span><strong>Jever Dias</strong><small>Console do portfólio</small></span></div>
              <nav aria-label="Navegação administrativa">
                <button className={view === 'overview' ? 'is-active' : ''} type="button" onClick={() => setView('overview')}><LayoutDashboard size={17} /> Visão geral</button>
                <button className={view === 'settings' ? 'is-active' : ''} type="button" onClick={() => setView('settings')}><Settings size={17} /> Configurações</button>
                <button className={view === 'repositories' ? 'is-active' : ''} type="button" onClick={() => setView('repositories')}><FolderKanban size={17} /> Repositórios</button>
              </nav>
              <div className="admin-console__security"><ShieldCheck size={16} /><span><strong>Sessão local</strong><small>Dados neste dispositivo</small></span></div>
              <button className="admin-console__logout" type="button" onClick={() => setAuthenticated(false)}><LogOut size={16} /> Sair</button>
            </aside>

            <main className="admin-console__main">
              <header className="admin-console__topbar"><div><span>Painel administrativo</span><strong id="admin-title">{view === 'overview' ? 'Visão geral' : view === 'settings' ? 'Configurações' : 'Repositórios'}</strong></div><div><span className="admin-status-dot" /> Alterações locais</div></header>
              {error && view !== 'repositories' && <div className="form-error form-error--block admin-global-error">{error}</div>}
              {view === 'overview' && renderOverview()}
              {view === 'settings' && renderSettings()}
              {view === 'repositories' && renderRepositories()}
            </main>
          </div>
        )}
      </section>
    </div>
  )
}
