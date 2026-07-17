import { useCallback, useEffect, useRef, useState } from 'react'
import { isSupabaseConfigured, removePortfolioAsset, supabase, uploadPortfolioAsset } from '../lib/supabase'
import { validateSiteImport } from '../utils/validation'
import { normalizeSiteConfig, readSiteCache, SITE_STORAGE_KEY } from '../utils/compatibility'

const SAVE_DELAY = 700

export function useSiteStore() {
  const [site, setSite] = useState(readSiteCache)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState('')
  const [saveStatus, setSaveStatus] = useState('idle')
  const saveTimerRef = useRef(null)
  const saveSequenceRef = useRef(0)

  const refresh = useCallback(async () => {
    if (!supabase) return
    const { data, error: loadError } = await supabase.from('site_settings').select('data').eq('id', 'main').maybeSingle()
    if (loadError) setError('Não foi possível carregar as configurações online.')
    if (data?.data) {
      const next = normalizeSiteConfig(data.data)
      setSite(next)
      localStorage.setItem(SITE_STORAGE_KEY, JSON.stringify(next))
    }
    setLoading(false)
  }, [])

  // A leitura é assíncrona; não há atualização síncrona de estado dentro do efeito.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void refresh() }, [refresh])

  const persistOnline = useCallback(async (next, sequence) => {
    if (!supabase) return true
    setSaveStatus('saving')
    let saveError = null
    for (let attempt = 0; attempt < 3; attempt += 1) {
      if (sequence !== saveSequenceRef.current) return false
      const response = await supabase.from('site_settings').upsert({
        id: 'main',
        data: next,
        updated_at: new Date().toISOString(),
      })
      saveError = response.error
      if (!saveError) break
      if (attempt < 2) await new Promise((resolve) => window.setTimeout(resolve, 2000 * (attempt + 1)))
    }
    if (sequence !== saveSequenceRef.current) return !saveError
    setError(saveError ? 'A alteração ficou local, mas ainda não foi salva no Supabase.' : '')
    setSaveStatus(saveError ? 'error' : 'saved')
    return !saveError
  }, [])

  const queueOnlineSave = useCallback((next) => {
    if (!supabase) return
    const sequence = ++saveSequenceRef.current
    window.clearTimeout(saveTimerRef.current)
    setSaveStatus('pending')
    saveTimerRef.current = window.setTimeout(() => { void persistOnline(next, sequence) }, SAVE_DELAY)
  }, [persistOnline])

  useEffect(() => () => window.clearTimeout(saveTimerRef.current), [])

  const updateSite = useCallback((changes) => {
    setSite((current) => {
      const next = { ...current, ...changes }
      localStorage.setItem(SITE_STORAGE_KEY, JSON.stringify(next))
      queueOnlineSave(next)
      return next
    })
  }, [queueOnlineSave])

  const importSite = useCallback((next) => {
    const normalized = normalizeSiteConfig(validateSiteImport(next))
    setSite(normalized)
    localStorage.setItem(SITE_STORAGE_KEY, JSON.stringify(normalized))
    queueOnlineSave(normalized)
  }, [queueOnlineSave])

  const resetSite = useCallback(() => {
    const next = normalizeSiteConfig()
    setSite(next)
    localStorage.setItem(SITE_STORAGE_KEY, JSON.stringify(next))
    queueOnlineSave(next)
  }, [queueOnlineSave])

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
