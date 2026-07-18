import { AppearanceView } from './views/AppearanceView'
import { ClassificationView } from './views/ClassificationView'
import { DashboardView } from './views/DashboardView'
import { GuideView } from './views/GuideView'
import { LibraryView } from './views/LibraryView'
import { MessagesView } from './views/MessagesView'
import { ProfessionalContentView } from './views/ProfessionalContentView'
import { ProjectsView } from './views/ProjectsView'
import { SettingsView } from './views/SettingsView'
import { SpecialtiesView } from './views/SpecialtiesView'

export const adminViewRegistry = Object.freeze({
  overview: DashboardView,
  settings: SettingsView,
  appearance: AppearanceView,
  classification: ClassificationView,
  professional: ProfessionalContentView,
  repositories: ProjectsView,
  library: LibraryView,
  specialties: SpecialtiesView,
  messages: MessagesView,
  guide: GuideView,
})

export const hasAdminView = (componentKey) => typeof adminViewRegistry[componentKey] === 'function'

export const getAdminView = (componentKey) => adminViewRegistry[componentKey] || null
