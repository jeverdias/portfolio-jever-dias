import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { extname, join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../../', import.meta.url))
const read = (path) => readFileSync(join(root, path), 'utf8').replace(/\r\n/g, '\n')
const main = read('src/main.jsx')
const index = read('src/styles/index.css')
const tokens = read('src/styles/tokens.css')
const packageJson = JSON.parse(read('package.json'))
const fontImport = index.trim().split('\n')[0]
const modulePaths = [
  'themes/classifications-foundation.css',
  'base.css',
  'public/site-intro.css',
  'public/specialties.css',
  'components/specialties-modal.css',
  'public/projects.css',
  'public/site-content.css',
  'components/contact-modal.css',
  'components/portfolio-guide-modal.css',
  'public/site-closing.css',
  'components/project-modal.css',
  'public/project-detail.css',
  'admin/core.css',
  'admin/legacy.css',
  'admin/shell.css',
  'admin/views.css',
  'admin/projects.css',
  'admin/library.css',
  'admin/guide.css',
  'animations.css',
  'responsive/main.css',
  'responsive/reduced-motion-early.css',
  'themes/appearance.css',
  'themes/admin-previews.css',
  'themes/classifications-preview.css',
  'themes/classifications-structures.css',
  'themes/classifications-late.css',
  'admin/messages-late.css',
  'status/focus.css',
  'responsive/reduced-motion-final.css',
]
const modules = Object.fromEntries(modulePaths.map((path) => [path, read(`src/styles/${path}`)]))
const expectedImports = ['tokens.css', ...modulePaths]
const expectedIndex = [fontImport, ...expectedImports.map((path) => `@import "./${path}";`)].join('\n')
const effectiveSources = [tokens, ...modulePaths.map((path) => modules[path])]
const compactBoundaries = new Set(['admin/legacy.css', 'admin/views.css', 'admin/projects.css'])

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? sourceFiles(path) : [path]
  })
}

