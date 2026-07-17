import assert from 'node:assert/strict'
import test from 'node:test'
import { defaultAppearance } from '../../src/data/appearance.js'
import { getClassificationPresentation } from '../../src/data/classificationPresentation.js'
import { defaultProjects } from '../../src/data/projects.js'
import { siteClassifications } from '../../src/data/siteClassifications.js'
import { siteConfig } from '../../src/data/site.js'
import { SITE_CONFIG_MIGRATIONS } from '../../src/core/config/migrateSiteConfig.js'
import { normalizeSiteConfig } from '../../src/core/config/normalizeSiteConfig.js'
import { cloneConfigValue } from '../../src/core/config/siteSchema.js'
import {
  CONTACT_STORAGE_KEY,
  PROJECTS_STORAGE_KEY,
  PUBLIC_SITE_CLASSIFICATION_ID,
  SITE_STORAGE_KEY,
  selectPublicProjects,
} from '../../src/utils/compatibility.js'
import {
  createCapabilities,
  hasTemplateCapability,
  validateTemplateCapabilities,
} from '../../src/core/site-engine/templateCapabilities.js'
import { getSectionDefinition, isKnownSection, listSections } from '../../src/core/site-engine/sectionRegistry.js'
import {
  DEFAULT_TEMPLATE_ID,
  getCanonicalTemplateId,
  getTemplateDefinition,
  getTemplateIds,
  isTemplateAvailableForPreview,
  listTemplates,
} from '../../src/core/site-engine/templateRegistry.js'
import {
  getDefaultTemplateSections,
  resolveSections,
  resolveTemplate,
  TEMPLATE_CONTEXT,
  templateAllowsSection,
  templateSupportsCapability,
} from '../../src/core/site-engine/resolveTemplate.js'
import {
  isTemplatePubliclyAllowed,
  PUBLIC_TEMPLATE_ID,
  resolvePublicTemplate,
} from '../../src/core/site-engine/publicTemplatePolicy.js'

const requiredTemplateFields = ['id', 'label', 'description', 'status', 'publicEnabled', 'previewEnabled', 'sections', 'defaultSectionOrder', 'capabilities', 'primaryAction', 'supportedContent', 'requiredContent', 'optionalContent', 'definitionVersion', 'fallbackTemplateId']
const futureTemplateIds = ['landing-page', 'institutional', 'professional-services']

// Template registry — 1 a 15
test('01 portfolio-app existe', () => assert.equal(getTemplateDefinition('portfolio-app')?.id, 'portfolio-app'))
test('02 portfolio-app é público', () => assert.equal(getTemplateDefinition('portfolio-app').publicEnabled, true))
test('03 portfolio-app permite preview', () => assert.equal(isTemplateAvailableForPreview('portfolio-app'), true))
test('04 landing page existe', () => assert.equal(getTemplateDefinition('landing-page')?.id, 'landing-page'))
test('05 landing page não é pública', () => assert.equal(getTemplateDefinition('landing-page').publicEnabled, false))
test('06 landing page permite preview', () => assert.equal(isTemplateAvailableForPreview('landing-page'), true))
test('07 institucional existe', () => assert.equal(getTemplateDefinition('institutional')?.id, 'institutional'))
test('08 institucional não é público', () => assert.equal(getTemplateDefinition('institutional').publicEnabled, false))
test('09 profissional autônomo existe', () => assert.equal(getTemplateDefinition('professional-services')?.id, 'professional-services'))
test('10 profissional autônomo não é público', () => assert.equal(getTemplateDefinition('professional-services').publicEnabled, false))
test('11 IDs de templates são únicos', () => assert.equal(new Set(getTemplateIds()).size, getTemplateIds().length))
test('12 definições possuem todos os campos obrigatórios', () => {
  for (const template of listTemplates()) for (const field of requiredTemplateFields) assert.ok(field in template, `${template.id}: ${field}`)
})
test('13 ordens padrão contêm somente seções conhecidas e permitidas', () => {
  for (const template of listTemplates()) for (const section of template.defaultSectionOrder) {
    assert.equal(isKnownSection(section), true, `${template.id}: ${section}`)
    assert.equal(template.sections.includes(section), true, `${template.id}: ${section}`)
  }
})
test('14 capabilities de todos os templates têm formato válido', () => {
  for (const template of listTemplates()) assert.equal(validateTemplateCapabilities(template.capabilities), true, template.id)
})
test('15 consultas ao registry não compartilham referências mutáveis', () => {
  const first = getTemplateDefinition('portfolio-app')
  const second = getTemplateDefinition('portfolio-app')
  first.sections.push('mutação-local')
  first.primaryAction.label = 'Alterado'
  assert.notDeepEqual(first, second)
  assert.equal(getTemplateDefinition('portfolio-app').sections.includes('mutação-local'), false)
  assert.equal(getTemplateDefinition('portfolio-app').primaryAction.label, 'Ver portfólio')
})

