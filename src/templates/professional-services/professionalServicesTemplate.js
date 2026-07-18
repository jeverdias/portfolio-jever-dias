import { createCapabilities } from '../../core/site-engine/templateCapabilities.js'

export const professionalServicesTemplate = {
  id: 'professional-services',
  label: 'Profissional autônomo',
  description: 'Apresenta perfil, serviços, especialidades, trabalhos, credenciais e contato.',
  status: 'preview',
  publicEnabled: false,
  previewEnabled: true,
  sections: ['hero', 'professional-profile', 'services', 'specialties', 'portfolio', 'testimonials', 'credentials', 'contact', 'footer'],
  defaultSectionOrder: ['hero', 'professional-profile', 'services', 'specialties', 'portfolio', 'testimonials', 'credentials', 'contact', 'footer'],
  capabilities: createCapabilities('projects', 'caseStudies', 'testimonials', 'resume', 'timeline', 'metrics', 'specialties', 'services', 'contact', 'externalDemo'),
  primaryAction: { type: 'section', target: 'contact', label: 'Agendar conversa' },
  supportedContent: ['identity', 'profile', 'services', 'specialties', 'projects', 'testimonials', 'credentials', 'contacts'],
  requiredContent: ['identity', 'profile'],
  optionalContent: ['services', 'specialties', 'projects', 'testimonials', 'credentials', 'contacts'],
  definitionVersion: 1,
  fallbackTemplateId: 'portfolio-app',
}
