import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { format, parseISO } from 'date-fns'
import { MapPin, Clock, Users, CurrencyCircleDollar, InstagramLogo } from '@phosphor-icons/react/dist/ssr'
import { fmtTime } from '@/lib/utils'

type Params = { slug: string }

async function getEvent(slug: string) {
  const supabase = await createClient()

  const { data: workshop } = await supabase
    .from('workshops')
    .select('*')
    .eq('slug', slug)
    .single()
  if (workshop) {
    const { count: enrolled } = await supabase
      .from('workshop_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('workshop_id', workshop.id)
      .neq('status', 'cancelled')
    return { kind: 'workshop' as const, event: workshop, enrolled: enrolled ?? 0 }
  }

  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .single()
  if (course) {
    const { count: enrolled } = await supabase
      .from('course_enrollments')
      .select('*', { count: 'exact', head: true })
      .eq('course_id', course.id)
      .in('enrollment_status', ['active', 'trial'])
    return { kind: 'course' as const, event: course, enrolled: enrolled ?? 0 }
  }

  return null
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const result = await getEvent(slug)
  if (!result) return { title: 'Not found' }

  const { event } = result
  const title = `${event.name} — Salsita with Cris`
  const description = ('description' in event && event.description)
    ? event.description
    : `Join us for ${event.name} with Cristhian Garzón in Budapest.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: event.thumbnail_url ? [{ url: event.thumbnail_url, width: 1200, height: 630 }] : [],
      type: 'website',
    },
    twitter: {
      card: event.thumbnail_url ? 'summary_large_image' : 'summary',
      title,
      description,
      images: event.thumbnail_url ? [event.thumbnail_url] : [],
    },
  }
}

export default async function EventPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const result = await getEvent(slug)
  if (!result) notFound()

  const { kind, event, enrolled } = result

  const dateStr = 'date' in event && event.date
    ? format(parseISO(event.date), 'EEEE, d MMMM yyyy')
    : null

  const startDateStr = 'start_date' in event && event.start_date
    ? format(parseISO(event.start_date as string), 'd MMMM yyyy')
    : null

  const timeStr = event.start_time
    ? event.end_time
      ? `${fmtTime(event.start_time)} – ${fmtTime(event.end_time)}`
      : fmtTime(event.start_time)
    : null

  const priceStr = 'price' in event && event.price != null
    ? event.price === 0 ? 'Free' : `${event.price.toLocaleString()} HUF`
    : 'default_price' in event
      ? `${(event.default_price as number).toLocaleString()} HUF / class`
      : null

  const capacity = event.capacity as number | null | undefined
  const availableSpots = capacity != null ? Math.max(0, capacity - enrolled) : null

  return (
    <div className="min-h-screen bg-[#F7F1E7] py-10">
      <div className="mx-auto max-w-2xl px-5 sm:px-8">

        {/* Hero thumbnail */}
        {event.thumbnail_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.thumbnail_url}
            alt={event.name}
            className="mb-8 block w-full"
          />
        )}

        {/* Title */}
        <div className="mb-8">
          <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">
            {kind === 'workshop' ? (event.type ?? 'Event') : `${kind}${'level' in event && event.level ? ` · ${event.level}` : ''}`}
          </span>
          <h1 className="font-display text-3xl font-light text-[#171410] sm:text-5xl">{event.name}</h1>
        </div>

        {/* Details grid */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Workshop: exact date · Course: weekly schedule + start date */}
          {kind === 'workshop' && dateStr && (
            <div className="flex items-start gap-3 border border-[#E2DDD5] bg-white p-4">
              <Clock size={20} weight="light" className="mt-0.5 shrink-0 text-[#C9A84C]" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#9A907F]">Date &amp; Time</p>
                <p className="mt-1 text-sm text-[#171410]">{dateStr}</p>
                {timeStr && <p className="text-sm text-[#6B6155]">{timeStr}</p>}
              </div>
            </div>
          )}
          {kind === 'course' && ('day_of_week' in event || startDateStr) && (
            <div className="flex items-start gap-3 border border-[#E2DDD5] bg-white p-4">
              <Clock size={20} weight="light" className="mt-0.5 shrink-0 text-[#C9A84C]" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#9A907F]">Schedule</p>
                {'day_of_week' in event && event.day_of_week && (
                  <p className="mt-1 text-sm capitalize text-[#171410]">
                    Every {event.day_of_week as string}{timeStr ? ` · ${timeStr}` : ''}
                  </p>
                )}
                {startDateStr && (
                  <p className="text-sm text-[#6B6155]">Starting {startDateStr}</p>
                )}
              </div>
            </div>
          )}
          {event.location && (
            <div className="flex items-start gap-3 border border-[#E2DDD5] bg-white p-4">
              <MapPin size={20} weight="light" className="mt-0.5 shrink-0 text-[#C9A84C]" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#9A907F]">Location</p>
                <p className="mt-1 text-sm text-[#171410]">{event.location}</p>
              </div>
            </div>
          )}
          {priceStr && (
            <div className="flex items-start gap-3 border border-[#E2DDD5] bg-white p-4">
              <CurrencyCircleDollar size={20} weight="light" className="mt-0.5 shrink-0 text-[#C9A84C]" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#9A907F]">Price</p>
                <p className="mt-1 text-sm text-[#171410]">{priceStr}</p>
              </div>
            </div>
          )}
          {availableSpots != null && (
            <div className="flex items-start gap-3 border border-[#E2DDD5] bg-white p-4">
              <Users size={20} weight="light" className="mt-0.5 shrink-0 text-[#C9A84C]" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#9A907F]">Spots available</p>
                <p className="mt-1 text-sm text-[#171410]">
                  {availableSpots === 0 ? 'Class is full' : `${availableSpots} of ${capacity} spots left`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {'description' in event && event.description && (
          <div className="mb-8 border border-[#E2DDD5] bg-white p-6">
            <h2 className="mb-3 font-display text-xl font-light text-[#171410]">About this event</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-[#6B6155]">{event.description}</p>
          </div>
        )}

        {/* CTA */}
        <div className="border border-[#E2DDD5] bg-white p-6 text-center">
          <p className="mb-1 font-display text-2xl font-light text-[#171410]">Ready to join?</p>
          <p className="mb-5 text-sm text-[#9A907F]">Reach out to reserve your spot</p>
          <div className="flex justify-center">
            <a
              href="https://www.instagram.com/andresgarzong"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#171410] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-80"
            >
              <InstagramLogo size={18} weight="light" />
              @andresgarzong
            </a>
          </div>
        </div>

        {/* Footer brand */}
        <div className="mt-10 text-center">
          <p className="font-display text-3xl font-light text-[#C9A84C]">Salsita with Cris</p>
          <p className="mt-1 text-xs uppercase tracking-widest text-[#9A907F]">Colombian Salsa · Budapest</p>
        </div>
      </div>
    </div>
  )
}
