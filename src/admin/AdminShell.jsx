import { AdminContent } from './AdminContent'
import { AdminHeader } from './AdminHeader'
import { AdminSidebar } from './AdminSidebar'

export function AdminShell({ activeView, adminAuth, projectStore, siteStore, onNavigate, onLogout }) {
  return (
    <div className="admin-console">
      <AdminSidebar activeView={activeView} adminAuth={adminAuth} site={siteStore.site} onNavigate={onNavigate} onLogout={onLogout} />
      <main className="admin-console__main">
        <AdminHeader activeView={activeView} adminAuth={adminAuth} projectStore={projectStore} siteStore={siteStore} />
        <AdminContent activeView={activeView} adminAuth={adminAuth} projectStore={projectStore} siteStore={siteStore} onNavigate={onNavigate} />
      </main>
    </div>
  )
}
