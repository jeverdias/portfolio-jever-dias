import { ArrowUpRight, CheckCircle2, Mail, Send } from 'lucide-react'
import { useState } from 'react'
import { getClassificationPresentation } from '../data/classificationPresentation'
import { isSupabaseConfigured, submitContactMessage } from '../lib/supabase'
import { CONTACT_STORAGE_KEY, localStorageAdapter } from '../core/persistence/localStorageAdapter'

const CONTACT_COOLDOWN_MS = 60_000

export function Contact({ site, onOpen, classificationId = site.siteClassificationId }) {
  const [status, setStatus] = useState('idle')
  const copy = getClassificationPresentation(classificationId)

  const submitContact = async (event) => {
    event.preventDefault()
    setStatus('sending')
    const form = event.currentTarget
    const formData = new FormData(form)
    if (formData.get('empresa-site')) {
      setStatus('idle')
      return
    }
    const lastSubmit = Number(localStorageAdapter.readRaw(CONTACT_STORAGE_KEY, '0').value || 0)
    if (Date.now() - lastSubmit < CONTACT_COOLDOWN_MS) {
      setStatus('rate-limited')
      return
    }

    try {
      if (isSupabaseConfigured) {
        await submitContactMessage({
          name: formData.get('nome'),
          email: formData.get('email'),
          subject: formData.get('assunto'),
          message: formData.get('mensagem'),
        })
        if (import.meta.env.PROD && window.location.protocol === 'https:') {
          const response = await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString(),
          })
          if (!response.ok) setStatus('success-no-email')
        }
      } else {
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString(),
        })
        if (!response.ok) throw new Error('Falha no envio')
      }
      localStorageAdapter.writeRaw(CONTACT_STORAGE_KEY, Date.now())
      form.reset()
      setStatus((current) => current === 'success-no-email' ? current : 'success')
    } catch (submitError) {
      setStatus(/aguarde|limite|repetida/i.test(submitError.message || '') ? 'rate-limited' : 'error')
    }
  }

  return (
    <section className="contact-section" id="contato">
      <div className="container">
        <div className="contact-card">
          <div className="contact-card__orb" />
          <div>
            <span className="contact-card__eyebrow">{copy.contactEyebrow}</span>
            <h2>{copy.contactTitle}</h2>
            <p>{copy.contactText}</p>
          </div>
          <button className="button button--light" type="button" onClick={onOpen}>
            <Mail size={18} /> Falar com {site.name.split(' ')[0]} <ArrowUpRight size={17} />
          </button>
        </div>

        <div className="contact-form-card" id="formulario-contato">
          <div className="contact-form-card__intro">
            <span className="section-heading__eyebrow">Contato direto</span>
            <h2>Conte um pouco sobre o seu projeto.</h2>
            <p>Preencha os dados abaixo. A mensagem será salva com segurança e ficará disponível no painel administrativo.</p>
            <button type="button" onClick={onOpen}>Prefere outro canal? Ver redes e emails <ArrowUpRight size={15} /></button>
          </div>
          <form name="contato-portfolio" method="POST" data-netlify="true" data-netlify-honeypot="empresa-site" onSubmit={submitContact}>
            <input type="hidden" name="form-name" value="contato-portfolio" />
            <p className="honeypot"><label>Não preencha este campo<input name="empresa-site" tabIndex="-1" autoComplete="off" /></label></p>
            <label>Nome<input name="nome" minLength="2" maxLength="120" required autoComplete="name" /></label>
            <label>Email<input name="email" type="email" maxLength="254" required autoComplete="email" /></label>
            <label className="field--wide">Assunto<input name="assunto" minLength="2" maxLength="180" required /></label>
            <label className="field--wide">Mensagem<textarea name="mensagem" rows="5" minLength="10" maxLength="5000" required /></label>
            <button className="button button--primary" type="submit" disabled={status === 'sending'}>
              <Send size={17} /> {status === 'sending' ? 'Enviando...' : 'Enviar mensagem'}
            </button>
            <div aria-live="polite">
              {status === 'success' && <p className="contact-form-status is-success"><CheckCircle2 size={16} /> Mensagem enviada. Obrigado pelo contato!</p>}
              {status === 'success-no-email' && <p className="contact-form-status is-success"><CheckCircle2 size={16} /> Mensagem salva no painel. A notificação por email ficou pendente.</p>}
              {status === 'rate-limited' && <p className="contact-form-status is-error">Aguarde um minuto antes de enviar outra mensagem.</p>}
              {status === 'error' && <p className="contact-form-status is-error">Não foi possível enviar agora. Use um dos contatos acima.</p>}
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
