import { AdminSiteClassification } from '../../components/AdminSiteClassification'

export function ClassificationView({ siteStore }) {
  return <div className="admin-page"><AdminSiteClassification siteStore={siteStore} /></div>
}
