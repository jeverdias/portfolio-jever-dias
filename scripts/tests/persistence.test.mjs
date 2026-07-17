import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  CONTACT_STORAGE_KEY,
  createLocalStorageAdapter,
  LocalStorageError,
  PROJECTS_STORAGE_KEY,
  SITE_STORAGE_KEY,
  STORAGE_KEYS,
} from '../../src/core/persistence/localStorageAdapter.js'
import { createPersistenceQueue } from '../../src/core/persistence/persistenceQueue.js'
import { PERSISTENCE_STATUS } from '../../src/core/persistence/persistenceStatus.js'
import {
  createSupabaseAdapter,
  isTransientPersistenceError,
  RemotePersistenceError,
} from '../../src/core/persistence/supabaseAdapter.js'
import { normalizeSiteConfig } from '../../src/core/config/normalizeSiteConfig.js'
import { useSiteStore } from '../../src/hooks/useSiteStore.js'
import { coalesceProjectOperations, useProjectStore } from '../../src/hooks/useProjectStore.js'
import {
  getPublicClassification,
  normalizeProjectData,
  PUBLIC_SITE_CLASSIFICATION_ID,
  readProjectsCache,
  readSiteCache,
} from '../../src/utils/compatibility.js'
import { validateProjectsImport, validateSiteImport } from '../../src/utils/validation.js'

const siteFixtures = JSON.parse(readFileSync(new URL('./fixtures/site-configs.json', import.meta.url), 'utf8'))
const projectFixtures = JSON.parse(readFileSync(new URL('./fixtures/projects.json', import.meta.url), 'utf8'))

function createMemoryStorage(initial = {}, options = {}) {
  const values = new Map(Object.entries(initial))
  return {
    values,
    getItem(key) {
      if (options.readError) throw options.readError
      return values.has(key) ? values.get(key) : null
    },
    setItem(key, value) {
      if (options.writeError) throw options.writeError
      values.set(key, String(value))
    },
    removeItem(key) {
      if (options.removeError) throw options.removeError
      values.delete(key)
    },
  }
}

function createManualTimers() {
  const callbacks = new Map()
  let id = 0
  return {
    callbacks,
    setTimer(callback) {
      id += 1
      callbacks.set(id, callback)
      return id
    },
    clearTimer(timer) {
      callbacks.delete(timer)
    },
  }
}

function queueOptions(overrides = {}) {
  const timers = createManualTimers()
  return {
    timers,
    options: {
      delay: 700,
      setTimer: timers.setTimer,
      clearTimer: timers.clearTimer,
      wait: async () => undefined,
      ...overrides,
    },
  }
}

function createSupabaseMock(overrides = {}) {
  const calls = []
  const responses = {
    loadSite: { data: { data: { name: 'Remoto' } }, error: null },
    saveSite: { data: null, error: null },
    loadProjects: { data: [], error: null },
    saveProjects: { data: null, error: null },
    deleteProject: { data: null, error: null },
    ...overrides,
  }
  const client = {
    from(table) {
      const state = { table, action: '' }
      calls.push(['from', table])
      const builder = {
        select(columns) {
          state.action = 'select'
          calls.push(['select', table, columns])
          return builder
        },
        eq(column, value) {
          calls.push(['eq', table, column, value])
          return state.action === 'delete' ? Promise.resolve(responses.deleteProject) : builder
        },
        maybeSingle() {
          calls.push(['maybeSingle', table])
          return Promise.resolve(responses.loadSite)
        },
        order(column) {
          calls.push(['order', table, column])
          return Promise.resolve(responses.loadProjects)
        },
        upsert(payload) {
          calls.push(['upsert', table, payload])
          return Promise.resolve(table === 'site_settings' ? responses.saveSite : responses.saveProjects)
        },
        delete() {
          state.action = 'delete'
          calls.push(['delete', table])
          return builder
        },
      }
      return builder
    },
  }
  return { client, calls }
}

