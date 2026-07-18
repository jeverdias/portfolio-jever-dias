import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { siteClassifications } from '../src/data/siteClassifications.js'

const expected = ['portfolio-app', 'landing-conversion', 'institutional', 'professional-services', 'local-business', 'catalog', 'blog-editorial', 'event']
const previewClasses = {
  'portfolio-app': 'portfolio',
  'landing-conversion': 'landing',
  institutional: 'institutional',
  'professional-services': 'services',
  'local-business': 'local',
  catalog: 'catalog',
  'blog-editorial': 'blog',
  event: 'event',
}
const stylesIndexUrl = new URL('../src/styles/index.css', import.meta.url)
const stylesIndex = await readFile(stylesIndexUrl, 'utf8')
const localImports = [...stylesIndex.matchAll(/@import "(\.\/[^\"]+\.css)";/g)].map((match) => match[1])
const css = (await Promise.all(localImports.map((path) => readFile(new URL(path, stylesIndexUrl), 'utf8')))).join('\n')
const admin = await readFile(new URL('../src/components/AdminSiteClassification.jsx', import.meta.url), 'utf8')

assert.deepEqual(siteClassifications.map((item) => item.id), expected, 'As oito classificações devem permanecer disponíveis e ordenadas.')
assert.ok(siteClassifications.every((item) => item.purpose && item.audience && item.layout), 'Cada classificação precisa explicar finalidade, público e estrutura.')
assert.ok(siteClassifications.every((item) => !('appearance' in item)), 'Classificação não pode alterar a aparência.')
assert.match(admin, /classification-card__info/, 'Os cards devem possuir ajuda contextual.')
assert.match(css, /@media \(max-width:760px\)/, 'O layout precisa possuir regras para celular.')

for (const id of expected) {
  assert.match(admin, new RegExp(`structure-preview--${previewClasses[id]}`), `A prévia ${id} precisa estar implementada.`)
  if (id !== 'portfolio-app') assert.match(css, new RegExp(`data-site-classification='${id}'`), `A estrutura pública ${id} precisa ter regras próprias.`)
}

console.log(`✓ ${expected.length} classificações validadas para desktop e celular.`)
