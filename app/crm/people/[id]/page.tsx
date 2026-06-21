import Link from 'next/link'
import { notFound } from 'next/navigation'
import { format, parseISO } from 'date-fns'
import { createClient } from '@/lib/supabase/server'
import { PageHeader, Badge, Card, Button, Table, Th, Td, EmptyState } from '@/components/crm/ui'
import { statusBadge } from '@/components/crm/ui'
import { PencilSimple, ArrowLeft, Plus } from '@phosphor-icons/react/dist/ssr'
import { DeleteButton } from '@/components/crm/DeleteButton'

export const dynamic = 'force-dynamic'

export default async function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [
    { data: person },
    { data: enrollments },
    { data: attendance },
    { data: passes },
    { data: payments },
    { data: privateLessons },
    { data: workshopRegs },
    { data: commLogs },
    { data: tasks },
  ] = await Promise.all([
    supabase.from('people').select('*').eq('id', id).single(),
    supabase.from('course_enrollments').select('*, courses(name, day_of_week, start_time)').eq('person_id', id),
    supabase.from('attendance').select('*, class_sessions(date, courses(name))').eq('person_id', id).order('created_at', { ascending: false }).limit(20),
    supabase.from('passes').select('*').eq('person_id', id).order('valid_until', { ascending: false }),
    supabase.from('payments').select('*').eq('person_id', id).order('payment_date', { ascending: false }).limit(20),
    supabase.from('private_lessons').select('*').eq('person_id', id).order('date', { ascending: false }).limit(10),
    supabase.from('workshop_registrations').select('*, workshops(name, date)').eq('person_id', id),
    supabase.from('communication_logs').select('*').eq('person_id', id).order('date', { ascending: false }).limit(10),
    supabase.from('tasks').select('*').eq('person_id', id).order('created_at', { ascending: false }),
  ])

  if (!person) notFound()

  return (
    <div>
      <div className="mb-6">
        <Link href="/crm/people" className="flex items-center gap-1 text-sm text-[#9A907F] hover:text-[#C9A84C]">
          <ArrowLeft size={14} weight="light" /> Back to People
        </Link>
      </div>

      <PageHeader
        title={person.full_name}
        action={
          <div className="flex gap-2">
            <Link href={`/crm/people/${id}/edit`}>
              <Button variant="secondary" size="sm"><PencilSimple size={14} weight="light" /> Edit</Button>
            </Link>
            <DeleteButton table="people" id={id} redirectTo="/crm/people" label="Delete" />
          </div>
        }
      />

      {/* Profile */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge variant={statusBadge(person.status)}>{person.status}</Badge>
            <Badge variant="gray">{person.dance_role}</Badge>
            <Badge variant="gray">{person.dance_experience}</Badge>
          </div>
          <dl className="space-y-3 text-sm">
            {person.email && <Row label="Email">{person.email}</Row>}
            {person.phone && <Row label="Phone">{person.phone}</Row>}
            {person.instagram_handle && <Row label="Instagram">{person.instagram_handle}</Row>}
            {person.whatsapp_number && <Row label="WhatsApp">{person.whatsapp_number}</Row>}
            {person.nationality && <Row label="Nationality">{person.nationality}</Row>}
            {person.source && <Row label="Source">{person.source}</Row>}
            <Row label="Since">{format(parseISO(person.created_at), 'd MMM yyyy')}</Row>
          </dl>
          {person.notes && (
            <div className="mt-4 border-t border-[#E2DDD5] pt-4">
              <p className="mb-1 text-xs uppercase tracking-[0.2em] text-[#9A907F]">Notes</p>
              <p className="text-sm text-[#6B6155]">{person.notes}</p>
            </div>
          )}
          {person.tags?.length && (
            <div className="mt-4 flex flex-wrap gap-2">
              {person.tags.map((t: string) => <Badge key={t} variant="gray">{t}</Badge>)}
            </div>
          )}
        </Card>

        <div className="space-y-6 lg:col-span-2">
          {/* Active courses */}
          <Card>
            <h3 className="mb-4 font-display text-lg font-light text-[#171410]">Active courses</h3>
            {enrollments?.length ? (
              <ul className="space-y-3">
                {enrollments.map(e => (
                  <li key={e.id} className="flex items-center justify-between border-b border-[#E2DDD5] pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium">{e.courses?.name}</p>
                      <p className="text-xs text-[#9A907F]">{e.package_type} · {e.courses?.day_of_week}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={statusBadge(e.enrollment_status)}>{e.enrollment_status}</Badge>
                      <Badge variant={statusBadge(e.payment_status)}>{e.payment_status}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[#9A907F]">Not enrolled in any courses.</p>
            )}
          </Card>

          {/* Active passes */}
          {passes?.some(p => p.status === 'active') && (
            <Card>
              <h3 className="mb-4 font-display text-lg font-light text-[#171410]">Passes</h3>
              <ul className="space-y-3">
                {passes.filter(p => p.status === 'active').map(p => (
                  <li key={p.id} className="flex items-center justify-between border-b border-[#E2DDD5] pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium">{p.package_name ?? p.package_type}</p>
                      <p className="text-xs text-[#9A907F]">
                        {p.remaining_credits} of {p.total_credits} credits remaining · expires {format(parseISO(p.valid_until), 'd MMM yyyy')}
                      </p>
                    </div>
                    <Badge variant={statusBadge(p.status)}>{p.status}</Badge>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>

      {/* Attendance history */}
      <Card className="mb-6">
        <h3 className="mb-4 font-display text-lg font-light text-[#171410]">Attendance</h3>
        {attendance?.length ? (
          <Table>
            <thead><tr>
              <Th>Date</Th><Th>Class</Th><Th>Status</Th>
            </tr></thead>
            <tbody>
              {attendance.map(a => (
                <tr key={a.id}>
                  <Td>{a.class_sessions?.date ? format(parseISO(a.class_sessions.date), 'd MMM yyyy') : '—'}</Td>
                  <Td>{a.class_sessions?.courses?.name ?? '—'}</Td>
                  <Td><Badge variant={statusBadge(a.status)}>{a.status}</Badge></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : <EmptyState message="No attendance records yet." />}
      </Card>

      {/* Payment history */}
      <Card className="mb-6">
        <h3 className="mb-4 font-display text-lg font-light text-[#171410]">Payments</h3>
        {payments?.length ? (
          <Table>
            <thead><tr>
              <Th>Date</Th><Th>Type</Th><Th>Method</Th><Th>Amount</Th><Th>Status</Th>
            </tr></thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id}>
                  <Td>{format(parseISO(p.payment_date), 'd MMM yyyy')}</Td>
                  <Td><span className="text-xs">{p.payment_type}</span></Td>
                  <Td><span className="text-xs">{p.payment_method}</span></Td>
                  <Td className="font-medium">{p.amount.toLocaleString()} {p.currency}</Td>
                  <Td><Badge variant={statusBadge(p.status)}>{p.status}</Badge></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : <EmptyState message="No payments recorded." />}
      </Card>

      {/* Communication log */}
      <Card className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-light text-[#171410]">Communication</h3>
          <Link href={`/crm/people/${id}/log`}>
            <Button variant="secondary" size="sm"><Plus size={14} weight="light" /> Add note</Button>
          </Link>
        </div>
        {commLogs?.length ? (
          <ul className="space-y-3">
            {commLogs.map(l => (
              <li key={l.id} className="border-b border-[#E2DDD5] pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <Badge variant="gray">{l.channel}</Badge>
                  <Badge variant={l.direction === 'incoming' ? 'blue' : 'gray'}>{l.direction}</Badge>
                  <span className="text-xs text-[#9A907F]">{format(parseISO(l.date), 'd MMM yyyy')}</span>
                </div>
                {l.subject && <p className="mt-1 text-sm font-medium">{l.subject}</p>}
                <p className="mt-1 text-sm text-[#6B6155]">{l.summary}</p>
                {l.follow_up_needed && (
                  <p className="mt-1 text-xs text-orange-600">
                    Follow up: {l.follow_up_date ? format(parseISO(l.follow_up_date), 'd MMM') : 'asap'}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : <EmptyState message="No communication logged yet." />}
      </Card>

      {/* Tasks */}
      {tasks?.length ? (
        <Card>
          <h3 className="mb-4 font-display text-lg font-light text-[#171410]">Tasks</h3>
          <ul className="space-y-2">
            {tasks.map(t => (
              <li key={t.id} className="flex items-center gap-3 border-b border-[#E2DDD5] pb-2 last:border-0">
                <Badge variant={statusBadge(t.priority)}>{t.priority}</Badge>
                <span className="flex-1 text-sm">{t.title}</span>
                <Badge variant={statusBadge(t.status)}>{t.status}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-xs uppercase tracking-[0.15em] text-[#9A907F]">{label}</dt>
      <dd className="text-right text-[#171410]">{children}</dd>
    </div>
  )
}
