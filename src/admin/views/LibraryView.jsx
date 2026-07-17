import { AdminTechLibrary } from '../../components/AdminTechLibrary'

export function LibraryView({ siteStore }) {
  return <div className="admin-page"><AdminTechLibrary siteStore={siteStore} /></div>
}
