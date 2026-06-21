'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { Input, Select } from '@/components/crm/ui'
import { MagnifyingGlass } from '@phosphor-icons/react'

export function PeopleSearch({ statusOptions, roleOptions, defaultQ, defaultStatus, defaultRole }: {
  statusOptions: string[]
  roleOptions: string[]
  defaultQ: string
  defaultStatus: string
  defaultRole: string
}) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  const update = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search)
    if (value) params.set(key, value); else params.delete(key)
    startTransition(() => router.push(`/crm/people?${params.toString()}`))
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A907F]" />
        <Input
          defaultValue={defaultQ}
          placeholder="Search by name…"
          className="pl-9"
          onChange={e => update('q', e.target.value)}
        />
      </div>
      <Select
        defaultValue={defaultStatus}
        className="w-full sm:w-44"
        onChange={e => update('status', e.target.value)}
      >
        <option value="">All statuses</option>
        {statusOptions.filter(Boolean).map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </Select>
      <Select
        defaultValue={defaultRole}
        className="w-full sm:w-36"
        onChange={e => update('role', e.target.value)}
      >
        <option value="">All roles</option>
        {roleOptions.filter(Boolean).map(r => (
          <option key={r} value={r}>{r}</option>
        ))}
      </Select>
    </div>
  )
}
