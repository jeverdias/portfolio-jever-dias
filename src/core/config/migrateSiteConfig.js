import { siteClassifications, defaultSiteClassification } from '../../data/siteClassifications.js'
import { createDefaultSiteConfig } from './defaultSiteConfig.js'
import { CURRENT_SITE_SCHEMA_VERSION, getSiteSchemaVersion } from './configVersion.js'
import { cloneConfigValue, isPlainRecord, normalizeSiteShape } from './siteSchema.js'

const inferLegacyClassification = (value) => {
  const next = cloneConfigValue(value)
  if (!next.siteClassificationId && typeof next.siteClassification === 'string') {
    const match = siteClassifications.find((item) => item.classification === next.siteClassification)
    if (match) next.siteClassificationId = match.id
  }
  return next
}

const preserveLegacyMetricCounters = (value) => {
  const next = cloneConfigValue(value)
  if (!Array.isArray(next.metrics)) {
    const defaults = createDefaultSiteConfig().metrics
    next.metrics = defaults.map((metric) => metric.id === 'dashboards'
      ? { ...metric, value: typeof next.dashboardsCount === 'string' ? next.dashboardsCount : metric.value, label: typeof next.dashboardsLabel === 'string' ? next.dashboardsLabel : metric.label }
      : { ...metric, value: typeof next.systemsCount === 'string' ? next.systemsCount : metric.value, label: typeof next.systemsLabel === 'string' ? next.systemsLabel : metric.label })
  }
  return next
}

export const SITE_CONFIG_MIGRATIONS = Object.freeze([
  Object.freeze({ from: 0, to: 1, migrate: inferLegacyClassification }),
  Object.freeze({ from: 1, to: 2, migrate: preserveLegacyMetricCounters }),
])

export function applySiteConfigMigrations(value) {
  let current = isPlainRecord(value) ? cloneConfigValue(value) : {}
  let version = getSiteSchemaVersion(current)
  if (version > CURRENT_SITE_SCHEMA_VERSION) return current

  for (const migration of SITE_CONFIG_MIGRATIONS) {
    if (migration.from < version) continue
    if (migration.from !== version) break
    current = migration.migrate(current)
    version = migration.to
  }
  return current
}

export function migrateSiteConfig(value) {
  const migrated = applySiteConfigMigrations(value)
  return normalizeSiteShape(migrated, createDefaultSiteConfig(), siteClassifications, defaultSiteClassification)
}
