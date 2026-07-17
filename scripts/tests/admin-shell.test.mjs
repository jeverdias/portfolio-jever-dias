import assert from 'node:assert/strict'
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
const { adminNavigation, getAdminNavigation, getAdminViewLabel, resolveAdminViewId } = await vite.ssrLoadModule('/src/admin/adminNavigation.js')

after(async () => vite.close())

const calls = []
const record = (name, result) => (...args) => { calls.push([name, ...args]); return result }
const siteStore = () => ({
  site: createDefaultSiteConfig(), mode: 'local', saveStatus: 'saved', updateSite: record('updateSite'),
  importSite: record('importSite'), resetSite: record('resetSite'), uploadResume: record('uploadResume'),
})
const projectStore = () => ({
  projects: structuredClone(defaultProjects), mode: 'local', saveStatus: 'saved', addProject: record('addProject', 'novo'),
  updateProject: record('updateProject'), removeProject: record('removeProject'), moveProject: record('moveProject'),
  replaceDisplayModel: record('replaceDisplayModel'), importProjects: record('importProjects'),
})
const auth = (overrides = {}) => ({ configured: false, user: null, loading: false, error: '', login: record('login', Promise.resolve(false)), logout: record('logout', Promise.resolve()), ...overrides })
const render = (Component, props) => renderToStaticMarkup(React.createElement(Component, props))
const shellProps = (overrides = {}) => ({
  activeView: 'overview', adminAuth: auth(), projectStore: projectStore(), siteStore: siteStore(),
  onNavigate: record('navigate'), onLogout: record('logout-shell'), children: React.createElement('div', { id: 'conteudo-admin' }, 'Conteúdo'), ...overrides,
})

test('01 shell renderiza sidebar', () => assert.match(render(AdminShell, shellProps()), /admin-console__nav/))
test('02 shell renderiza header', () => assert.match(render(AdminShell, shellProps()), /admin-console__topbar/))
test('03 shell renderiza conteúdo recebido', () => assert.match(render(AdminShell, shellProps()), /id="conteudo-admin"/))
test('04 shell mantém classe raiz existente', () => assert.match(render(AdminShell, shellProps()), /class="admin-console"/))
test('05 painel fechado não renderiza diálogo', () => assert.equal(render(AdminPanel, { open: false, onClose() {}, projectStore: projectStore(), siteStore: siteStore(), adminAuth: auth() }), ''))
test('06 painel aberto preserva backdrop', () => assert.match(render(AdminPanel, { open: true, onClose() {}, projectStore: projectStore(), siteStore: siteStore(), adminAuth: auth() }), /admin-backdrop/))
test('07 painel preserva diálogo acessível', () => assert.match(render(AdminPanel, { open: true, onClose() {}, projectStore: projectStore(), siteStore: siteStore(), adminAuth: auth() }), /aria-modal="true"/))
test('08 usuário não autenticado vê login', () => assert.match(render(AdminPanel, { open: true, onClose() {}, projectStore: projectStore(), siteStore: siteStore(), adminAuth: auth({ configured: true }) }), /Área administrativa/))
test('09 administrador autorizado vê shell e views legadas', () => assert.match(render(AdminPanel, { open: true, onClose() {}, projectStore: projectStore(), siteStore: siteStore(), adminAuth: auth({ configured: true, user: { email: 'admin@example.com' } }) }), /Seu portfólio em um só lugar/))
test('10 loading não exibe shell prematuramente', () => assert.doesNotMatch(render(AdminPanel, { open: true, onClose() {}, projectStore: projectStore(), siteStore: siteStore(), adminAuth: auth({ configured: true, loading: true }) }), /admin-console__nav/))
test('11 todas as dez abas atuais estão centralizadas', () => assert.equal(adminNavigation.length, 10))
test('12 IDs das abas são únicos', () => assert.equal(new Set(adminNavigation.map(({ id }) => id)).size, 10))
test('13 ordem das abas é preservada', () => assert.deepEqual(adminNavigation.map(({ id }) => id), ['classification', 'overview', 'settings', 'appearance', 'professional', 'repositories', 'library', 'specialties', 'messages', 'guide']))
test('14 aba válida é resolvida', () => assert.equal(resolveAdminViewId('repositories', { adminAuth: auth() }), 'repositories'))
test('15 aba inválida usa visão geral', () => assert.equal(resolveAdminViewId('inexistente', { adminAuth: auth() }), 'overview'))
test('16 item oculto não aparece', () => assert.equal(getAdminNavigation({ adminAuth: auth() }).some(({ id }) => id === 'messages'), false))
test('17 mensagens aparecem com autenticação configurada', () => assert.equal(getAdminNavigation({ adminAuth: auth({ configured: true }) }).some(({ id }) => id === 'messages'), true))
test('18 mobile e desktop compartilham a mesma definição', () => assert.strictEqual(getAdminNavigation({ adminAuth: auth() })[0], adminNavigation[0]))
test('19 título especial de trajetória é preservado', () => assert.equal(getAdminViewLabel('professional', { adminAuth: auth() }), 'Trajetória e métricas'))
test('20 título inválido possui fallback seguro', () => assert.equal(getAdminViewLabel('inválido', { adminAuth: auth() }), 'Visão geral'))
test('21 sidebar local renderiza nove itens', () => { const element = AdminSidebar({ activeView: 'overview', adminAuth: auth(), site: createDefaultSiteConfig(), onNavigate() {}, onLogout() {} }); assert.equal(element.props.children[1].props.children.length, 9) })
test('22 sidebar configurada renderiza dez itens', () => { const element = AdminSidebar({ activeView: 'overview', adminAuth: auth({ configured: true }), site: createDefaultSiteConfig(), onNavigate() {}, onLogout() {} }); assert.equal(element.props.children[1].props.children.length, 10) })
test('23 clique da sidebar aciona navegação', () => { calls.length = 0; const element = AdminSidebar({ activeView: 'overview', adminAuth: auth(), site: createDefaultSiteConfig(), onNavigate: record('navigate-item'), onLogout() {} }); element.props.children[1].props.children[0].props.onClick(); assert.deepEqual(calls[0], ['navigate-item', 'classification']) })
test('24 botão de logout aciona callback do shell', () => { calls.length = 0; const element = AdminSidebar({ activeView: 'overview', adminAuth: auth(), site: createDefaultSiteConfig(), onNavigate() {}, onLogout: record('logout-item') }); element.props.children[3].props.onClick(); assert.deepEqual(calls[0], ['logout-item']) })
