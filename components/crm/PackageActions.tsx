'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format, addDays, addWeeks, parseISO } from 'date-fns'
import { Button, Field, Input } from '@/components/crm/ui'
import type { StudentPackage } from '@/lib/supabase/types'

interface Props {
  pkg: StudentPackage
}

export function PackageActions({ pkg }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [customExtend, setCustomExtend] = useState('')
  const [showCustom, setShowCustom] = useState(false)

  const patch = async (body: Record<string, unknown>, label: string) => {
    setLoading(label)
    setError(null)
    const res = await fetch(`/api/crm/packages/${pkg.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const b = await res.json().catch(() => ({}))
      setError(b.error ?? 'Failed to update')
    } else {
      router.refresh()
    }
    setLoading(null)
  }

  const markPaid = () => patch({ payment_status: 'paid' }, 'paid')

  const extend = (weeks: number) => {
    const base = pkg.expiry_date ? parseISO(pkg.expiry_date) : new Date()
    const newExpiry = format(addWeeks(base, weeks), 'yyyy-MM-dd')
    patch({ expiry_date: newExpiry }, `extend-${weeks}`)
  }

  const extendCustom = () => {
    if (!customExtend) return
    patch({ expiry_date: customExtend }, 'extend-custom')
    setShowCustom(false)
  }

  const archive = async () => {
    if (!confirm('Archive this package? It will be hidden from active views.')) return
    setLoading('archive')
    const res = await fetch(`/api/crm/packages/${pkg.id}`, { method: 'DELETE' })
    if (!res.ok) {
      const b = await res.json().catch(() => ({}))
      setError(b.error ?? 'Failed to archive')
      setLoading(null)
    } else {
      router.push('/crm/packages')
    }
  }

  return (
    <div className="space-y-3">
      {error && <p className="bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <div className="flex flex-wrap gap-2">
        {pkg.payment_status !== 'paid' && (
          <Button
            size="sm"
            onClick={markPaid}
            disabled={loading === 'paid'}
          >
            {loading === 'paid' ? 'Saving…' : 'Mark as Paid'}
          </Button>
        )}

        <Button
          size="sm"
          variant="secondary"
          onClick={() => extend(1)}
          disabled={!!loading}
        >
          {loading === 'extend-1' ? '…' : '+1 week'}
        </Button>

        <Button
          size="sm"
          variant="secondary"
          onClick={() => extend(2)}
          disabled={!!loading}
        >
          {loading === 'extend-2' ? '…' : '+2 weeks'}
        </Button>

        <Button
          size="sm"
          variant="secondary"
          onClick={() => setShowCustom(v => !v)}
        >
          Custom date
        </Button>

        <Button
          size="sm"
          variant="danger"
          onClick={archive}
          disabled={loading === 'archive'}
        >
          {loading === 'archive' ? 'Archiving…' : 'Archive'}
        </Button>
      </div>

      {showCustom && (
        <div className="flex items-end gap-2 mt-2">
          <Field label="New expiry date" htmlFor="custom-extend" className="flex-1">
            <Input
              id="custom-extend"
              type="date"
              value={customExtend}
              onChange={e => setCustomExtend(e.target.value)}
            />
          </Field>
          <Button size="sm" onClick={extendCustom} disabled={!customExtend}>Apply</Button>
        </div>
      )}
    </div>
  )
}
