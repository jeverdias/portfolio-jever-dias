import { BarChart3, Bot, Braces, Database, Eye, EyeOff, LineChart, Plus, Sparkles, Trash2, Workflow } from 'lucide-react'
import { useMemo, useState } from 'react'

const icons = {
  chart: { label: 'Gráfico', icon: BarChart3 },
  analytics: { label: 'Analytics', icon: LineChart },
  code: { label: 'Código', icon: Braces },
  database: { label: 'Dados', icon: Database },
  bot: { label: 'GPT/Robô', icon: Bot },
  workflow: { label: 'Fluxo/Agente', icon: Workflow },
  sparkles: { label: 'Destaque', icon: Sparkles },
}

export function AdminSpecialties({ siteStore }) {
  const items = useMemo(() => siteStore.site.specialties || [], [siteStore.site.specialties])
  const stickers = siteStore.site.stickerLibrary || []
  const [selectedId, setSelectedId] = useState(items[0]?.id || '')
  const selected = items.find((item) => item.id === selectedId) || items[0]
  const persist = (next) => siteStore.updateSite({ specialties: next.map((item, index) => ({ ...item, number: String(index + 1).padStart(2, '0') })) })
  const update = (changes) => selected && persist(items.map((item) => item.id === selected.id ? { ...item, ...changes } : item))

  const add = () => {
    const id = `especialidade-${Date.now()}`
    persist([...items, { id, icon: 'sparkles', title: 'Nova especialidade', text: 'Resumo curto da especialidade.', plain: 'Explique esta área em palavras simples.', example: 'Exemplo: mostre uma situação prática.', color: '#69c7ff', image: '', visible: true }])
    setSelectedId(id)
  }

  const remove = () => {
    if (!selected || !window.confirm(`Excluir a especialidade “${selected.title}”?`)) return
    const next = items.filter((item) => item.id !== selected.id)
    persist(next)
    setSelectedId(next[0]?.id || '')
  }

  return <div className="admin-specialties">
    <div className="admin-page__heading"><span>Conteúdo editável</span><h3>Especialidades</h3><p>Edite nome, textos, exemplo, ícone, figurinha e visibilidade dos cards públicos.</p></div>
    <div className="specialty-editor-layout">
      <aside className="specialty-editor-list"><button type="button" onClick={add}><Plus size={15} /> Nova especialidade</button><div>{items.map((item) => { const Icon = icons[item.icon]?.icon || Sparkles; return <button className={selected?.id === item.id ? 'is-active' : ''} type="button" key={item.id} onClick={() => setSelectedId(item.id)}>{item.image ? <img src={item.image} alt="" /> : <Icon size={19} style={{ color: item.color }} />}<span><strong>{item.title}</strong><small>{item.visible === false ? 'Oculta' : 'Visível'}</small></span></button> })}</div></aside>
      <section className="specialty-editor-form">{selected ? <>
        <div className="specialty-editor-form__head"><div><span>Card {selected.number}</span><h4>{selected.title}</h4></div><button type="button" onClick={remove}><Trash2 size={14} /> Excluir</button></div>
        <div className="admin-form">
          <label className="field">Nome<input value={selected.title} onChange={(event) => update({ title: event.target.value })} /></label>
          <label className="field">Ícone<select value={selected.icon || 'sparkles'} onChange={(event) => update({ icon: event.target.value, image: '' })}>{Object.entries(icons).map(([value, option]) => <option value={value} key={value}>{option.label}</option>)}</select></label>
          <label className="field field--wide">Resumo do card<textarea rows="2" value={selected.text || ''} onChange={(event) => update({ text: event.target.value })} /></label>
          <label className="field field--wide">Explicação para leigos<textarea rows="3" value={selected.plain || ''} onChange={(event) => update({ plain: event.target.value })} /></label>
          <label className="field field--wide">Exemplo prático<textarea rows="2" value={selected.example || ''} onChange={(event) => update({ example: event.target.value })} /></label>
          <label className="field">Cor<input type="color" value={selected.color || '#69c7ff'} onChange={(event) => update({ color: event.target.value })} /></label>
          <button className={`specialty-visibility-toggle ${selected.visible === false ? 'is-hidden' : ''}`} type="button" onClick={() => update({ visible: selected.visible === false })}>{selected.visible === false ? <><EyeOff size={16} /> Oculta — clique para mostrar</> : <><Eye size={16} /> Visível — clique para ocultar</>}</button>
        </div>
        <div className="specialty-stickers"><strong>Usar figurinha da coleção</strong><div><button className={!selected.image ? 'is-active' : ''} type="button" onClick={() => update({ image: '' })}><Sparkles size={20} /><span>Ícone</span></button>{stickers.map((sticker) => <button className={selected.image === sticker.image ? 'is-active' : ''} type="button" key={sticker.id} onClick={() => update({ image: sticker.image })}><img src={sticker.image} alt="" /><span>{sticker.name}</span></button>)}</div>{!stickers.length && <p>Envie figurinhas primeiro em “Box/figurinhas”.</p>}</div>
      </> : <div className="admin-empty"><p>Nenhuma especialidade cadastrada.</p><button className="button button--primary" type="button" onClick={add}><Plus size={16} /> Criar especialidade</button></div>}</section>
    </div>
  </div>
}
