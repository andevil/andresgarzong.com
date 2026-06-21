import { format, parseISO } from 'date-fns'
import { createClient } from '@/lib/supabase/server'
import { PageHeader, Badge, Card, EmptyState } from '@/components/crm/ui'
import { AttendanceSheet } from '@/components/crm/AttendanceSheet'

export const dynamic = 'force-dynamic'

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const today = format(new Date(), 'yyyy-MM-dd')

  // Upcoming and today's sessions
  const { data: sessions } = await supabase
    .from('class_sessions')
    .select('*, courses(name, day_of_week)')
    .eq('status', 'scheduled')
    .gte('date', today)
    .order('date')
    .order('start_time')
    .limit(20)

  const selectedId = params.session ?? sessions?.[0]?.id

  let enrolledPeople: Array<{
    id: string; full_name: string; dance_role: string; dance_experience: string;
    attendance_status: string | null
  }> = []

  let selectedSession = sessions?.find(s => s.id === selectedId)

  if (selectedId) {
    // Get enrolled dancers for the course
    const [{ data: enrolled }, { data: existingAtt }] = await Promise.all([
      supabase
        .from('course_enrollments')
        .select('people(id, full_name, dance_role, dance_experience)')
        .eq('course_id', selectedSession?.course_id ?? '')
        .eq('enrollment_status', 'active'),
      supabase
        .from('attendance')
        .select('person_id, status')
        .eq('session_id', selectedId),
    ])

    const attMap = new Map(existingAtt?.map(a => [a.person_id, a.status]))

    enrolledPeople = (enrolled ?? []).flatMap(e => {
      const p = Array.isArray(e.people) ? e.people[0] : e.people
      return p
        ? [{
            id: p.id as string,
            full_name: p.full_name as string,
            dance_role: p.dance_role as string,
            dance_experience: p.dance_experience as string,
            attendance_status: attMap.get(p.id as string) ?? null,
          }]
        : []
    })
  }

  return (
    <div>
      <PageHeader title="Attendance" subtitle="Check in dancers for today's class" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Session list */}
        <div className="lg:col-span-1">
          <Card>
            <h2 className="mb-4 font-display text-lg font-light text-[#171410]">Upcoming classes</h2>
            {sessions?.length ? (
              <ul className="space-y-2">
                {sessions.map(s => (
                  <li key={s.id}>
                    <a
                      href={`/crm/attendance?session=${s.id}`}
                      className={`block border p-3 text-sm transition-colors ${
                        s.id === selectedId
                          ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-[#171410]'
                          : 'border-[#E2DDD5] text-[#6B6155] hover:border-[#C9A84C]/40'
                      }`}
                    >
                      <p className="font-medium">{s.courses?.name}</p>
                      <p className="mt-0.5 text-xs text-[#9A907F]">
                        {format(parseISO(s.date), 'EEE d MMM')} · {s.start_time?.slice(0,5)}
                      </p>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState message="No upcoming classes." />
            )}
          </Card>
        </div>

        {/* Check-in sheet */}
        <div className="lg:col-span-2">
          {selectedId ? (
            <AttendanceSheet
              sessionId={selectedId}
              sessionName={selectedSession?.courses?.name ?? ''}
              sessionDate={selectedSession?.date ?? ''}
              people={enrolledPeople}
            />
          ) : (
            <Card>
              <EmptyState message="Select a class to take attendance." />
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
