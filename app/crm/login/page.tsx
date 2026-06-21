'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/crm')
      router.refresh()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F1E7]">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <span className="font-display text-5xl font-light text-[#C9A84C]">CG</span>
          <p className="mt-3 text-sm uppercase tracking-[0.25em] text-[#9A907F]">Salsita Admin</p>
        </div>

        <form onSubmit={handleLogin} className="border border-[#E2DDD5] bg-white p-8">
          <h1 className="mb-8 font-display text-2xl font-light text-[#171410]">Sign in</h1>

          {error && (
            <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-[0.2em] text-[#9A907F]">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full border border-[#E2DDD5] bg-[#FAFAF8] px-4 py-3 text-sm text-[#171410] outline-none focus:border-[#C9A84C]"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-xs uppercase tracking-[0.2em] text-[#9A907F]">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full border border-[#E2DDD5] bg-[#FAFAF8] px-4 py-3 text-sm text-[#171410] outline-none focus:border-[#C9A84C]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full bg-[#C9A84C] px-6 py-3 text-sm font-medium tracking-wide text-[#171410] transition-opacity disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
