import { createClient } from '@supabase/supabase-js'
import { validateContactPayload } from '../utils/validation.js'

const runtimeEnv = import.meta.env || {}
const supabaseUrl = runtimeEnv.VITE_SUPABASE_URL
const supabaseAnonKey = runtimeEnv.VITE_SUPABASE_ANON_KEY
const forceLocalAdmin = runtimeEnv.DEV && runtimeEnv.VITE_FORCE_LOCAL_ADMIN === 'true'

export const isSupabaseConfigured = !forceLocalAdmin && Boolean(supabaseUrl && supabaseAnonKey)
export const portfolioBucket = 'portfolio-assets'
const MAX_ASSET_SIZE = 10 * 1024 * 1024
const allowedAssetTypes = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'application/pdf'])

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

export const safeFileName = (name) => name
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9.]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'arquivo'

const safeFolder = (folder) => String(folder || 'arquivos')
  .split('/')
  .map((part) => safeFileName(part).replace(/\.+$/g, '') || 'arquivos')
  .join('/')

export async function uploadPortfolioAsset(file, folder) {
  if (!supabase) throw new Error('Supabase ainda não foi configurado.')
  if (!file || !allowedAssetTypes.has(file.type)) throw new Error('Formato de arquivo não permitido.')
  if (file.size > MAX_ASSET_SIZE) throw new Error('O arquivo deve ter no máximo 10 MB.')
  const fileName = `${Date.now()}-${safeFileName(file.name)}`
  const path = `${safeFolder(folder)}/${fileName}`
  const { error } = await supabase.storage.from(portfolioBucket).upload(path, file, {
    cacheControl: '3600',
    contentType: file.type,
    upsert: false,
  })
  if (error) throw error
  return supabase.storage.from(portfolioBucket).getPublicUrl(path).data.publicUrl
}

export function getPortfolioAssetPath(url) {
  if (!url || !supabaseUrl) return ''
  try {
    const parsed = new URL(url)
    const base = new URL(supabaseUrl)
    const marker = `/storage/v1/object/public/${portfolioBucket}/`
    if (parsed.origin !== base.origin || !parsed.pathname.startsWith(marker)) return ''
    return decodeURIComponent(parsed.pathname.slice(marker.length))
  } catch {
    return ''
  }
}

export async function removePortfolioAsset(url) {
  if (!supabase) return false
  const path = getPortfolioAssetPath(url)
  if (!path) return false
  const { error } = await supabase.storage.from(portfolioBucket).remove([path])
  if (error) throw error
  return true
}

export async function submitContactMessage(payload) {
  if (!supabase) throw new Error('Supabase ainda não foi configurado.')
  const message = validateContactPayload(payload)
  const { error } = await supabase.rpc('submit_contact_message', {
    p_name: message.name,
    p_email: message.email,
    p_subject: message.subject,
    p_message: message.message,
  })
  if (error) {
    if (/aguarde|limite|repetida/i.test(error.message || '')) throw new Error(error.message)
    throw new Error('Não foi possível enviar a mensagem agora.')
  }
}
