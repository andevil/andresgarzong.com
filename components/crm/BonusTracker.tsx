'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Badge, Button, Card } from '@/components/crm/ui'
import { CheckCircle, Circle } from '@phosphor-icons/react'
import type { PackageBonus } from '@/lib/supabase/types'

interface Props {
  packageId: string
  bonuses: PackageBonus[]
}

export function BonusTracker({ packageId, bonuses: initialBonuses }: Props) {
  const [bonuses, setBonuses] = useState<PackageBonus[]>(initialBonuses)
  const [usedForValues, setUsedForValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const toggle = async (bonus: PackageBonus) => {
    setLoading(bonus.id)
    setError(null)

    const newUsed = !bonus.used
    const used_for = newUsed ? (usedForValues[bonus.id] || null) : null

    const res = await fetch(`/api/crm/packages/${packageId}/bonuses/${bonus.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ used: newUsed, used_for }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      setError(body.error ?? 'Failed to update bonus')
      setLoading(null)
      return
    }

    const updated = await res.json()
    setBonuses(prev => prev.map(b => b.id === bonus.id ? updated : b))
    setLoading(null)
  }

  if (bonuses.length === 0) return null

  return (
    <Card className="mb-6">
      <h3 className="mb-4 font-display text-lg font-light text-[#171410]">Bonus Items</h3>

      {error && (
        <p className="mb-3 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <div className="space-y-4">
        {bonuses.map(bonus => (
          <div key={bonus.id} className="border-b border-white/40 pb-4 last:border-0 last:pb-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                {bonus.used ? (
                  <CheckCircle size={20} weight="light" className="mt-0.5 shrink-0 text-emerald-500" />
                ) : (
                  <Circle size={20} weight="light" className="mt-0.5 shrink-0 text-[#9A907F]" />
                )}
                <div>
                  <p className="text-sm font-medium text-[#171410]">{bonus.label}</p>
                  <p className="text-xs text-[#9A907F]">{bonus.bonus_type.replace(/_/g, ' ')}</p>
                  {bonus.used && bonus.used_date && (
                    <p className="mt-0.5 text-xs text-emerald-600">
                      Used {format(new Date(bonus.used_date), 'dd MMM yyyy')}
                      {bonus.used_for ? ` — ${bonus.used_for}` : ''}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {bonus.used
                  ? <Badge variant="green">Used</Badge>
                  : <Badge variant="gray">Available</Badge>
                }
                <Button
                  type="button"
                  variant={bonus.used ? 'secondary' : 'primary'}
                  size="sm"
                  disabled={loading === bonus.id}
                  onClick={() => toggle(bonus)}
                >
                  {loading === bonus.id ? '…' : bonus.used ? 'Mark unused' : 'Mark used'}
                </Button>
              </div>
            </div>

            {/* Used-for text field, shown when not yet used */}
            {!bonus.used && (
              <div className="mt-2 ml-8">
                <input
                  type="text"
                  placeholder="What is this used for? (optional)"
                  value={usedForValues[bonus.id] ?? ''}
                  onChange={e => setUsedForValues(prev => ({ ...prev, [bonus.id]: e.target.value }))}
                  className="w-full max-w-sm border border-white/50 bg-white/60 px-3 py-1.5 text-xs text-[#171410] outline-none focus:border-[#C9A84C]/60 focus:ring-1 focus:ring-[#C9A84C]/20"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
