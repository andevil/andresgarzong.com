'use client'

import { useState, useTransition } from 'react'
import { format, parseISO } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { Badge, Button } from '@/components/crm/ui'
import { Check, X, Clock, Minus } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

type AttStatus = 'present' | 'absent' | 'late' | 'no-show' | 'cancelled-in-time' | null

interface PersonRow {
  id: string
  full_name: string
  dance_role: string
  dance_experience: string
  attendance_status: string | null
}

const STATUS_OPTS: { value: AttStatus; label: string; icon: React.ReactNode; cls: string }[] = [
  { value: 'present',          label: 'Present',    icon: <Check size={14} weight="bold" />,  cls: 'bg-emerald-500 text-white' },
  { value: 'late',             label: 'Late',        icon: <Clock size={14} weight="bold" />,  cls: 'bg-orange-400 text-white' },
  { value: 'absent',           label: 'Absent',      icon: <Minus size={14} weight="bold" />,  cls: 'bg-[#E2DDD5] text-[#6B6155]' },
  { value: 'no-show',          label: 'No show',     icon: <X size={14} weight="bold" />,      cls: 'bg-red-500 text-white' },
  { value: 'cancelled-in-time',label: 'Cancelled',   icon: <X size={14} weight="light" />,     cls: 'bg-blue-100 text-blue-700' },
]

export function AttendanceSheet({ sessionId, sessionName, sessionDate, people }: {
  sessionId: string
  sessionName: string
  sessionDate: string
  people: PersonRow[]
}) {
  const [statuses, setStatuses] = useState<Record<string, AttStatus>>(() => {
    const map: Record<string, AttStatus> = {}
    people.forEach(p => { map[p.id] = (p.attendance_status as AttStatus) ?? null })
    return map
  })
  const [saved, setSaved] = useState(false)
  const [, startTransition] = useTransition()

  const toggle = (personId: string, status: AttStatus) => {
    setStatuses(prev => ({
      ...prev,
      [personId]: prev[personId] === status ? null : status,
    }))
    setSaved(false)
  }

  const saveAll = () => {
    startTransition(async () => {
      const supabase = createClient()
      const entries = Object.entries(statuses)
        .filter(([, s]) => s !== null)
        .map(([person_id, status]) => ({
          session_id: sessionId,
          person_id,
          status: status!,
          payment_required: true,
        }))

      await supabase
        .from('attendance')
        .upsert(entries, { onConflict: 'session_id,person_id' })

      setSaved(true)
    })
  }

  const presentCount = Object.values(statuses).filter(s => s === 'present' || s === 'late').length

  return (
    <div className="border border-[#E2DDD5] bg-white">
      {/* Header */}
      <div className="border-b border-[#E2DDD5] px-5 py-4">
        <h2 className="font-display text-xl font-light text-[#171410]">{sessionName}</h2>
        <p className="mt-1 text-sm text-[#9A907F]">
          {sessionDate ? format(parseISO(sessionDate), 'EEEE, d MMMM yyyy') : ''}
          {' · '}{presentCount} / {people.length} present
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 border-b border-[#E2DDD5] px-5 py-3">
        {STATUS_OPTS.map(o => (
          <span key={o.value as string} className="flex items-center gap-1.5 text-xs text-[#9A907F]">
            <span className={cn('inline-flex h-5 w-5 items-center justify-center', o.cls)}>{o.icon}</span>
            {o.label}
          </span>
        ))}
      </div>

      {/* Dancer rows */}
      <ul className="divide-y divide-[#E2DDD5]">
        {people.map(p => {
          const current = statuses[p.id]
          return (
            <li key={p.id} className="flex items-center gap-4 px-5 py-3">
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-[#171410]">{p.full_name}</p>
                <p className="text-xs text-[#9A907F]">{p.dance_role} · {p.dance_experience}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                {STATUS_OPTS.map(opt => (
                  <button
                    key={opt.value as string}
                    type="button"
                    onClick={() => toggle(p.id, opt.value)}
                    aria-label={`${opt.label} for ${p.full_name}`}
                    aria-pressed={current === opt.value}
                    title={opt.label}
                    className={cn(
                      'inline-flex h-8 w-8 items-center justify-center border text-xs transition-colors',
                      current === opt.value
                        ? cn(opt.cls, 'border-transparent')
                        : 'border-[#E2DDD5] text-[#9A907F] hover:border-[#C9A84C]'
                    )}
                  >
                    {opt.icon}
                  </button>
                ))}
              </div>
            </li>
          )
        })}
      </ul>

      {/* Save bar */}
      <div className="flex items-center justify-between border-t border-[#E2DDD5] px-5 py-4">
        {saved ? (
          <span className="text-sm text-emerald-600">Saved ✓</span>
        ) : (
          <span className="text-sm text-[#9A907F]">{presentCount} present</span>
        )}
        <Button onClick={saveAll}>Save attendance</Button>
      </div>
    </div>
  )
}
