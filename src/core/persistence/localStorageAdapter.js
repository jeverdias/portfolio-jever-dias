export const SITE_STORAGE_KEY = 'jd-portfolio-site-v1'
export const PROJECTS_STORAGE_KEY = 'jd-portfolio-projects-v1'
export const CONTACT_STORAGE_KEY = 'jd-contact-last-submit'

export const STORAGE_KEYS = Object.freeze({
  site: SITE_STORAGE_KEY,
  projects: PROJECTS_STORAGE_KEY,
  contact: CONTACT_STORAGE_KEY,
})

export class LocalStorageError extends Error {
  constructor(code, cause) {
    super(code === 'unavailable'
      ? 'O armazenamento local não está disponível.'
      : code === 'invalid-json'
        ? 'O conteúdo armazenado não é um JSON válido.'
        : code === 'quota-exceeded'
          ? 'O limite do armazenamento local foi atingido.'
          : code === 'serialization'
            ? 'O conteúdo não pôde ser serializado.'
            : 'Não foi possível acessar o armazenamento local.')
    this.name = 'LocalStorageError'
    this.code = code
    this.cause = cause
  }
}

const storageError = (error, fallbackCode = 'storage-error') => {
  const quotaExceeded = error?.name === 'QuotaExceededError'
    || error?.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    || error?.code === 22
    || error?.code === 1014
  return new LocalStorageError(quotaExceeded ? 'quota-exceeded' : fallbackCode, error)
}

const resolveDefaultStorage = () => {
  try {
    return globalThis?.localStorage || null
  } catch {
    return null
  }
}

export function createLocalStorageAdapter(storage) {
  const resolveStorage = () => {
    const target = storage === undefined ? resolveDefaultStorage() : storage
    if (!target || typeof target.getItem !== 'function' || typeof target.setItem !== 'function') {
      throw new LocalStorageError('unavailable')
    }
    return target
  }

  const readRaw = (key, fallback = null) => {
    try {
      const value = resolveStorage().getItem(key)
      return { ok: true, found: value !== null, value: value ?? fallback, error: null }
    } catch (error) {
      return { ok: false, found: false, value: fallback, error: error instanceof LocalStorageError ? error : storageError(error) }
    }
  }

  const writeRaw = (key, value) => {
    try {
      resolveStorage().setItem(key, String(value))
      return { ok: true, error: null }
    } catch (error) {
      return { ok: false, error: error instanceof LocalStorageError ? error : storageError(error) }
    }
  }

  const readJson = (key, fallback = null) => {
    const raw = readRaw(key)
    if (!raw.ok) return { ...raw, value: fallback }
    if (!raw.found) return { ...raw, value: fallback }
    try {
      return { ok: true, found: true, value: JSON.parse(raw.value), error: null }
    } catch (error) {
      return { ok: false, found: true, value: fallback, error: new LocalStorageError('invalid-json', error) }
    }
  }

  const writeJson = (key, value) => {
    let serialized
    try {
      serialized = JSON.stringify(value)
      if (serialized === undefined) throw new TypeError('Resultado JSON indefinido.')
    } catch (error) {
      return { ok: false, error: new LocalStorageError('serialization', error) }
    }
    return writeRaw(key, serialized)
  }

  const remove = (key) => {
    try {
      const target = resolveStorage()
      if (typeof target.removeItem !== 'function') throw new LocalStorageError('unavailable')
      target.removeItem(key)
      return { ok: true, error: null }
    } catch (error) {
      return { ok: false, error: error instanceof LocalStorageError ? error : storageError(error) }
    }
  }

  return Object.freeze({ readRaw, writeRaw, readJson, writeJson, remove })
}

export const localStorageAdapter = createLocalStorageAdapter()
