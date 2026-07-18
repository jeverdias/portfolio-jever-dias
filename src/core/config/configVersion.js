export const LEGACY_SITE_SCHEMA_VERSION = 0
export const CURRENT_SITE_SCHEMA_VERSION = 2

export const getSiteSchemaVersion = (value) => {
  const version = value && typeof value === 'object' ? value.schemaVersion : undefined
  return Number.isInteger(version) && version >= 0 ? version : LEGACY_SITE_SCHEMA_VERSION
}
