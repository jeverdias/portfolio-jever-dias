import assert from 'node:assert/strict'
import { readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

const manifest = JSON.parse(readFileSync(resolve('dist/.vite/manifest.json'), 'utf8'))
const entry = manifest['index.html']

assert.ok(entry?.isEntry, 'O arquivo principal não foi encontrado no manifesto do build.')

const entryBytes = statSync(resolve('dist', entry.file)).size
const importedChunks = new Set(entry.imports || [])

assert.ok(importedChunks.size >= 3, 'O pacote principal precisa manter React, Supabase e ícones em blocos separados.')
assert.ok(entryBytes <= 150_000, `O pacote principal voltou a ficar grande: ${(entryBytes / 1024).toFixed(2)} KB.`)

console.log(`✓ pacote principal: ${(entryBytes / 1024).toFixed(2)} KB; ${importedChunks.size} blocos compartilhados separados.`)
