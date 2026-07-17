import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readdirSync, readFileSync } from 'node:fs'
import { extname, join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../../', import.meta.url))
const read = (path) => readFileSync(join(root, path), 'utf8').replace(/\r\n/g, '\n')
const main = read('src/main.jsx')
const index = read('src/styles/index.css')
const tokens = read('src/styles/tokens.css')
const global = read('src/styles/global.css')
const packageJson = JSON.parse(read('package.json'))
const fontImport = "@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=Barlow:wght@400;500;600;700&family=Bebas+Neue&family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@400;500;600;700&family=Fira+Sans:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&family=Libre+Baskerville:wght@400;700&family=Lora:wght@500;600;700&family=Manrope:wght@500;600;700;800&family=Merriweather:wght@400;700&family=Montserrat:wght@400;500;600;700;800&family=Noto+Serif:wght@400;600;700&family=Nunito+Sans:wght@400;500;600;700&family=Oswald:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&family=Poppins:wght@400;500;600;700&family=Raleway:wght@400;500;600;700&family=Roboto+Slab:wght@500;600;700&family=Rubik:wght@400;500;600;700&family=Sora:wght@400;500;600;700&family=Source+Serif+4:wght@400;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Urbanist:wght@400;500;600;700&family=Work+Sans:wght@400;500;600;700&display=swap');"
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
]
const modules = Object.fromEntries(modulePaths.map((path) => [path, read(`src/styles/${path}`)]))
const expectedImports = ['tokens.css', ...modulePaths, 'global.css']
const expectedIndex = [fontImport, ...expectedImports.map((path) => `@import "./${path}";`)].join('\n')
const effectiveSources = [tokens, ...modulePaths.map((path) => modules[path]), global]
const expectedProperties = [
  ['--bg', '#050814'],
  ['--bg-deep', '#02040b'],
  ['--surface', 'rgba(12, 18, 35, 0.72)'],
  ['--surface-strong', '#0c1223'],
  ['--line', 'rgba(151, 174, 230, 0.13)'],
  ['--line-strong', 'rgba(139, 120, 255, 0.34)'],
  ['--text', '#f7f8ff'],
  ['--muted', '#9ea9c2'],
  ['--blue', '#55b8ff'],
  ['--purple', '#9b5cff'],
  ['--green', '#4de0ad'],
  ['--gradient', 'linear-gradient(110deg, #5aaeff 8%, #8b6cff 51%, #bd55f6 96%)'],
  ['--shadow', '0 28px 80px rgba(0, 0, 0, 0.36)'],
  ['--header-bg', 'rgba(5, 8, 20, 0.72)'],
  ['--glow-one', 'rgba(102, 65, 239, .22)'],
  ['--glow-two', 'rgba(67, 130, 255, .16)'],
  ['--card-radius', '18px'],
  ['--heading-font', "'Manrope', sans-serif"],
  ['--body-font', "'DM Sans', 'Segoe UI', sans-serif"],
  ['--card-shadow', 'var(--shadow)'],
]

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? sourceFiles(path) : [path]
  })
}

