import {
  BarChart3,
  Bot,
  BrainCircuit,
  Braces,
  DatabaseZap,
  ImagePlus,
  LayoutDashboard,
  Plus,
  Search,
  Sigma,
  Sparkles,
  Trash2,
  Upload,
  Workflow,
} from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { optimizeImage } from '../utils/optimizeImage'

const techIconOptions = {
  chart: { label: 'Gráfico', icon: BarChart3, keywords: 'bi painel gráfico dashboard' },
  dashboard: { label: 'Dashboard', icon: LayoutDashboard, keywords: 'bi painel indicadores' },
  sigma: { label: 'Cálculo', icon: Sigma, keywords: 'dax fórmula cálculo matemática' },
  code: { label: 'Código', icon: Braces, keywords: 'web javascript programação sistema' },
  database: { label: 'Banco de dados', icon: DatabaseZap, keywords: 'dados supabase armazenamento' },
  bot: { label: 'Robô', icon: Bot, keywords: 'gpt chat ia assistente' },
  brain: { label: 'Inteligência artificial', icon: BrainCircuit, keywords: 'ia inteligência automação' },
  workflow: { label: 'Fluxo', icon: Workflow, keywords: 'agente processo automação etapas' },
  sparkles: { label: 'Destaque', icon: Sparkles, keywords: 'novo especial inovação' },
}

const fileToDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(reader.result)
  reader.onerror = () => reject(new Error('Não foi possível carregar a figurinha.'))
  reader.readAsDataURL(file)
})