// Política pública — 16 a 25
test('16 contexto public retorna portfolio-app', () => assert.equal(resolveTemplate({ requestedTemplateId: 'portfolio-app', context: TEMPLATE_CONTEXT.PUBLIC }).id, 'portfolio-app'))
test('17 template futuro solicitado publicamente retorna portfolio-app', () => assert.equal(resolvePublicTemplate('landing-page').id, 'portfolio-app'))
test('18 template inválido retorna portfolio-app', () => assert.equal(resolvePublicTemplate('inexistente').id, 'portfolio-app'))
test('19 valor vindo do localStorage não publica template futuro', () => {
  const stored = JSON.parse(JSON.stringify({ siteClassificationId: 'institutional' }))
  assert.equal(resolvePublicTemplate(stored.siteClassificationId).id, 'portfolio-app')
})
test('20 valor vindo do Supabase não publica template futuro', () => {
  const row = { id: 'main', data: { siteClassificationId: 'professional-services' } }
  assert.equal(resolvePublicTemplate(row.data.siteClassificationId).id, 'portfolio-app')
})
test('21 valor importado por backup não publica template futuro', () => {
  const backup = { version: 2, site: { siteClassificationId: 'landing-conversion' } }
  assert.equal(resolvePublicTemplate(backup.site.siteClassificationId).id, 'portfolio-app')
})
test('22 seleção administrativa não muda template público', () => {
  for (const classification of siteClassifications) assert.equal(resolvePublicTemplate(classification.id).id, 'portfolio-app')
})
test('23 aumento de versão não altera template público', () => {
  for (const version of [1, 2, 99]) assert.equal(resolvePublicTemplate({ id: 'institutional', version }.id).id, 'portfolio-app')
})
test('24 appearance não altera template público', () => {
  const input = { siteClassificationId: 'landing-page', appearance: { ...defaultAppearance, paletteId: 'outra' } }
  assert.equal(resolvePublicTemplate(input.siteClassificationId).id, 'portfolio-app')
  assert.equal(input.appearance.paletteId, 'outra')
})
test('25 classification inválida não quebra resolução', () => {
  for (const value of [null, undefined, '', 42, {}, []]) assert.doesNotThrow(() => resolvePublicTemplate(value))
})

// Preview — 26 a 34
test('26 admin-preview permite landing page e alias legado', () => {
  assert.equal(resolveTemplate({ requestedTemplateId: 'landing-page', context: TEMPLATE_CONTEXT.ADMIN_PREVIEW }).id, 'landing-page')
  assert.equal(resolveTemplate({ requestedTemplateId: 'landing-conversion', context: TEMPLATE_CONTEXT.ADMIN_PREVIEW }).id, 'landing-page')
})
test('27 admin-preview permite institucional', () => assert.equal(resolveTemplate({ requestedTemplateId: 'institutional', context: TEMPLATE_CONTEXT.ADMIN_PREVIEW }).id, 'institutional'))
test('28 admin-preview permite profissional autônomo', () => assert.equal(resolveTemplate({ requestedTemplateId: 'professional-services', context: TEMPLATE_CONTEXT.ADMIN_PREVIEW }).id, 'professional-services'))
test('29 preview inválido usa fallback', () => assert.equal(resolveTemplate({ requestedTemplateId: 'event', context: TEMPLATE_CONTEXT.ADMIN_PREVIEW }).id, 'portfolio-app'))
test('30 preview não modifica objeto de opções recebido', () => {
  const input = { requestedTemplateId: 'institutional', context: TEMPLATE_CONTEXT.ADMIN_PREVIEW }
  const before = structuredClone(input)
  resolveTemplate(input)
  assert.deepEqual(input, before)
})
test('31 preview não modifica conteúdo', () => {
  const content = { name: 'Jever Dias', projects: [{ id: 'um' }] }
  const before = structuredClone(content)
  resolveTemplate({ requestedTemplateId: 'landing-page', context: TEMPLATE_CONTEXT.ADMIN_PREVIEW })
  assert.deepEqual(content, before)
})
test('32 preview não modifica aparência', () => {
  const appearance = cloneConfigValue(defaultAppearance)
  const before = structuredClone(appearance)
  resolveTemplate({ requestedTemplateId: 'institutional', context: TEMPLATE_CONTEXT.ADMIN_PREVIEW })
  assert.deepEqual(appearance, before)
})
test('33 preview não modifica classificação', () => {
  const site = { siteClassificationId: 'professional-services' }
  resolveTemplate({ requestedTemplateId: site.siteClassificationId, context: TEMPLATE_CONTEXT.ADMIN_PREVIEW })
  assert.equal(site.siteClassificationId, 'professional-services')
})
test('34 preview não altera política pública', () => {
  const preview = resolveTemplate({ requestedTemplateId: 'institutional', context: TEMPLATE_CONTEXT.ADMIN_PREVIEW })
  assert.equal(preview.id, 'institutional')
  assert.equal(resolvePublicTemplate(preview.id).id, 'portfolio-app')
})

