import { ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { getInitials } from '../utils/getInitials'

const ADMIN_PIN = import.meta.env.DEV ? (import.meta.env.VITE_ADMIN_PIN || '') : ''

export function AdminLogin({ adminAuth, siteName, onLocalAuthenticated }) {
  const [email, setEmail] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const localLoginAllowed = !adminAuth.configured && import.meta.env.DEV && Boolean(ADMIN_PIN)

  const login = async (event) => {
    event.preventDefault()
    if (adminAuth.configured) {
      const success = await adminAuth.login(email, pin)
      if (success) {
        setPin('')
        setError('')
      }
      return
    }

    if (localLoginAllowed && pin === ADMIN_PIN) {
      onLocalAuthenticated()
      setPin('')
      setError('')
      return
    }

    setError('PIN incorreto. Confira o arquivo .env do projeto.')
  }

  return (
    <div className="admin-login">
      <div className="admin-login__mark">{getInitials(siteName)}</div>
      <span>Área administrativa</span>
      <h2 id="admin-title">Login</h2>
      <p>Entre para configurar o site e gerenciar seus repositórios.</p>
      {(adminAuth.configured || localLoginAllowed) ? <form onSubmit={login}>
        {adminAuth.configured && <><label htmlFor="admin-email">Email</label><input id="admin-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" autoFocus required /></>}
        <label htmlFor="admin-pin">{adminAuth.configured ? 'Senha' : 'PIN local de desenvolvimento'}</label>
        <input id="admin-pin" type="password" value={pin} onChange={(event) => setPin(event.target.value)} onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            event.currentTarget.form?.requestSubmit()
          }
        }} autoComplete={adminAuth.configured ? 'current-password' : 'off'} autoFocus={!adminAuth.configured} required />
        {(error || adminAuth.error) && <div className="form-error">{error || adminAuth.error}</div>}
        <button className="button button--primary" type="submit" disabled={adminAuth.loading}>{adminAuth.loading ? 'Entrando...' : 'Entrar no painel'}</button>
        <span className="admin-login__enter-hint">Pressione Enter ou clique no botão para entrar.</span>
      </form> : <div className="admin-login__setup"><ShieldCheck size={20} /><strong>Painel protegido</strong><p>Configure as variáveis do projeto Supabase exclusivo no Netlify para habilitar o acesso administrativo seguro.</p></div>}
      <small>{adminAuth.configured ? 'Acesso protegido pelo Supabase Auth. Somente usuários autorizados pelas políticas do portfólio podem editar.' : localLoginAllowed ? 'Modo local temporário: use o PIN de desenvolvimento. No site publicado, o painel permanece bloqueado sem Supabase.' : 'O PIN local nunca é aceito no site publicado.'}</small>
    </div>
  )
}
