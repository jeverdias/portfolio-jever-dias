import { createElement } from 'react'
import { getAdminNavigation, resolveAdminViewId } from './adminNavigation'
import { getAdminView, hasAdminView } from './adminViewRegistry'

export function AdminContent({ activeView, adminAuth, projectStore, siteStore, onNavigate }) {
  const resolvedViewId = resolveAdminViewId(activeView, { adminAuth }, hasAdminView)
  const item = getAdminNavigation({ adminAuth }).find((entry) => entry.id === resolvedViewId)
  const View = getAdminView(item?.componentKey)
  if (!View) return <div className="admin-page"><div className="admin-empty"><p>Esta área não está disponível.</p></div></div>
  return createElement(View, { adminAuth, projectStore, siteStore, onNavigate })
}
