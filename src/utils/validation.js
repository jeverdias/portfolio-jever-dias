const MAX_TEXT_LENGTHS = {
  title: 140,
  theme: 240,
  category: 100,
  typeLabel: 80,
  status: 80,
  description: 600,
  details: 5000,
  challenge: 3000,
  solution: 3000,
  results: 3000,
  duration: 120,
  contribution: 500,
  contentFormat: 160,
  audience: 300,
}

const URL_FIELDS = ['image', 'embedUrl', 'externalUrl', 'videoUrl']
const DATA_IMAGE_PATTERN = /^data:image\/(?:png|jpeg|webp|gif);base64,/i

export const isHttpUrl = (value) => {
  if (!value) return false
  try {
    const url = new URL(String(value).trim())
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export const isSafeImageSource = (value) => isHttpUrl(value) || DATA_IMAGE_PATTERN.test(value || '')

export const sanitizeText = (value, maxLength = 5000) => String(value ?? '').trim().slice(0, maxLength)

const sanitizeUrl = (value, { image = false } = {}) => {
  const normalized = String(value ?? '').trim()
  if (!normalized) return ''
  if (image && DATA_IMAGE_PATTERN.test(normalized)) return normalized
  if (!isHttpUrl(normalized)) throw new Error(`URL inválida: ${normalized.slice(0, 80)}`)
  return normalized
}

export const sanitizeProject = (project, index = 0) => {
  if (!project || typeof project !== 'object' || Array.isArray(project)) {
    throw new Error(`O projeto ${index + 1} não possui um formato válido.`)
  }
  const id = sanitizeText(project.id, 120)
  const title = sanitizeText(project.title, MAX_TEXT_LENGTHS.title)
  const type = sanitizeText(project.type, 40)
  if (!id || !/^[a-z0-9][a-z0-9-]*$/i.test(id)) throw new Error(`O projeto ${index + 1} possui um identificador inválido.`)
  if (title.length < 2) throw new Error(`O projeto ${index + 1} precisa de um nome.`)
  if (!type) throw new Error(`O projeto “${title}” precisa de um modelo de exibição.`)

  const next = { ...project, id, title, type }
  Object.entries(MAX_TEXT_LENGTHS).forEach(([field, limit]) => {
    if (field !== 'title') next[field] = sanitizeText(project[field], limit)
  })
  URL_FIELDS.forEach((field) => {
    next[field] = sanitizeUrl(project[field], { image: field === 'image' })
  })
  next.tags = [...new Set((Array.isArray(project.tags) ? project.tags : [])
    .map((tag) => sanitizeText(tag, 60)).filter(Boolean))].slice(0, 20)
  next.gallery = [...new Set((Array.isArray(project.gallery) ? project.gallery : [])
    .map((image) => sanitizeUrl(image, { image: true })).filter(Boolean))].slice(0, 4)
  next.featured = project.featured !== false
  return next
}

export const validateProjectsImport = (payload) => {
  const serialized = typeof payload === 'string' ? payload : JSON.stringify(payload)
  if (serialized.length > 5_000_000) throw new Error('O backup de projetos excede o limite seguro de importação.')
  const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload
  if (!Array.isArray(parsed) || !parsed.length) throw new Error('O backup precisa conter pelo menos um projeto.')
  if (parsed.length > 100) throw new Error('O backup excede o limite de 100 projetos.')
  const projects = parsed.map(sanitizeProject)
  if (new Set(projects.map((project) => project.id)).size !== projects.length) {
    throw new Error('Existem projetos com identificadores duplicados no backup.')
  }
  return projects
}

export const validateSiteImport = (payload) => {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error('As configurações do site são inválidas.')
  const serialized = JSON.stringify(payload)
  if (serialized.length > 1_500_000) throw new Error('As configurações excedem o limite seguro de importação.')
  return payload
}

export const validateContactPayload = (payload) => {
  const message = {
    name: sanitizeText(payload.name, 120),
    email: sanitizeText(payload.email, 254).toLowerCase(),
    subject: sanitizeText(payload.subject, 180),
    message: sanitizeText(payload.message, 5000),
  }
  if (message.name.length < 2 || message.subject.length < 2 || message.message.length < 10 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(message.email)) {
    throw new Error('Confira os dados antes de enviar.')
  }
  return message
}
