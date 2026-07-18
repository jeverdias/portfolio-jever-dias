import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { fileURLToPath } from 'node:url'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { createDefaultSiteConfig } from '../../src/core/config/defaultSiteConfig.js'
import { SITE_CONFIG_MIGRATIONS } from '../../src/core/config/migrateSiteConfig.js'
import { normalizeSiteConfig } from '../../src/core/config/normalizeSiteConfig.js'
import { getDefaultTemplateSections, templateAllowsSection } from '../../src/core/site-engine/resolveTemplate.js'
import { getTemplateDefinition } from '../../src/core/site-engine/templateRegistry.js'
import { PUBLIC_TEMPLATE_ID, resolvePublicTemplate } from '../../src/core/site-engine/publicTemplatePolicy.js'
import { defaultProjects } from '../../src/data/projects.js'
import { siteClassifications } from '../../src/data/siteClassifications.js'
import { siteConfig } from '../../src/data/site.js'
import { createPortfolioReturnPath, createProjectPath, readProjectIdFromPath } from '../../src/app/appNavigation.js'
import {
  createPublicRenderPlan,
  PORTFOLIO_PUBLIC_SECTION_IDS,
  PORTFOLIO_SECTION_ANCHORS,
} from '../../src/templates/portfolio/portfolioSections.js'
import {
  CONTACT_STORAGE_KEY,
  PROJECTS_STORAGE_KEY,
  SITE_STORAGE_KEY,
} from '../../src/core/persistence/localStorageAdapter.js'

