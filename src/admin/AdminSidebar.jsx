import { LogOut, ShieldCheck } from 'lucide-react'
import { getInitials } from '../utils/getInitials'
import { getAdminNavigation } from './adminNavigation'

export function AdminSidebar({ activeView, adminAuth, site, onNavigate, onLogout }) {
  const items = getAdminNavigation({ adminAuth })

  const navigateWithKeyboard = (event, index) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const nextIndex = event.key === 'Home' ? 0
      : event.key === 'End' ? items.length - 1
        : (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length
    const nextButton = event.currentTarget.parentElement?.children[nextIndex]
    nextButton?.focus()
  }

  return (
    <aside className="admin-console__nav">
      <div className="admin-console__brand"><div>{getInitials(site.name)}</div><span><strong>{site.name}</strong><small>{site.siteClassification}</small></span></div>
      <nav aria-label="Navegação administrativa">
        {items.map((item, index) => {
          const Icon = item.icon
          return <button className={activeView === item.id ? 'is-active' : ''} type="button" key={item.id} onClick={() => onNavigate(item.id)} onKeyDown={(event) => navigateWithKeyboard(event, index)}><Icon size={17} /> {item.label}</button>
        })}
      </nav>
      <div className="admin-console__security"><ShieldCheck size={16} /><span><strong>{adminAuth.configured ? 'Sessão protegida' : 'Sessão local'}</strong><small>{adminAuth.configured ? adminAuth.user?.email : 'Dados neste dispositivo'}</small></span></div>
      <button className="admin-console__logout" type="button" onClick={onLogout}><LogOut size={16} /> Sair</button>
    </aside>
  )
}
