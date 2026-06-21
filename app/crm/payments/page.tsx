import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { createClient } from '@/lib/supabase/server'
import { PageHeader, Badge, Table, Th, Td, Button, Card, EmptyState } from '@/components/crm/ui'
import { statusBadge } from '@/components/crm/ui'
import { Plus } from '@phosphor-icons/react/dist/ssr'

export const dynamic = 'force-dynamic'

export default async function PaymentsPage() {
  const supabase = await createClient()

  const [{ data: payments }, { data: unpaidEnrollments }] = await Promise.all([
    supabase
      .from('payments')
      .select('*, people(full_name, id)')
      .order('payment_date', { ascending: false })
      .limit(100),
    supabase
      .from('course_enrollments')
      .select('*, people(full_name, id), courses(name)')
      .in('payment_status', ['unpaid', 'overdue'])
      .eq('enrollment_status', 'active'),
  ])

  const totalThisMonth = payments
    ?.filter(p => {
      const m = new Date().toISOString().slice(0, 7)
      return p.payment_date.startsWith(m) && p.status === 'paid'
    })
    .reduce((sum, p) => sum + p.amount, 0) ?? 0

  return (
    <div>
      <PageHeader
        title="Payments"
        action={
          <Link href="/crm/payments/new">
            <Button><Plus size={16} weight="light" /> Add payment</Button>
          </Link>
        }
      />

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-[0.2em] text-[#9A907F]">This month</p>
          <p className="mt-1 font-display text-3xl font-light text-[#C9A84C]">
            {totalThisMonth.toLocaleString()} HUF
          </p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.2em] text-[#9A907F]">Unpaid enrollments</p>
          <p className="mt-1 font-display text-3xl font-light text-[#171410]">
            {unpaidEnrollments?.length ?? 0}
          </p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.2em] text-[#9A907F]">Total payments</p>
          <p className="mt-1 font-display text-3xl font-light text-[#171410]">
            {payments?.length ?? 0}
          </p>
        </Card>
      </div>

      {/* Unpaid alert */}
      {unpaidEnrollments && unpaidEnrollments.length > 0 && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <h3 className="mb-3 text-sm font-medium text-orange-800">Dancers who haven&apos;t paid</h3>
          <ul className="space-y-2">
            {unpaidEnrollments.map(e => (
              <li key={e.id} className="flex items-center justify-between text-sm">
                <Link href={`/crm/people/${e.people?.id}`} className="text-[#171410] hover:text-[#C9A84C]">
                  {e.people?.full_name}
                </Link>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#9A907F]">{e.courses?.name}</span>
                  <Badge variant={statusBadge(e.payment_status)}>{e.payment_status}</Badge>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Payment history */}
      <div className="border border-[#E2DDD5] bg-white">
        {payments?.length ? (
          <Table>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Person</Th>
                <Th className="hidden sm:table-cell">Type</Th>
                <Th className="hidden md:table-cell">Method</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-[#F7F1E7]/50">
                  <Td>{format(parseISO(p.payment_date), 'd MMM yyyy')}</Td>
                  <Td>
                    <Link href={`/crm/people/${p.people?.id}`} className="font-medium hover:text-[#C9A84C]">
                      {p.people?.full_name}
                    </Link>
                    {p.reference_note && (
                      <p className="text-xs text-[#9A907F]">{p.reference_note}</p>
                    )}
                  </Td>
                  <Td className="hidden sm:table-cell">
                    <span className="text-xs text-[#6B6155]">{p.payment_type ?? '—'}</span>
                  </Td>
                  <Td className="hidden md:table-cell">
                    <span className="text-xs">{p.payment_method ?? '—'}</span>
                  </Td>
                  <Td className="font-medium">{p.amount.toLocaleString()} {p.currency}</Td>
                  <Td><Badge variant={statusBadge(p.status)}>{p.status}</Badge></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <EmptyState
            message="No payments recorded yet."
            action={<Link href="/crm/payments/new"><Button>Add first payment</Button></Link>}
          />
        )}
      </div>
    </div>
  )
}
