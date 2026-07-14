import { ArrowDown, ArrowUp, Download, ImagePlus, LogOut, Plus, RotateCcw, Save, Trash2, Upload, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { projectTypes } from '../data/projects'

const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || 'jd2026'

export function AdminPanel({ open, onClose, store }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState(store.projects[0]?.id || '')
  const importRef = useRef(null)
  const imageRef = useRef(null)

  const selected = useMemo(
    () => store.projects.find((project) => project.id === selectedId) || store.projects[0],
    [selectedId, store.projects],
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

  const update = (field, value) => selected && store.updateProject(selected.id, { [field]: value })

  const add = () => {
    const id = store.addProject()
    setSelectedId(id)
  }

  const remove = () => {
    if (!selected || !window.confirm(`Excluir o projeto “${selected.title}”?`)) return
    const index = store.projects.findIndex((project) => project.id === selected.id)
    const fallback = store.projects[index - 1]?.id || store.projects[index + 1]?.id || ''
    store.removeProject(selected.id)
    setSelectedId(fallback)
  }

  const exportData = () => {
    const blob = new Blob([JSON.stringify(store.projects, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `portfolio-jever-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const importData = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      store.importProjects(await file.text())
      setSelectedId('')
      setError('')
    } catch (importError) {
      setError(importError.message)
    } finally {
      event.target.value = ''
    }
  }

  const uploadImage = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 1_500_000) {
      setError('Use uma imagem com até 1,5 MB para não ultrapassar o limite do navegador.')
      event.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = () => update('image', reader.result)
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  return (
    <div className="admin-backdrop">
      <section className="admin-panel" role="dialog" aria-modal="true" aria-labelledby="admin-title">
        <button className="modal-close" type="button" onClick={onClose} aria-label="Fechar administração"><X size={21} /></button>

        {!authenticated ? (
          <div className="admin-login">
            <div className="admin-login__mark">JD</div>
            <span>Área administrativa local</span>
            <h2 id="admin-title">Editar portfólio</h2>
            <p>Informe o PIN para gerenciar os projetos salvos neste navegador.</p>
            <form onSubmit={login}>
              <label htmlFor="admin-pin">PIN de acesso</label>
              <input id="admin-pin" type="password" value={pin} onChange={(event) => setPin(event.target.value)} autoFocus />
              {error && <div className="form-error">{error}</div>}
              <button className="button button--primary" type="submit">Entrar</button>
            </form>
            <small>Primeiro acesso: use <strong>jd2026</strong> e altere em <code>.env</code>.</small>
          </div>
        ) : (
          <div className="admin-workspace">
            <aside className="admin-sidebar">
              <div className="admin-sidebar__head">
                <div><span>Modo administrador</span><h2 id="admin-title">Projetos</h2></div>
                <button type="button" onClick={() => setAuthenticated(false)} aria-label="Sair"><LogOut size={18} /></button>
              </div>
              <button className="admin-add" type="button" onClick={add}><Plus size={17} /> Novo projeto</button>
              <div className="admin-projects">
                {store.projects.map((project, index) => (
                  <button className={selected?.id === project.id ? 'is-active' : ''} type="button" key={project.id} onClick={() => setSelectedId(project.id)}>
                    <i style={{ background: project.accent }} />
                    <span><strong>{project.title}</strong><small>{projectTypes[project.type]}</small></span>
                    <em>{String(index + 1).padStart(2, '0')}</em>
                  </button>
                ))}
              </div>
              <div className="admin-sidebar__actions">
                <button type="button" onClick={exportData}><Download size={15} /> Exportar JSON</button>
                <button type="button" onClick={() => importRef.current?.click()}><Upload size={15} /> Importar JSON</button>
                <input ref={importRef} type="file" accept="application/json" onChange={importData} hidden />
              </div>
            </aside>

            <main className="admin-editor">
              {selected ? (
                <>
                  <div className="admin-editor__head">
                    <div><span><Save size={14} /> Salvo automaticamente neste navegador</span><h3>{selected.title}</h3></div>
                    <div>
                      <button type="button" onClick={() => store.moveProject(selected.id, -1)} aria-label="Mover projeto para cima"><ArrowUp size={17} /></button>
                      <button type="button" onClick={() => store.moveProject(selected.id, 1)} aria-label="Mover projeto para baixo"><ArrowDown size={17} /></button>
                      <button className="danger" type="button" onClick={remove} aria-label="Excluir projeto"><Trash2 size={17} /></button>
                    </div>
                  </div>

                  {error && <div className="form-error form-error--block">{error}</div>}
                  <div className="admin-form">
                    <label className="field field--wide">Título<input value={selected.title} onChange={(event) => update('title', event.target.value)} /></label>
                    <label className="field">Tipo
                      <select value={selected.type} onChange={(event) => update('type', event.target.value)}>
                        {Object.entries(projectTypes).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
                      </select>
                    </label>
                    <label className="field">Categoria<input value={selected.category} onChange={(event) => update('category', event.target.value)} /></label>
                    <label className="field field--wide">Descrição curta<textarea rows="3" value={selected.description} onChange={(event) => update('description', event.target.value)} /></label>
                    <label className="field field--wide">Detalhes do projeto<textarea rows="4" value={selected.details || ''} onChange={(event) => update('details', event.target.value)} /></label>
                    <label className="field field--wide">Tecnologias <small>Separe com vírgulas</small><input value={selected.tags.join(', ')} onChange={(event) => update('tags', event.target.value.split(',').map((tag) => tag.trim()).filter(Boolean))} /></label>
                    {selected.type === 'powerbi' ? (
                      <label className="field field--wide">Link incorporado do Power BI <small>O endereço não será exibido ao visitante</small><input type="url" placeholder="https://app.powerbi.com/view?..." value={selected.embedUrl || ''} onChange={(event) => update('embedUrl', event.target.value)} /></label>
                    ) : (
                      <label className="field field--wide">Link do projeto <small>Será usado na visualização e no botão externo</small><input type="url" placeholder="https://seusite.netlify.app" value={selected.externalUrl || ''} onChange={(event) => update('externalUrl', event.target.value)} /></label>
                    )}
                    <label className="field field--wide">URL da imagem de capa <input type="url" placeholder="https://.../imagem.jpg" value={selected.image?.startsWith('data:') ? '' : selected.image || ''} onChange={(event) => update('image', event.target.value)} /></label>
                    <div className="field field--wide image-upload">
                      <span>Ou envie uma imagem do computador</span>
                      <button type="button" onClick={() => imageRef.current?.click()}><ImagePlus size={17} /> Selecionar imagem</button>
                      {selected.image && <button type="button" onClick={() => update('image', '')}>Remover capa</button>}
                      <input ref={imageRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadImage} hidden />
                    </div>
                    <label className="field">Cor de destaque<input type="color" value={selected.accent || '#6f7cff'} onChange={(event) => update('accent', event.target.value)} /></label>
                    <label className="field checkbox-field"><input type="checkbox" checked={selected.featured} onChange={(event) => update('featured', event.target.checked)} /> Projeto em destaque</label>
                  </div>
                  <div className="admin-note">Para publicar estas alterações para todos os visitantes, exporte o JSON e siga o guia do README. Sem backend, as edições ficam apenas neste navegador.</div>
                </>
              ) : (
                <div className="admin-empty"><p>Nenhum projeto cadastrado.</p><button className="button button--primary" type="button" onClick={add}><Plus size={17} /> Criar projeto</button></div>
              )}
              <button className="admin-reset" type="button" onClick={() => window.confirm('Restaurar os projetos de exemplo?') && store.resetProjects()}><RotateCcw size={14} /> Restaurar exemplos</button>
            </main>
          </div>
        )}
      </section>
    </div>
  )
}
