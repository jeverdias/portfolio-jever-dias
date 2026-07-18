export const SITE_CONFIG_SCHEMA = Object.freeze({
  identity: ['name', 'role', 'location'],
  navigation: ['sectionVisibility'],
  hero: ['eyebrow', 'intro', 'dashboardsCount', 'dashboardsLabel', 'systemsCount', 'systemsLabel'],
  landing: ['landingLabel', 'landingHeadline', 'landingText', 'landingCta', 'landingBenefitsText'],
  contacts: ['email', 'emailSecondary', 'whatsapp'],
  socialNetworks: ['linkedin', 'github', 'instagram', 'x', 'facebook', 'lattes'],
  appearance: ['appearance'],
  classification: ['classificationLayoutVersion', 'siteClassificationId', 'siteClassification', 'siteClassificationDescription'],
  visibility: ['sectionVisibility'],
  specialties: ['specialties'],
  technologies: ['techItems'],
  credibility: ['metrics', 'testimonialsText'],
  trajectory: ['timelineText'],
  resume: ['resumeUrl', 'resumeSummary'],
  library: ['stickerLibrary'],
  projectSettings: ['displayModels'],
})

export const SITE_ARRAY_POLICIES = Object.freeze({
  metrics: 'default-when-empty',
  techItems: 'default-when-empty',
  specialties: 'default-when-empty',
  stickerLibrary: 'preserve-empty',
  displayModels: 'built-ins-plus-valid-custom',
  unknownArrays: 'preserve-and-clone',
})

export const isPlainRecord = (value) => (
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)
)

export const cloneConfigValue = (value) => {
  if (Array.isArray(value)) return value.map(cloneConfigValue)
  if (isPlainRecord(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cloneConfigValue(item)]))
  }
  return value
}

export const deepFreezeConfig = (value) => {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value
  Object.values(value).forEach(deepFreezeConfig)
  return Object.freeze(value)
}

const hasStableId = (item) => isPlainRecord(item) && typeof item.id === 'string' && item.id.trim().length > 0

const normalizeObjectArray = (value, fallback, { preserveEmpty = false } = {}) => {
  if (!Array.isArray(value)) return cloneConfigValue(fallback)
  if (value.length === 0) return preserveEmpty ? [] : cloneConfigValue(fallback)
  const valid = value.filter(hasStableId).map(cloneConfigValue)
  if (valid.length) return valid
  return preserveEmpty ? [] : cloneConfigValue(fallback)
}

const normalizeNestedRecord = (value, fallback) => {
  if (!isPlainRecord(value)) return cloneConfigValue(fallback)
  const result = { ...cloneConfigValue(fallback), ...cloneConfigValue(value) }
  Object.entries(fallback).forEach(([key, defaultValue]) => {
    if (typeof value[key] !== typeof defaultValue) result[key] = cloneConfigValue(defaultValue)
  })
  return result
}

const normalizeDisplayModels = (value, defaults) => {
  const builtIns = defaults.filter((model) => model.builtIn === true).map(cloneConfigValue)
  if (!Array.isArray(value)) return builtIns
  const builtInIds = new Set(builtIns.map((model) => model.id))
  const custom = value
    .filter((model) => hasStableId(model) && model.builtIn !== true && !builtInIds.has(model.id))
    .map(cloneConfigValue)
  return [...builtIns, ...custom]
}

export function validateSiteConfigShape(value) {
  const issues = []
  if (!isPlainRecord(value)) return { valid: false, issues: ['A configuração precisa ser um objeto.'], unknownFields: [] }

  const knownFields = new Set(Object.values(SITE_CONFIG_SCHEMA).flat())
  const unknownFields = Object.keys(value).filter((key) => !knownFields.has(key))
  for (const field of ['metrics', 'techItems', 'stickerLibrary', 'displayModels', 'specialties']) {
    if (field in value && !Array.isArray(value[field])) issues.push(`${field} precisa ser um array.`)
  }
  for (const field of ['appearance', 'sectionVisibility']) {
    if (field in value && !isPlainRecord(value[field])) issues.push(`${field} precisa ser um objeto.`)
  }
  if ('siteClassificationId' in value && typeof value.siteClassificationId !== 'string') {
    issues.push('siteClassificationId precisa ser texto.')
  }
  return { valid: issues.length === 0, issues, unknownFields }
}

export function normalizeSiteShape(value, defaults, classifications, defaultClassificationId) {
  const source = isPlainRecord(value) ? cloneConfigValue(value) : {}
  const result = { ...cloneConfigValue(defaults), ...source }

  Object.entries(defaults).forEach(([key, defaultValue]) => {
    if (['classificationLayoutVersion', 'siteClassificationId', 'siteClassification', 'siteClassificationDescription'].includes(key)) return
    if (['metrics', 'techItems', 'stickerLibrary', 'displayModels', 'specialties', 'appearance', 'sectionVisibility'].includes(key)) return
    if (['string', 'number', 'boolean'].includes(typeof defaultValue) && typeof source[key] !== typeof defaultValue) {
      result[key] = cloneConfigValue(defaultValue)
    }
  })

  const classification = classifications.find((item) => item.id === source.siteClassificationId)
    || classifications.find((item) => item.id === defaultClassificationId)
  const classificationIsValid = Boolean(classifications.find((item) => item.id === source.siteClassificationId))
  result.classificationLayoutVersion = defaults.classificationLayoutVersion
  result.siteClassificationId = classification?.id || defaultClassificationId
  result.siteClassification = classificationIsValid && typeof source.siteClassification === 'string' && source.siteClassification
    ? source.siteClassification
    : classification?.classification || defaults.siteClassification
  result.siteClassificationDescription = classificationIsValid && typeof source.siteClassificationDescription === 'string' && source.siteClassificationDescription
    ? source.siteClassificationDescription
    : classification?.goal || defaults.siteClassificationDescription

  result.metrics = normalizeObjectArray(source.metrics, defaults.metrics)
  result.techItems = normalizeObjectArray(source.techItems, defaults.techItems)
  result.specialties = normalizeObjectArray(source.specialties, defaults.specialties)
  result.stickerLibrary = normalizeObjectArray(source.stickerLibrary, defaults.stickerLibrary, { preserveEmpty: true })
  result.displayModels = normalizeDisplayModels(source.displayModels, defaults.displayModels)
  result.sectionVisibility = normalizeNestedRecord(source.sectionVisibility, defaults.sectionVisibility)
  result.appearance = normalizeNestedRecord(source.appearance, defaults.appearance)

  return result
}
