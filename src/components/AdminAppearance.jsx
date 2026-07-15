import { Check, Eye, Palette, RotateCcw, Shapes, X } from 'lucide-react'
import { useState } from 'react'
import { colorPalettes, defaultAppearance, designStyles, fontOptions, professionalPresets } from '../data/appearance'

function AppearancePreview({ preview, onClose }) {
  if (!preview) return null
  const palette = colorPalettes.find((item) => item.id === preview.appearance.paletteId) || colorPalettes[0]
  const font = fontOptions.find((item) => item.id === preview.appearance.fontId) || fontOptions[0]
  const style = { ...palette.vars, '--body-font': font.body, '--heading-font': font.heading }
  return <div className="admin-submodal" role="dialog" aria-modal="true" aria-label={`Prévia: ${preview.title}`} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <div className="admin-submodal__panel appearance-live-preview" style={style} data-preview-design={preview.appearance.designId}>
      <header><div><span>PRÉVIA DO SITE</span><h3>{preview.title}</h3></div><button type="button" onClick={onClose} aria-label="Fechar prévia"><X size={19} /></button></header>
      <main><small>BI · DADOS · SISTEMAS · IMPACTO</small><h2>Jever <strong>Dias</strong></h2><h4>BI Developer | Analytics | Sistemas Web</h4><p>Transformo dados em soluções claras para apoiar decisões e melhorar processos.</p><div><button type="button">Ver portfólio</button><button type="button">Falar comigo</button></div><section><article><b>+12</b><span>Dashboards</span></article><article><b>+5</b><span>Sistemas web</span></article><article><b>Projeto em destaque</b><span>Uma amostra real de card do site.</span></article></section></main>
    </div>
  </div>
}

function PreviewButton({ onClick }) { return <button className="appearance-preview-button" type="button" onClick={onClick}><Eye size={14} /> Visualizar</button> }

export function AdminAppearance({ siteStore }) {
  const appearance = { ...defaultAppearance, ...(siteStore.site.appearance || {}) }
  const [preview, setPreview] = useState(null)
  const update = (changes) => siteStore.updateSite({ appearance: { ...appearance, ...changes } })
  const show = (title, changes) => setPreview({ title, appearance: { ...appearance, ...changes } })

  return <div className="admin-appearance">
    <div className="admin-page__heading"><span>Aparência do site</span><h3>Temas, cores e estilos</h3><p>A estrutura, os textos e os projetos permanecem iguais. Apenas a identidade visual é alterada.</p></div>
    <div className="appearance-current"><div><Palette size={20} /><span><strong>Visual atual</strong><small>{colorPalettes.find((item) => item.id === appearance.paletteId)?.name} · {designStyles.find((item) => item.id === appearance.designId)?.name}</small></span></div><button type="button" onClick={() => siteStore.updateSite({ appearance: defaultAppearance })}><RotateCcw size={15} /> Restaurar tema JD</button></div>

    <section className="appearance-section"><div className="appearance-section__heading"><span>30 sugestões profissionais</span><h4>Escolha pelo setor</h4><p>Visualize primeiro ou aplique a combinação de paleta e estilo.</p></div><div className="appearance-presets">
      {professionalPresets.map((preset) => { const palette = colorPalettes.find((item) => item.id === preset.paletteId); const active = appearance.presetId === preset.id; return <article className={active ? 'is-active' : ''} key={preset.id}><button type="button" onClick={() => update({ presetId: preset.id, paletteId: preset.paletteId, designId: preset.designId })}><span className="appearance-swatches">{palette.swatches.map((color) => <i style={{ background: color }} key={color} />)}</span><span><strong>{preset.name}</strong><small>{palette.name} · {designStyles.find((item) => item.id === preset.designId)?.name}</small></span>{active && <Check size={16} />}</button><PreviewButton onClick={() => show(preset.name, { presetId: preset.id, paletteId: preset.paletteId, designId: preset.designId })} /></article> })}
    </div></section>

    <section className="appearance-section"><div className="appearance-section__heading"><span>Cor independente</span><h4>Paletas</h4><p>Troque somente as cores, mantendo o design.</p></div><div className="appearance-palettes">
      {colorPalettes.map((palette) => <article className={appearance.paletteId === palette.id ? 'is-active' : ''} key={palette.id}><button type="button" onClick={() => update({ presetId: 'custom', paletteId: palette.id })}><span className="appearance-palette-preview" style={{ background: palette.vars['--bg'] }}>{palette.swatches.map((color) => <i style={{ background: color }} key={color} />)}</span><strong>{palette.name}</strong><small>{palette.scheme === 'dark' ? 'Escura' : 'Clara'}</small></button><PreviewButton onClick={() => show(palette.name, { paletteId: palette.id })} /></article>)}
    </div></section>

    <section className="appearance-section"><div className="appearance-section__heading"><span>Modelo independente</span><h4>Estilos de design</h4><p>Troque acabamento, cantos e personalidade sem mudar o conteúdo.</p></div><div className="appearance-designs">
      {designStyles.map((design) => <article className={appearance.designId === design.id ? 'is-active' : ''} key={design.id}><button type="button" onClick={() => update({ presetId: 'custom', designId: design.id })}><Shapes size={18} /><span><strong>{design.name}</strong><small>{design.description}</small></span>{appearance.designId === design.id && <Check size={16} />}</button><PreviewButton onClick={() => show(design.name, { designId: design.id })} /></article>)}
    </div></section>

    <section className="appearance-section"><div className="appearance-section__heading"><span>Tipografia</span><h4>Fontes do site</h4><p>Troque a fonte sem alterar textos ou organização.</p></div><div className="appearance-fonts">
      {fontOptions.map((font) => <article className={appearance.fontId === font.id ? 'is-active' : ''} key={font.id}><button type="button" onClick={() => update({ presetId: 'custom', fontId: font.id })}><b style={{ fontFamily: font.heading }}>Aa</b><span><strong style={{ fontFamily: font.heading }}>{font.name}</strong><small>{font.description}</small></span>{appearance.fontId === font.id && <Check size={16} />}</button><PreviewButton onClick={() => show(font.name, { fontId: font.id })} /></article>)}
    </div></section>
    <AppearancePreview preview={preview} onClose={() => setPreview(null)} />
  </div>
}
