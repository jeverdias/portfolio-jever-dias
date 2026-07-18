import { AdminSpecialties } from '../../components/AdminSpecialties'

export function SpecialtiesView({ siteStore }) {
  return <div className="admin-page"><AdminSpecialties siteStore={siteStore} /></div>
}
