import { useCallback, useEffect, useState } from 'react'
import { siteConfig } from '../data/site'
import { isSupabaseConfigured, supabase, uploadPortfolioAsset } from '../lib/supabase'

const STORAGE_KEY = 'jd-portfolio-site-v1'

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

  const persistOnline = useCallback(async (next) => {
    if (!supabase) return
    const { error: saveError } = await supabase.from('site_settings').upsert({
      id: 'main',
      data: next,
      updated_at: new Date().toISOString(),
    })
    setError(saveError ? 'A alteração ficou local, mas ainda não foi salva no Supabase.' : '')
  }, [])

  const updateSite = useCallback((changes) => {
    setSite((current) => {
      const next = { ...current, ...changes }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      void persistOnline(next)
      return next
    })
  }, [persistOnline])

  const importSite = useCallback((next) => {
    const normalized = normalizeSite(next)
    setSite(normalized)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
    void persistOnline(normalized)
  }, [persistOnline])

  const resetSite = useCallback(() => {
    const next = normalizeSite()
    setSite(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    void persistOnline(next)
  }, [persistOnline])

  const uploadResume = useCallback(async (file) => {
    const url = await uploadPortfolioAsset(file, 'curriculo')
    updateSite({ resumeUrl: url })
    return url
  }, [updateSite])

  return {
    site,
    loading,
    error,
    mode: isSupabaseConfigured ? 'supabase' : 'local',
    updateSite,
    importSite,
    resetSite,
    uploadResume,
    refresh,
  }
}
