import { AdminSaveStatus } from '../components/admin/AdminSaveStatus'
import { getAdminViewLabel } from './adminNavigation'

export function AdminHeader({ activeView, adminAuth, projectStore, siteStore }) {
  return (
    <header className="admin-console__topbar">
      <div><span>Painel administrativo</span><strong id="admin-title">{getAdminViewLabel(activeView, { adminAuth })}</strong></div>
      {siteStore.mode === 'supabase'
        ? <AdminSaveStatus status={activeView === 'repositories' ? projectStore.saveStatus : siteStore.saveStatus} />
        : <div><span className="admin-status-dot" /> Alterações locais</div>}
    </header>
  )
}
