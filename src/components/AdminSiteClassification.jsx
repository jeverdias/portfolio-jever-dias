import { Check, Eye, Layers3, RotateCcw, X } from 'lucide-react'
import { useState } from 'react'
import { colorPalettes, defaultAppearance, fontOptions } from '../data/appearance'
import { defaultSiteClassification, siteClassifications } from '../data/siteClassifications'

function ClassificationPreview({ item, appearance, onClose }) {
  if (!item) return null
  const palette = colorPalettes.find((entry) => entry.id === appearance?.paletteId) || colorPalettes[0]
  const font = fontOptions.find((entry) => entry.id === appearance?.fontId) || fontOptions[0]
  return <div className="admin-submodal" role="dialog" aria-modal="true" aria-label={`Prévia: ${item.name}`} onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className="admin-submodal__panel classification-preview" data-classification-preview={item.id} style={{ ...palette.vars, '--body-font': font.body, '--heading-font': font.heading }}>
    <header><div><span>ESTRUTURA DO SITE · CORES PRESERVADAS</span><h3>{item.name}</h3></div><button type="button" onClick={onClose} aria-label="Fechar prévia"><X size={19} /></button></header>
    <main><small>{item.classification}</small><h2>{item.name}</h2><p>{item.goal}</p><div className="classification-preview__actions"><button type="button">Ação principal</button><button type="button">Saiba mais</button></div><section>{item.features.map((feature, index) => <article key={feature}><i>0{index + 1}</i><strong>{feature}</strong><span>Exemplo desta seção.</span></article>)}</section><footer><strong>Estrutura aplicada</strong><span>{item.layout}</span></footer></main>
  </div></div>
}

export function AdminSiteClassification({ siteStore }) {
  const currentId = siteStore.site.siteClassificationId || defaultSiteClassification
  const [group, setGroup] = useState('Todos')
  const [preview, setPreview] = useState(null)
  const groups = ['Todos', ...new Set(siteClassifications.map((item) => item.group))]
  const visible = group === 'Todos' ? siteClassifications : siteClassifications.filter((item) => item.group === group)
  const apply = (item) => siteStore.updateSite({ siteClassificationId: item.id, siteClassification: item.classification, siteClassificationDescription: item.goal })
  const restorePortfolio = () => { const item = siteClassifications.find((entry) => entry.id === defaultSiteClassification); apply(item) }

  return <div className="admin-classification"><div className="admin-page__heading"><span>Classificação do site</span><h3>Escolha uma estrutura simples</h3><p>A classificação muda organização, textos, métricas e prioridade das seções. Cores, fontes e estilo continuam sendo controlados somente em Aparência.</p></div>
    <div className="classification-current"><Layers3 size={20} /><span><strong>Classificação atual</strong><small>{siteClassifications.find((item) => item.id === currentId)?.name || siteStore.site.siteClassification}</small></span><button type="button" onClick={restorePortfolio}><RotateCcw size={14} /> Restaurar portfólio</button></div>
    <div className="classification-groups" role="group" aria-label="Filtrar classificações">{groups.map((name) => <button className={group === name ? 'is-active' : ''} type="button" key={name} onClick={() => setGroup(name)}>{name}</button>)}</div>
    <div className="classification-grid">{visible.map((item) => <article className={currentId === item.id ? 'is-active' : ''} key={item.id}><header><span>{item.group}</span>{currentId === item.id && <Check size={16} />}</header><h4>{item.name}</h4><small>{item.classification}</small><p>{item.goal}</p><div className="classification-layout-note"><strong>O que muda</strong><span>{item.layout}</span></div><div className="classification-tags">{item.features.map((feature) => <span key={feature}>{feature}</span>)}</div><footer><button type="button" onClick={() => setPreview(item)}><Eye size={14} /> Visualizar</button><button type="button" onClick={() => apply(item)}>Aplicar estrutura</button></footer></article>)}</div>
    {currentId === 'landing-conversion' && <section className="landing-admin-fields"><div className="appearance-section__heading"><span>Conteúdo da landing page</span><h4>Oferta e conversão</h4><p>Estes campos aparecem somente quando a estrutura Landing Page estiver ativa.</p></div><div className="admin-form"><label className="field">Etiqueta da oferta<input value={siteStore.site.landingLabel || ''} onChange={(event) => siteStore.updateSite({ landingLabel: event.target.value })} /></label><label className="field">Texto do botão<input value={siteStore.site.landingCta || ''} onChange={(event) => siteStore.updateSite({ landingCta: event.target.value })} /></label><label className="field field--wide">Título principal<input value={siteStore.site.landingHeadline || ''} onChange={(event) => siteStore.updateSite({ landingHeadline: event.target.value })} /></label><label className="field field--wide">Explicação da oferta<textarea rows="3" value={siteStore.site.landingText || ''} onChange={(event) => siteStore.updateSite({ landingText: event.target.value })} /></label><label className="field field--wide">Benefícios <small>Um por linha: Título | explicação</small><textarea rows="5" value={siteStore.site.landingBenefitsText || ''} onChange={(event) => siteStore.updateSite({ landingBenefitsText: event.target.value })} /></label></div></section>}
    <aside className="classification-research"><strong>Referências usadas</strong><p>Os modelos básicos seguem estruturas recorrentes para sites empresariais, portfólios, landing pages, blogs, catálogos e eventos.</p><div><a href="https://webflow.com/blog/types-of-websites" target="_blank" rel="noreferrer">Webflow: tipos populares</a><a href="https://www.wix.com/blog/types-of-websites" target="_blank" rel="noreferrer">Wix: tipos de sites</a><a href="https://www.wix.com/blog/website-vs-landing-page" target="_blank" rel="noreferrer">Wix: site x landing page</a></div></aside>
    <ClassificationPreview item={preview} appearance={{ ...defaultAppearance, ...(siteStore.site.appearance || {}) }} onClose={() => setPreview(null)} />
  </div>
}
