import { useCallback, useEffect, useRef, useState } from 'react'
import { siteConfig } from '../data/site'
import { isSupabaseConfigured, removePortfolioAsset, supabase, uploadPortfolioAsset } from '../lib/supabase'
import { validateSiteImport } from '../utils/validation'

const STORAGE_KEY = 'jd-portfolio-site-v1'
const SAVE_DELAY = 700

const normalizeDisplayModels = (models) => {
  const saved = Array.isArray(models) ? models : []
  const builtInIds = new Set(siteConfig.displayModels.map((model) => model.id))
  const custom = saved.filter((model) => !builtInIds.has(model.id) && model.builtIn !== true)
  return [...siteConfig.displayModels, ...custom]
}

const normalizeSite = (value = {}) => {
  const restoreOriginalLayout = value.classificationLayoutVersion !== siteConfig.classificationLayoutVersion
  return {
  ...siteConfig,
  ...value,
  classificationLayoutVersion: siteConfig.classificationLayoutVersion,
  siteClassificationId: restoreOriginalLayout ? siteConfig.siteClassificationId : (value.siteClassificationId || siteConfig.siteClassificationId),
  siteClassification: restoreOriginalLayout ? siteConfig.siteClassification : (value.siteClassification || siteConfig.siteClassification),
  siteClassificationDescription: restoreOriginalLayout ? siteConfig.siteClassificationDescription : (value.siteClassificationDescription || siteConfig.siteClassificationDescription),
  techItems: Array.isArray(value.techItems) && value.techItems.length
    ? value.techItems
    : siteConfig.techItems,
  metrics: Array.isArray(value.metrics) && value.metrics.length ? value.metrics : siteConfig.metrics,
  stickerLibrary: Array.isArray(value.stickerLibrary) ? value.stickerLibrary : siteConfig.stickerLibrary,
  displayModels: normalizeDisplayModels(value.displayModels),
  specialties: Array.isArray(value.specialties) && value.specialties.length ? value.specialties : siteConfig.specialties,
  sectionVisibility: { ...siteConfig.sectionVisibility, ...(value.sectionVisibility || {}) },
  appearance: { ...siteConfig.appearance, ...(value.appearance || {}) },
}}

const readSite = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? normalizeSite(JSON.parse(saved)) : normalizeSite()
  } catch {
    return normalizeSite()
  }
}

export function useSiteStore() {
  const [site, setSite] = useState(readSite)
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
      const next = normalizeSite(data.data)
      setSite(next)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      queueOnlineSave(next)
      return next
    })
  }, [queueOnlineSave])

  const importSite = useCallback((next) => {
    const normalized = normalizeSite(validateSiteImport(next))
    setSite(normalized)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
    queueOnlineSave(normalized)
  }, [queueOnlineSave])

  const resetSite = useCallback(() => {
    const next = normalizeSite()
    setSite(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
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
