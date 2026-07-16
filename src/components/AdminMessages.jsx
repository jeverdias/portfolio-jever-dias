import { Archive, Check, Mail, RefreshCw, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

const statusLabels = { new: 'Nova', read: 'Lida', archived: 'Arquivada' }

export function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [status, setStatus] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!supabase) return
    setLoading(true)
    setError('')
    const { data, error: loadError } = await supabase.from('contact_messages').select('id, name, email, subject, message, status, created_at').order('created_at', { ascending: false })
    setMessages(data || [])
    setError(loadError ? 'Não foi possível carregar as mensagens.' : '')
    setLoading(false)
  }, [])

  // A consulta remota é assíncrona e atualiza o estado somente quando a resposta chega.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load() }, [load])

  const visible = useMemo(() => status === 'all' ? messages : messages.filter((item) => item.status === status), [messages, status])
  const newCount = messages.filter((item) => item.status === 'new').length

  const changeStatus = async (id, nextStatus) => {
    const { error: updateError } = await supabase.from('contact_messages').update({ status: nextStatus }).eq('id', id)
    if (updateError) setError('Não foi possível atualizar a mensagem.')
    else setMessages((current) => current.map((item) => item.id === id ? { ...item, status: nextStatus } : item))
  }

  const remove = async (item) => {
    if (!window.confirm(`Excluir a mensagem de “${item.name}”?`)) return
    const { error: deleteError } = await supabase.from('contact_messages').delete().eq('id', item.id)
    if (deleteError) setError('Não foi possível excluir a mensagem.')
    else setMessages((current) => current.filter((message) => message.id !== item.id))
  }

  return <div className="admin-messages">
    <div className="admin-page__heading"><span>Formulário de contato</span><h3>Mensagens recebidas</h3><p>As mensagens enviadas pelo site ficam protegidas e visíveis somente para administradores autorizados.</p></div>
    <div className="admin-messages__summary"><div><Mail size={20} /><span><strong>{newCount}</strong><small>nova{newCount === 1 ? '' : 's'}</small></span></div><button type="button" onClick={load} disabled={loading}><RefreshCw size={15} /> Atualizar</button></div>
    <div className="admin-messages__filters" role="group" aria-label="Filtrar mensagens">{[['all', 'Todas'], ['new', 'Novas'], ['read', 'Lidas'], ['archived', 'Arquivadas']].map(([value, label]) => <button className={status === value ? 'is-active' : ''} type="button" key={value} onClick={() => setStatus(value)}>{label}</button>)}</div>
    {error && <div className="form-error form-error--block">{error}</div>}
    {loading ? <div className="admin-empty"><p>Carregando mensagens...</p></div> : visible.length ? <div className="admin-messages__list">{visible.map((item) => <article className={`is-${item.status}`} key={item.id}>
      <header><div><strong>{item.name}</strong><a href={`mailto:${item.email}`}>{item.email}</a></div><span>{statusLabels[item.status]} · {new Date(item.created_at).toLocaleString('pt-BR')}</span></header>
      <h4>{item.subject}</h4><p>{item.message}</p>
      <footer>{item.status !== 'read' && <button type="button" onClick={() => changeStatus(item.id, 'read')}><Check size={14} /> Marcar como lida</button>}{item.status !== 'archived' && <button type="button" onClick={() => changeStatus(item.id, 'archived')}><Archive size={14} /> Arquivar</button>}<button className="danger" type="button" onClick={() => remove(item)}><Trash2 size={14} /> Excluir</button></footer>
    </article>)}</div> : <div className="admin-empty"><Mail size={25} /><p>Nenhuma mensagem nesta categoria.</p></div>}
    <aside className="admin-messages__email-note"><strong>Notificação por email</strong><p>As mensagens já ficam salvas no painel. O envio de aviso por email poderá ser ativado depois por uma função segura no Supabase, sem expor senhas no site.</p></aside>
  </div>
}
