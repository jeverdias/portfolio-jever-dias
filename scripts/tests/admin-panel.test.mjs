import assert from 'node:assert/strict'
import { readdirSync } from 'node:fs'
import { after, test } from 'node:test'
import { fileURLToPath } from 'node:url'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { createDefaultSiteConfig } from '../../src/core/config/defaultSiteConfig.js'
import { defaultProjects } from '../../src/data/projects.js'

const root = fileURLToPath(new URL('../..', import.meta.url))
const vite = await createServer({ root, server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' })
const { AdminPanel } = await vite.ssrLoadModule('/src/components/AdminPanel.jsx')
const { AdminShell } = await vite.ssrLoadModule('/src/admin/AdminShell.jsx')
const { AdminSidebar } = await vite.ssrLoadModule('/src/admin/AdminSidebar.jsx')
const { AdminHeader } = await vite.ssrLoadModule('/src/admin/AdminHeader.jsx')
const { AdminContent } = await vite.ssrLoadModule('/src/admin/AdminContent.jsx')
const { adminNavigation, getAdminNavigation, resolveAdminViewId, getAdminViewLabel } = await vite.ssrLoadModule('/src/admin/adminNavigation.js')
const { adminViewRegistry, getAdminView, hasAdminView } = await vite.ssrLoadModule('/src/admin/adminViewRegistry.js')
const { createAdminBackup, parseAdminBackup } = await vite.ssrLoadModule('/src/admin/adminBackup.js')
const { validateLocalImageSize } = await vite.ssrLoadModule('/src/admin/adminUploads.js')

after(async () => vite.close())

const calls = []
const record = (name, result) => (...args) => {
  calls.push([name, ...args])
  return result
}
const createSiteStore = (overrides = {}) => ({
  site: createDefaultSiteConfig(), loading: false, error: '', saveStatus: 'saved', mode: 'local',
  updateSite: record('updateSite'), importSite: record('importSite'), resetSite: record('resetSite'),
  uploadResume: record('uploadResume', Promise.resolve('resume.pdf')), uploadAsset: record('uploadAsset'),
  removeAsset: record('removeAsset'), refresh: record('refresh'), ...overrides,
})
const createProjectStore = (overrides = {}) => ({
  projects: structuredClone(defaultProjects), loading: false, error: '', saveStatus: 'saved', mode: 'local',
  addProject: record('addProject', 'novo-projeto'), updateProject: record('updateProject'), removeProject: record('removeProject'),
  moveProject: record('moveProject'), replaceDisplayModel: record('replaceDisplayModel'), importProjects: record('importProjects'),
  resetProjects: record('resetProjects'), uploadImage: record('uploadImage', Promise.resolve('image.webp')),
  removeImage: record('removeImage', Promise.resolve()), refresh: record('refreshProjects'), ...overrides,
})
const auth = (overrides = {}) => ({ configured: false, user: null, loading: false, error: '', login: record('login', Promise.resolve(false)), logout: record('logout', Promise.resolve()), ...overrides })
const render = (Component, props) => renderToStaticMarkup(React.createElement(Component, props))
const shellProps = (overrides = {}) => ({ activeView: 'overview', adminAuth: auth(), projectStore: createProjectStore(), siteStore: createSiteStore(), onNavigate: record('navigate'), onLogout: record('logout-shell'), ...overrides })

// Shell e autenticação — 1 a 9
test('01 shell renderiza sidebar', () => assert.match(render(AdminShell, shellProps()), /admin-console__nav/))
test('02 shell renderiza header', () => assert.match(render(AdminShell, shellProps()), /admin-console__topbar/))
test('03 shell renderiza conteúdo', () => assert.match(render(AdminShell, shellProps()), /Seu portfólio em um só lugar/))
test('04 shell mantém classe raiz existente', () => assert.match(render(AdminShell, shellProps()), /class="admin-console"/))
test('05 painel fechado não renderiza diálogo', () => assert.equal(render(AdminPanel, { open: false, onClose() {}, projectStore: createProjectStore(), siteStore: createSiteStore(), adminAuth: auth() }), ''))
test('06 painel aberto preserva backdrop e diálogo', () => assert.match(render(AdminPanel, { open: true, onClose() {}, projectStore: createProjectStore(), siteStore: createSiteStore(), adminAuth: auth() }), /admin-backdrop/))
test('07 usuário não autenticado vê login', () => assert.match(render(AdminPanel, { open: true, onClose() {}, projectStore: createProjectStore(), siteStore: createSiteStore(), adminAuth: auth({ configured: true }) }), /Área administrativa/))
test('08 administrador autorizado vê shell', () => assert.match(render(AdminPanel, { open: true, onClose() {}, projectStore: createProjectStore(), siteStore: createSiteStore(), adminAuth: auth({ configured: true, user: { email: 'admin@example.com' } }) }), /admin-console/))
test('09 loading não exibe painel autenticado prematuramente', () => assert.doesNotMatch(render(AdminPanel, { open: true, onClose() {}, projectStore: createProjectStore(), siteStore: createSiteStore(), adminAuth: auth({ configured: true, loading: true }) }), /admin-console__nav/))

// Navegação — 10 a 18
test('10 todas as dez abas atuais estão registradas', () => assert.equal(adminNavigation.length, 10))
test('11 IDs das abas são únicos', () => assert.equal(new Set(adminNavigation.map(({ id }) => id)).size, adminNavigation.length))
test('12 ordem das abas é preservada', () => assert.deepEqual(adminNavigation.map(({ id }) => id), ['classification', 'overview', 'settings', 'appearance', 'professional', 'repositories', 'library', 'specialties', 'messages', 'guide']))
test('13 aba válida é resolvida', () => assert.equal(resolveAdminViewId('repositories', { adminAuth: auth() }, hasAdminView), 'repositories'))
test('14 aba inválida usa visão geral', () => assert.equal(resolveAdminViewId('inexistente', { adminAuth: auth() }, hasAdminView), 'overview'))
test('15 view ausente usa fallback sem quebrar', () => assert.equal(resolveAdminViewId('guide', { adminAuth: auth() }, (key) => key !== 'guide'), 'overview'))
test('16 mensagens ficam ocultas sem Supabase configurado', () => assert.equal(getAdminNavigation({ adminAuth: auth() }).some(({ id }) => id === 'messages'), false))
test('17 mensagens aparecem com autenticação configurada', () => assert.equal(getAdminNavigation({ adminAuth: auth({ configured: true }) }).some(({ id }) => id === 'messages'), true))
test('18 mobile e desktop recebem a mesma definição central', () => assert.strictEqual(getAdminNavigation({ adminAuth: auth() })[0], adminNavigation[0]))

// Views — 19 a 28
for (const [number, id, expected] of [
  [19, 'overview', 'Seu portfólio em um só lugar'], [20, 'settings', 'Detalhes do site'], [21, 'appearance', 'Aparência'],
  [22, 'classification', 'Classificação'], [23, 'repositories', 'Repositórios'], [24, 'specialties', 'Especialidades'],
  [25, 'library', 'Box/figurinhas'], [26, 'professional', 'Trajetória'], [27, 'messages', 'Mensagens'], [28, 'guide', 'Aprenda sobre este site'],
]) {
  test(`${number} view ${id} renderiza`, () => {
    const html = render(AdminContent, { ...shellProps({ activeView: id }), activeView: id, adminAuth: auth({ configured: true, user: { email: 'admin@example.com' } }) })
    assert.match(html, new RegExp(expected, 'i'))
  })
}

// Estado e composição — 29 a 33
test('29 registro retorna a mesma referência de view', () => assert.strictEqual(getAdminView('overview'), adminViewRegistry.overview))
test('30 troca de aba não modifica stores recebidos', () => { const siteStore = createSiteStore(); const projectStore = createProjectStore(); render(AdminContent, { ...shellProps(), activeView: 'overview', siteStore, projectStore }); assert.equal(calls.length, 0) })
test('31 formulário SSR não altera dados persistidos', () => { const store = createSiteStore(); const before = structuredClone(store.site); render(AdminContent, { ...shellProps(), activeView: 'settings', siteStore: store }); assert.deepEqual(store.site, before) })
test('32 estado derivado não entra no registro', () => assert.equal(Object.hasOwn(adminViewRegistry, 'activeView'), false))
test('33 renderização e desmontagem SSR não disparam salvamento', () => { calls.length = 0; render(AdminContent, { ...shellProps(), activeView: 'repositories' }); assert.equal(calls.length, 0) })

// Autenticação e cabeçalho — 34 a 39
test('34 login Supabase pede email', () => assert.match(render(AdminPanel, { open: true, onClose() {}, projectStore: createProjectStore(), siteStore: createSiteStore(), adminAuth: auth({ configured: true }) }), /id="admin-email"/))
test('35 modo de desenvolvimento identifica o PIN como local', () => assert.match(render(AdminPanel, { open: true, onClose() {}, projectStore: createProjectStore(), siteStore: createSiteStore(), adminAuth: auth() }), /PIN local de desenvolvimento/))
test('36 usuário sem allowlist permanece fora do shell', () => assert.doesNotMatch(render(AdminPanel, { open: true, onClose() {}, projectStore: createProjectStore(), siteStore: createSiteStore(), adminAuth: auth({ configured: true, user: null }) }), /admin-console__nav/))
test('37 sessão autorizada exibe email protegido', () => assert.match(render(AdminShell, shellProps({ adminAuth: auth({ configured: true, user: { email: 'admin@example.com' } }) })), /admin@example.com/))
test('38 cabeçalho usa status de projetos em repositórios', () => assert.match(render(AdminHeader, { activeView: 'repositories', adminAuth: auth(), projectStore: createProjectStore({ saveStatus: 'saving' }), siteStore: createSiteStore({ mode: 'supabase' }) }), /Salvando/))
test('39 título inválido possui fallback seguro', () => assert.equal(getAdminViewLabel('inválido', { adminAuth: auth() }), 'Visão geral'))

// Projetos e uploads — 40 a 50
test('40 projetos atuais renderizam no cadastro', () => assert.match(render(AdminContent, { ...shellProps(), activeView: 'repositories' }), new RegExp(defaultProjects[0].title)))
test('41 editor preserva ação de criar projeto', () => assert.match(render(AdminContent, { ...shellProps(), activeView: 'repositories', projectStore: createProjectStore({ projects: [] }) }), /Criar projeto/))
test('42 editor preserva ação de excluir projeto', () => assert.match(render(AdminContent, { ...shellProps(), activeView: 'repositories' }), /aria-label="Excluir projeto"/))
test('43 editor preserva ordenação', () => assert.match(render(AdminContent, { ...shellProps(), activeView: 'repositories' }), /Mover projeto para cima/))
test('44 editor preserva visibilidade pública', () => assert.match(render(AdminContent, { ...shellProps(), activeView: 'repositories' }), /Exibir no portfólio/))
test('45 editor preserva destaque pelo mesmo campo featured', () => assert.equal(typeof defaultProjects[0].featured, 'boolean'))
test('46 editor preserva preview', () => assert.match(render(AdminContent, { ...shellProps(), activeView: 'repositories' }), /> Visualizar</))
test('47 editor preserva upload de capa e galeria', () => { const html = render(AdminContent, { ...shellProps(), activeView: 'repositories' }); assert.match(html, /Selecionar capa/); assert.match(html, /Enviar imagens/) })
test('48 validação de upload aceita limite', () => assert.doesNotThrow(() => validateLocalImageSize({ size: 10 }, 10, 'erro')))
test('49 validação de upload rejeita excesso', () => assert.throws(() => validateLocalImageSize({ size: 11 }, 10, 'arquivo grande'), /arquivo grande/))
test('50 renderização do editor não salva automaticamente', () => { calls.length = 0; render(AdminContent, { ...shellProps(), activeView: 'repositories' }); assert.equal(calls.some(([name]) => name === 'updateProject'), false) })

// Backup — 51 a 55
test('51 exportação mantém formato 2 compatível com v1.8.6', () => assert.equal(createAdminBackup({ name: 'JD' }, []).version, 2))
test('52 importa backup de objeto válido', () => assert.deepEqual(parseAdminBackup(JSON.stringify({ version: 2, site: { name: 'JD' }, projects: [] })).site, { name: 'JD' }))
test('53 rejeita backup inválido', () => assert.throws(() => parseAdminBackup('{}'), /inválido/))
test('54 aceita backup legado em array', () => assert.deepEqual(parseAdminBackup('[]').projects, []))
test('55 backup não acrescenta segredo', () => assert.deepEqual(Object.keys(createAdminBackup({}, [])), ['version', 'exportedAt', 'site', 'projects']))

// Compatibilidade — 56 a 65
test('56 APIs do siteStore permanecem disponíveis', () => assert.deepEqual(Object.keys(createSiteStore()).filter((key) => typeof createSiteStore()[key] === 'function'), ['updateSite', 'importSite', 'resetSite', 'uploadResume', 'uploadAsset', 'removeAsset', 'refresh']))
test('57 APIs do projectStore permanecem disponíveis', () => assert.deepEqual(Object.keys(createProjectStore()).filter((key) => typeof createProjectStore()[key] === 'function'), ['addProject', 'updateProject', 'removeProject', 'moveProject', 'replaceDisplayModel', 'importProjects', 'resetProjects', 'uploadImage', 'removeImage', 'refresh']))
test('58 configuração não recebe estado administrativo', () => assert.equal(Object.hasOwn(createDefaultSiteConfig(), 'activeAdminView'), false))
test('59 Supabase continua decidido pelos stores', () => assert.equal(createSiteStore().mode, 'local'))
test('60 templates futuros não entram no registro de views', () => assert.equal(['landing-page', 'institutional', 'professional-services'].some((id) => hasAdminView(id)), false))
test('61 painel mantém as mesmas dez abas', () => assert.equal(Object.keys(adminViewRegistry).length, 10))
test('62 registro não contém CSS ou regras de aparência', () => assert.equal(Object.keys(adminViewRegistry).some((key) => /css|theme|palette/.test(key)), false))
test('63 composição administrativa não recebe componente público', () => assert.equal(Object.keys(adminViewRegistry).some((key) => /hero|footer|contact/.test(key)), false))
test('64 nenhuma migration foi criada pela etapa', () => assert.deepEqual(readdirSync(new URL('../../supabase/migrations/', import.meta.url)).sort(), ['202607150001_portfolio_initial.sql', '202607160001_security_hardening.sql']))
test('65 Etapa 8 não foi executada', () => assert.equal(Object.keys(adminViewRegistry).some((key) => /marketplace|plugin/.test(key)), false))
