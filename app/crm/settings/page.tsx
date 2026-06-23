import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageHeader, Card, Badge, Table, Th, Td, EmptyState } from '@/components/crm/ui'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: rules } = await supabase
    .from('notification_rules')
    .select('*')
    .order('created_at')

  return (
    <div>
      <PageHeader title="Settings" subtitle="Business configuration" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-display text-xl font-light text-[#171410]">Business info</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-[#9A907F]">Name</dt><dd>Salsita with Cris</dd></div>
            <div className="flex justify-between"><dt className="text-[#9A907F]">Teacher</dt><dd>Cristhian Garzón</dd></div>
            <div className="flex justify-between"><dt className="text-[#9A907F]">Location</dt><dd>Budapest, Hungary</dd></div>
            <div className="flex justify-between"><dt className="text-[#9A907F]">Currency</dt><dd>HUF</dd></div>
            <div className="flex justify-between"><dt className="text-[#9A907F]">Timezone</dt><dd>Europe/Budapest</dd></div>
          </dl>
        </Card>
        <Card>
          <h2 className="mb-4 font-display text-xl font-light text-[#171410]">Pricing defaults</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-[#9A907F]">Group class</dt><dd>4,000 HUF</dd></div>
            <div className="flex justify-between"><dt className="text-[#9A907F]">Monthly pass (4 classes)</dt><dd>15,000 HUF</dd></div>
            <div className="flex justify-between"><dt className="text-[#9A907F]">Private lesson</dt><dd>14,000 HUF / hr</dd></div>
            <div className="flex justify-between"><dt className="text-[#9A907F]">Private pack (4+ hrs)</dt><dd>12,000 HUF / hr</dd></div>
          </dl>
        </Card>
        <Card>
          <h2 className="mb-4 font-display text-xl font-light text-[#171410]">Locations</h2>
          <ul className="space-y-2 text-sm text-[#6B6155]">
            <li>BackStage Studio — Dohány u. 5b, Budapest</li>
            <li>Roxy Studio — Tátra u. 4, Budapest</li>
          </ul>
        </Card>
        <Card>
          <h2 className="mb-4 font-display text-xl font-light text-[#171410]">Payment methods</h2>
          <ul className="space-y-2 text-sm text-[#6B6155]">
            {['Cash', 'Revolut', 'Wise', 'Bank transfer', 'Other'].map(m => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Notification Rules */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-light text-[#171410]">Notification Rules</h2>
          <Link
            href="/crm/notifications"
            className="text-xs text-[#C9A84C] hover:underline"
          >
            View all notifications
          </Link>
        </div>

        {rules && rules.length > 0 ? (
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Trigger</Th>
                <Th>Days before</Th>
                <Th>Audience</Th>
                <Th>Channel</Th>
                <Th>Enabled</Th>
              </tr>
            </thead>
            <tbody>
              {rules.map(r => (
                <tr key={r.id}>
                  <Td>
                    <span className="font-medium text-[#171410]">{r.name}</span>
                    {r.message_template && (
                      <p className="mt-0.5 text-xs text-[#9A907F] truncate max-w-xs">{r.message_template}</p>
                    )}
                  </Td>
                  <Td><Badge variant="gray">{r.trigger_type.replace(/_/g, ' ')}</Badge></Td>
                  <Td>{r.trigger_days_before ?? '—'}</Td>
                  <Td>{r.audience}</Td>
                  <Td>{r.channel.replace(/_/g, ' ')}</Td>
                  <Td>
                    {r.enabled
                      ? <Badge variant="green">On</Badge>
                      : <Badge variant="gray">Off</Badge>
                    }
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <EmptyState message="No notification rules configured." />
        )}

        <p className="mt-3 text-xs text-[#9A907F]">
          Notification rules are managed via the database. Contact your developer to add or modify rules.
        </p>
      </div>
    </div>
  )
}