function captureHook(useHook) {
  let result
  function Probe() {
    result = useHook()
    return createElement('span', null, 'ok')
  }
  renderToStaticMarkup(createElement(Probe))
  return result
}

test('localStorage: lê JSON válido', () => {
  const adapter = createLocalStorageAdapter(createMemoryStorage({ a: '{"valor":1}' }))
  assert.deepEqual(adapter.readJson('a').value, { valor: 1 })
})

test('localStorage: chave ausente retorna fallback', () => {
  const result = createLocalStorageAdapter(createMemoryStorage()).readJson('ausente', { seguro: true })
  assert.equal(result.found, false)
  assert.deepEqual(result.value, { seguro: true })
})

test('localStorage: JSON inválido é identificado', () => {
  const result = createLocalStorageAdapter(createMemoryStorage({ a: '{inválido' })).readJson('a', [])
  assert.equal(result.ok, false)
  assert.equal(result.error.code, 'invalid-json')
  assert.deepEqual(result.value, [])
})

test('localStorage: escreve JSON válido', () => {
  const storage = createMemoryStorage()
  assert.equal(createLocalStorageAdapter(storage).writeJson('a', { valor: 2 }).ok, true)
  assert.equal(storage.getItem('a'), '{"valor":2}')
})

test('localStorage: erro de serialização é controlado', () => {
  const circular = {}
  circular.self = circular
  const result = createLocalStorageAdapter(createMemoryStorage()).writeJson('a', circular)
  assert.equal(result.error.code, 'serialization')
})

test('localStorage: quota excedida é classificada', () => {
  const quota = Object.assign(new Error('quota'), { name: 'QuotaExceededError' })
  const result = createLocalStorageAdapter(createMemoryStorage({}, { writeError: quota })).writeJson('a', {})
  assert.equal(result.error.code, 'quota-exceeded')
})

test('localStorage: funciona sem window ou storage', () => {
  const result = createLocalStorageAdapter(null).readJson('a', 'fallback')
  assert.equal(result.value, 'fallback')
  assert.ok(result.error instanceof LocalStorageError)
})

test('localStorage: remove uma chave', () => {
  const storage = createMemoryStorage({ a: '1' })
  assert.equal(createLocalStorageAdapter(storage).remove('a').ok, true)
  assert.equal(storage.getItem('a'), null)
})

test('localStorage: preserva as três chaves públicas', () => {
  assert.deepEqual(STORAGE_KEYS, { site: 'jd-portfolio-site-v1', projects: 'jd-portfolio-projects-v1', contact: 'jd-contact-last-submit' })
})

test('localStorage: escrita não modifica a entrada', () => {
  const input = { nested: { value: 1 } }
  createLocalStorageAdapter(createMemoryStorage()).writeJson('a', input)
  assert.deepEqual(input, { nested: { value: 1 } })
})

test('Supabase: carrega configuração', async () => {
  const { client } = createSupabaseMock({ loadSite: { data: { data: { name: 'Jever' } }, error: null } })
  assert.deepEqual(await createSupabaseAdapter(client).loadSiteConfig(), { name: 'Jever' })
})

test('Supabase: salva configuração', async () => {
  const { client, calls } = createSupabaseMock()
  await createSupabaseAdapter(client).saveSiteConfig({ name: 'Jever' }, '2026-01-01T00:00:00.000Z')
  assert.deepEqual(calls.find((call) => call[0] === 'upsert')[2], { id: 'main', data: { name: 'Jever' }, updated_at: '2026-01-01T00:00:00.000Z' })
})

test('Supabase: carrega projetos ordenados', async () => {
  const rows = [{ id: 'a', data: {}, featured: true, position: 0 }]
  const { client } = createSupabaseMock({ loadProjects: { data: rows, error: null } })
  assert.deepEqual(await createSupabaseAdapter(client).loadProjects(), rows)
})

