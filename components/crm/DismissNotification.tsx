'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/crm/ui'
import { X } from '@phosphor-icons/react'

export function DismissNotification({ notificationId }: { notificationId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const dismiss = async () => {
    setLoading(true)
    await fetch(`/api/crm/notifications/${notificationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'dismissed' }),
    })
    router.refresh()
    setLoading(false)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={dismiss}
      disabled={loading}
      aria-label="Dismiss notification"
      className="shrink-0"
    >
      <X size={14} weight="light" />
    </Button>
  )
}
