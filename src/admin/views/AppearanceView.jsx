import { AdminAppearance } from '../../components/AdminAppearance'

export function AppearanceView({ siteStore }) {
  return <div className="admin-page"><AdminAppearance siteStore={siteStore} /></div>
}
