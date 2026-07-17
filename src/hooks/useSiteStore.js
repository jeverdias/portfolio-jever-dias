import { useCallback, useEffect, useRef, useState } from 'react'
import { isSupabaseConfigured, removePortfolioAsset, supabase, uploadPortfolioAsset } from '../lib/supabase.js'
import { validateSiteImport } from '../utils/validation.js'
import { normalizeSiteConfig, readSiteCache, SITE_STORAGE_KEY } from '../utils/compatibility.js'
import { localStorageAdapter } from '../core/persistence/localStorageAdapter.js'
import { createPersistenceQueue } from '../core/persistence/persistenceQueue.js'
import { PERSISTENCE_STATUS } from '../core/persistence/persistenceStatus.js'
import { createSupabaseAdapter, isTransientPersistenceError } from '../core/persistence/supabaseAdapter.js'

const SAVE_DELAY = 700
const remotePersistence = createSupabaseAdapter(supabase)

export function useSiteStore() {
  const [site, setSite] = useState(readSiteCache)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState('')
  const [saveStatus, setSaveStatus] = useState(PERSISTENCE_STATUS.IDLE)
  const queueRef = useRef(null)

  const createQueue = useCallback(() => createPersistenceQueue({
    delay: SAVE_DELAY,
    save: (next) => remotePersistence.saveSiteConfig(next),
    isRetryable: isTransientPersistenceError,
    onStatus: (status) => {
      setSaveStatus(status)
      if (status === PERSISTENCE_STATUS.ERROR) setError('A alteração ficou local, mas ainda não foi salva no Supabase.')
      if (status === PERSISTENCE_STATUS.SAVED) setError('')
    },
  }), [])

  const ensureQueue = useCallback(() => {
    if (!supabase) return null
    if (!queueRef.current || queueRef.current.isDisposed()) queueRef.current = createQueue()
    return queueRef.current
  }, [createQueue])

  useEffect(() => {
    ensureQueue()
    return () => {
      queueRef.current?.dispose()
      queueRef.current = null
    }
  }, [ensureQueue])

  const writeCache = useCallback((next) => {
    const result = localStorageAdapter.writeJson(SITE_STORAGE_KEY, next)
    if (!result.ok) setError('A alteração está nesta sessão, mas não pôde ser armazenada neste navegador.')
    return result.ok
  }, [])

  const refresh = useCallback(async () => {
    if (!supabase) {
      setLoading(false)
      return
    }
    try {
      const data = await remotePersistence.loadSiteConfig()
      if (data) {
        const next = normalizeSiteConfig(data)
        setSite(next)
        writeCache(next)
      }
    } catch {
      setError('Não foi possível carregar as configurações online.')
    } finally {
      setLoading(false)
    }
  }, [writeCache])

  // A hidratação apenas lê e normaliza; ela não entra na fila de salvamento.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void refresh() }, [refresh])

  const queueOnlineSave = useCallback((next) => {
    void ensureQueue()?.enqueue(next)
  }, [ensureQueue])

  const updateSite = useCallback((changes) => {
    setSite((current) => {
      const next = { ...current, ...changes }
      writeCache(next)
      queueOnlineSave(next)
      return next
    })
  }, [queueOnlineSave, writeCache])

  const importSite = useCallback((next) => {
    const normalized = normalizeSiteConfig(validateSiteImport(next))
    setSite(normalized)
    writeCache(normalized)
    queueOnlineSave(normalized)
  }, [queueOnlineSave, writeCache])

  const resetSite = useCallback(() => {
    const next = normalizeSiteConfig()
    setSite(next)
    writeCache(next)
    queueOnlineSave(next)
  }, [queueOnlineSave, writeCache])

  const uploadResume = useCallback(async (file) => {
    const previousUrl = site.resumeUrl
    const url = await uploadPortfolioAsset(file, 'curriculo')
    updateSite({ resumeUrl: url })
    if (previousUrl && previousUrl !== url) void removePortfolioAsset(previousUrl).catch(() => undefined)
    return url
  }, [site.resumeUrl, updateSite])

  const uploadAsset = useCallback((file, folder = 'figurinhas') => uploadPortfolioAsset(file, folder), [])
  const removeAsset = useCallback((url) => removePortfolioAsset(url), [])

  return {
    site,
    loading,
    error,
    saveStatus,
    mode: isSupabaseConfigured ? 'supabase' : 'local',
    updateSite,
    importSite,
    resetSite,
    uploadResume,
    uploadAsset,
    removeAsset,
    refresh,
  }
}
