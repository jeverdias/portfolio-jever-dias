import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')

test('não usa dependências flutuantes', () => {
  const pkg = JSON.parse(read('package.json'))
  const versions = [...Object.values(pkg.dependencies), ...Object.values(pkg.devDependencies)]
  assert.equal(versions.some((version) => version === 'latest' || /^[~^]/.test(version)), false)
})

test('Netlify aplica cabeçalhos de segurança', () => {
  const config = read('netlify.toml')
  for (const header of ['Content-Security-Policy', 'X-Content-Type-Options', 'X-Frame-Options', 'Referrer-Policy', 'Permissions-Policy']) {
    assert.match(config, new RegExp(header))
  }
  assert.match(config, /frame-ancestors 'none'/)
  assert.match(config, /object-src 'none'/)
})

test('mensagens públicas usam RPC com limite e sem INSERT direto', () => {
  const schema = read('supabase/schema.sql')
  assert.match(schema, /function public\.submit_contact_message/)
  assert.match(schema, /security definer/)
  assert.match(schema, /interval '60 seconds'/)
  assert.doesNotMatch(schema, /grant insert on public\.contact_messages to anon/)
  assert.doesNotMatch(schema, /create policy "Public can send contact messages"/)
})

test('PIN local não possui valor padrão de produção', () => {
  const admin = read('src/components/AdminPanel.jsx')
  assert.match(admin, /import\.meta\.env\.DEV/)
  assert.doesNotMatch(admin, /VITE_ADMIN_PIN \|\| ['"][^'"]+['"]/)
})

test('chaves administrativas não estão presentes no frontend', () => {
  const sources = [
    read('src/lib/supabase.js'),
    read('src/hooks/useAdminAuth.js'),
    read('.env.example'),
  ].join('\n')
  assert.doesNotMatch(sources, /service_role|sb_secret_/i)
})

test('formulário estático permite detecção segura pelo Netlify', () => {
  const html = read('index.html')
  assert.match(html, /name="contato-portfolio"/)
  assert.match(html, /data-netlify-honeypot="empresa-site"/)
})
