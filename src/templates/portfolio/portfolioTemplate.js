import { createCapabilities } from '../../core/site-engine/templateCapabilities.js'

export const portfolioTemplate = {
  id: 'portfolio-app',
  label: 'Portfólio profissional',
  description: 'Apresenta experiência, especialidades, projetos, trajetória, currículo e contato.',
  status: 'stable',
  publicEnabled: true,
  previewEnabled: true,
  sections: ['hero', 'specialties', 'projects', 'about', 'credibility', 'resume', 'contact', 'footer'],
  defaultSectionOrder: ['hero', 'specialties', 'projects', 'about', 'credibility', 'resume', 'contact', 'footer'],
  capabilities: createCapabilities('projects', 'projectFilters', 'caseStudies', 'testimonials', 'resume', 'timeline', 'metrics', 'specialties', 'contact', 'externalDemo', 'powerBiEmbed'),
  primaryAction: { type: 'section', target: 'projects', label: 'Ver portfólio' },
  supportedContent: ['identity', 'specialties', 'projects', 'trajectory', 'metrics', 'resume', 'contacts', 'testimonials'],
  requiredContent: ['identity'],
  optionalContent: ['specialties', 'projects', 'trajectory', 'metrics', 'resume', 'contacts', 'testimonials'],
  definitionVersion: 1,
  fallbackTemplateId: null,
}
