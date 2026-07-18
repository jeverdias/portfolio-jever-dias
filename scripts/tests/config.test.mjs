import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import {
  createDefaultSiteConfig,
  defaultSiteConfig,
} from '../../src/core/config/defaultSiteConfig.js'
import {
  CURRENT_SITE_SCHEMA_VERSION,
  getSiteSchemaVersion,
  LEGACY_SITE_SCHEMA_VERSION,
} from '../../src/core/config/configVersion.js'
import {
  applySiteConfigMigrations,
  migrateSiteConfig,
  SITE_CONFIG_MIGRATIONS,
} from '../../src/core/config/migrateSiteConfig.js'
import { normalizeSiteConfig } from '../../src/core/config/normalizeSiteConfig.js'
import {
  cloneConfigValue,
  SITE_ARRAY_POLICIES,
  SITE_CONFIG_SCHEMA,
  validateSiteConfigShape,
} from '../../src/core/config/siteSchema.js'
import { siteConfig } from '../../src/data/site.js'
import {
  CONTACT_STORAGE_KEY,
  getPublicClassification,
  PROJECTS_STORAGE_KEY,
  PUBLIC_SITE_CLASSIFICATION_ID,
  readSiteCache,
  SITE_STORAGE_KEY,
} from '../../src/utils/compatibility.js'
import { validateSiteImport } from '../../src/utils/validation.js'

