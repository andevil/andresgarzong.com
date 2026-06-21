import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { createClient } from '@/lib/supabase/server'
import { PageHeader, Badge, Card, Button, Table, Th, Td, EmptyState } from '@/components/crm/ui'
import { statusBadge } from '@/components/crm/ui'
import { PencilSimple, ArrowLeft, Plus } from '@phosphor-icons/react/dist/ssr'
import { CourseSessionActions } from '@/components/crm/CourseSessionActions'
import { DeleteButton } from '@/components/crm/DeleteButton'
import { fmtTime } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: course }, { data: enrollments }, { data: sessions }] = await Promise.all([
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