export function AdminTechLibrary({ siteStore }) {
  const [search, setSearch] = useState('')
  const [iconSearch, setIconSearch] = useState('')
  const [selectedId, setSelectedId] = useState(siteStore.site.techItems?.[0]?.id || '')
  const [message, setMessage] = useState('')
  const uploadRef = useRef(null)
  const items = useMemo(() => siteStore.site.techItems || [], [siteStore.site.techItems])
  const stickers = useMemo(() => siteStore.site.stickerLibrary || [], [siteStore.site.stickerLibrary])
  const selected = items.find((item) => item.id === selectedId) || items[0]

  const filteredItems = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('pt-BR')
    return query ? items.filter((item) => `${item.name} ${item.category} ${item.description}`.toLocaleLowerCase('pt-BR').includes(query)) : items
  }, [items, search])

  const filteredIcons = useMemo(() => {
    const query = iconSearch.trim().toLocaleLowerCase('pt-BR')
    return Object.entries(techIconOptions).filter(([, option]) => !query || `${option.label} ${option.keywords}`.toLocaleLowerCase('pt-BR').includes(query))
  }, [iconSearch])

  const persist = (next) => siteStore.updateSite({ techItems: next })
  const update = (changes) => selected && persist(items.map((item) => item.id === selected.id ? { ...item, ...changes } : item))

  const add = () => {
    const id = `tecnologia-${Date.now()}`
    persist([...items, { id, name: 'Nova tecnologia', icon: 'sparkles', color: '#7fcaff', category: 'Outros', description: 'Explique de forma simples para que esta tecnologia serve.', image: '' }])
    setSelectedId(id)
  }

  const remove = () => {
    if (!selected || !window.confirm(`Excluir “${selected.name}” deste box?`)) return
    const next = items.filter((item) => item.id !== selected.id)
    persist(next)
    setSelectedId(next[0]?.id || '')
  }

  const upload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const optimized = await optimizeImage(file, { maxWidth: 320, maxHeight: 320, quality: 0.84 })
      if (optimized.size > 250_000) throw new Error('Use uma figurinha com até 250 KB depois da otimização.')
      const image = siteStore.mode === 'supabase'
        ? await siteStore.uploadAsset(optimized, 'figurinhas')
        : await fileToDataUrl(optimized)
      const sticker = {
        id: `figurinha-${Date.now()}`,
        name: file.name.replace(/\.[^.]+$/, '') || 'Nova figurinha',
        image,
      }
      siteStore.updateSite({
        stickerLibrary: [...stickers, sticker],
        techItems: items.map((item) => item.id === selected.id ? { ...item, image, stickerId: sticker.id } : item),
      })
      setMessage(`Figurinha otimizada: ${Math.round(optimized.size / 1024)} KB.`)
    } catch (error) {
      setMessage(error.message)
    } finally {
      event.target.value = ''
    }
  }

  const applySticker = (sticker) => update({ image: sticker.image, stickerId: sticker.id })

  const removeSticker = async (sticker) => {
    if (!window.confirm(`Excluir a figurinha “${sticker.name}” da coleção?`)) return
    const usedOutsideTech = [...(siteStore.site.metrics || []), ...(siteStore.site.specialties || [])]
      .some((item) => item.image === sticker.image)
    siteStore.updateSite({
      stickerLibrary: stickers.filter((item) => item.id !== sticker.id),
      techItems: items.map((item) => item.stickerId === sticker.id || item.image === sticker.image ? { ...item, image: '', stickerId: '' } : item),
    })
    if (!usedOutsideTech && siteStore.mode === 'supabase') {
      try {
        await siteStore.removeAsset(sticker.image)
      } catch {
        setMessage('Figurinha removida da coleção, mas o arquivo não pôde ser limpo do Storage.')
        return
      }
    }
    setMessage(usedOutsideTech
      ? 'Figurinha removida da coleção; o arquivo foi preservado porque ainda está em uso.'
      : 'Figurinha excluída da coleção, dos boxes e do Storage.')
  }

  return (
    <div className="admin-tech-library">
      <div className="admin-page__heading">
        <span>Biblioteca visual</span>
        <h3>Box/figurinhas</h3>
        <p>Edite os boxes da página inicial. Figurinhas enviadas ficam salvas na coleção para serem reutilizadas ou excluídas.</p>
      </div>

      <div className="tech-library-layout">
        <aside className="tech-library-list">
          <label className="tech-search"><Search size={15} /><input type="search" placeholder="Buscar por nome ou área" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
          <button className="tech-library-add" type="button" onClick={add}><Plus size={16} /> Adicionar item</button>
          <div>
            {filteredItems.map((item) => {
              const Icon = techIconOptions[item.icon]?.icon || Sparkles
              return <button className={selected?.id === item.id ? 'is-active' : ''} type="button" key={item.id} onClick={() => setSelectedId(item.id)}>
                {item.image ? <img src={item.image} alt="" /> : <Icon size={20} style={{ color: item.color }} />}
                <span><strong>{item.name}</strong><small>{item.category || 'Sem categoria'}</small></span>
              </button>
            })}
          </div>
        </aside>

        <section className="tech-library-editor">
          {selected ? <>
            <div className="tech-library-editor__head">
              <div><span>Prévia no site</span><strong>{selected.name}</strong></div>
              <button className="danger" type="button" onClick={remove}><Trash2 size={16} /> Excluir</button>
            </div>
            <div className="admin-form">
              <label className="field">Nome<input value={selected.name} onChange={(event) => update({ name: event.target.value })} /></label>
              <label className="field">Área / categoria<input placeholder="BI, Web, IA, Dados..." value={selected.category || ''} onChange={(event) => update({ category: event.target.value })} /></label>
              <label className="field field--wide">Explicação para leigos<textarea rows="3" value={selected.description || ''} onChange={(event) => update({ description: event.target.value })} /></label>
              <label className="field">Cor do ícone<input type="color" value={selected.color || '#7fcaff'} onChange={(event) => update({ color: event.target.value })} /></label>
              <div className="field"><span>Figurinha personalizada</span><button className="tech-upload-button" type="button" onClick={() => uploadRef.current?.click()}><Upload size={15} /> Enviar imagem</button><input ref={uploadRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={upload} hidden /></div>
              {selected.image && <div className="field field--wide custom-icon-preview"><img src={selected.image} alt={`Figurinha de ${selected.name}`} /><button type="button" onClick={() => update({ image: '', stickerId: '' })}>Remover deste box</button></div>}
            </div>

            <div className="icon-picker">
              <div className="icon-picker__head"><div><strong>Coleção de ícones</strong><span>Busque pelo nome ou finalidade.</span></div><label><Search size={14} /><input type="search" placeholder="Ex.: dados, IA, dashboard" value={iconSearch} onChange={(event) => setIconSearch(event.target.value)} /></label></div>
              <div className="icon-picker__grid">
                {filteredIcons.map(([value, option]) => {
                  const Icon = option.icon
                  return <button className={!selected.image && selected.icon === value ? 'is-active' : ''} type="button" key={value} onClick={() => update({ icon: value, image: '', stickerId: '' })}><Icon size={23} /><span>{option.label}</span></button>
                })}
              </div>
            </div>

            <div className="sticker-collection">
              <div className="sticker-collection__head"><div><strong>Minhas figurinhas</strong><span>{stickers.length} salva{stickers.length === 1 ? '' : 's'} na coleção</span></div><button type="button" onClick={() => uploadRef.current?.click()}><Plus size={15} /> Nova figurinha</button></div>
              {stickers.length ? <div className="sticker-collection__grid">{stickers.map((sticker) => <article key={sticker.id}>
                <button className="sticker-collection__use" type="button" onClick={() => applySticker(sticker)} aria-label={`Usar ${sticker.name}`}><img src={sticker.image} alt="" /><span>{sticker.name}</span></button>
                <button className="sticker-collection__remove" type="button" onClick={() => removeSticker(sticker)} aria-label={`Excluir ${sticker.name}`}><Trash2 size={13} /></button>
              </article>)}</div> : <p className="sticker-collection__empty">Nenhuma figurinha personalizada foi enviada. Use “Enviar imagem” para criar a primeira.</p>}
            </div>

            <div className="icon-source-note"><ImagePlus size={17} /><div><strong>Onde encontrar figurinhas</strong><p>Use imagens com fundo transparente em <a href="https://lucide.dev/icons/" target="_blank" rel="noreferrer">Lucide</a>, <a href="https://www.svgrepo.com/" target="_blank" rel="noreferrer">SVG Repo</a> ou <a href="https://icons8.com/icons" target="_blank" rel="noreferrer">Icons8</a>. Confira a licença antes de publicar.</p></div></div>
            {message && <p className="tech-library-message" role="status">{message}</p>}
          </> : <div className="admin-empty"><p>Nenhum item cadastrado.</p><button className="button button--primary" type="button" onClick={add}><Plus size={17} /> Criar primeiro item</button></div>}
        </section>
      </div>
    </div>
  )
}
