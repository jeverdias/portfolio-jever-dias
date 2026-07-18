import { X } from 'lucide-react'
import { useRef, useState } from 'react'
import { AdminLogin } from '../admin/AdminLogin'
import { AdminShell } from '../admin/AdminShell'
import { resolveAdminViewId } from '../admin/adminNavigation'
import { hasAdminView } from '../admin/adminViewRegistry'
import { useModalA11y } from '../hooks/useModalA11y'

export function AdminPanel({ open, onClose, projectStore, siteStore, adminAuth }) {
  const [localAuthenticated, setLocalAuthenticated] = useState(false)
  const [view, setView] = useState('overview')
  const panelRef = useRef(null)
  const closeRef = useRef(null)
  const authenticated = adminAuth.configured ? Boolean(adminAuth.user) : localAuthenticated
  const activeView = resolveAdminViewId(view, { adminAuth }, hasAdminView)

  useModalA11y({ active: open, containerRef: panelRef, initialFocusRef: closeRef, onClose })

  if (!open) return null

  const navigate = (nextView) => setView(resolveAdminViewId(nextView, { adminAuth }, hasAdminView))
  const logout = () => {
    if (adminAuth.configured) {
      void adminAuth.logout()
      return
    }
    setLocalAuthenticated(false)
  }

  return (
    <div className="admin-backdrop">
      <section ref={panelRef} className="admin-panel admin-panel--console" role="dialog" aria-modal="true" aria-labelledby="admin-title">
        <button ref={closeRef} className="modal-close" type="button" onClick={onClose} aria-label="Fechar administração"><X size={21} /></button>
        {!authenticated
          ? <AdminLogin adminAuth={adminAuth} siteName={siteStore.site.name} onLocalAuthenticated={() => setLocalAuthenticated(true)} />
          : <AdminShell activeView={activeView} adminAuth={adminAuth} projectStore={projectStore} siteStore={siteStore} onNavigate={navigate} onLogout={logout} />}
      </section>
    </div>
  )
}