// Sections — 35 a 44
test('35 resolve seções do portfólio', () => assert.deepEqual(resolveSections({ template: 'portfolio-app' }), getDefaultTemplateSections('portfolio-app')))
test('36 respeita ordem válida preferida', () => {
  const result = resolveSections({ template: 'portfolio-app', preferredOrder: ['hero', 'projects', 'specialties', 'contact'] })
  assert.deepEqual(result.slice(0, 4), ['hero', 'projects', 'specialties', 'contact'])
})
test('37 ignora seção desconhecida', () => assert.equal(resolveSections({ template: 'portfolio-app', preferredOrder: ['hero', 'desconhecida', 'contact'] }).includes('desconhecida'), false))
test('38 evita duplicações', () => {
  const result = resolveSections({ template: 'portfolio-app', preferredOrder: ['hero', 'projects', 'hero', 'projects'] })
  assert.equal(result.length, new Set(result).size)
})
test('39 respeita visibilidade de seção opcional', () => assert.equal(resolveSections({ template: 'portfolio-app', visibility: { projects: false } }).includes('projects'), false))
test('40 preserva seção obrigatória mesmo oculta', () => {
  const result = resolveSections({ template: 'portfolio-app', visibility: { hero: false, contact: false } })
  assert.equal(result.includes('hero'), true)
  assert.equal(result.includes('contact'), true)
})
test('41 usa ordem padrão como fallback', () => assert.deepEqual(resolveSections({ template: 'portfolio-app', preferredOrder: undefined }), getTemplateDefinition('portfolio-app').defaultSectionOrder))
test('42 array vazio intencional retorna somente seções obrigatórias', () => assert.deepEqual(resolveSections({ template: 'portfolio-app', preferredOrder: [] }), ['hero', 'contact']))
test('43 resolução de seções não modifica entradas', () => {
  const input = { template: getTemplateDefinition('portfolio-app'), visibility: { projects: false }, preferredOrder: ['contact', 'hero'] }
  const before = structuredClone(input)
  resolveSections(input)
  assert.deepEqual(input, before)
})
test('44 resolução de seções é determinística', () => {
  const input = { template: 'portfolio-app', visibility: { resume: false }, preferredOrder: ['hero', 'projects'] }
  assert.deepEqual(resolveSections(input), resolveSections(input))
})

// Capabilities — 45 a 50
test('45 consulta capacidade existente', () => assert.equal(templateSupportsCapability('portfolio-app', 'projects'), true))
test('46 capacidade inexistente retorna false', () => assert.equal(templateSupportsCapability('portfolio-app', 'teletransporte'), false))
test('47 portfólio suporta projetos', () => assert.equal(hasTemplateCapability(getTemplateDefinition('portfolio-app'), 'projects'), true))
test('48 portfólio suporta estudos de caso', () => assert.equal(templateSupportsCapability('portfolio-app', 'caseStudies'), true))
test('49 landing page suporta lead capture', () => assert.equal(templateSupportsCapability('landing-page', 'leadCapture'), true))
test('50 template não recebe capacidade de outro template', () => {
  const portfolio = getTemplateDefinition('portfolio-app')
  const institutional = getTemplateDefinition('institutional')
  portfolio.capabilities.team = true
  assert.equal(institutional.capabilities.team, true)
  assert.equal(getTemplateDefinition('portfolio-app').capabilities.team, false)
  assert.equal(createCapabilities('team').projects, false)
})