const root = fileURLToPath(new URL('../..', import.meta.url))
const vite = await createServer({ root, server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' })
const { PublicSiteRenderer } = await vite.ssrLoadModule('/src/app/PublicSiteRenderer.jsx')
const { PortfolioTemplate } = await vite.ssrLoadModule('/src/templates/portfolio/PortfolioTemplate.jsx')
const {
  getPublicSectionComponentIds,
  hasPublicSectionComponent,
  publicSectionComponents,
  renderPublicSection,
} = await vite.ssrLoadModule('/src/app/publicSectionComponents.js')

after(async () => vite.close())

const handlers = Object.freeze({
  onLogin: () => 'login',
  onContact: () => 'contact',
  onOpenProject: (project) => project,
})

const createSite = (overrides = {}) => {
  const defaults = createDefaultSiteConfig()
  return {
    ...defaults,
    ...overrides,
    sectionVisibility: overrides.sectionVisibility === undefined
      ? defaults.sectionVisibility
      : overrides.sectionVisibility,
  }
}

const renderPublic = (overrides = {}, options = {}) => renderToStaticMarkup(React.createElement(PublicSiteRenderer, {
  requestedTemplateId: options.requestedTemplateId,
  siteConfig: createSite(overrides),
  projects: options.projects ?? defaultProjects,
  handlers: options.handlers ?? handlers,
}))

const defaultPlan = () => createPublicRenderPlan({
  siteConfig: createDefaultSiteConfig(),
  registeredSectionIds: getPublicSectionComponentIds(),
})

// App shell — 1 a 8
test('01 App inicializa o site público pelo renderer', () => assert.match(renderPublic(), /class="site-shell"/))
test('02 App mantém suporte à página individual por rota', () => assert.equal(readProjectIdFromPath('/portfolio/dashboard-htlv'), 'dashboard-htlv'))
test('03 App mantém o callback de abertura do painel no Header', () => {
  const element = PortfolioTemplate({ template: resolvePublicTemplate(), sectionIds: defaultPlan().sectionIds, siteConfig: createSite(), projects: [], handlers })
  assert.strictEqual(element.props.children[0].props.onLogin, handlers.onLogin)
})
test('04 App mantém navegação manual sem biblioteca de rotas', () => {
  assert.equal(createProjectPath('projeto 1'), '/portfolio/projeto%201')
  assert.equal(createPortfolioReturnPath(), '/#projetos')
})
test('05 composição pública usa uma lista resolvida fora do App', () => assert.deepEqual(defaultPlan().sectionIds, PORTFOLIO_PUBLIC_SECTION_IDS))
test('06 PublicSiteRenderer delega a estrutura ao PortfolioTemplate', () => {
  const element = PublicSiteRenderer({ siteConfig: createSite(), projects: [], handlers })
  assert.strictEqual(element.type, PortfolioTemplate)
})
test('07 callbacks globais permanecem recebidos, não persistidos', () => {
  const element = PublicSiteRenderer({ siteConfig: createSite(), projects: [], handlers })
  assert.strictEqual(element.props.handlers, handlers)
})
test('08 áreas lazy e administrativas permanecem fora do registro público', () => {
  for (const id of ['admin', 'project-detail', 'project-modal', 'contact-modal']) assert.equal(hasPublicSectionComponent(id), false)
})

// PublicSiteRenderer — 9 a 20
test('09 renderer resolve portfolio-app no contexto público', () => assert.equal(defaultPlan().template.id, 'portfolio-app'))
test('10 renderer ignora template futuro', () => assert.equal(createPublicRenderPlan({ requestedTemplateId: 'institutional' }).template.id, 'portfolio-app'))
test('11 renderer usa fallback para template inválido', () => assert.equal(createPublicRenderPlan({ requestedTemplateId: 'inexistente' }).template.id, 'portfolio-app'))
test('12 renderer recebe configuração incompleta', () => assert.doesNotThrow(() => renderToStaticMarkup(React.createElement(PublicSiteRenderer, { siteConfig: { name: 'Exemplo' } }))))
test('13 renderer recebe visibility inválida', () => assert.deepEqual(createPublicRenderPlan({ siteConfig: { sectionVisibility: 'inválida' } }).sectionIds, PORTFOLIO_PUBLIC_SECTION_IDS))
test('14 renderer recebe ordem inválida e usa a ordem padrão', () => assert.deepEqual(createPublicRenderPlan({ siteConfig: { sectionOrder: 'inválida' } }).sectionIds, PORTFOLIO_PUBLIC_SECTION_IDS))
test('15 renderer ignora seção desconhecida', () => assert.equal(createPublicRenderPlan({ registeredSectionIds: [...PORTFOLIO_PUBLIC_SECTION_IDS, 'desconhecida'] }).sectionIds.includes('desconhecida'), false))
test('16 renderer ignora componente não registrado', () => assert.equal(createPublicRenderPlan({ registeredSectionIds: PORTFOLIO_PUBLIC_SECTION_IDS.filter((id) => id !== 'projects') }).sectionIds.includes('projects'), false))
test('17 renderer não duplica seção', () => {
  const plan = createPublicRenderPlan({ registeredSectionIds: ['hero', 'hero', 'projects', 'projects', 'contact'] })
  assert.equal(plan.sectionIds.length, new Set(plan.sectionIds).size)
})
test('18 renderer não modifica props', () => {
  const input = { requestedTemplateId: 'institutional', siteConfig: { sectionVisibility: { projects: false }, sectionOrder: ['contact', 'hero'] }, registeredSectionIds: [...PORTFOLIO_PUBLIC_SECTION_IDS] }
  const before = structuredClone(input)
  createPublicRenderPlan(input)
  assert.deepEqual(input, before)
})
test('19 renderer não salva dados ou adiciona campos', () => {
  const config = { name: 'Sem persistência' }
  createPublicRenderPlan({ siteConfig: config })
  assert.deepEqual(config, { name: 'Sem persistência' })
})
test('20 renderer inclui somente seções permitidas pelo template', () => {
  for (const id of defaultPlan().sectionIds) assert.equal(templateAllowsSection('portfolio-app', id), true)
})

// PortfolioTemplate — 21 a 32
test('21 portfólio contém as mesmas seções atuais', () => assert.deepEqual(getPublicSectionComponentIds(), PORTFOLIO_PUBLIC_SECTION_IDS))
test('22 portfólio mantém a mesma ordem', () => assert.deepEqual(defaultPlan().sectionIds, getDefaultTemplateSections('portfolio-app')))
test('23 portfólio mantém os mesmos ids de anchor', () => assert.deepEqual(PORTFOLIO_SECTION_ANCHORS, { hero: 'inicio', specialties: 'servicos', projects: 'projetos', about: 'sobre', credibility: 'trajetoria', resume: 'curriculo', contact: 'contato', footer: null }))
test('24 portfólio mantém wrappers e estrutura semântica', () => {
  const html = renderPublic()
  assert.match(html, /^<div class="site-shell"><header/)
  assert.match(html, /<main id="conteudo">/)
  assert.match(html, /<footer/)
})
test('25 portfólio mantém callback de projeto', () => {
  const element = publicSectionComponents.projects({ projects: defaultProjects, templateId: 'portfolio-app', handlers })
  assert.strictEqual(element.props.onOpen, handlers.onOpenProject)
})
test('26 portfólio mantém projetos visíveis', () => {
  const element = publicSectionComponents.projects({ projects: defaultProjects, templateId: 'portfolio-app', handlers })
  assert.deepEqual(element.props.projects, defaultProjects.filter((project) => project.featured !== false))
})
test('27 portfólio mantém o componente que gerencia filtros', () => assert.equal(publicSectionComponents.projects({ projects: [], templateId: 'portfolio-app', handlers }).type.name, 'Projects'))
test('28 portfólio mantém contato e callback', () => {
  const element = publicSectionComponents.contact({ siteConfig: createSite(), templateId: 'portfolio-app', handlers })
  assert.strictEqual(element.props.onOpen, handlers.onContact)
})
test('29 portfólio mantém trajetória dentro da credibilidade', () => assert.equal(publicSectionComponents.credibility({ siteConfig: createSite() }).type.name, 'Credibility'))
test('30 portfólio mantém currículo', () => assert.equal(publicSectionComponents.resume({ siteConfig: createSite() }).type.name, 'Resume'))
test('31 portfólio mantém credibilidade', () => assert.match(renderPublic(), /id="trajetoria"/))
test('32 portfólio mantém especialidades', () => assert.match(renderPublic(), /id="servicos"/))

// Visibility — 33 a 38
test('33 seção visível é renderizada', () => assert.match(renderPublic({ sectionVisibility: { ...siteConfig.sectionVisibility, projects: true } }), /id="projetos"/))
test('34 seção oculta não é renderizada', () => assert.doesNotMatch(renderPublic({ sectionVisibility: { ...siteConfig.sectionVisibility, projects: false } }), /id="projetos"/))
test('35 seção sem conteúdo segue a regra atual do próprio componente', () => assert.doesNotThrow(() => renderPublic({ specialties: [], metrics: [], techItems: [] })))
test('36 visibility parcial mantém seções não explicitamente ocultas', () => assert.deepEqual(createPublicRenderPlan({ siteConfig: { sectionVisibility: { resume: false } } }).sectionIds, PORTFOLIO_PUBLIC_SECTION_IDS.filter((id) => id !== 'resume')))
test('37 visibility desconhecida não quebra', () => assert.doesNotThrow(() => createPublicRenderPlan({ siteConfig: { sectionVisibility: { futura: false } } })))
test('38 configuração antiga continua funcionando', () => assert.equal(createPublicRenderPlan({ siteConfig: { name: 'Legado', siteClassificationId: 'event' } }).template.id, 'portfolio-app'))

// Política pública — 39 a 45
test('39 landing-page não aparece publicamente', () => assert.equal(createPublicRenderPlan({ requestedTemplateId: 'landing-page' }).template.id, 'portfolio-app'))
test('40 institutional não aparece publicamente', () => assert.equal(createPublicRenderPlan({ requestedTemplateId: 'institutional' }).template.id, 'portfolio-app'))
test('41 professional-services não aparece publicamente', () => assert.equal(createPublicRenderPlan({ requestedTemplateId: 'professional-services' }).template.id, 'portfolio-app'))
test('42 alias legado não publica landing page', () => assert.equal(createPublicRenderPlan({ requestedTemplateId: 'landing-conversion' }).template.id, 'portfolio-app'))
test('43 ID vindo do localStorage não publica template futuro', () => assert.equal(createPublicRenderPlan({ siteConfig: JSON.parse('{"siteClassificationId":"institutional"}') }).template.id, 'portfolio-app'))
test('44 ID vindo do Supabase não publica template futuro', () => assert.equal(createPublicRenderPlan({ siteConfig: { ...siteConfig, siteClassificationId: 'professional-services' } }).template.id, 'portfolio-app'))
test('45 ID vindo do backup não publica template futuro', () => assert.equal(createPublicRenderPlan({ siteConfig: { ...structuredClone(siteConfig), siteClassificationId: 'landing-page' } }).template.id, 'portfolio-app'))

// Rotas — 46 a 52
test('46 rota inicial funciona', () => assert.equal(readProjectIdFromPath('/'), ''))
test('47 rota de projeto funciona', () => assert.equal(readProjectIdFromPath('/portfolio/dashboard-htlv'), 'dashboard-htlv'))
test('48 refresh de projeto preserva leitura da mesma URL', () => assert.equal(readProjectIdFromPath(createProjectPath('sistema-os')), 'sistema-os'))
test('49 retorno usa a âncora pública existente', () => assert.equal(createPortfolioReturnPath(), '/#projetos'))
test('50 popstate pode reler a nova localização', () => {
  assert.equal(readProjectIdFromPath('/portfolio/primeiro'), 'primeiro')
  assert.equal(readProjectIdFromPath('/portfolio/segundo'), 'segundo')
})
test('51 admin não foi incluído nas rotas públicas de projeto', () => assert.equal(readProjectIdFromPath('/admin'), ''))
test('52 URL pública permanece igual e aceita barra final', () => assert.equal(readProjectIdFromPath('/portfolio/projeto-1/'), 'projeto-1'))

// Modais — 53 a 58
test('53 callback que abre modal de projeto permanece no adapter', () => assert.strictEqual(publicSectionComponents.projects({ projects: [], templateId: 'portfolio-app', handlers }).props.onOpen, handlers.onOpenProject))
test('54 ausência de callback de projeto é tratada sem erro', () => assert.doesNotThrow(() => renderPublicSection('projects', { projects: [], templateId: 'portfolio-app', handlers: {} })))
test('55 callback que abre modal de contato permanece no adapter', () => assert.strictEqual(publicSectionComponents.contact({ siteConfig: createSite(), templateId: 'portfolio-app', handlers }).props.onOpen, handlers.onContact))
test('56 ausência de callback de contato é tratada sem erro', () => assert.doesNotThrow(() => renderPublicSection('contact', { siteConfig: createSite(), templateId: 'portfolio-app', handlers: {} })))
test('57 componentes de modal continuam fora da árvore de seções', () => {
  assert.equal(hasPublicSectionComponent('ProjectModal'), false)
  assert.equal(hasPublicSectionComponent('ContactModal'), false)
})
test('58 referências dos callbacks permanecem válidas', () => {
  assert.strictEqual(publicSectionComponents.hero({ siteConfig: createSite(), templateId: 'portfolio-app', handlers }).props.onContact, handlers.onContact)
  assert.strictEqual(publicSectionComponents.projects({ projects: [], templateId: 'portfolio-app', handlers }).props.onOpen, handlers.onOpenProject)
})

// Regressão e compatibilidade — 59 a 70
test('59 siteConfig permanece igual após planejar e renderizar', () => {
  const config = createDefaultSiteConfig()
  const before = structuredClone(config)
  createPublicRenderPlan({ siteConfig: config })
  renderToStaticMarkup(React.createElement(PublicSiteRenderer, { siteConfig: config }))
  assert.deepEqual(config, before)
})
test('60 projetos permanecem iguais após renderizar', () => {
  const projects = structuredClone(defaultProjects)
  const before = structuredClone(projects)
  renderToStaticMarkup(React.createElement(PublicSiteRenderer, { siteConfig: createSite(), projects }))
  assert.deepEqual(projects, before)
})
test('61 localStorage permanece com as mesmas chaves', () => assert.deepEqual([SITE_STORAGE_KEY, PROJECTS_STORAGE_KEY, CONTACT_STORAGE_KEY], ['jd-portfolio-site-v1', 'jd-portfolio-projects-v1', 'jd-contact-last-submit']))
test('62 Supabase permanece fora do renderer e plano puro', () => assert.doesNotThrow(() => createPublicRenderPlan({ siteConfig: { siteClassificationId: 'institutional' } })))
test('63 backup v1.8.5 continua válido', () => {
  const backup = { appVersion: '1.8.5', version: 2, site: structuredClone(siteConfig), projects: structuredClone(defaultProjects) }
  assert.equal(normalizeSiteConfig(backup.site).name, siteConfig.name)
  assert.equal(backup.projects.length, defaultProjects.length)
})
test('64 aparência permanece igual', () => {
  const appearance = structuredClone(siteConfig.appearance)
  createPublicRenderPlan({ siteConfig })
  assert.deepEqual(siteConfig.appearance, appearance)
})
test('65 classification permanece salva sem controlar produção', () => {
  for (const classification of siteClassifications) {
    const config = normalizeSiteConfig({ siteClassificationId: classification.id })
    assert.equal(config.siteClassificationId, classification.id)
    assert.equal(createPublicRenderPlan({ siteConfig: config }).template.id, PUBLIC_TEMPLATE_ID)
  }
})
test('66 nenhuma migration foi criada', () => assert.deepEqual(SITE_CONFIG_MIGRATIONS.map(({ from, to }) => [from, to]), [[0, 1], [1, 2]]))
test('67 nenhum acesso real ao Supabase é necessário', () => assert.doesNotThrow(() => renderPublic({ siteClassificationId: 'institutional' })))
test('68 AdminPanel permanece fora da composição pública', () => assert.equal(getPublicSectionComponentIds().some((id) => /admin/i.test(id)), false))
test('69 templates futuros não ganharam componentes públicos', () => {
  for (const id of ['landing-page', 'institutional', 'professional-services']) {
    assert.equal(getTemplateDefinition(id).publicEnabled, false)
    assert.equal(hasPublicSectionComponent(id), false)
  }
})
test('70 Etapa 8 não foi executada', () => {
  assert.equal('revision' in siteConfig, false)
  assert.equal('schema_version' in siteConfig, false)
  assert.equal(PUBLIC_TEMPLATE_ID, 'portfolio-app')
})
