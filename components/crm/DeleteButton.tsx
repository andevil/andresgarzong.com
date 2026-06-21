'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/crm/ui'
import { Trash } from '@phosphor-icons/react'

interface Props {
  table: string
  id: string
  redirectTo: string
  label?: string
}

export function DeleteButton({ table, id, redirectTo, label = 'Delete' }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Delete this ${label.toLowerCase()}? This cannot be undone.`)) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from(table).delete().eq('id', id)
    router.push(redirectTo)
    router.refresh()
  }

  return (
    <Button variant="danger" size="sm" onClick={handleDelete} disabled={loading}>
      <Trash size={14} weight="light" />
      {loading ? 'Deleting…' : label}
    </Button>
  )
}
