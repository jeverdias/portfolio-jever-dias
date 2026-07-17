export const ADMIN_BACKUP_FORMAT_VERSION = 2

export function createAdminBackup(site, projects, exportedAt = new Date().toISOString()) {
  return { version: ADMIN_BACKUP_FORMAT_VERSION, exportedAt, site, projects }
}

export function parseAdminBackup(value) {
  const parsed = typeof value === 'string' ? JSON.parse(value) : value
  if (Array.isArray(parsed)) return { site: null, projects: parsed }
  if (!parsed || typeof parsed !== 'object' || (!parsed.site && !Array.isArray(parsed.projects))) {
    throw new Error('Arquivo de backup inválido.')
  }
  return { site: parsed.site || null, projects: parsed.projects || null }
}

export function downloadAdminBackup(payload, documentRef = document, urlApi = URL) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = urlApi.createObjectURL(blob)
  const link = documentRef.createElement('a')
  link.href = url
  link.download = `portfolio-jever-backup-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  urlApi.revokeObjectURL(url)
}
