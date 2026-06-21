import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { createClient } from '@/lib/supabase/server'
import { fmtTime } from '@/lib/utils'
import { PageHeader, Badge, Table, Th, Td, Button, EmptyState } from '@/components/crm/ui'
import { statusBadge } from '@/components/crm/ui'
import { Plus } from '@phosphor-icons/react/dist/ssr'

export const dynamic = 'force-dynamic'

export default async function PrivateLessonsPage() {
  const supabase = await createClient()
  const { data: lessons } = await supabase
    .from('private_lessons')
    .select('*, people:person_id(id, full_name), partner:partner_person_id(full_name)')
    .order('date', { ascending: false })
    .limit(50)

  return (
    <div>
      <PageHeader
        title="Private Lessons"
        action={
          <Link href="/crm/private-lessons/new">
            <Button><Plus size={16} weight="light" /> Schedule lesson</Button>
          </Link>
        }
      />
      <div className="border border-[#E2DDD5] bg-white">
        {lessons?.length ? (
          <Table>
            <thead>
              <tr>
                <Th>Date</Th><Th>Student</Th><Th className="hidden sm:table-cell">Focus</Th>
                <Th>Price</Th><Th>Payment</Th><Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {lessons.map(l => (
                <tr key={l.id} className="hover:bg-[#F7F1E7]/50">
                  <Td>
                    <p className="text-sm">{format(parseISO(l.date), 'd MMM yyyy')}</p>
                    <p className="text-xs text-[#9A907F]">{fmtTime(l.start_time)}</p>
                  </Td>
                  <Td>
                    <Link href={`/crm/people/${l.people?.id}`} className="font-medium hover:text-[#C9A84C]">
                      {l.people?.full_name}
                    </Link>
                    {l.partner && <p className="text-xs text-[#9A907F]">+ {l.partner.full_name}</p>}
                  </Td>
                  <Td className="hidden sm:table-cell">
                    <span className="text-xs text-[#6B6155]">{l.focus_area ?? '—'}</span>
                  </Td>
                  <Td className="font-medium">{l.price.toLocaleString()} HUF</Td>
                  <Td><Badge variant={statusBadge(l.payment_status)}>{l.payment_status}</Badge></Td>
                  <Td><Badge variant={statusBadge(l.status)}>{l.status}</Badge></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <EmptyState
            message="No private lessons yet."
            action={<Link href="/crm/private-lessons/new"><Button>Schedule first lesson</Button></Link>}
          />
        )}
      </div>
    </div>
  )
}
