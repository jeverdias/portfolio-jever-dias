export const TEMPLATE_CAPABILITY_IDS = Object.freeze([
  'projects',
  'projectFilters',
  'caseStudies',
  'testimonials',
  'resume',
  'timeline',
  'metrics',
  'specialties',
  'services',
  'team',
  'clients',
  'faq',
  'leadCapture',
  'contact',
  'externalDemo',
  'powerBiEmbed',
])

const knownCapabilities = new Set(TEMPLATE_CAPABILITY_IDS)

export const createCapabilities = (...enabled) => Object.freeze(Object.fromEntries(
  TEMPLATE_CAPABILITY_IDS.map((capability) => [capability, enabled.includes(capability)]),
))

export const hasTemplateCapability = (template, capability) => (
  Boolean(template)
  && knownCapabilities.has(capability)
  && template.capabilities?.[capability] === true
)

export const validateTemplateCapabilities = (capabilities) => (
  Boolean(capabilities)
  && typeof capabilities === 'object'
  && !Array.isArray(capabilities)
  && Object.keys(capabilities).every((key) => knownCapabilities.has(key) && typeof capabilities[key] === 'boolean')
)
