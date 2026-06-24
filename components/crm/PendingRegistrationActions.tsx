'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function PendingRegistrationActions({ id }: { id: string }) {
  const router = useRouter()
  const [, start] = useTransition()
  const [loading, setLoading] = useState<'enroll' | 'dismiss' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const enroll = () => {
    setLoading('enroll')
    setError(null)
    start(async () => {
      const res = await fetch(`/api/crm/registrations/${id}/enroll`, { method: 'POST' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError((body as { error?: string }).error ?? 'Failed to enroll')
        setLoading(null)
        return
      }
      setLoading(null)
      router.refresh()
    })
  }

  const dismiss = () => {
    setLoading('dismiss')
    setError(null)
    start(async () => {
      const supabase = createClient()
      await supabase
        .from('public_registrations')
        .update({ status: 'cancelled' })
        .eq('id', id)
      setLoading(null)
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <button
          onClick={enroll}
          disabled={!!loading}
          className="bg-[#C9A84C] px-3 py-1.5 text-xs font-medium text-[#171410] transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {loading === 'enroll' ? 'Enrolling…' : 'Enroll & mark paid'}
        </button>
        <button
          onClick={dismiss}
          disabled={!!loading}
          className="border border-[#E2DDD5] px-3 py-1.5 text-xs text-[#9A907F] transition-colors hover:border-red-300 hover:text-red-600 disabled:opacity-50"
        >
          {loading === 'dismiss' ? '…' : 'Dismiss'}
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
