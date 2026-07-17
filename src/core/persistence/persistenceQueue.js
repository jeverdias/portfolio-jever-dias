import { PERSISTENCE_STATUS } from './persistenceStatus.js'

const cloneSnapshot = (value) => {
  if (Array.isArray(value)) return value.map(cloneSnapshot)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cloneSnapshot(item)]))
  }
  return value
}

const defaultWait = (delay) => new Promise((resolve) => globalThis.setTimeout(resolve, delay))

export function createPersistenceQueue({
  save,
  delay = 700,
  maxAttempts = 3,
  retryDelays = [2000, 4000],
  isRetryable = () => false,
  onStatus = () => undefined,
  coalesce = (_, incoming) => incoming,
  snapshot = cloneSnapshot,
  setTimer = (callback, timeout) => globalThis.setTimeout(callback, timeout),
  clearTimer = (timer) => globalThis.clearTimeout(timer),
  wait = defaultWait,
} = {}) {
  if (typeof save !== 'function') throw new TypeError('A fila requer uma função save.')

  let timer = null
  let latestValue
  let revision = 0
  let savedRevision = 0
  let activePromise = null
  let disposed = false
  let lastError = null

  const emit = (status, detail = null) => {
    if (!disposed) onStatus(status, detail)
  }

  const clearScheduled = () => {
    if (timer !== null) clearTimer(timer)
    timer = null
  }

  const saveWithRetry = async (value) => {
    let error
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        await save(value)
        return
      } catch (saveError) {
        error = saveError
        if (attempt >= maxAttempts || !isRetryable(saveError)) break
        await wait(retryDelays[Math.min(attempt - 1, retryDelays.length - 1)] || 0)
      }
    }
    throw error
  }

  const run = () => {
    if (disposed) return Promise.resolve(false)
    if (activePromise) return activePromise
    clearScheduled()

    const task = (async () => {
      while (!disposed && savedRevision < revision) {
        const targetRevision = revision
        const value = snapshot(latestValue)
        emit(PERSISTENCE_STATUS.SAVING)
        try {
          await saveWithRetry(value)
        } catch (error) {
          lastError = error
          emit(PERSISTENCE_STATUS.ERROR, error)
          return false
        }
        savedRevision = targetRevision
        lastError = null
      }
      if (!disposed) {
        latestValue = undefined
        emit(PERSISTENCE_STATUS.SAVED)
      }
      return true
    })()

    activePromise = task
    void task.finally(() => {
      if (activePromise === task) activePromise = null
    })
    return task
  }

  const enqueue = (value, { immediate = false } = {}) => {
    if (disposed) return Promise.resolve(false)
    const incoming = snapshot(value)
    latestValue = latestValue === undefined ? incoming : coalesce(latestValue, incoming)
    revision += 1
    lastError = null
    emit(PERSISTENCE_STATUS.DIRTY)
    clearScheduled()
    if (immediate) return run()
    if (!activePromise) timer = setTimer(() => { timer = null; void run() }, delay)
    return Promise.resolve(true)
  }

  const cancelPending = () => {
    clearScheduled()
    savedRevision = revision
    latestValue = undefined
    lastError = null
    emit(PERSISTENCE_STATUS.IDLE)
  }

  const dispose = () => {
    clearScheduled()
    disposed = true
    latestValue = undefined
  }

  const getState = () => ({
    status: disposed ? PERSISTENCE_STATUS.IDLE : lastError ? PERSISTENCE_STATUS.ERROR : savedRevision < revision ? PERSISTENCE_STATUS.DIRTY : PERSISTENCE_STATUS.IDLE,
    revision,
    savedRevision,
    hasPending: savedRevision < revision,
    running: Boolean(activePromise),
    disposed,
    lastError,
  })

  return Object.freeze({ enqueue, flushNow: run, cancelPending, dispose, getState, isDisposed: () => disposed })
}
