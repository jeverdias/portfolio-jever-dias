import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const forceLocalAdmin = import.meta.env.DEV && import.meta.env.VITE_FORCE_LOCAL_ADMIN === 'true'

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
  .replace(/^-+|-+$/g, '')

export async function uploadPortfolioAsset(file, folder) {
  if (!supabase) throw new Error('Supabase ainda não foi configurado.')
  if (!file || !allowedAssetTypes.has(file.type)) throw new Error('Formato de arquivo não permitido.')
  if (file.size > MAX_ASSET_SIZE) throw new Error('O arquivo deve ter no máximo 10 MB.')
  const fileName = `${Date.now()}-${safeFileName(file.name)}`
  const path = `${folder}/${fileName}`
  const { error } = await supabase.storage.from(portfolioBucket).upload(path, file, {
    cacheControl: '3600',
    contentType: file.type,
    upsert: false,
  })
  if (error) throw error
  return supabase.storage.from(portfolioBucket).getPublicUrl(path).data.publicUrl
}

export async function submitContactMessage(payload) {
  if (!supabase) throw new Error('Supabase ainda não foi configurado.')
  const message = {
    name: String(payload.name || '').trim().slice(0, 120),
    email: String(payload.email || '').trim().toLowerCase().slice(0, 254),
    subject: String(payload.subject || '').trim().slice(0, 180),
    message: String(payload.message || '').trim().slice(0, 5000),
    status: 'new',
  }
  if (message.name.length < 2 || message.subject.length < 2 || message.message.length < 10 || !/^\S+@\S+\.\S+$/.test(message.email)) {
    throw new Error('Confira os dados antes de enviar.')
  }
  const { error } = await supabase.from('contact_messages').insert(message)
  if (error) throw error
}
