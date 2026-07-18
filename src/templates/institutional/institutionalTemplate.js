import { createCapabilities } from '../../core/site-engine/templateCapabilities.js'

export const institutionalTemplate = {
  id: 'institutional',
  label: 'Site institucional',
  description: 'Apresenta empresa, soluções, diferenciais, equipe, clientes e contato.',
  status: 'preview',
  publicEnabled: false,
  previewEnabled: true,
  sections: ['hero', 'about-company', 'services', 'differentials', 'clients', 'team', 'contact', 'footer'],
  defaultSectionOrder: ['hero', 'about-company', 'services', 'differentials', 'clients', 'team', 'contact', 'footer'],
  capabilities: createCapabilities('caseStudies', 'testimonials', 'metrics', 'services', 'team', 'clients', 'contact'),
  primaryAction: { type: 'section', target: 'contact', label: 'Fale conosco' },
  supportedContent: ['identity', 'about', 'services', 'differentials', 'clients', 'team', 'contacts'],
  requiredContent: ['identity', 'about'],
  optionalContent: ['services', 'differentials', 'clients', 'team', 'contacts'],
  definitionVersion: 1,
  fallbackTemplateId: 'portfolio-app',
}
