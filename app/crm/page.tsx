import Link from 'next/link'
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns'
import { createClient } from '@/lib/supabase/server'
import {
  StatCard, Card, Badge, PageHeader, Button, EmptyState
} from '@/components/crm/ui'
import { statusBadge } from '@/components/crm/ui'
import {
  UserPlus, CalendarCheck, CurrencyCircleDollar, ListChecks, ArrowRight
} from '@phosphor-icons/react/dist/ssr'
import { fmtTime } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const today = new Date()
  const todayStr = format(today, 'yyyy-MM-dd')
  const in7days = format(addDays(today, 7), 'yyyy-MM-dd')
  const in14days = format(addDays(today, 14), 'yyyy-MM-dd')

  const [
    { count: activeDancers },
    { count: waitlistCount },
    { data: sessions },
    { data: pendingPayments },
    { data: expiringPasses },
    { data: openTasks },
  ] = await Promise.all([
    supabase.from('people').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('waitlist_entries').select('*', { count: 'exact', head: true }).in('status', ['new', 'contacted']),
    supabase
      .from('class_sessions')
      .select('*, courses(name, day_of_week, start_time, location)')
      .eq('status', 'scheduled')
      .gte('date', todayStr)
      .lte('date', in7days)
      .order('date').order('start_time'),
    supabase
      .from('course_enrollments')
      .select('*, people(full_name, id), courses(name)')
      .in('payment_status', ['unpaid', 'overdue'])
      .eq('enrollment_status', 'active')
      .limit(6),
    supabase
      .from('passes')
      .select('*, people(full_name, id)')
      .eq('status', 'active')
      .lte('valid_until', in14days)
      .order('valid_until'),
    supabase
      .from('tasks')
      .select('*, people(full_name)')
      .eq('status', 'open')
      .order('due_date', { nullsFirst: false })
      .limit(5),
  ])

  const quickActions = [
    { label: 'Add Person',        href: '/crm/people/new',          icon: UserPlus },
    { label: 'Take Attendance',   href: '/crm/attendance',          icon: CalendarCheck },
    { label: 'Add Payment',       href: '/crm/payments/new',        icon: CurrencyCircleDollar },
    { label: 'Add to Waitlist',   href: '/crm/waitlist/new',        icon: ListChecks },
  ]

  return (
    <div>
      <PageHeader title="Dashboard" subtitle={format(today, 'EEEE, d MMMM yyyy')} />

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Active dancers"   value={activeDancers ?? 0} accent />
        <StatCard label="Waitlist"         value={waitlistCount ?? 0} sub="pending review" />
        <StatCard label="Classes this week" value={sessions?.length ?? 0} />
        <StatCard label="Unpaid"           value={pendingPayments?.length ?? 0} sub="enrollments" />
      </div>

      {/* Quick actions */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {quickActions.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 border border-[#E2DDD5] bg-white px-4 py-3 text-sm text-[#171410] transition-colors hover:border-[#C9A84C] hover:text-[#C9A84C]"
          >
            <Icon size={18} weight="light" className="shrink-0 text-[#C9A84C]" />
            {label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming classes */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-light text-[#171410]">Classes this week</h2>
            <Link href="/crm/courses" className="text-xs text-[#C9A84C] hover:underline">View all</Link>
          </div>
          {sessions?.length ? (
            <ul className="space-y-3">
              {sessions.map(s => (
                <li key={s.id} className="flex items-start justify-between border-b border-[#E2DDD5] pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-[#171410]">{s.courses?.name}</p>
                    <p className="mt-0.5 text-xs text-[#9A907F]">
                      {format(parseISO(s.date), 'EEE d MMM')} · {fmtTime(s.start_time)} · {s.location}
                    </p>
                  </div>
                  <Link href={`/crm/attendance?session=${s.id}`}>
                    <Button variant="secondary" size="sm">Check in</Button>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState message="No classes scheduled this week." />
          )}
        </Card>

        {/* Open tasks */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-light text-[#171410]">Follow-ups</h2>
            <Link href="/crm/people" className="text-xs text-[#C9A84C] hover:underline">View people</Link>
          </div>
          {openTasks?.length ? (
            <ul className="space-y-3">
              {openTasks.map(t => (
                <li key={t.id} className="flex items-start justify-between border-b border-[#E2DDD5] pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm text-[#171410]">{t.title}</p>
                    {t.people && (
                      <p className="mt-0.5 text-xs text-[#9A907F]">{t.people.full_name}</p>
                    )}
                    {t.due_date && (
                      <p className="mt-0.5 text-xs text-[#9A907F]">Due {format(parseISO(t.due_date), 'd MMM')}</p>
                    )}
                  </div>
                  <Badge variant={statusBadge(t.priority)}>{t.priority}</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState message="No open tasks. You're on top of it." />
          )}
        </Card>

        {/* Unpaid enrollments */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-light text-[#171410]">Unpaid enrollments</h2>
            <Link href="/crm/payments" className="text-xs text-[#C9A84C] hover:underline">All payments</Link>
          </div>
          {pendingPayments?.length ? (
            <ul className="space-y-3">
              {pendingPayments.map(e => (
                <li key={e.id} className="flex items-center justify-between border-b border-[#E2DDD5] pb-3 last:border-0 last:pb-0">
                  <div>
                    <Link href={`/crm/people/${e.people?.id}`} className="text-sm font-medium text-[#171410] hover:text-[#C9A84C]">
                      {e.people?.full_name}
                    </Link>
                    <p className="text-xs text-[#9A907F]">{e.courses?.name}</p>
                  </div>
                  <Badge variant={statusBadge(e.payment_status)}>{e.payment_status}</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState message="Everyone is paid up." />
          )}
        </Card>

        {/* Expiring passes */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-light text-[#171410]">Passes expiring soon</h2>
            <Link href="/crm/passes" className="text-xs text-[#C9A84C] hover:underline">All passes</Link>
          </div>
          {expiringPasses?.length ? (
            <ul className="space-y-3">
              {expiringPasses.map(p => (
                <li key={p.id} className="flex items-center justify-between border-b border-[#E2DDD5] pb-3 last:border-0 last:pb-0">
                  <div>
                    <Link href={`/crm/people/${p.people?.id}`} className="text-sm font-medium text-[#171410] hover:text-[#C9A84C]">
                      {p.people?.full_name}
                    </Link>
                    <p className="text-xs text-[#9A907F]">
                      {p.remaining_credits} credit{p.remaining_credits !== 1 ? 's' : ''} left · expires {format(parseISO(p.valid_until), 'd MMM')}
                    </p>
                  </div>
                  <Badge variant={
                    isBefore(parseISO(p.valid_until), addDays(today, 7)) ? 'red' : 'orange'
                  }>
                    {format(parseISO(p.valid_until), 'd MMM')}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState message="No passes expiring in the next 2 weeks." />
          )}
        </Card>
      </div>
    </div>
  )
}
