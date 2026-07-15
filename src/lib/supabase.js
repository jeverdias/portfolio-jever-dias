import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
export const portfolioBucket = 'portfolio-assets'

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
