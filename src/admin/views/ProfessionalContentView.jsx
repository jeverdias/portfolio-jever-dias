import { AdminProfessionalContent } from '../../components/AdminProfessionalContent'

export function ProfessionalContentView({ siteStore, onNavigate }) {
  return <div className="admin-page"><AdminProfessionalContent siteStore={siteStore} onOpenLibrary={() => onNavigate('library')} /></div>
}
