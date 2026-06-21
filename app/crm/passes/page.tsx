import Link from 'next/link'
import { format, parseISO, differenceInDays } from 'date-fns'
import { createClient } from '@/lib/supabase/server'
import { PageHeader, Badge, Card, Table, Th, Td, Button, EmptyState } from '@/components/crm/ui'
import { statusBadge } from '@/components/crm/ui'
import { Plus } from '@phosphor-icons/react/dist/ssr'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function PassesPage() {
  const supabase = await createClient()
  const today = new Date()

  const [{ data: active }, { data: expired }] = await Promise.all([
    supabase
      .from('passes')
      .select('*, people(full_name, id)')
      .eq('status', 'active')
      .order('valid_until'),
    supabase
      .from('passes')
      .select('*, people(full_name, id)')
      .in('status', ['expired', 'used-up', 'cancelled'])
      .order('valid_until', { ascending: false })
      .limit(20),
  ])

  const daysLeft = (dateStr: string) => differenceInDays(parseISO(dateStr), today)

  return (
    <div>
      <PageHeader
        title="Passes & Packages"
        subtitle="Track credits and validity"
        action={
          <Link href="/crm/passes/new">
            <Button><Plus size={16} weight="light" /> Add pass</Button>
          </Link>
        }
      />

      {/* Active passes */}
      <h2 className="mb-4 font-display text-xl font-light text-[#171410]">Active</h2>
      <div className="mb-8 border border-[#E2DDD5] bg-white">
        {active?.length ? (
          <Table>
            <thead>
              <tr>
                <Th>Person</Th>
                <Th>Package</Th>
                <Th>Credits</Th>
                <Th>Expires</Th>
                <Th>Days left</Th>
              </tr>
            </thead>
            <tbody>
              {active.map(p => {
                const days = daysLeft(p.valid_until)
                const urgent = days <= 7
                return (
                  <tr key={p.id} className={cn('hover:bg-[#F7F1E7]/50', urgent && 'bg-orange-50')}>
                    <Td>
                      <Link href={`/crm/people/${p.people?.id}`} className="font-medium hover:text-[#C9A84C]">
                        {p.people?.full_name}
                      </Link>
                    </Td>
                    <Td><span className="text-xs">{p.package_name ?? p.package_type}</span></Td>
                    <Td>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{p.remaining_credits} left</span>
                        <span className="text-xs text-[#9A907F]">of {p.total_credits}</span>
                        <div className="h-1.5 w-16 bg-[#E2DDD5]">
                          <div
                            className="h-1.5 bg-[#C9A84C]"
                            style={{ width: `${(p.remaining_credits / p.total_credits) * 100}%` }}
                          />
                        </div>
                      </div>
                    </Td>
                    <Td>{format(parseISO(p.valid_until), 'd MMM yyyy')}</Td>
                    <Td>
                      <Badge variant={days <= 3 ? 'red' : days <= 7 ? 'orange' : 'green'}>
                        {days}d
                      </Badge>
                    </Td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        ) : (
          <EmptyState message="No active passes." />
        )}
      </div>

      {/* Past passes */}
      {expired && expired.length > 0 && (
        <>
          <h2 className="mb-4 font-display text-xl font-light text-[#171410]">Past</h2>
          <div className="border border-[#E2DDD5] bg-white">
            <Table>
              <thead>
                <tr>
                  <Th>Person</Th><Th>Package</Th><Th>Status</Th><Th>Expired</Th>
                </tr>
              </thead>
              <tbody>
                {expired.map(p => (
                  <tr key={p.id}>
                    <Td>
                      <Link href={`/crm/people/${p.people?.id}`} className="hover:text-[#C9A84C]">
                        {p.people?.full_name}
                      </Link>
                    </Td>
                    <Td><span className="text-xs">{p.package_name ?? p.package_type}</span></Td>
                    <Td><Badge variant={statusBadge(p.status)}>{p.status}</Badge></Td>
                    <Td className="text-xs text-[#9A907F]">{format(parseISO(p.valid_until), 'd MMM yyyy')}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      )}
    </div>
  )
}