const fixture = (name) => JSON.parse(readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8'))
const sites = fixture('site-configs.json')

const createStorage = (initial = {}) => {
  const values = new Map(Object.entries(initial))
  return {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    snapshot: () => Object.fromEntries(values),
  }
}

test('schema documenta todos os grupos conceituais atuais', () => {
  for (const group of ['identity', 'navigation', 'hero', 'contacts', 'socialNetworks', 'appearance', 'classification', 'visibility', 'specialties', 'technologies', 'credibility', 'trajectory', 'resume', 'library', 'projectSettings']) {
    assert.ok(Array.isArray(SITE_CONFIG_SCHEMA[group]), `Grupo ausente: ${group}`)
  }
})

test('validador conceitual aceita objeto e informa campos desconhecidos', () => {
  const result = validateSiteConfigShape({ name: 'Exemplo', futureField: true })
  assert.equal(result.valid, true)
  assert.deepEqual(result.unknownFields, ['futureField'])
})

test('validador conceitual relata tipos estruturais incorretos', () => {
  const result = validateSiteConfigShape({ metrics: 'inválido', appearance: [], siteClassificationId: 42 })
  assert.equal(result.valid, false)
  assert.equal(result.issues.length, 3)
})

test('normaliza undefined', () => {
  assert.equal(normalizeSiteConfig(undefined).name, defaultSiteConfig.name)
})

test('normaliza null', () => {
  assert.equal(normalizeSiteConfig(null).name, defaultSiteConfig.name)
})

test('normaliza objeto vazio', () => {
  assert.deepEqual(normalizeSiteConfig({}), createDefaultSiteConfig())
})

test('preserva uma configuração completa', () => {
  const normalized = normalizeSiteConfig(sites.currentDefault)
  assert.equal(normalized.name, sites.currentDefault.name)
  assert.equal(normalized.appearance.paletteId, sites.currentDefault.appearance.paletteId)
})

test('aceita configuração antiga e preserva classificação válida', () => {
  const normalized = normalizeSiteConfig(sites.legacyIncomplete)
  assert.equal(normalized.siteClassificationId, 'institutional')
  assert.equal(normalized.metrics[0].id, 'legado-1')
})

test('configuração incompleta recebe somente os padrões ausentes', () => {
  const normalized = normalizeSiteConfig({ name: 'Nome mantido' })
  assert.equal(normalized.name, 'Nome mantido')
  assert.equal(normalized.role, defaultSiteConfig.role)
})

test('tipos incorretos em campos conhecidos usam fallback seguro', () => {
  const normalized = normalizeSiteConfig({ name: ['inválido'], appearance: 'inválida', sectionVisibility: [], metrics: 'inválidas' })
  assert.equal(normalized.name, defaultSiteConfig.name)
  assert.deepEqual(normalized.appearance, defaultSiteConfig.appearance)
  assert.deepEqual(normalized.sectionVisibility, defaultSiteConfig.sectionVisibility)
  assert.deepEqual(normalized.metrics, defaultSiteConfig.metrics)
})

test('campos desconhecidos são preservados e clonados', () => {
  const input = { futureField: { values: [1, 2] } }
  const normalized = normalizeSiteConfig(input)
  assert.deepEqual(normalized.futureField, input.futureField)
  assert.notStrictEqual(normalized.futureField, input.futureField)
  assert.notStrictEqual(normalized.futureField.values, input.futureField.values)
})

test('objetos aninhados parciais completam apenas campos ausentes', () => {
  const normalized = normalizeSiteConfig({ appearance: { paletteId: 'ocean-cyan' }, sectionVisibility: { contact: false } })
  assert.equal(normalized.appearance.paletteId, 'ocean-cyan')
  assert.equal(normalized.appearance.designId, defaultSiteConfig.appearance.designId)
  assert.equal(normalized.sectionVisibility.contact, false)
  assert.equal(normalized.sectionVisibility.hero, true)
})

test('array vazio intencional da biblioteca permanece vazio', () => {
  assert.equal(SITE_ARRAY_POLICIES.stickerLibrary, 'preserve-empty')
  assert.deepEqual(normalizeSiteConfig({ stickerLibrary: [] }).stickerLibrary, [])
})

test('arrays estruturais vazios mantêm a política anterior de defaults', () => {
  const normalized = normalizeSiteConfig({ metrics: [], techItems: [], specialties: [] })
  assert.deepEqual(normalized.metrics, defaultSiteConfig.metrics)
  assert.deepEqual(normalized.techItems, defaultSiteConfig.techItems)
  assert.deepEqual(normalized.specialties, defaultSiteConfig.specialties)
})

test('arrays inválidos e itens sem id não derrubam a aplicação', () => {
  const normalized = normalizeSiteConfig({ metrics: [null, { value: 'sem id' }], stickerLibrary: [null] })
  assert.deepEqual(normalized.metrics, defaultSiteConfig.metrics)
  assert.deepEqual(normalized.stickerLibrary, [])
})

test('modelos internos permanecem e modelo personalizado válido é acrescentado', () => {
  const normalized = normalizeSiteConfig({ displayModels: [{ id: 'custom', name: 'Custom', behavior: 'website', builtIn: false }] })
  assert.ok(normalized.displayModels.some((model) => model.id === 'powerbi' && model.builtIn))
  assert.ok(normalized.displayModels.some((model) => model.id === 'custom'))
})

test('contatos opcionais vazios continuam opcionais', () => {
  const normalized = normalizeSiteConfig({ emailSecondary: '', whatsapp: '', lattes: '' })
  assert.equal(normalized.emailSecondary, '')
  assert.equal(normalized.whatsapp, '')
  assert.equal(normalized.lattes, '')
})

test('aparência ausente usa o padrão canônico', () => {
  assert.deepEqual(normalizeSiteConfig(sites.withoutAppearance).appearance, defaultSiteConfig.appearance)
})

test('aparência parcial preserva valores válidos e completa o restante', () => {
  const normalized = normalizeSiteConfig({ appearance: { fontId: 'inter' } })
  assert.equal(normalized.appearance.fontId, 'inter')
  assert.equal(normalized.appearance.paletteId, defaultSiteConfig.appearance.paletteId)
})

test('classificação ausente usa portfolio-app', () => {
  assert.equal(normalizeSiteConfig(sites.withoutClassification).siteClassificationId, 'portfolio-app')
})

test('classificação válida e seus textos são preservados', () => {
  const normalized = normalizeSiteConfig({ siteClassificationId: 'institutional', siteClassification: 'Rótulo preservado', siteClassificationDescription: 'Descrição preservada' })
  assert.equal(normalized.siteClassificationId, 'institutional')
  assert.equal(normalized.siteClassification, 'Rótulo preservado')
  assert.equal(normalized.siteClassificationDescription, 'Descrição preservada')
})

test('classificação inválida recebe fallback completo do portfólio', () => {
  const normalized = normalizeSiteConfig(sites.invalidClassification)
  assert.equal(normalized.siteClassificationId, 'portfolio-app')
  assert.equal(normalized.siteClassification, 'Portfolio Website')
})

test('visibilidade parcial preserva todas as demais seções', () => {
  const normalized = normalizeSiteConfig({ sectionVisibility: { resume: false } })
  assert.equal(normalized.sectionVisibility.resume, false)
  assert.equal(normalized.sectionVisibility.projects, true)
})

test('ids de coleções são preservados', () => {
  const normalized = normalizeSiteConfig(sites.currentDefault)
  assert.equal(normalized.metrics[0].id, 'entregas')
  assert.equal(normalized.techItems[0].id, 'ferramenta-exemplo')
  assert.equal(normalized.specialties[0].id, 'especialidade-exemplo')
})

test('URLs válidas são preservadas sem transformação', () => {
  const input = { linkedin: 'https://example.com/perfil', resumeUrl: 'https://example.com/curriculo.pdf', lattes: 'https://example.com/lattes' }
  const normalized = normalizeSiteConfig(input)
  assert.equal(normalized.linkedin, input.linkedin)
  assert.equal(normalized.resumeUrl, input.resumeUrl)
  assert.equal(normalized.lattes, input.lattes)
})

test('normalização não modifica o objeto de entrada', () => {
  const input = cloneConfigValue(sites.currentDefault)
  const before = structuredClone(input)
  normalizeSiteConfig(input)
  assert.deepEqual(input, before)
})

test('alterar resultado não modifica os defaults canônicos', () => {
  const normalized = normalizeSiteConfig()
  normalized.metrics[0].value = 'alterado'
  normalized.appearance.paletteId = 'alterada'
  assert.equal(defaultSiteConfig.metrics[0].value, '+12')
  assert.equal(defaultSiteConfig.appearance.paletteId, 'jd-original')
})

test('duas normalizações não compartilham referências mutáveis', () => {
  const first = normalizeSiteConfig()
  const second = normalizeSiteConfig()
  assert.notStrictEqual(first, second)
  assert.notStrictEqual(first.metrics, second.metrics)
  assert.notStrictEqual(first.metrics[0], second.metrics[0])
  assert.notStrictEqual(first.appearance, second.appearance)
})

test('fixtures permanecem intactas após normalização e migration', () => {
  const before = structuredClone(sites.legacyIncomplete)
  normalizeSiteConfig(sites.legacyIncomplete)
  migrateSiteConfig(sites.legacyIncomplete)
  assert.deepEqual(sites.legacyIncomplete, before)
})

test('normalização repetida é determinística', () => {
  assert.deepEqual(normalizeSiteConfig(sites.currentDefault), normalizeSiteConfig(sites.currentDefault))
})

test('defaults canônicos são congelados e cópias são editáveis', () => {
  assert.equal(Object.isFrozen(defaultSiteConfig), true)
  assert.equal(Object.isFrozen(defaultSiteConfig.metrics), true)
  const copy = createDefaultSiteConfig()
  assert.equal(Object.isFrozen(copy), false)
  copy.name = 'Outro'
  assert.equal(defaultSiteConfig.name, 'Jever Dias')
})

test('schemaVersion ausente é reconhecido como versão 0', () => {
  assert.equal(LEGACY_SITE_SCHEMA_VERSION, 0)
  assert.equal(getSiteSchemaVersion({}), 0)
})

test('migrations possuem ordem contínua até a versão lógica atual', () => {
  assert.deepEqual(SITE_CONFIG_MIGRATIONS.map(({ from, to }) => [from, to]), [[0, 1], [1, 2]])
  assert.equal(CURRENT_SITE_SCHEMA_VERSION, 2)
})

test('migration 0 infere classificação antiga e depois preserva métricas legadas', () => {
  const migrated = applySiteConfigMigrations({ siteClassification: 'Business Website', dashboardsCount: '+30', systemsCount: '+8' })
  assert.equal(migrated.siteClassificationId, 'institutional')
  assert.equal(migrated.metrics.find((metric) => metric.id === 'dashboards').value, '+30')
  assert.equal(migrated.metrics.find((metric) => metric.id === 'systems').value, '+8')
})

test('migration é idempotente', () => {
  const input = { siteClassification: 'Business Website', dashboardsCount: '+30' }
  assert.deepEqual(migrateSiteConfig(migrateSiteConfig(input)), migrateSiteConfig(input))
})

test('versão futura desconhecida preserva os dados sem executar migrations antigas', () => {
  const input = { schemaVersion: 99, name: 'Futuro', futureField: { enabled: true }, metrics: [{ id: 'future', value: '1' }] }
  const migrated = migrateSiteConfig(input)
  assert.equal(migrated.schemaVersion, 99)
  assert.deepEqual(migrated.futureField, { enabled: true })
  assert.equal(migrated.metrics[0].id, 'future')
})

test('migration não acessa armazenamento nem adiciona schemaVersion', () => {
  const migrated = migrateSiteConfig({ name: 'Sem persistência' })
  assert.equal('schemaVersion' in migrated, false)
  assert.equal(migrated.name, 'Sem persistência')
})

test('migration não muda classificação válida', () => {
  assert.equal(migrateSiteConfig({ siteClassificationId: 'professional-services' }).siteClassificationId, 'professional-services')
})

test('migration não altera aparência válida', () => {
  const appearance = { presetId: 'technology', paletteId: 'ocean-cyan', designId: 'bento', fontId: 'inter' }
  assert.deepEqual(migrateSiteConfig({ appearance }).appearance, appearance)
})

test('migration preserva campos desconhecidos por regra explícita', () => {
  const migrated = migrateSiteConfig({ pluginFuture: { items: ['a'] } })
  assert.deepEqual(migrated.pluginFuture, { items: ['a'] })
})

test('fachada histórica e módulo canônico produzem o mesmo resultado', async () => {
  const facade = await import('../../src/utils/compatibility.js')
  assert.deepEqual(facade.normalizeSiteConfig(sites.currentDefault), normalizeSiteConfig(sites.currentDefault))
})

test('leitura antiga do localStorage continua compatível', () => {
  const storage = createStorage({ [SITE_STORAGE_KEY]: JSON.stringify(sites.legacyIncomplete) })
  assert.equal(readSiteCache(storage).siteClassificationId, 'institutional')
})

test('chaves atuais do localStorage permanecem inalteradas', () => {
  assert.deepEqual([SITE_STORAGE_KEY, PROJECTS_STORAGE_KEY, CONTACT_STORAGE_KEY], ['jd-portfolio-site-v1', 'jd-portfolio-projects-v1', 'jd-contact-last-submit'])
})

test('conteúdo site do backup atual continua importável', () => {
  const backup = { version: 2, exportedAt: '2026-07-17T00:00:00.000Z', site: sites.currentDefault, projects: [] }
  const imported = normalizeSiteConfig(validateSiteImport(backup.site))
  assert.equal(imported.name, 'Profissional Exemplo')
})

test('linha de configuração do Supabase continua normalizada', () => {
  assert.equal(normalizeSiteConfig(sites.supabaseRow.data).name, 'Registro Supabase Exemplo')
})

test('somente portfolio-app permanece como classificação pública', () => {
  assert.equal(PUBLIC_SITE_CLASSIFICATION_ID, 'portfolio-app')
  assert.equal(getPublicClassification().id, 'portfolio-app')
})

test('classificação administrativa continua armazenada sem virar pública', () => {
  const normalized = normalizeSiteConfig({ siteClassificationId: 'event' })
  assert.equal(normalized.siteClassificationId, 'event')
  assert.equal(PUBLIC_SITE_CLASSIFICATION_ID, 'portfolio-app')
})

test('configuração padrão continua produzindo as mesmas seções públicas', () => {
  assert.deepEqual(Object.keys(siteConfig.sectionVisibility), ['hero', 'specialties', 'projects', 'about', 'credibility', 'resume', 'contact', 'footer'])
  assert.ok(Object.values(siteConfig.sectionVisibility).every(Boolean))
})
