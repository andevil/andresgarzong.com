import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { createClient } from '@/lib/supabase/server'
import { PageHeader, Badge, Card, Button, Table, Th, Td, EmptyState } from '@/components/crm/ui'
import { statusBadge } from '@/components/crm/ui'
import { Plus } from '@phosphor-icons/react/dist/ssr'

export const dynamic = 'force-dynamic'

const STATUSES = ['new', 'contacted', 'invited', 'registered', 'not-ready', 'lost'] as const

export default async function WaitlistPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const filterStatus = params.status ?? ''
  const filterCourse = params.course ?? ''

  const supabase = await createClient()
  let query = supabase
    .from('waitlist_entries')
    .select('*, people(id, full_name, dance_role, email, instagram_handle)')
    .order('created_at')

  if (filterStatus) query = query.eq('status', filterStatus)
  if (filterCourse) query = query.eq('desired_level', filterCourse)

  const { data: entries } = await query

  const grouped = STATUSES.map(s => ({
    status: s,
    entries: entries?.filter(e => e.status === s) ?? [],
  }))

  return (
    <div>
      <PageHeader
        title="Waitlist"
        subtitle={`${entries?.length ?? 0} total entries`}
        action={
          <Link href="/crm/waitlist/new">
            <Button><Plus size={16} weight="light" /> Add to waitlist</Button>
          </Link>
        }
      />

      {/* Status filter pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/crm/waitlist"
          className={`border px-3 py-1.5 text-xs transition-colors ${!filterStatus ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-[#171410]' : 'border-[#E2DDD5] text-[#6B6155] hover:border-[#C9A84C]/40'}`}
        >
          All
        </Link>
        {STATUSES.map(s => (
          <Link
            key={s}
            href={`/crm/waitlist?status=${s}`}
            className={`border px-3 py-1.5 text-xs capitalize transition-colors ${filterStatus === s ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-[#171410]' : 'border-[#E2DDD5] text-[#6B6155] hover:border-[#C9A84C]/40'}`}
          >
            {s} ({entries?.filter(e => e.status === s).length ?? 0})
          </Link>
        ))}
      </div>

      {/* Entries table */}
      <div className="border border-[#E2DDD5] bg-white">
        {entries?.length ? (
          <Table>
            <thead>
              <tr>
                <Th>Person</Th>
                <Th>Wants</Th>
                <Th className="hidden sm:table-cell">Role</Th>
                <Th>Urgency</Th>
                <Th>Status</Th>
                <Th className="hidden md:table-cell">Added</Th>
                <Th>{''}</Th>
              </tr>
            </thead>
            <tbody>
              {(filterStatus ? entries.filter(e => e.status === filterStatus) : entries).map(e => (
                <tr key={e.id} className="hover:bg-[#F7F1E7]/50">
                  <Td>
                    <Link href={`/crm/people/${e.people?.id}`} className="font-medium hover:text-[#C9A84C]">
                      {e.people?.full_name}
                    </Link>
                    {e.people?.instagram_handle && (
                      <p className="text-xs text-[#9A907F]">{e.people.instagram_handle}</p>
                    )}
                  </Td>
                  <Td>
                    <p className="text-xs">
                      {[e.desired_course_type, e.desired_level].filter(Boolean).join(' · ')}
                    </p>
                    {e.has_partner && (
                      <p className="text-xs text-[#9A907F]">Has partner{e.partner_name ? `: ${e.partner_name}` : ''}</p>
                    )}
                  </Td>
                  <Td className="hidden sm:table-cell">
                    <Badge variant="gray">{e.dance_role ?? e.people?.dance_role}</Badge>
                  </Td>
                  <Td><Badge variant={statusBadge(e.urgency)}>{e.urgency}</Badge></Td>
                  <Td><Badge variant={statusBadge(e.status)}>{e.status}</Badge></Td>
                  <Td className="hidden md:table-cell text-xs text-[#9A907F]">
                    {format(parseISO(e.created_at), 'd MMM')}
                  </Td>
                  <Td>
                    <Link href={`/crm/waitlist/${e.id}/edit`} className="text-xs text-[#C9A84C] hover:underline">
                      Update →
                    </Link>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <EmptyState
            message="No waitlist entries."
            action={<Link href="/crm/waitlist/new"><Button>Add first entry</Button></Link>}
          />
        )}
      </div>
    </div>
  )
}
