import assert from 'node:assert/strict'
import test from 'node:test'
import {
  isHttpUrl,
  sanitizeProject,
  validateContactPayload,
  validateProjectsImport,
  validateSiteImport,
} from '../../src/utils/validation.js'

test('aceita somente URLs HTTP e HTTPS', () => {
  assert.equal(isHttpUrl('https://example.com/projeto'), true)
  assert.equal(isHttpUrl('http://localhost:4173'), true)
  assert.equal(isHttpUrl('javascript:alert(1)'), false)
  assert.equal(isHttpUrl('data:text/html;base64,abc'), false)
})

test('normaliza projeto e limita coleções', () => {
  const project = sanitizeProject({
    id: 'projeto-seguro',
    title: 'Projeto seguro',
    type: 'website',
    tags: Array.from({ length: 25 }, (_, index) => `Tag ${index}`),
    gallery: Array.from({ length: 8 }, (_, index) => `https://example.com/${index}.webp`),
  })
  assert.equal(project.tags.length, 20)
  assert.equal(project.gallery.length, 4)
  assert.equal(project.featured, true)
})

test('rejeita projetos com URL perigosa e IDs duplicados', () => {
  assert.throws(() => sanitizeProject({ id: 'x', title: 'Teste', type: 'website', externalUrl: 'javascript:alert(1)' }), /URL inválida/)
  const repeated = { id: 'repetido', title: 'Projeto', type: 'website' }
  assert.throws(() => validateProjectsImport([repeated, repeated]), /duplicados/)
})

test('limita o tamanho do backup de projetos', () => {
  assert.throws(() => validateProjectsImport(`[${' '.repeat(5_000_001)}]`), /limite seguro/)
})

test('valida e normaliza mensagens de contato', () => {
  const message = validateContactPayload({ name: ' Jever ', email: ' TESTE@EXAMPLE.COM ', subject: ' Contato ', message: ' Mensagem válida para teste. ' })
  assert.equal(message.email, 'teste@example.com')
  assert.equal(message.name, 'Jever')
  assert.throws(() => validateContactPayload({ name: 'A', email: 'x', subject: '', message: 'curta' }), /Confira/)
})

test('limita o tamanho do backup das configurações', () => {
  assert.equal(validateSiteImport({ name: 'Jever' }).name, 'Jever')
  assert.throws(() => validateSiteImport(null), /inválidas/)
  assert.throws(() => validateSiteImport({ value: 'x'.repeat(1_500_001) }), /limite seguro/)
})
