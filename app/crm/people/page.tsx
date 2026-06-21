import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageHeader, Badge, Table, Th, Td, Button, EmptyState } from '@/components/crm/ui'
import { statusBadge } from '@/components/crm/ui'
import { UserPlus } from '@phosphor-icons/react/dist/ssr'
import { PeopleSearch } from '@/components/crm/PeopleSearch'

export const dynamic = 'force-dynamic'

const STATUS_OPTIONS  = ['', 'lead', 'waitlist', 'active', 'inactive', 'alumni', 'private-only', 'workshop-only']
const ROLE_OPTIONS    = ['', 'leader', 'follower', 'both', 'solo', 'unknown']

export default async function PeoplePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params  = await searchParams
  const q       = params.q ?? ''
  const status  = params.status ?? ''
  const role    = params.role ?? ''

  const supabase = await createClient()

  let query = supabase
    .from('people')
    .select('*')
    .order('full_name')

  if (status) query = query.eq('status', status)
  if (role)   query = query.eq('dance_role', role)
  if (q)      query = query.ilike('full_name', `%${q}%`)

  const { data: people } = await query.limit(200)

  return (
    <div>
      <PageHeader
        title="People"
        subtitle={`${people?.length ?? 0} contacts`}
        action={
          <Link href="/crm/people/new">
            <Button><UserPlus size={16} weight="light" /> Add person</Button>
          </Link>
        }
      />

      <PeopleSearch
        statusOptions={STATUS_OPTIONS}
        roleOptions={ROLE_OPTIONS}
        defaultQ={q}
        defaultStatus={status}
        defaultRole={role}
      />

      <div className="mt-4 border border-[#E2DDD5] bg-white">
        {people?.length ? (
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th className="hidden md:table-cell">Email / Phone</Th>
                <Th>Status</Th>
                <Th className="hidden sm:table-cell">Role</Th>
                <Th className="hidden lg:table-cell">Level</Th>
                <Th className="hidden lg:table-cell">Source</Th>
                <Th>{''}</Th>
              </tr>
            </thead>
            <tbody>
              {people.map(p => (
                <tr key={p.id} className="hover:bg-[#F7F1E7]/50">
                  <Td>
                    <Link href={`/crm/people/${p.id}`} className="font-medium text-[#171410] hover:text-[#C9A84C]">
                      {p.full_name}
                    </Link>
                    {p.instagram_handle && (
                      <p className="text-xs text-[#9A907F]">{p.instagram_handle}</p>
                    )}
                  </Td>
                  <Td className="hidden md:table-cell">
                    <p className="text-xs">{p.email}</p>
                    <p className="text-xs text-[#9A907F]">{p.phone}</p>
                  </Td>
                  <Td><Badge variant={statusBadge(p.status)}>{p.status}</Badge></Td>
                  <Td className="hidden sm:table-cell">
                    <Badge variant="gray">{p.dance_role}</Badge>
                  </Td>
                  <Td className="hidden lg:table-cell">
                    <span className="text-xs text-[#6B6155]">{p.dance_experience}</span>
                  </Td>
                  <Td className="hidden lg:table-cell">
                    <span className="text-xs text-[#9A907F]">{p.source ?? '—'}</span>
                  </Td>
                  <Td>
                    <Link href={`/crm/people/${p.id}`} className="text-xs text-[#C9A84C] hover:underline">
                      View →
                    </Link>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <EmptyState
            message="No people found."
            action={<Link href="/crm/people/new"><Button>Add first person</Button></Link>}
          />
        )}
      </div>
    </div>
  )
}