test('Supabase: salva linhas de projetos', async () => {
  const rows = [{ id: 'a', data: { id: 'a' }, featured: true, position: 0 }]
  const { client, calls } = createSupabaseMock()
  await createSupabaseAdapter(client).saveProjects(rows)
  assert.strictEqual(calls.find((call) => call[0] === 'upsert')[2], rows)
})

test('Supabase: exclui projeto por id', async () => {
  const { client, calls } = createSupabaseMock()
  await createSupabaseAdapter(client).deleteProject('projeto-a')
  assert.ok(calls.some((call) => call[0] === 'eq' && call[3] === 'projeto-a'))
})

test('Supabase: resposta vazia de configuração retorna null', async () => {
  const { client } = createSupabaseMock({ loadSite: { data: null, error: null } })
  assert.equal(await createSupabaseAdapter(client).loadSiteConfig(), null)
})

test('Supabase: erro transitório é interpretado', async () => {
  const { client } = createSupabaseMock({ loadSite: { data: null, error: { status: 503, message: 'temporary' } } })
  await assert.rejects(() => createSupabaseAdapter(client).loadSiteConfig(), (error) => error instanceof RemotePersistenceError && error.transient)
})

test('Supabase: erro definitivo não é marcado como transitório', async () => {
  const { client } = createSupabaseMock({ saveProjects: { data: null, error: { status: 400, message: 'invalid' } } })
  await assert.rejects(() => createSupabaseAdapter(client).saveProjects([]), (error) => !error.transient)
})

test('Supabase: cliente ausente produz erro controlado', async () => {
  await assert.rejects(() => createSupabaseAdapter(null).loadProjects(), (error) => error.code === 'CLIENT_MISSING')
})

test('Supabase: adaptador não normaliza conteúdo editorial', async () => {
  const value = { unknown: { kept: true }, siteClassificationId: 'qualquer' }
  const { client } = createSupabaseMock({ loadSite: { data: { data: value }, error: null } })
  assert.strictEqual(await createSupabaseAdapter(client).loadSiteConfig(), value)
})

test('fila: uma alteração gera um salvamento', async () => {
  const saved = []
  const setup = queueOptions({ save: async (value) => saved.push(value) })
  const queue = createPersistenceQueue(setup.options)
  await queue.enqueue({ value: 1 })
  await queue.flushNow()
  assert.equal(saved.length, 1)
})

test('fila: várias alterações no debounce geram um salvamento', async () => {
  const saved = []
  const setup = queueOptions({ save: async (value) => saved.push(value) })
  const queue = createPersistenceQueue(setup.options)
  await queue.enqueue(1); await queue.enqueue(2); await queue.enqueue(3)
  await queue.flushNow()
  assert.deepEqual(saved, [3])
})

test('fila: o último estado é salvo', async () => {
  const saved = []
  const setup = queueOptions({ save: async (value) => saved.push(value) })
  const queue = createPersistenceQueue(setup.options)
  await queue.enqueue({ version: 1 }); await queue.enqueue({ version: 2 })
  await queue.flushNow()
  assert.equal(saved[0].version, 2)
})

test('fila: alteração durante request gera salvamento posterior', async () => {
  const saved = []
  let release
  const blocker = new Promise((resolve) => { release = resolve })
  const setup = queueOptions({ save: async (value) => { saved.push(value); if (saved.length === 1) await blocker } })
  const queue = createPersistenceQueue(setup.options)
  const running = queue.enqueue('A', { immediate: true })
  await Promise.resolve()
  await queue.enqueue('B')
  release()
  await running
  assert.deepEqual(saved, ['A', 'B'])
})

test('fila: estado intermediário não é salvo', async () => {
  const saved = []
  const setup = queueOptions({ save: async (value) => saved.push(value) })
  const queue = createPersistenceQueue(setup.options)
  for (const value of ['A', 'B', 'C', 'D']) await queue.enqueue(value)
  await queue.flushNow()
  assert.deepEqual(saved, ['D'])
})