// Compatibilidade — 51 a 67
test('51 classification atual continua válida', () => {
  for (const classification of siteClassifications) assert.equal(normalizeSiteConfig({ siteClassificationId: classification.id }).siteClassificationId, classification.id)
})
test('52 alias legado landing-conversion resolve landing-page', () => assert.equal(getCanonicalTemplateId('landing-conversion'), 'landing-page'))
test('53 siteConfig persistido permanece sem campo obrigatório de template', () => {
  const normalized = normalizeSiteConfig(siteConfig)
  assert.equal('templateId' in normalized, false)
  assert.equal(normalized.siteClassificationId, siteConfig.siteClassificationId)
})
test('54 chaves do localStorage permanecem iguais', () => assert.deepEqual([SITE_STORAGE_KEY, PROJECTS_STORAGE_KEY, CONTACT_STORAGE_KEY], ['jd-portfolio-site-v1', 'jd-portfolio-projects-v1', 'jd-contact-last-submit']))
test('55 backup v1.8.4 permanece normalizável', () => {
  const backup = { appVersion: '1.8.4', version: 2, site: cloneConfigValue(siteConfig), projects: cloneConfigValue(defaultProjects) }
  assert.equal(normalizeSiteConfig(backup.site).name, siteConfig.name)
  assert.equal(backup.projects.length, defaultProjects.length)
})
test('56 composição pública declarada corresponde à composição atual', () => assert.deepEqual(getTemplateDefinition('portfolio-app').sections, ['hero', 'specialties', 'projects', 'about', 'credibility', 'resume', 'contact', 'footer']))
test('57 ordem pública permanece a mesma', () => assert.deepEqual(getDefaultTemplateSections('portfolio-app'), Object.keys(siteConfig.sectionVisibility)))
test('58 textos públicos permanecem os textos do portfólio', () => {
  const copy = getClassificationPresentation(resolvePublicTemplate('institutional').id)
  assert.equal(copy.navProjects, 'Portfólio')
  assert.equal(copy.heroCta, 'Ver portfólio')
  assert.equal(copy.contactTitle, 'Dados e sistemas podem ser mais simples.')
})
test('59 mesmas seções públicas permanecem disponíveis', () => {
  for (const id of Object.keys(siteConfig.sectionVisibility)) assert.equal(templateAllowsSection('portfolio-app', id), true)
})
test('60 mesmos projetos públicos permanecem selecionados', () => assert.deepEqual(selectPublicProjects(defaultProjects), defaultProjects.filter((project) => project.featured !== false)))
test('61 links de conteúdo não são alterados pela resolução', () => {
  const links = { email: siteConfig.email, linkedin: siteConfig.linkedin, github: siteConfig.github, resumeUrl: siteConfig.resumeUrl }
  resolvePublicTemplate('institutional')
  assert.deepEqual({ email: siteConfig.email, linkedin: siteConfig.linkedin, github: siteConfig.github, resumeUrl: siteConfig.resumeUrl }, links)
})
test('62 dados usados por modais de projetos permanecem intactos', () => {
  const projects = cloneConfigValue(defaultProjects)
  const before = structuredClone(projects)
  resolveTemplate({ requestedTemplateId: 'landing-page', context: TEMPLATE_CONTEXT.ADMIN_PREVIEW })
  assert.deepEqual(projects, before)
})
test('63 login permanece fora das responsabilidades do motor', () => {
  for (const template of listTemplates()) assert.equal(template.supportedContent.includes('authentication'), false)
})
test('64 painel permanece fora das definições declarativas', () => {
  for (const template of listTemplates()) {
    assert.equal('adminState' in template, false)
    assert.equal('component' in template, false)
  }
})
test('65 nenhuma migration de configuração foi criada pela etapa', () => assert.deepEqual(SITE_CONFIG_MIGRATIONS.map(({ from, to }) => [from, to]), [[0, 1], [1, 2]]))
test('66 resolução é pura e não precisa acessar Supabase ou armazenamento', () => {
  const before = cloneConfigValue(siteConfig)
  assert.doesNotThrow(() => resolveTemplate({ requestedTemplateId: 'institutional', context: TEMPLATE_CONTEXT.ADMIN_PREVIEW }))
  assert.deepEqual(siteConfig, before)
})
test('67 nenhum template futuro é publicado', () => {
  assert.equal(DEFAULT_TEMPLATE_ID, 'portfolio-app')
  assert.equal(PUBLIC_TEMPLATE_ID, 'portfolio-app')
  assert.equal(PUBLIC_SITE_CLASSIFICATION_ID, 'portfolio-app')
  assert.equal(isTemplatePubliclyAllowed('portfolio-app'), true)
  for (const id of futureTemplateIds) {
    assert.equal(isTemplatePubliclyAllowed(id), false)
    assert.equal(resolvePublicTemplate(id).id, 'portfolio-app')
  }
  assert.equal(listTemplates({ publicOnly: true }).length, 1)
  assert.equal(listSections().every((section) => Boolean(getSectionDefinition(section.id))), true)
})
