import { createClient } from '@/lib/supabase/server'
import { format, parseISO } from 'date-fns'
import { Badge } from '@/components/crm/ui'
import { RegistrationActions } from '@/components/crm/RegistrationActions'
import type { PublicRegistration } from '@/lib/supabase/types'

const STATUS_BADGE: Record<PublicRegistration['status'], 'orange' | 'blue' | 'green' | 'red'> = {
  pending:      'orange',
  payment_sent: 'blue',
  paid:         'green',
  cancelled:    'red',
}

const LEVEL_LABEL: Record<string, string> = {
  'absolute-beginner': 'Absolute beginner',
  beginner:            'Beginner',
  intermediate:        'Intermediate',
  advanced:            'Advanced',
}

export default async function RegistrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('public_registrations')
    .select('*')
    .order('created_at', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data: rawRegistrations } = await query
  const registrations: PublicRegistration[] = (rawRegistrations ?? []) as PublicRegistration[]

  const counts = await supabase
    .from('public_registrations')
    .select('status')
    .then(({ data }) => {
      const acc: Record<string, number> = { all: 0, pending: 0, payment_sent: 0, paid: 0, cancelled: 0 }
      for (const r of data ?? []) {
        acc.all++
        acc[r.status] = (acc[r.status] ?? 0) + 1
      }
      return acc
    })

  const tabs: { key: string; label: string }[] = [
    { key: 'all',          label: `All (${counts.all})` },
    { key: 'pending',      label: `Pending (${counts.pending})` },
    { key: 'payment_sent', label: `Payment sent (${counts.payment_sent})` },
    { key: 'paid',         label: `Paid (${counts.paid})` },
    { key: 'cancelled',    label: `Cancelled (${counts.cancelled})` },
  ]

  const active = status ?? 'all'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-light text-[#171410]">Registrations</h1>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 flex-wrap">
        {tabs.map(t => (
          <a
            key={t.key}
            href={t.key === 'all' ? '/crm/registrations' : `/crm/registrations?status=${t.key}`}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors ${
              active === t.key
                ? 'bg-[#171410] text-white'
                : 'bg-white text-[#6B6155] hover:bg-[#E2DDD5]'
            }`}
          >
            {t.label}
          </a>
        ))}
      </div>

      {registrations.length === 0 ? (
        <div className="border border-[#E2DDD5] bg-white p-12 text-center">
          <p className="text-sm text-[#9A907F]">No registrations yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {registrations.map(r => (
            <div key={r.id} className="border border-[#E2DDD5] bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                {/* Left: name + event */}
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-[#171410]">{r.name}</p>
                    <Badge variant={STATUS_BADGE[r.status]}>{r.status.replace('_', ' ')}</Badge>
                    {r.event_type === 'course' && (
                      <span className="text-xs uppercase tracking-widest text-[#9A907F]">Course</span>
                    )}
                    {r.event_type === 'workshop' && (
                      <span className="text-xs uppercase tracking-widest text-[#9A907F]">Workshop</span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-[#C9A84C]">{r.event_name}</p>
                </div>

                {/* Right: actions */}
                <RegistrationActions id={r.id} currentStatus={r.status} />
              </div>

              {/* Contact row */}
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#6B6155]">
                {r.email    && <span>{r.email}</span>}
                {r.phone    && <span>{r.phone}</span>}
                {r.instagram && <span>@{r.instagram}</span>}
              </div>

              {/* Dance details row */}
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#9A907F]">
                {r.dance_level && <span>{LEVEL_LABEL[r.dance_level] ?? r.dance_level}</span>}
                {r.dance_role  && <span className="capitalize">{r.dance_role}</span>}
                {r.coming_with_partner != null && (
                  <span>{r.coming_with_partner ? `With partner${r.partner_name ? `: ${r.partner_name}` : ''}` : 'Solo'}</span>
                )}
                <span className="ml-auto">{format(parseISO(r.created_at), 'd MMM yyyy · HH:mm')}</span>
              </div>

              {r.notes && (
                <p className="mt-2 text-xs italic text-[#9A907F]">{r.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
