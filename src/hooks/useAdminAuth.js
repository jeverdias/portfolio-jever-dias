import { useCallback, useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

const verifyPortfolioAdmin = async (user) => {
  if (!supabase || !user) return false
  const { data, error } = await supabase.from('portfolio_admins').select('user_id').eq('user_id', user.id).maybeSingle()
  return !error && Boolean(data?.user_id)
}

export function useAdminAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!supabase) return undefined

    supabase.auth.getSession().then(async ({ data }) => {
      const sessionUser = data.session?.user || null
      const allowed = await verifyPortfolioAdmin(sessionUser)
      setUser(allowed ? sessionUser : null)
      if (sessionUser && !allowed) await supabase.auth.signOut()
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') setUser(null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const login = useCallback(async (email, password) => {
    if (!supabase) return false
    setLoading(true)
    setError('')
    const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (loginError) {
      setError('Email ou senha inválidos.')
      return false
    }
    const allowed = await verifyPortfolioAdmin(data.user)
    if (!allowed) {
      await supabase.auth.signOut()
      setError('Este usuário não está autorizado a administrar o portfólio.')
      return false
    }
    setUser(data.user)
    return true
  }, [])

  const logout = useCallback(async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setUser(null)
  }, [])

  return { configured: isSupabaseConfigured, user, loading, error, login, logout }
}