test('01 main importa o ponto de entrada modular', () => assert.match(main, /import ['"]\.\/styles\/index\.css['"]/))
test('02 main não importa global diretamente', () => assert.doesNotMatch(main, /import ['"]\.\/styles\/global\.css['"]/))
test('03 fontes são o primeiro import e permanecem idênticas', () => assert.equal(index.trim().split('\n')[0], fontImport))
test('04 tokens são importados antes do global', () => assert.ok(index.indexOf('./tokens.css') < index.indexOf('./global.css')))
test('05 index contém somente os imports autorizados na ordem física original', () => assert.equal(index.trim(), expectedIndex))
test('06 tokens contém um único bloco root canônico', () => assert.equal((tokens.match(/:root\s*\{/g) || []).length, 1))
test('07 propriedades e CSS efetivo permanecem semanticamente idênticos', () => {
  const properties = [...tokens.matchAll(/\s+(--[\w-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2]])
  assert.deepEqual(properties, expectedProperties)
  const effective = `${fontImport}\n\n${effectiveSources.map((source) => source.trimEnd()).join('\n\n')}\n`
  assert.equal(createHash('sha256').update(effective).digest('hex'), '47dc37021e0d1075930947bf59a43a12f8bde688d0fe248d196a746775d37e82')
})
test('08 global não repete o root canônico', () => assert.doesNotMatch(global, /:root\s*\{/))
test('09 import remoto aparece uma única vez', () => assert.equal(([index, ...effectiveSources].join('\n').match(/fonts\.googleapis\.com\/css2/g) || []).length, 1))
test('10 tokens não contém classificação', () => assert.doesNotMatch(tokens, /data-(?:site-classification|classification-preview)/))
test('11 tokens não contém media query', () => assert.doesNotMatch(tokens, /@media\b/))
test('12 tokens não contém seletor administrativo', () => assert.doesNotMatch(tokens, /\.admin[-_]/))
test('13 tokens não contém seletor público de componente', () => assert.doesNotMatch(tokens, /\.(?:hero|project|specialty|site-header|footer|contact)[-_\s:{]/))
test('14 classificações fundacionais preservam as quatro media queries iniciais', () => {
  const foundation = modules['themes/classifications-foundation.css']
  assert.match(foundation, /^\/\* Classificação comercial do site \*\/\n\.admin-classification\b/)
  assert.equal((foundation.match(/@media\b/g) || []).length, 4)
  assert.ok(foundation.indexOf('.admin-classification') < foundation.indexOf("html[data-site-classification='institutional']"))
})
test('15 global começa pelo primeiro bloco administrativo não movido', () => assert.match(global, /^\.admin-panel\b/))
test('16 arquitetura não introduz layer', () => assert.doesNotMatch([index, ...effectiveSources].join('\n'), /@layer\b/))
test('17 button e section permanecem na posição original do site intro', () => {
  const siteIntro = modules['public/site-intro.css']
  assert.ok(siteIntro.indexOf('.hero') < siteIntro.indexOf('.button {'))
  assert.ok(siteIntro.indexOf('.button {') < siteIntro.indexOf('.section {'))
  assert.ok(siteIntro.indexOf('.section {') < siteIntro.indexOf('.text-link:hover'))
})
test('18 modais permanecem separados e na posição física original', () => {
  const specialtyIndex = expectedImports.indexOf('components/specialties-modal.css')
  const contactIndex = expectedImports.indexOf('components/contact-modal.css')
  const guideIndex = expectedImports.indexOf('components/portfolio-guide-modal.css')
  const projectIndex = expectedImports.indexOf('components/project-modal.css')
  assert.ok(specialtyIndex < expectedImports.indexOf('public/projects.css'))
  assert.ok(contactIndex < guideIndex && guideIndex < expectedImports.indexOf('public/site-closing.css'))
  assert.ok(expectedImports.indexOf('public/site-closing.css') < projectIndex)
  assert.ok(projectIndex < expectedImports.indexOf('public/project-detail.css'))
})
test('19 blocos movidos não permanecem no global', () => {
  assert.doesNotMatch(global, /^\.site-shell \{ position: relative; overflow: clip; \}$/m)
  assert.doesNotMatch(global, /^\.specialties-modal \{ position: relative; width: min\(900px, 100%\);/m)
  assert.doesNotMatch(global, /^\.project-filters \{ display: flex; flex-wrap: wrap;/m)
  assert.doesNotMatch(global, /^\.contact-modal \{ position: relative; width: min\(620px, 100%\);/m)
  assert.doesNotMatch(global, /^\.case-page \{ min-height: 100vh;/m)
})
test('20 somente as quatro media queries fundacionais saíram do global', () => {
  assert.equal((global.match(/@media\b/g) || []).length, 10)
  assert.equal((effectiveSources.join('\n').match(/@media\b/g) || []).length, 14)
})
test('21 keyframes, appearance, data-design e mensagens permanecem no global', () => {
  assert.equal((global.match(/@keyframes\b/g) || []).length, 8)
  assert.match(global, /Aparência editável/)
  assert.match(global, /\[data-design=/)
  assert.match(global, /Classificação v1\.5\.1/)
  assert.match(global, /\.admin-messages\b/)
})
test('22 arquivos modulares não repetem assinaturas dos blocos extraídos', () => {
  const signatures = [
    ['themes/classifications-foundation.css', '.admin-classification { display:grid; gap:22px; }'],
    ['base.css', '* { box-sizing: border-box; }'],
    ['public/site-intro.css', '.site-shell { position: relative; overflow: clip; }'],
    ['public/specialties.css', '.specialties-guide { display: flex; justify-content: flex-end;'],
    ['components/specialties-modal.css', '.specialties-modal { position: relative; width: min(900px, 100%);'],
    ['public/projects.css', '.section--projects { background: linear-gradient'],
    ['public/site-content.css', '.about__grid { display: grid; grid-template-columns: 1fr .86fr;'],
    ['components/contact-modal.css', '.contact-modal { position: relative; width: min(620px, 100%);'],
    ['components/portfolio-guide-modal.css', '.portfolio-guide-modal { position: relative; width: min(820px, 100%);'],
    ['public/site-closing.css', '.footer { border-top: 1px solid var(--line);'],
    ['components/project-modal.css', '.project-modal { position: relative; width: min(1080px, 100%);'],
    ['public/project-detail.css', '.case-page { min-height: 100vh;'],
  ]
  for (const [owner, signature] of signatures) {
    assert.equal(effectiveSources.filter((source) => source.includes(signature)).length, 1, `${signature} deve existir somente em ${owner}`)
  }
})
test('23 nenhum componente recebeu import de CSS', () => {
  const imports = sourceFiles(join(root, 'src')).filter((path) => ['.js', '.jsx'].includes(extname(path))).flatMap((path) => {
    const relative = path.slice(root.length).replaceAll('\\', '/')
    return [...readFileSync(path, 'utf8').matchAll(/import\s+['"]([^'"]+\.css)['"]/g)].map((match) => [relative, match[1]])
  })
  assert.deepEqual(imports, [['src/main.jsx', './styles/index.css']])
})
test('24 cada arquivo CSS local é importado uma única vez', () => {
  assert.equal((main.match(/styles\/index\.css/g) || []).length, 1)
  for (const path of expectedImports) assert.equal((index.match(new RegExp(`\\./${path.replaceAll('.', '\\.').replaceAll('/', '\\/')}`, 'g')) || []).length, 1)
})
test('25 versão permanece v1.8.7', () => assert.equal(packageJson.version, '1.8.7'))