test('01 main imports the single modular entry point', () => assert.match(main, /import ['"]\.\/styles\/index\.css['"]/))
test('02 main does not import legacy global directly', () => assert.doesNotMatch(main, /import ['"]\.\/styles\/global\.css['"]/))
test('03 fonts remain the first and only remote import', () => {
  assert.match(fontImport, /^@import url\('https:\/\/fonts\.googleapis\.com\/css2\?/)
  assert.equal(([index, ...effectiveSources].join('\n').match(/fonts\.googleapis\.com\/css2/g) || []).length, 1)
})
test('04 tokens remain the first local import', () => assert.equal(index.trim().split('\n')[1], '@import "./tokens.css";'))
test('05 index contains only authorized imports in physical order', () => assert.equal(index.trim(), expectedIndex))
test('06 tokens retain a single canonical root', () => assert.equal((tokens.match(/:root\s*\{/g) || []).length, 1))
test('07 physical reconstruction is byte-equivalent to the original source', () => {
  let effective = `${fontImport}\n\n${tokens.trimEnd()}`
  for (const path of modulePaths) effective += `${compactBoundaries.has(path) ? '\n' : '\n\n'}${modules[path].trimEnd()}`
  effective += '\n'
  assert.equal(createHash('sha256').update(effective).digest('hex'), '47dc37021e0d1075930947bf59a43a12f8bde688d0fe248d196a746775d37e82')
})
test('08 global.css was removed after complete extraction', () => assert.equal(existsSync(join(root, 'src/styles/global.css')), false))
test('09 tokens contain no classifications', () => assert.doesNotMatch(tokens, /data-(?:site-classification|classification-preview)/))
test('10 tokens contain no media queries', () => assert.doesNotMatch(tokens, /@media\b/))
test('11 tokens contain no administrative selector', () => assert.doesNotMatch(tokens, /\.admin[-_]/))
test('12 tokens contain no public component selector', () => assert.doesNotMatch(tokens, /\.(?:hero|project|specialty|site-header|footer|contact)[-_\s:{]/))
test('13 foundational classifications retain their four media queries', () => {
  const foundation = modules['themes/classifications-foundation.css']
  assert.match(foundation, /^\/\* Classifica/)
  assert.equal((foundation.match(/@media\b/g) || []).length, 4)
  assert.ok(foundation.indexOf('.admin-classification') < foundation.indexOf("html[data-site-classification='institutional']"))
})
test('14 animations start at the former global boundary', () => assert.match(modules['animations.css'], /^@keyframes fade-in\b/))
test('15 architecture does not introduce layers', () => assert.doesNotMatch([index, ...effectiveSources].join('\n'), /@layer\b/))
test('16 shared button and section retain their physical position', () => {
  const siteIntro = modules['public/site-intro.css']
  assert.ok(siteIntro.indexOf('.hero') < siteIntro.indexOf('.button {'))
  assert.ok(siteIntro.indexOf('.button {') < siteIntro.indexOf('.section {'))
  assert.ok(siteIntro.indexOf('.section {') < siteIntro.indexOf('.text-link:hover'))
})
test('17 public modals remain separated in physical order', () => {
  assert.ok(expectedImports.indexOf('components/specialties-modal.css') < expectedImports.indexOf('public/projects.css'))
  assert.ok(expectedImports.indexOf('components/contact-modal.css') < expectedImports.indexOf('components/portfolio-guide-modal.css'))
  assert.ok(expectedImports.indexOf('components/portfolio-guide-modal.css') < expectedImports.indexOf('public/site-closing.css'))
  assert.ok(expectedImports.indexOf('public/site-closing.css') < expectedImports.indexOf('components/project-modal.css'))
})
test('18 initial admin modules remain before animations', () => {
  const adminPaths = ['admin/core.css', 'admin/legacy.css', 'admin/shell.css', 'admin/views.css', 'admin/projects.css', 'admin/library.css', 'admin/guide.css']
  assert.deepEqual(expectedImports.slice(expectedImports.indexOf('admin/core.css'), expectedImports.indexOf('animations.css')), adminPaths)
})
test('19 initial admin modules do not anticipate responsive or theme rules', () => {
  const paths = ['admin/core.css', 'admin/legacy.css', 'admin/shell.css', 'admin/views.css', 'admin/projects.css', 'admin/library.css', 'admin/guide.css']
  const sources = paths.map((path) => modules[path]).join('\n')
  assert.doesNotMatch(sources, /@media\b|@keyframes\b|data-design|data-site-classification/)
})
test('20 late modules preserve their exact physical order', () => {
  const order = ['animations.css', 'responsive/main.css', 'responsive/reduced-motion-early.css', 'themes/appearance.css', 'themes/admin-previews.css', 'themes/classifications-preview.css', 'themes/classifications-structures.css', 'themes/classifications-late.css', 'admin/messages-late.css', 'status/focus.css', 'responsive/reduced-motion-final.css']
  assert.deepEqual(modulePaths.slice(-order.length), order)
})
test('21 all fourteen media queries are preserved', () => {
  const counts = {
    'themes/classifications-foundation.css': 4,
    'responsive/main.css': 3,
    'responsive/reduced-motion-early.css': 1,
    'themes/admin-previews.css': 2,
    'themes/classifications-structures.css': 1,
    'themes/classifications-late.css': 1,
    'admin/messages-late.css': 1,
    'responsive/reduced-motion-final.css': 1,
  }
  for (const [path, count] of Object.entries(counts)) assert.equal((modules[path].match(/@media\b/g) || []).length, count)
  assert.equal((effectiveSources.join('\n').match(/@media\b/g) || []).length, 14)
})
test('22 all eight keyframes are preserved at their original positions', () => {
  assert.equal((modules['animations.css'].match(/@keyframes\b/g) || []).length, 7)
  assert.equal((modules['admin/messages-late.css'].match(/@keyframes\b/g) || []).length, 1)
  assert.equal((effectiveSources.join('\n').match(/@keyframes\b/g) || []).length, 8)
})
test('23 all twelve important declarations are preserved', () => assert.equal((effectiveSources.join('\n').match(/!important/g) || []).length, 12))
test('24 appearance retains designs, light scheme and admin UI', () => {
  const appearance = modules['themes/appearance.css']
  assert.match(appearance, /data-design='jd-modern'/)
  assert.match(appearance, /data-design='compact-pro'/)
  assert.match(appearance, /data-color-scheme='light'/)
  assert.match(appearance, /\.admin-appearance\b/)
  assert.match(appearance, /\.model-preview--assistant\b/)
})
test('25 late previews remain after appearance', () => {
  assert.ok(expectedImports.indexOf('themes/appearance.css') < expectedImports.indexOf('themes/admin-previews.css'))
  assert.match(modules['themes/admin-previews.css'], /administrativas v1\.2/)
  assert.match(modules['themes/admin-previews.css'], /\.project-change-preview\b/)
})
test('26 classification generations remain explicit and ordered', () => {
  assert.ok(expectedImports.indexOf('themes/classifications-foundation.css') < expectedImports.indexOf('themes/classifications-preview.css'))
  assert.ok(expectedImports.indexOf('themes/classifications-preview.css') < expectedImports.indexOf('themes/classifications-structures.css'))
  assert.ok(expectedImports.indexOf('themes/classifications-structures.css') < expectedImports.indexOf('themes/classifications-late.css'))
  assert.match(modules['themes/classifications-structures.css'], /landing-highlights/)
  assert.match(modules['themes/classifications-late.css'], /data-site-classification='institutional'/)
  assert.match(modules['themes/classifications-late.css'], /data-site-classification='professional-services'/)
})
test('27 messages and synchronization remain late', () => {
  const messages = modules['admin/messages-late.css']
  assert.match(messages, /\.admin-messages\b/)
  assert.match(messages, /Estado real da sincroniza/)
  assert.match(messages, /@keyframes admin-spin/)
  assert.ok(expectedImports.indexOf('themes/classifications-late.css') < expectedImports.indexOf('admin/messages-late.css'))
})
test('28 final reduced motion is the last effective block', () => {
  assert.equal(expectedImports.at(-1), 'responsive/reduced-motion-final.css')
  assert.match(modules['responsive/reduced-motion-final.css'], /^@media \(prefers-reduced-motion: reduce\)/)
  assert.match(modules['responsive/reduced-motion-final.css'], /transition-duration:\.01ms !important/)
})
test('29 moved block signatures have a single owner', () => {
  const signatures = ['@keyframes fade-in', '.admin-appearance {', '.project-change-preview > main', "data-classification-preview='course-membership'", '.landing-admin-fields {', '.structure-preview__event-hero {', '@keyframes admin-spin', ':where(a,button,input,select,textarea,[tabindex]):focus-visible', 'scroll-behavior:auto !important']
  for (const signature of signatures) assert.equal(effectiveSources.filter((source) => source.includes(signature)).length, 1)
})
test('30 no component imports CSS directly', () => {
  const imports = sourceFiles(join(root, 'src')).filter((path) => ['.js', '.jsx'].includes(extname(path))).flatMap((path) => {
    const relative = path.slice(root.length).replaceAll('\\', '/')
    return [...readFileSync(path, 'utf8').matchAll(/import\s+['"]([^'"]+\.css)['"]/g)].map((match) => [relative, match[1]])
  })
  assert.deepEqual(imports, [['src/main.jsx', './styles/index.css']])
})
test('31 every local CSS file is imported exactly once', () => {
  assert.equal((main.match(/styles\/index\.css/g) || []).length, 1)
  for (const path of expectedImports) assert.equal((index.match(new RegExp(`\\./${path.replaceAll('.', '\\.').replaceAll('/', '\\/')}`, 'g')) || []).length, 1)
})
test('32 version closes the CSS architecture work at v1.8.8', () => assert.equal(packageJson.version, '1.8.8'))
test('33 public template policy remains portfolio only', async () => {
  const { listTemplates } = await import('../../src/core/site-engine/templateRegistry.js')
  assert.deepEqual(listTemplates({ publicOnly: true }).map(({ id }) => id), ['portfolio-app'])
})
