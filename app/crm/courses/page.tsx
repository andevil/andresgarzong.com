import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { fmtTime } from '@/lib/utils'
import { PageHeader, Badge, Card, Button, EmptyState } from '@/components/crm/ui'
import { statusBadge } from '@/components/crm/ui'
import { Plus } from '@phosphor-icons/react/dist/ssr'

export const dynamic = 'force-dynamic'

const DAY_ORDER = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']

export default async function CoursesPage() {
  const supabase = await createClient()

  const [{ data: courses }, { data: enrollments }] = await Promise.all([
    supabase.from('courses').select('*').order('day_of_week').order('start_time'),
    supabase.from('course_enrollments').select('course_id, dance_role:people(dance_role)').eq('enrollment_status', 'active'),
  ])

  const countByCourse = (courseId: string) =>
    enrollments?.filter(e => e.course_id === courseId).length ?? 0

  return (
    <div>
      <PageHeader
        title="Courses"
        subtitle="Regular weekly classes"
        action={
          <Link href="/crm/courses/new">
            <Button><Plus size={16} weight="light" /> Add course</Button>
          </Link>
        }
      />

      {courses?.length ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {courses.map(c => {
            const enrolled = countByCourse(c.id)
            const pct = c.capacity ? Math.round((enrolled / c.capacity) * 100) : 0
            return (
              <Link key={c.id} href={`/crm/courses/${c.id}`}>
                <Card className="h-full cursor-pointer transition-colors hover:border-[#C9A84C]/40">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display text-xl font-light text-[#171410]">{c.name}</h3>
                      {c.day_of_week && (
                        <p className="mt-1 text-xs capitalize text-[#9A907F]">
                          {c.day_of_week} · {fmtTime(c.start_time)}–{fmtTime(c.end_time)}
                        </p>
                      )}
                    </div>
                    <Badge variant={statusBadge(c.status)}>{c.status}</Badge>
                  </div>
                  {c.location && (
                    <p className="mb-3 text-xs text-[#9A907F]">{c.location}</p>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6B6155]">{enrolled} dancer{enrolled !== 1 ? 's' : ''}</span>
                    {c.capacity && <span className="text-xs text-[#9A907F]">cap {c.capacity}</span>}
                  </div>
                  {c.capacity && (
                    <div className="mt-3 h-1 bg-[#E2DDD5]">
                      <div
                        className="h-1 bg-[#C9A84C] transition-all"
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  )}
                  <div className="mt-3 flex justify-between text-xs text-[#9A907F]">
                    <span>{c.default_price?.toLocaleString()} HUF / class</span>
                    {c.level && <Badge variant="gray">{c.level}</Badge>}
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      ) : (
        <EmptyState
          message="No courses yet."
          action={<Link href="/crm/courses/new"><Button>Add first course</Button></Link>}
        />
      )}
    </div>
  )
}
