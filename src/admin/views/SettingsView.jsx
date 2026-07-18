import { Eye, EyeOff, RotateCcw, Sparkles, Upload } from 'lucide-react'
import { useRef, useState } from 'react'

const publicSections = [
  ['hero', 'Apresentação inicial'], ['specialties', 'Especialidades'], ['projects', 'Portfólio'], ['about', 'Sobre'],
  ['credibility', 'Trajetória e credibilidade'], ['resume', 'Currículo'], ['contact', 'Contato'], ['footer', 'Rodapé'],
]

export function SettingsView({ siteStore }) {
  const [error, setError] = useState('')
  const resumeRef = useRef(null)

  const uploadResume = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (siteStore.mode !== 'supabase') {
      setError('O envio do PDF será liberado quando o Supabase Storage estiver conectado. Por enquanto, informe uma URL pública.')
      event.target.value = ''
      return
    }
    if (file.type !== 'application/pdf' || file.size > 10_000_000) {
      setError('Envie um arquivo PDF com até 10 MB.')
      event.target.value = ''
      return
    }
    try {
      await siteStore.uploadResume(file)
      setError('')
    } catch (uploadError) {
      setError(uploadError.message)
    } finally {
      event.target.value = ''
    }
  }

  return (
    <div className="admin-page">
      {error && <div className="form-error form-error--block admin-global-error">{error}</div>}
      <div className="admin-page__heading"><span>Configurações</span><h3>Detalhes do site</h3><p>As mudanças abaixo aparecem imediatamente no portfólio deste navegador.</p></div>
      <div className="admin-form admin-form--settings">
        <label className="field">Nome profissional<input value={siteStore.site.name} onChange={(event) => siteStore.updateSite({ name: event.target.value })} /></label>
        <label className="field">Cargo / especialidades<input value={siteStore.site.role} onChange={(event) => siteStore.updateSite({ role: event.target.value })} /></label>
        <label className="field field--wide">Selo acima do nome<input value={siteStore.site.eyebrow} onChange={(event) => siteStore.updateSite({ eyebrow: event.target.value })} /></label>
        <label className="field field--wide">Texto de apresentação<textarea rows="4" value={siteStore.site.intro} onChange={(event) => siteStore.updateSite({ intro: event.target.value })} /></label>
        <label className="field">Email<input type="email" value={siteStore.site.email} onChange={(event) => siteStore.updateSite({ email: event.target.value })} /></label>
        <label className="field">Email alternativo<input type="email" placeholder="Opcional" value={siteStore.site.emailSecondary || ''} onChange={(event) => siteStore.updateSite({ emailSecondary: event.target.value })} /></label>
        <label className="field">Localização<input value={siteStore.site.location} onChange={(event) => siteStore.updateSite({ location: event.target.value })} /></label>
        <div className="admin-settings-section-title field--wide"><span>Visibilidade das áreas públicas</span><span className="admin-settings-info"><button type="button" aria-label="Como funciona a visibilidade">!</button><span role="tooltip">Ocultar uma área remove a seção da página e também retira seu link do menu quando houver.</span></span></div>
        <div className="field field--wide section-visibility-grid">{publicSections.map(([key, label]) => { const visible = siteStore.site.sectionVisibility?.[key] !== false; return <button className={visible ? 'is-visible' : 'is-hidden'} type="button" key={key} onClick={() => siteStore.updateSite({ sectionVisibility: { ...siteStore.site.sectionVisibility, [key]: !visible } })}>{visible ? <Eye size={15} /> : <EyeOff size={15} />}<span><strong>{label}</strong><small>{visible ? 'Visível no site' : 'Oculta no site'}</small></span></button> })}</div>
        <div className="admin-settings-section-title field--wide"><span>Redes sociais</span><span className="admin-settings-info"><button type="button" aria-label="Como as redes sociais aparecem no site" aria-describedby="social-fields-help">!</button><span id="social-fields-help" role="tooltip">As redes só aparecem no modal de contato e no rodapé quando o campo estiver preenchido corretamente.</span></span></div>
        <label className="field">LinkedIn<input type="url" value={siteStore.site.linkedin} onChange={(event) => siteStore.updateSite({ linkedin: event.target.value })} /></label>
        <label className="field">GitHub<input type="url" value={siteStore.site.github} onChange={(event) => siteStore.updateSite({ github: event.target.value })} /></label>
        <label className="field">Instagram<input type="url" placeholder="https://www.instagram.com/seuusuario/" value={siteStore.site.instagram} onChange={(event) => siteStore.updateSite({ instagram: event.target.value })} /></label>
        <label className="field">X (antigo Twitter)<input type="url" placeholder="https://x.com/seuusuario" value={siteStore.site.x || ''} onChange={(event) => siteStore.updateSite({ x: event.target.value })} /></label>
        <label className="field">Facebook<input type="url" placeholder="https://www.facebook.com/seuusuario" value={siteStore.site.facebook || ''} onChange={(event) => siteStore.updateSite({ facebook: event.target.value })} /></label>
        <label className="field">WhatsApp<small>Informe o número com DDI e DDD ou cole o link do WhatsApp</small><input placeholder="55 99 99999-9999" value={siteStore.site.whatsapp || ''} onChange={(event) => siteStore.updateSite({ whatsapp: event.target.value })} /></label>
        <label className="field field--wide">Currículo Lattes<input type="url" placeholder="http://lattes.cnpq.br/0000000000000000" value={siteStore.site.lattes || ''} onChange={(event) => siteStore.updateSite({ lattes: event.target.value })} /></label>
        <div className="admin-settings-section-title field--wide"><span>Currículo profissional</span></div>
        <label className="field field--wide">Resumo do currículo<textarea rows="3" value={siteStore.site.resumeSummary || ''} onChange={(event) => siteStore.updateSite({ resumeSummary: event.target.value })} /></label>
        <label className="field field--wide">URL pública do currículo em PDF<input type="url" placeholder="https://.../curriculo-jever-dias.pdf" value={siteStore.site.resumeUrl || ''} onChange={(event) => siteStore.updateSite({ resumeUrl: event.target.value })} /></label>
        <div className="field field--wide image-upload"><span>Ou envie o PDF pelo Supabase Storage</span><button type="button" onClick={() => resumeRef.current?.click()} disabled={siteStore.mode !== 'supabase'}><Upload size={17} /> Selecionar currículo</button><input ref={resumeRef} type="file" accept="application/pdf" onChange={uploadResume} hidden /></div>
        <div className="admin-note field--wide"><Sparkles size={15} /> Métricas, trajetória e depoimentos agora possuem uma área própria e editável no menu lateral.</div>
      </div>
      <button className="admin-inline-action" type="button" onClick={() => window.confirm('Restaurar os textos originais do site?') && siteStore.resetSite()}><RotateCcw size={14} /> Restaurar configurações</button>
    </div>
  )
}
