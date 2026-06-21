import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { createClient } from '@/lib/supabase/server'
import { PageHeader, Badge, Card, Table, Th, Td, EmptyState } from '@/components/crm/ui'
import { statusBadge } from '@/components/crm/ui'
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'

export const dynamic = 'force-dynamic'

export default async function WorkshopDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const [{ data: workshop }, { data: registrations }] = await Promise.all([
    supabase.from('workshops').select('*').eq('id', id).single(),
    supabase.from('workshop_registrations').select('*, people(id, full_name, dance_role)').eq('workshop_id', id),
  ])
  if (!workshop) notFound()

  return (
    <div>
      <div className="mb-6">
        <Link href="/crm/workshops" className="flex items-center gap-1 text-sm text-[#9A907F] hover:text-[#C9A84C]">
          <ArrowLeft size={14} weight="light" /> Workshops
        </Link>
      </div>
      <PageHeader
        title={workshop.name}
        subtitle={format(parseISO(workshop.date), 'EEEE, d MMMM yyyy')}
      />
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Type', value: workshop.type ?? '—' },
          { label: 'Status', value: <Badge variant={statusBadge(workshop.status)}>{workshop.status}</Badge> },
          { label: 'Capacity', value: workshop.capacity ?? '—' },
          { label: 'Price', value: workshop.price > 0 ? `${workshop.price.toLocaleString()} HUF` : 'Free' },
        ].map(s => (
          <Card key={s.label}>
            <p className="text-xs uppercase tracking-[0.2em] text-[#9A907F]">{s.label}</p>
            <p className="mt-1 font-display text-2xl font-light text-[#171410]">{s.value}</p>
          </Card>
        ))}
      </div>
      {workshop.description && (
        <Card className="mb-6">
          <p className="text-sm text-[#6B6155]">{workshop.description}</p>
        </Card>
      )}
      <Card>
        <h3 className="mb-4 font-display text-lg font-light text-[#171410]">
          Registrations ({registrations?.length ?? 0})
        </h3>
        {registrations?.length ? (
          <Table>
            <thead><tr><Th>Name</Th><Th>Role</Th><Th>Status</Th><Th>Payment</Th></tr></thead>
            <tbody>
              {registrations.map(r => (
                <tr key={r.id}>
                  <Td>
                    <Link href={`/crm/people/${r.people?.id}`} className="hover:text-[#C9A84C]">
                      {r.people?.full_name}
                    </Link>
                  </Td>
                  <Td><Badge variant="gray">{r.people?.dance_role}</Badge></Td>
                  <Td><Badge variant={statusBadge(r.status)}>{r.status}</Badge></Td>
                  <Td><Badge variant={statusBadge(r.payment_status ?? 'unpaid')}>{r.payment_status}</Badge></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <EmptyState message="No registrations yet." />
        )}
      </Card>
    </div>
  )
}