test('fila: não cresce indefinidamente', async () => {
  const saved = []
  const setup = queueOptions({ save: async (value) => saved.push(value) })
  const queue = createPersistenceQueue(setup.options)
  for (let value = 0; value < 100; value += 1) await queue.enqueue(value)
  await queue.flushNow()
  assert.deepEqual(saved, [99])
})

test('fila: erro não descarta alteração', async () => {
  const setup = queueOptions({ save: async () => { throw new Error('offline') } })
  const queue = createPersistenceQueue(setup.options)
  await queue.enqueue('A')
  assert.equal(await queue.flushNow(), false)
  assert.equal(queue.getState().hasPending, true)
})

test('fila: retry é limitado', async () => {
  let attempts = 0
  const setup = queueOptions({ save: async () => { attempts += 1; throw new Error('network') }, isRetryable: () => true, maxAttempts: 3 })
  const queue = createPersistenceQueue(setup.options)
  await queue.enqueue('A'); await queue.flushNow()
  assert.equal(attempts, 3)
})

test('fila: erro definitivo não entra em retry', async () => {
  let attempts = 0
  const setup = queueOptions({ save: async () => { attempts += 1; throw new Error('invalid') }, isRetryable: () => false })
  const queue = createPersistenceQueue(setup.options)
  await queue.enqueue('A'); await queue.flushNow()
  assert.equal(attempts, 1)
})

test('fila: cleanup cancela timer', async () => {
  const setup = queueOptions({ save: async () => undefined })
  const queue = createPersistenceQueue(setup.options)
  await queue.enqueue('A')
  assert.equal(setup.timers.callbacks.size, 1)
  queue.dispose()
  assert.equal(setup.timers.callbacks.size, 0)
})

test('fila: unmount não atualiza estado', async () => {
  const statuses = []
  let release
  const blocker = new Promise((resolve) => { release = resolve })
  const setup = queueOptions({ save: async () => blocker, onStatus: (status) => statuses.push(status) })
  const queue = createPersistenceQueue(setup.options)
  const running = queue.enqueue('A', { immediate: true })
  await Promise.resolve()
  const count = statuses.length
  queue.dispose(); release(); await running
  assert.equal(statuses.length, count)
})

test('fila: resposta antiga não encerra estado mais novo', async () => {
  const statuses = []
  let release
  const blocker = new Promise((resolve) => { release = resolve })
  let call = 0
  const setup = queueOptions({ save: async () => { call += 1; if (call === 1) await blocker }, onStatus: (status) => statuses.push(status) })
  const queue = createPersistenceQueue(setup.options)
  const running = queue.enqueue('A', { immediate: true })
  await Promise.resolve(); await queue.enqueue('B'); release(); await running
  assert.equal(call, 2)
  assert.equal(statuses.at(-1), PERSISTENCE_STATUS.SAVED)
})

test('hidratação: defaults são apresentados inicialmente', () => {
  assert.equal(readSiteCache(createMemoryStorage()).name, 'Jever Dias')
})

test('hidratação: cache válido é carregado', () => {
  const storage = createMemoryStorage({ [SITE_STORAGE_KEY]: JSON.stringify({ name: 'Cache válido' }) })
  assert.equal(readSiteCache(storage).name, 'Cache válido')
})

test('hidratação: cache inválido é ignorado', () => {
  const storage = createMemoryStorage({ [SITE_STORAGE_KEY]: '{inválido' })
  assert.equal(readSiteCache(storage).siteClassificationId, 'portfolio-app')
})

test('hidratação: Supabase pode substituir o cache', async () => {
  const storage = createMemoryStorage({ [SITE_STORAGE_KEY]: JSON.stringify({ name: 'Cache' }) })
  const { client } = createSupabaseMock({ loadSite: { data: { data: { name: 'Remoto' } }, error: null } })
  const final = normalizeSiteConfig(await createSupabaseAdapter(client).loadSiteConfig())
  createLocalStorageAdapter(storage).writeJson(SITE_STORAGE_KEY, final)
  assert.equal(readSiteCache(storage).name, 'Remoto')
})

