'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { PublicRegistration } from '@/lib/supabase/types'

const NEXT_STATUS: Record<PublicRegistration['status'], { label: string; next: PublicRegistration['status'] } | null> = {
  pending:      { label: 'Mark payment sent', next: 'payment_sent' },
  payment_sent: { label: 'Mark as paid',      next: 'paid' },
  paid:         null,
  cancelled:    null,
}

export function RegistrationActions({
  id,
  currentStatus,
}: {
  id: string
  currentStatus: PublicRegistration['status']
}) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [busy, setBusy] = useState(false)

  const advance = NEXT_STATUS[currentStatus]

  const update = (status: PublicRegistration['status']) => {
    setBusy(true)
    startTransition(async () => {
      const supabase = createClient()
      await supabase.from('public_registrations').update({ status }).eq('id', id)
      setBusy(false)
      router.refresh()
    })
  }

  const cancel = () => update('cancelled')

  return (
    <div className="flex items-center gap-2">
      {advance && (
        <button
          onClick={() => update(advance.next)}
          disabled={busy}
          className="bg-[#C9A84C] px-3 py-1.5 text-xs font-medium text-[#171410] transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {advance.label}
        </button>
      )}
      {currentStatus !== 'cancelled' && currentStatus !== 'paid' && (
        <button
          onClick={cancel}
          disabled={busy}
          className="border border-[#E2DDD5] px-3 py-1.5 text-xs text-[#9A907F] transition-colors hover:border-red-300 hover:text-red-600 disabled:opacity-50"
        >
          Cancel
        </button>
      )}
    </div>
  )
}
