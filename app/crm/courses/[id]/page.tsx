import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { createClient } from '@/lib/supabase/server'
import { PageHeader, Badge, Card, Button, Table, Th, Td, EmptyState } from '@/components/crm/ui'
import { statusBadge } from '@/components/crm/ui'
import { PencilSimple, ArrowLeft, Plus, ArrowSquareOut } from '@phosphor-icons/react/dist/ssr'
import { CourseSessionActions } from '@/components/crm/CourseSessionActions'
import { DeleteButton } from '@/components/crm/DeleteButton'
import { PendingRegistrationActions } from '@/components/crm/PendingRegistrationActions'
import { fmtTime } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: course }, { data: enrollments }, { data: sessions }, { data: pending }] = await Promise.all([
    supabase.from('courses').select('*').eq('id', id).single(),
    supabase
      .from('course_enrollments')
      .select('*, people(id, full_name, dance_role, dance_experience)')
      .eq('course_id', id),
    supabase
      .from('class_sessions')
      .select('*')
      .eq('course_id', id)
      .order('date', { ascending: false })
      .limit(20),
    supabase
      .from('public_registrations')
      .select('*')
      .eq('event_id', id)
      .eq('event_type', 'course')
      .in('status', ['pending', 'payment_sent'])
      .order('created_at', { ascending: true }),
  ])

  if (!course) notFound()

  const leaders   = enrollments?.filter(e => e.people?.dance_role === 'leader').length ?? 0
  const followers = enrollments?.filter(e => e.people?.dance_role === 'follower').length ?? 0

  return (
    <div>
      <div className="mb-6">
        <Link href="/crm/courses" className="flex items-center gap-1 text-sm text-[#9A907F] hover:text-[#C9A84C]">
          <ArrowLeft size={14} weight="light" /> Courses
        </Link>
      </div>

      <PageHeader
        title={course.name}
        subtitle={[course.day_of_week, course.start_time ? fmtTime(course.start_time) : null, course.location].filter(Boolean).join(' · ')}
        action={
          <div className="flex gap-2">
            {course.slug && (
              <a href={`/events/${course.slug}`} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="sm"><ArrowSquareOut size={14} weight="light" /> Preview</Button>
              </a>
            )}
            <Link href={`/crm/courses/${id}/edit`}>
              <Button variant="secondary" size="sm"><PencilSimple size={14} weight="light" /> Edit</Button>
            </Link>
            <DeleteButton table="courses" id={id} redirectTo="/crm/courses" label="Delete" />
          </div>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Enrolled',  value: enrollments?.length ?? 0 },
          { label: 'Capacity',  value: course.capacity ?? '—' },
          { label: 'Leaders',   value: leaders },
          { label: 'Followers', value: followers },
        ].map(s => (
          <Card key={s.label}>
            <p className="text-xs uppercase tracking-[0.2em] text-[#9A907F]">{s.label}</p>
            <p className="mt-1 font-display text-3xl font-light text-[#171410]">{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Pending registrations */}
      {pending && pending.length > 0 && (
        <Card className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-light text-[#171410]">
              Pending registration
              <span className="ml-2 text-sm font-normal text-[#C9A84C]">({pending.length})</span>
            </h3>
          </div>
          <div className="space-y-3">
            {pending.map(r => (
              <div key={r.id} className="flex items-start justify-between gap-4 border border-[#E2DDD5] p-4">
                <div>
                  <p className="font-medium text-[#171410]">{r.name}</p>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-[#6B6155]">
                    {r.email     && <span>{r.email}</span>}
                    {r.phone     && <span>{r.phone}</span>}
                    {r.instagram && <span>@{r.instagram}</span>}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-[#9A907F]">
                    {r.dance_level && <span className="capitalize">{(r.dance_level as string).replace('-', ' ')}</span>}
                    {r.dance_role  && <span className="capitalize">{r.dance_role}</span>}
                    {r.coming_with_partner != null && (
                      <span>{r.coming_with_partner ? `With partner${r.partner_name ? `: ${r.partner_name}` : ''}` : 'Solo'}</span>
                    )}
                    <Badge variant={r.status === 'payment_sent' ? 'blue' : 'orange'}>
                      {(r.status as string).replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                <PendingRegistrationActions id={r.id as string} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Enrolled dancers */}
      <Card className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-light text-[#171410]">Enrolled dancers</h3>
          <Link href={`/crm/courses/${id}/enroll`}>
            <Button variant="secondary" size="sm"><Plus size={14} weight="light" /> Enroll dancer</Button>
          </Link>
        </div>
        {enrollments?.length ? (
          <Table>
            <thead>
              <tr><Th>Name</Th><Th>Role</Th><Th>Package</Th><Th>Payment</Th><Th>Status</Th></tr>
            </thead>
            <tbody>
              {enrollments.map(e => (
                <tr key={e.id}>
                  <Td>
                    <Link href={`/crm/people/${e.people?.id}`} className="font-medium hover:text-[#C9A84C]">
                      {e.people?.full_name}
                    </Link>
                  </Td>
                  <Td><Badge variant="gray">{e.people?.dance_role}</Badge></Td>
                  <Td><span className="text-xs">{e.package_type}</span></Td>
                  <Td><Badge variant={statusBadge(e.payment_status)}>{e.payment_status}</Badge></Td>
                  <Td><Badge variant={statusBadge(e.enrollment_status)}>{e.enrollment_status}</Badge></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <EmptyState message="No dancers enrolled yet." />
        )}
      </Card>

      {/* Sessions */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-light text-[#171410]">Class sessions</h3>
          <CourseSessionActions courseId={id} />
        </div>
        {sessions?.length ? (
          <Table>
            <thead>
              <tr><Th>Date</Th><Th>Time</Th><Th>Status</Th><Th>Attendance</Th></tr>
            </thead>
            <tbody>
              {sessions.map(s => (
                <tr key={s.id}>
                  <Td>{format(parseISO(s.date), 'EEE d MMM yyyy')}</Td>
                  <Td className="text-xs text-[#9A907F]">{fmtTime(s.start_time)}–{fmtTime(s.end_time)}</Td>
                  <Td><Badge variant={statusBadge(s.status)}>{s.status}</Badge></Td>
                  <Td>
                    <Link href={`/crm/attendance?session=${s.id}`} className="text-xs text-[#C9A84C] hover:underline">
                      Take attendance →
                    </Link>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <EmptyState message="No sessions yet. Generate sessions from the schedule." />
        )}
      </Card>
    </div>
  )
}
