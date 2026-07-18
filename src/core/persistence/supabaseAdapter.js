export class RemotePersistenceError extends Error {
  constructor(message, { operation, transient = false, status = null, code = '', cause } = {}) {
    super(message || 'Falha na persistência remota.')
    this.name = 'RemotePersistenceError'
    this.operation = operation
    this.transient = transient
    this.status = status
    this.code = code
    this.cause = cause
  }
}

const transientCodes = new Set(['408', '409', '425', '429', '500', '502', '503', '504', '57014', 'PGRST001', 'PGRST002', 'PGRST003'])

export const isTransientPersistenceError = (error) => {
  if (error?.transient === true) return true
  const status = Number(error?.status || error?.statusCode || 0)
  const code = String(error?.code || '')
  const message = String(error?.message || '')
  return status === 408
    || status === 409
    || status === 425
    || status === 429
    || status >= 500
    || transientCodes.has(code)
    || /network|fetch|timeout|temporar|connection|offline/i.test(message)
}

const toRemoteError = (error, operation) => new RemotePersistenceError(
  'Não foi possível concluir a sincronização com o Supabase.',
  {
    operation,
    transient: isTransientPersistenceError(error),
    status: error?.status || error?.statusCode || null,
    code: String(error?.code || ''),
    cause: error,
  },
)

const ensureClient = (client, operation) => {
  if (!client || typeof client.from !== 'function') {
    throw new RemotePersistenceError('Cliente Supabase não configurado.', { operation, transient: false, code: 'CLIENT_MISSING' })
  }
  return client
}

const unwrap = (response, operation) => {
  if (response?.error) throw toRemoteError(response.error, operation)
  return response?.data ?? null
}

export function createSupabaseAdapter(client) {
  const loadSiteConfig = async () => {
    const configured = ensureClient(client, 'load-site')
    const response = await configured.from('site_settings').select('data').eq('id', 'main').maybeSingle()
    return unwrap(response, 'load-site')?.data ?? null
  }

  const saveSiteConfig = async (data, updatedAt = new Date().toISOString()) => {
    const configured = ensureClient(client, 'save-site')
    const response = await configured.from('site_settings').upsert({ id: 'main', data, updated_at: updatedAt })
    unwrap(response, 'save-site')
    return true
  }

  const loadProjects = async () => {
    const configured = ensureClient(client, 'load-projects')
    const response = await configured.from('portfolio_projects').select('id, data, featured, position').order('position')
    return unwrap(response, 'load-projects') || []
  }

  const saveProjects = async (rows) => {
    const configured = ensureClient(client, 'save-projects')
    const response = await configured.from('portfolio_projects').upsert(rows)
    unwrap(response, 'save-projects')
    return true
  }

  const deleteProject = async (id) => {
    const configured = ensureClient(client, 'delete-project')
    const response = await configured.from('portfolio_projects').delete().eq('id', id)
    unwrap(response, 'delete-project')
    return true
  }

  return Object.freeze({ loadSiteConfig, saveSiteConfig, loadProjects, saveProjects, deleteProject })
}
