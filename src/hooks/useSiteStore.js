import { useCallback, useEffect, useState } from 'react'
import { siteConfig } from '../data/site'
import { isSupabaseConfigured, supabase, uploadPortfolioAsset } from '../lib/supabase'

const STORAGE_KEY = 'jd-portfolio-site-v1'

const readSite = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...siteConfig, ...JSON.parse(saved) } : { ...siteConfig }
  } catch {
    return { ...siteConfig }
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
      const next = { ...siteConfig, ...data.data }
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
    const normalized = { ...siteConfig, ...next }
    setSite(normalized)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
    void persistOnline(normalized)
  }, [persistOnline])

  const resetSite = useCallback(() => {
    const next = { ...siteConfig }
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
