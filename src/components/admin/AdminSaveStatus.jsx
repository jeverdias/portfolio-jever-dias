import { AlertTriangle, CheckCircle2, Cloud, LoaderCircle } from 'lucide-react'

const labels = {
  idle: 'Sem alterações pendentes',
  pending: 'Alterações aguardando salvamento',
  saving: 'Salvando no Supabase',
  saved: 'Salvo no Supabase',
  error: 'Erro ao salvar',
}

export function AdminSaveStatus({ status = 'idle' }) {
  const Icon = status === 'error' ? AlertTriangle : status === 'saved' ? CheckCircle2 : status === 'saving' ? LoaderCircle : Cloud
  return <span className={`admin-save-status is-${status}`} role="status" aria-live="polite">
    <Icon size={14} className={status === 'saving' ? 'is-spinning' : ''} /> {labels[status] || labels.idle}
  </span>
}