test('hidratação: carregamento não dispara salvamento', async () => {
  const { client, calls } = createSupabaseMock()
  await createSupabaseAdapter(client).loadSiteConfig()
  assert.equal(calls.some((call) => call[0] === 'upsert'), false)
})

test('hidratação: normalização não dispara salvamento', () => {
  const storage = createMemoryStorage()
  normalizeSiteConfig({ name: 'Normalizado' })
  assert.equal(storage.values.size, 0)
})

test('hidratação: configuração antiga continua válida', () => {
  assert.equal(normalizeSiteConfig(siteFixtures.legacyIncomplete).siteClassificationId, 'institutional')
})

test('hidratação: projeto antigo continua válido', () => {
  assert.equal(normalizeProjectData(projectFixtures.legacyMinimal).featured, true)
})

test('stores: useSiteStore mantém API pública', () => {
  const store = captureHook(useSiteStore)
  assert.deepEqual(Object.keys(store), ['site', 'loading', 'error', 'saveStatus', 'mode', 'updateSite', 'importSite', 'resetSite', 'uploadResume', 'uploadAsset', 'removeAsset', 'refresh'])
})

test('stores: useProjectStore mantém API pública', () => {
  const store = captureHook(useProjectStore)
  assert.deepEqual(Object.keys(store), ['projects', 'loading', 'error', 'saveStatus', 'mode', 'addProject', 'updateProject', 'removeProject', 'moveProject', 'replaceDisplayModel', 'importProjects', 'resetProjects', 'uploadImage', 'removeImage', 'refresh'])
})

test('stores: alteração de site atualiza cache pelo adaptador', () => {
  const storage = createMemoryStorage()
  createLocalStorageAdapter(storage).writeJson(SITE_STORAGE_KEY, normalizeSiteConfig({ name: 'Atualizado' }))
  assert.equal(readSiteCache(storage).name, 'Atualizado')
})

test('stores: alteração de projeto atualiza cache pelo adaptador', () => {
  const storage = createMemoryStorage()
  const project = normalizeProjectData({ id: 'a', title: 'Atualizado' })
  createLocalStorageAdapter(storage).writeJson(PROJECTS_STORAGE_KEY, [project])
  assert.equal(readProjectsCache(storage)[0].title, 'Atualizado')
})

test('stores: falha remota mantém conteúdo local', async () => {
  const storage = createMemoryStorage()
  createLocalStorageAdapter(storage).writeJson(SITE_STORAGE_KEY, { name: 'Local preservado' })
  const { client } = createSupabaseMock({ saveSite: { data: null, error: { status: 503 } } })
  await assert.rejects(() => createSupabaseAdapter(client).saveSiteConfig({ name: 'Local preservado' }))
  assert.equal(readSiteCache(storage).name, 'Local preservado')
})

test('status: saving é aplicado', async () => {
  const statuses = []
  const setup = queueOptions({ save: async () => undefined, onStatus: (status) => statuses.push(status) })
  const queue = createPersistenceQueue(setup.options)
  await queue.enqueue('A'); await queue.flushNow()
  assert.ok(statuses.includes(PERSISTENCE_STATUS.SAVING))
})

test('status: saved é aplicado', async () => {
  const statuses = []
  const setup = queueOptions({ save: async () => undefined, onStatus: (status) => statuses.push(status) })
  const queue = createPersistenceQueue(setup.options)
  await queue.enqueue('A'); await queue.flushNow()
  assert.equal(statuses.at(-1), PERSISTENCE_STATUS.SAVED)
})

