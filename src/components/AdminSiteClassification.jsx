import { Check, Eye, Layers3, X } from 'lucide-react'
import { useState } from 'react'
import { colorPalettes, fontOptions } from '../data/appearance'
import { defaultSiteClassification, siteClassifications } from '../data/siteClassifications'

function ClassificationPreview({ item, onClose }) {
  if (!item) return null
  const palette = colorPalettes.find((entry) => entry.id === item.appearance.paletteId) || colorPalettes[0]
  const font = fontOptions.find((entry) => entry.id === item.appearance.fontId) || fontOptions[0]
  return <div className="admin-submodal" role="dialog" aria-modal="true" aria-label={`Prévia: ${item.name}`} onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className="admin-submodal__panel classification-preview" style={{ ...palette.vars, '--body-font': font.body, '--heading-font': font.heading }}>
    <header><div><span>MODELO COMERCIAL</span><h3>{item.name}</h3></div><button type="button" onClick={onClose} aria-label="Fechar prévia"><X size={19} /></button></header>
    <main><small>{item.classification}</small><h2>{item.name}</h2><p>{item.goal}</p><div className="classification-preview__actions"><button type="button">Ação principal</button><button type="button">Saiba mais</button></div><section>{item.features.map((feature, index) => <article key={feature}><i>0{index + 1}</i><strong>{feature}</strong><span>Exemplo de conteúdo desta área.</span></article>)}</section><footer><strong>Público recomendado</strong><span>{item.audience}</span></footer></main>
  </div></div>
}

export function AdminSiteClassification({ siteStore }) {
  const currentId = siteStore.site.siteClassificationId || defaultSiteClassification
  const [group, setGroup] = useState('Todos')
  const [preview, setPreview] = useState(null)
  const groups = ['Todos', ...new Set(siteClassifications.map((item) => item.group))]
  const visible = group === 'Todos' ? siteClassifications : siteClassifications.filter((item) => item.group === group)
  const apply = (item) => siteStore.updateSite({ siteClassificationId: item.id, siteClassification: item.classification, siteClassificationDescription: item.goal, appearance: { ...(siteStore.site.appearance || {}), presetId: `classification-${item.id}`, ...item.appearance } })

  return <div className="admin-classification"><div className="admin-page__heading"><span>Classificação do site</span><h3>Transforme o modelo para diferentes clientes</h3><p>A classificação define o objetivo comercial e aplica um visual recomendado. Textos, projetos e dados existentes são preservados.</p></div>
    <div className="classification-current"><Layers3 size={20} /><span><strong>Classificação atual</strong><small>{siteClassifications.find((item) => item.id === currentId)?.name || siteStore.site.siteClassification}</small></span></div>
    <div className="classification-groups" role="group" aria-label="Filtrar classificações">{groups.map((name) => <button className={group === name ? 'is-active' : ''} type="button" key={name} onClick={() => setGroup(name)}>{name}</button>)}</div>
    <div className="classification-grid">{visible.map((item) => <article className={currentId === item.id ? 'is-active' : ''} key={item.id}><header><span>{item.group}</span>{currentId === item.id && <Check size={16} />}</header><h4>{item.name}</h4><small>{item.classification}</small><p>{item.goal}</p><div className="classification-tags">{item.features.map((feature) => <span key={feature}>{feature}</span>)}</div><footer><button type="button" onClick={() => setPreview(item)}><Eye size={14} /> Visualizar</button><button type="button" onClick={() => apply(item)}>Aplicar modelo</button></footer></article>)}</div>
    <aside className="classification-research"><strong>Referências para os modelos atuais</strong><p>Os formatos foram organizados a partir de categorias comerciais recorrentes em plataformas de criação e comércio digital.</p><div><a href="https://webflow.com/blog/types-of-websites" target="_blank" rel="noreferrer">Tipos populares no Webflow</a><a href="https://www.wix.com/blog/types-of-websites" target="_blank" rel="noreferrer">Tipos de sites no Wix</a><a href="https://www.shopify.com/blog/what-is-ecommerce" target="_blank" rel="noreferrer">Comércio eletrônico no Shopify</a></div></aside>
    <ClassificationPreview item={preview} onClose={() => setPreview(null)} />
  </div>
}
