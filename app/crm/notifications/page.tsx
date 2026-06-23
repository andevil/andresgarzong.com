import { format, parseISO } from 'date-fns'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageHeader, Card, Badge, EmptyState } from '@/components/crm/ui'
import { DismissNotification } from '@/components/crm/DismissNotification'

export const dynamic = 'force-dynamic'

const TRIGGER_LABELS: Record<string, string> = {
  expiry:                'Package Expiry',
  unused_bonus:          'Unused Bonus',
  unused_private_lesson: 'Unused Private Lesson',
  low_classes:           'Low Classes',
  payment_pending:       'Payment Pending',
}

export default async function NotificationsPage() {
  const supabase = await createClient()

  const { data: notifications } = await supabase
    .from('package_notifications')
    .select('*, people(id, full_name), student_packages(id, name)')
    .neq('status', 'dismissed')
    .order('created_at', { ascending: false })

  // Group by trigger_type
  const grouped: Record<string, typeof notifications> = {}
  for (const n of notifications ?? []) {
    const key = n.trigger_type
    if (!grouped[key]) grouped[key] = []
    grouped[key]!.push(n)
  }

  const triggerKeys = Object.keys(grouped)

  return (
    <div>
      <PageHeader
        title="Package Notifications"
        subtitle="Alerts for expiring packages, unused bonuses, and pending payments"
      />

      {triggerKeys.length === 0 && (
        <EmptyState message="No active notifications. Everything looks good." />
      )}

      <div className="space-y-8">
        {triggerKeys.map(key => (
          <div key={key}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#9A907F]">
              {TRIGGER_LABELS[key] ?? key}
            </h2>
            <div className="space-y-2">
              {(grouped[key] ?? []).map(n => (
                <Card key={n.id} className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#171410]">{n.message}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-3">
                      {n.people && (
                        <Link
                          href={`/crm/people/${n.people.id}`}
                          className="text-xs text-[#C9A84C] hover:underline"
                        >
                          {n.people.full_name}
                        </Link>
                      )}
                      {n.student_packages && (
                        <Link
                          href={`/crm/packages/${n.student_packages.id}`}
                          className="text-xs text-[#9A907F] hover:text-[#C9A84C]"
                        >
                          {n.student_packages.name}
                        </Link>
                      )}
                      <span className="text-xs text-[#9A907F]">
                        {format(parseISO(n.created_at), 'dd MMM yyyy')}
                      </span>
                      <Badge variant={n.status === 'viewed' ? 'gray' : 'gold'}>
                        {n.status}
                      </Badge>
                    </div>
                  </div>
                  <DismissNotification notificationId={n.id} />
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
