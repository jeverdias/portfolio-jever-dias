import { Check, Palette, RotateCcw, Shapes } from 'lucide-react'
import { colorPalettes, defaultAppearance, designStyles, fontOptions, professionalPresets } from '../data/appearance'

export function AdminAppearance({ siteStore }) {
  const appearance = { ...defaultAppearance, ...(siteStore.site.appearance || {}) }
  const update = (changes) => siteStore.updateSite({ appearance: { ...appearance, ...changes } })

  const choosePreset = (preset) => update({ presetId: preset.id, paletteId: preset.paletteId, designId: preset.designId })
  const choosePalette = (paletteId) => update({ presetId: 'custom', paletteId })
  const chooseDesign = (designId) => update({ presetId: 'custom', designId })
  const chooseFont = (fontId) => update({ presetId: 'custom', fontId })

  return <div className="admin-appearance">
    <div className="admin-page__heading"><span>Aparência do site</span><h3>Temas, cores e estilos</h3><p>A estrutura, os textos e os projetos permanecem iguais. Apenas a identidade visual é alterada.</p></div>

    <div className="appearance-current">
      <div><Palette size={20} /><span><strong>Visual atual</strong><small>{colorPalettes.find((item) => item.id === appearance.paletteId)?.name} · {designStyles.find((item) => item.id === appearance.designId)?.name}</small></span></div>
      <button type="button" onClick={() => siteStore.updateSite({ appearance: defaultAppearance })}><RotateCcw size={15} /> Restaurar tema JD</button>
    </div>

    <section className="appearance-section">
      <div className="appearance-section__heading"><span>30 sugestões profissionais</span><h4>Escolha pelo setor</h4><p>Cada opção combina uma paleta e um estilo adequados à área. Depois, você ainda pode personalizar separadamente.</p></div>
      <div className="appearance-presets">
        {professionalPresets.map((preset) => {
          const palette = colorPalettes.find((item) => item.id === preset.paletteId)
          const active = appearance.presetId === preset.id
          return <button className={active ? 'is-active' : ''} type="button" key={preset.id} onClick={() => choosePreset(preset)}>
            <span className="appearance-swatches">{palette.swatches.map((color) => <i style={{ background: color }} key={color} />)}</span>
            <span><strong>{preset.name}</strong><small>{palette.name} · {designStyles.find((item) => item.id === preset.designId)?.name}</small></span>
            {active && <Check size={16} />}
          </button>
        })}
      </div>
    </section>

    <section className="appearance-section">
      <div className="appearance-section__heading"><span>Cor independente</span><h4>Paletas</h4><p>Troque somente as cores, mantendo o modelo de design selecionado.</p></div>
      <div className="appearance-palettes">
        {colorPalettes.map((palette) => <button className={appearance.paletteId === palette.id ? 'is-active' : ''} type="button" key={palette.id} onClick={() => choosePalette(palette.id)}><span className="appearance-palette-preview" style={{ background: palette.vars['--bg'] }}>{palette.swatches.map((color) => <i style={{ background: color }} key={color} />)}</span><strong>{palette.name}</strong><small>{palette.scheme === 'dark' ? 'Escura' : 'Clara'}</small></button>)}
      </div>
    </section>

    <section className="appearance-section">
      <div className="appearance-section__heading"><span>Modelo independente</span><h4>Estilos de design</h4><p>Troque acabamento, cantos, densidade e personalidade sem mudar o conteúdo.</p></div>
      <div className="appearance-designs">
        {designStyles.map((design) => <button className={appearance.designId === design.id ? 'is-active' : ''} type="button" key={design.id} onClick={() => chooseDesign(design.id)}><Shapes size={18} /><span><strong>{design.name}</strong><small>{design.description}</small></span>{appearance.designId === design.id && <Check size={16} />}</button>)}
      </div>
    </section>

    <section className="appearance-section">
      <div className="appearance-section__heading"><span>Tipografia</span><h4>Fontes do site</h4><p>Troque a fonte sem alterar textos, tamanhos ou organização das seções.</p></div>
      <div className="appearance-fonts">
        {fontOptions.map((font) => <button className={appearance.fontId === font.id ? 'is-active' : ''} type="button" key={font.id} onClick={() => chooseFont(font.id)}><b style={{ fontFamily: font.heading }}>Aa</b><span><strong style={{ fontFamily: font.heading }}>{font.name}</strong><small>{font.description}</small></span>{appearance.fontId === font.id && <Check size={16} />}</button>)}
      </div>
    </section>
  </div>
}
