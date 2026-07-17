const definitions = [
  { id: 'hero', anchorId: 'inicio', required: true },
  { id: 'specialties', anchorId: 'servicos', required: false },
  { id: 'projects', anchorId: 'projetos', required: false },
  { id: 'about', anchorId: 'sobre', required: false },
  { id: 'credibility', anchorId: 'trajetoria', required: false },
  { id: 'resume', anchorId: 'curriculo', required: false },
  { id: 'contact', anchorId: 'contato', required: true },
  { id: 'footer', anchorId: null, required: false },
]

const frozenSections = Object.freeze(definitions.map((definition) => Object.freeze({ ...definition })))

export const listPublicSections = () => frozenSections.map((definition) => ({ ...definition }))
export const getPublicSectionIds = () => frozenSections.map(({ id }) => id)
export const getRequiredPublicSectionIds = () => frozenSections.filter(({ required }) => required).map(({ id }) => id)
