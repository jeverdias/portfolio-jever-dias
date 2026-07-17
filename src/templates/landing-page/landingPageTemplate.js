import { createCapabilities } from '../../core/site-engine/templateCapabilities.js'

export const landingPageTemplate = {
  id: 'landing-page',
  label: 'Landing page',
  description: 'Organiza uma oferta única, benefícios, prova e chamada para ação.',
  status: 'preview',
  publicEnabled: false,
  previewEnabled: true,
  sections: ['hero', 'problem', 'solution', 'benefits', 'social-proof', 'faq', 'call-to-action', 'contact', 'footer'],
  defaultSectionOrder: ['hero', 'problem', 'solution', 'benefits', 'social-proof', 'faq', 'call-to-action', 'contact', 'footer'],
  capabilities: createCapabilities('testimonials', 'metrics', 'services', 'faq', 'leadCapture', 'contact'),
  primaryAction: { type: 'lead', target: 'contact', label: 'Quero saber mais' },
  supportedContent: ['identity', 'landingOffer', 'benefits', 'metrics', 'testimonials', 'contacts'],
  requiredContent: ['identity', 'landingOffer'],
  optionalContent: ['benefits', 'metrics', 'testimonials', 'contacts'],
  definitionVersion: 1,
  fallbackTemplateId: 'portfolio-app',
}
