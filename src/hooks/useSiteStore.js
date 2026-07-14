import { useCallback, useState } from 'react'
import { siteConfig } from '../data/site'

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

  const updateSite = useCallback((changes) => {
    setSite((current) => {
      const next = { ...current, ...changes }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const importSite = useCallback((next) => {
    const normalized = { ...siteConfig, ...next }
    setSite(normalized)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
  }, [])

  const resetSite = useCallback(() => {
    const next = { ...siteConfig }
    setSite(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  return { site, updateSite, importSite, resetSite }
}
