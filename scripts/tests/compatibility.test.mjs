import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { defaultAppearance } from '../../src/data/appearance.js'
import { projectTypes } from '../../src/data/projects.js'
import { siteConfig } from '../../src/data/site.js'
import {
  AI_MIGRATION_KEY,
  CONTACT_STORAGE_KEY,
  getPublicClassification,
  normalizeProjectData,
  normalizeSiteConfig,
  PROJECTS_STORAGE_KEY,
  PUBLIC_SITE_CLASSIFICATION_ID,
  readProjectsCache,
  readSiteCache,
  selectPublicProjects,
  SITE_STORAGE_KEY,
} from '../../src/utils/compatibility.js'

const fixture = (name) => JSON.parse(readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8'))
const sites = fixture('site-configs.json')
const projects = fixture('projects.json')

const createStorage = (initial = {}) => {
  const values = new Map(Object.entries(initial))
  return {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
    snapshot: () => Object.fromEntries(values),
  }
}

test('preserva as três chaves públicas atuais do localStorage', () => {
  assert.equal(SITE_STORAGE_KEY, 'jd-portfolio-site-v1')
  assert.equal(PROJECTS_STORAGE_KEY, 'jd-portfolio-projects-v1')
  assert.equal(CONTACT_STORAGE_KEY, 'jd-contact-last-submit')
})

test('carrega a configuração representativa do formato atual', () => {
  const normalized = normalizeSiteConfig(sites.currentDefault)
  assert.equal(normalized.name, 'Profissional Exemplo')
  assert.equal(normalized.siteClassificationId, 'portfolio-app')
  assert.equal(normalized.appearance.paletteId, 'jd-original')
  assert.equal(normalized.metrics[0].id, 'entregas')
})

test('configuração incompleta recebe padrões sem perder campos conhecidos', () => {
  const normalized = normalizeSiteConfig(sites.legacyIncomplete)
  assert.equal(normalized.name, 'Organização Exemplo')
  assert.equal(normalized.role, siteConfig.role)
  assert.equal(normalized.sectionVisibility.contact, false)
  assert.equal(normalized.sectionVisibility.hero, true)
})

test('campos desconhecidos não derrubam nem apagam a configuração', () => {
  const normalized = normalizeSiteConfig({ name: 'Exemplo', futureField: { enabled: true } })
  assert.deepEqual(normalized.futureField, { enabled: true })
  assert.equal(normalized.name, 'Exemplo')
})

test('aparência é preservada sem modificar conteúdo', () => {
  const normalized = normalizeSiteConfig({ name: 'Conteúdo preservado', appearance: { paletteId: 'soft-sage' } })
  assert.equal(normalized.name, 'Conteúdo preservado')
  assert.equal(normalized.appearance.paletteId, 'soft-sage')
  assert.equal(normalized.appearance.designId, defaultAppearance.designId)
})

test('ausência de aparência aplica o fallback atual', () => {
  assert.deepEqual(normalizeSiteConfig(sites.withoutAppearance).appearance, defaultAppearance)
})

test('classificação válida sobrevive a diferença de versão sem troca silenciosa', () => {
  const normalized = normalizeSiteConfig(sites.legacyIncomplete)
  assert.equal(normalized.classificationLayoutVersion, siteConfig.classificationLayoutVersion)
  assert.equal(normalized.siteClassificationId, 'institutional')
  assert.equal(normalized.name, 'Organização Exemplo')
})

test('ausência ou classificação inválida usa o portfólio como fallback seguro', () => {
  assert.equal(normalizeSiteConfig(sites.withoutClassification).siteClassificationId, 'portfolio-app')
  const invalid = normalizeSiteConfig(sites.invalidClassification)
  assert.equal(invalid.siteClassificationId, 'portfolio-app')
  assert.equal(invalid.siteClassification, 'Portfolio Website')
  assert.doesNotMatch(invalid.siteClassificationDescription, /não pode chegar/i)
})

test('classificação e aparência não apagam visibilidade, contatos ou ids', () => {
  const normalized = normalizeSiteConfig(sites.currentDefault)
  assert.equal(normalized.email, '')
  assert.equal(normalized.emailSecondary, '')
  assert.equal(normalized.sectionVisibility.projects, true)
  assert.equal(normalized.techItems[0].id, 'ferramenta-exemplo')
  assert.equal(normalized.specialties[0].id, 'especialidade-exemplo')
  assert.ok(normalized.displayModels.some((item) => item.id === 'modelo-personalizado'))
})

test('lê configuração das chaves atuais e trata ausência ou JSON inválido', () => {
  const local = createStorage({ [sites.localStorage.key]: JSON.stringify(sites.localStorage.value) })
  assert.equal(readSiteCache(local).name, 'Cache Local Exemplo')
  assert.equal(readSiteCache(createStorage()).siteClassificationId, 'portfolio-app')
  assert.equal(readSiteCache(createStorage({ [SITE_STORAGE_KEY]: '{inválido' })).siteClassificationId, 'portfolio-app')
})

test('normaliza o formato da linha atual do Supabase', () => {
  const normalized = normalizeSiteConfig(sites.supabaseRow.data)
  assert.equal(sites.supabaseRow.id, 'main')
  assert.equal(normalized.name, 'Registro Supabase Exemplo')
  assert.equal(normalized.sectionVisibility.resume, false)
})

test('mantém o portfólio como única classificação publicada nesta etapa', () => {
  assert.equal(PUBLIC_SITE_CLASSIFICATION_ID, 'portfolio-app')
  assert.equal(getPublicClassification().classification, 'Portfolio Website')
  assert.notEqual(normalizeSiteConfig(sites.legacyIncomplete).siteClassificationId, 'portfolio-app')
})

test('a página pública usa a classificação fixa sem publicar a seleção administrativa', () => {
  const app = readFileSync(new URL('../../src/App.jsx', import.meta.url), 'utf8')
  assert.match(app, /dataset\.siteClassification = PUBLIC_SITE_CLASSIFICATION_ID/)
  assert.match(app, /classificationId=\{PUBLIC_SITE_CLASSIFICATION_ID\}/)
  assert.doesNotMatch(app, /classificationId=\{siteStore\.site\.siteClassificationId\}/)
})

test('normaliza projeto atual preservando id, URLs, tags e galeria', () => {
  const normalized = normalizeProjectData(projects.completeCurrent)
  assert.equal(normalized.id, 'projeto-completo-exemplo')
  assert.equal(normalized.externalUrl, 'https://example.com/demonstracao')
  assert.deepEqual(normalized.tags, ['React', 'Vite'])
  assert.deepEqual(normalized.gallery, ['https://example.com/print-1.webp'])
})

test('projeto legado recebe campos opcionais e continua visível por padrão', () => {
  const normalized = normalizeProjectData(projects.legacyMinimal)
  assert.equal(normalized.category, 'Projetos')
  assert.equal(normalized.status, 'Em andamento')
  assert.equal(normalized.featured, true)
  assert.deepEqual(normalized.tags, [])
  assert.deepEqual(normalized.gallery, [])
})

test('projetos com e sem imagens mantêm o formato da galeria', () => {
  const withImages = normalizeProjectData(projects.withImages)
  const withoutImages = normalizeProjectData(projects.withoutImages)
  assert.equal(withImages.image, 'https://example.com/dashboard.webp')
  assert.equal(withImages.gallery.length, 2)
  assert.equal(withoutImages.image, '')
  assert.deepEqual(withoutImages.gallery, [])
})

test('projeto oculto não entra na coleção pública e destacado entra', () => {
  const visible = selectPublicProjects([projects.hidden, projects.featured])
  assert.deepEqual(visible.map((project) => project.id), ['projeto-destacado'])
})

test('lista vazia e campos opcionais não geram erro', () => {
  assert.deepEqual(selectPublicProjects(projects.emptyList), [])
  assert.doesNotThrow(() => normalizeProjectData({ id: 'mínimo', title: 'Mínimo', type: 'content' }))
})

test('os quatro tipos atuais continuam reconhecidos', () => {
  assert.deepEqual(Object.keys(projectTypes), ['powerbi', 'website', 'content', 'ai'])
  for (const project of projects.byType) {
    assert.equal(normalizeProjectData(project).typeLabel, projectTypes[project.type])
  }
})

test('cache antigo de projetos é aceito e recebe a categoria de IA existente', () => {
  const storage = createStorage({
    [PROJECTS_STORAGE_KEY]: JSON.stringify([projects.legacyMinimal]),
  })
  const normalized = readProjectsCache(storage)
  assert.ok(normalized.some((project) => project.id === 'projeto-legado-exemplo'))
  assert.ok(normalized.some((project) => project.type === 'ai'))
  assert.equal(storage.snapshot()[AI_MIGRATION_KEY], '1')
})

test('cache ausente, vazio ou inválido usa projetos padrão sem falhar', () => {
  assert.ok(readProjectsCache(createStorage()).length > 0)
  assert.ok(readProjectsCache(createStorage({ [PROJECTS_STORAGE_KEY]: '[]' })).length > 0)
  assert.ok(readProjectsCache(createStorage({ [PROJECTS_STORAGE_KEY]: '{inválido' })).length > 0)
})