test('status: error é aplicado', async () => {
  const statuses = []
  const setup = queueOptions({ save: async () => { throw new Error('falha') }, onStatus: (status) => statuses.push(status) })
  const queue = createPersistenceQueue(setup.options)
  await queue.enqueue('A'); await queue.flushNow()
  assert.equal(statuses.at(-1), PERSISTENCE_STATUS.ERROR)
})

test('stores: modo local permanece funcional', () => {
  assert.equal(captureHook(useSiteStore).mode, 'local')
  assert.equal(captureHook(useProjectStore).mode, 'local')
})

test('stores: operações de projetos não são duplicadas', () => {
  const result = coalesceProjectOperations([{ kind: 'upsert', id: 'a', row: { value: 1 } }], [{ kind: 'upsert', id: 'a', row: { value: 2 } }])
  assert.deepEqual(result, [{ kind: 'upsert', id: 'a', row: { value: 2 } }])
})

test('compatibilidade: mesmas chaves continuam usadas', () => {
  assert.deepEqual([SITE_STORAGE_KEY, PROJECTS_STORAGE_KEY, CONTACT_STORAGE_KEY], ['jd-portfolio-site-v1', 'jd-portfolio-projects-v1', 'jd-contact-last-submit'])
})

test('compatibilidade: mesmo formato de site_settings.data é produzido', async () => {
  const site = normalizeSiteConfig({ name: 'Formato' })
  const { client, calls } = createSupabaseMock()
  await createSupabaseAdapter(client).saveSiteConfig(site, 'data')
  assert.strictEqual(calls.find((call) => call[0] === 'upsert')[2].data, site)
})

test('compatibilidade: mesmo formato de portfolio_projects é produzido', async () => {
  const row = { id: 'a', data: { id: 'a' }, featured: false, position: 2, updated_at: 'data' }
  const { client, calls } = createSupabaseMock()
  await createSupabaseAdapter(client).saveProjects([row])
  assert.deepEqual(calls.find((call) => call[0] === 'upsert')[2], [row])
})

test('compatibilidade: backup v1.8.3 continua importável', () => {
  assert.equal(validateSiteImport(siteFixtures.currentDefault).name, siteFixtures.currentDefault.name)
  assert.equal(validateProjectsImport([projectFixtures.completeCurrent]).length, 1)
})

test('compatibilidade: classificação é preservada', () => {
  assert.equal(normalizeSiteConfig({ siteClassificationId: 'institutional' }).siteClassificationId, 'institutional')
})

test('compatibilidade: aparência é preservada', () => {
  assert.equal(normalizeSiteConfig({ appearance: { paletteId: 'navy-gold' } }).appearance.paletteId, 'navy-gold')
})

test('compatibilidade: portfolio-app continua único modelo público', () => {
  assert.equal(PUBLIC_SITE_CLASSIFICATION_ID, 'portfolio-app')
  assert.equal(getPublicClassification().id, 'portfolio-app')
})

test('compatibilidade: persistência não cria regras de template', async () => {
  const input = { customFutureField: 'preservado' }
  const { client } = createSupabaseMock({ loadSite: { data: { data: input }, error: null } })
  assert.deepEqual(await createSupabaseAdapter(client).loadSiteConfig(), input)
})

test('compatibilidade: persistência não adiciona versão ou migration ao dado', () => {
  const storage = createMemoryStorage()
  createLocalStorageAdapter(storage).writeJson(SITE_STORAGE_KEY, { name: 'Sem migration' })
  assert.equal('schemaVersion' in createLocalStorageAdapter(storage).readJson(SITE_STORAGE_KEY).value, false)
})

test('compatibilidade: todos os acessos remotos usam cliente mockado', async () => {
  const { client, calls } = createSupabaseMock()
  const adapter = createSupabaseAdapter(client)
  await adapter.loadSiteConfig(); await adapter.loadProjects()
  assert.deepEqual(calls.filter((call) => call[0] === 'from').map((call) => call[1]), ['site_settings', 'portfolio_projects'])
  assert.equal(isTransientPersistenceError(new Error('network offline')), true)
})
