import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/)
  return {
    first_name: parts[0] ?? fullName,
    last_name:  parts.slice(1).join(' ') || '',
  }
}

const LEVEL_MAP: Record<string, string> = {
  'absolute-beginner': 'absolute-beginner',
  beginner:            'beginner',
  intermediate:        'intermediate',
  advanced:            'advanced',
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  // 1. Fetch the registration
  const { data: reg, error: regErr } = await supabase
    .from('public_registrations')
    .select('*')
    .eq('id', id)
    .single()

  if (regErr || !reg) {
    return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
  }
  if (reg.event_type !== 'course') {
    return NextResponse.json({ error: 'Only course registrations can be enrolled this way' }, { status: 400 })
  }

  // 2. Find or create person
  let personId: string

  const { data: existing } = reg.email
    ? await supabase.from('people').select('id').eq('email', reg.email).maybeSingle()
    : { data: null }

  if (existing) {
    personId = existing.id
  } else {
    const { first_name, last_name } = splitName(reg.name as string)
    const { data: newPerson, error: personErr } = await supabase
      .from('people')
      .insert({
        first_name,
        last_name,
        email:            reg.email   ?? null,
        phone:            reg.phone   ?? null,
        instagram_handle: reg.instagram ?? null,
        dance_experience: LEVEL_MAP[reg.dance_level as string] ?? 'unknown',
        dance_role:       reg.dance_role ?? 'unknown',
        status:           'active',
        source:           'website',
      })
      .select('id')
      .single()

    if (personErr || !newPerson) {
      console.error('Person creation error:', personErr?.message)
      return NextResponse.json({ error: 'Could not create person record' }, { status: 500 })
    }
    personId = newPerson.id
  }

  // 3. Upsert course enrollment
  const today = new Date().toISOString().split('T')[0]
  const { error: enrollErr } = await supabase
    .from('course_enrollments')
    .upsert(
      {
        person_id:         personId,
        course_id:         reg.event_id,
        enrollment_status: 'active',
        payment_status:    'paid',
        package_type:      'drop-in',
        start_date:        today,
      },
      { onConflict: 'person_id,course_id' }
    )

  if (enrollErr) {
    console.error('Enrollment error:', enrollErr.message)
    return NextResponse.json({ error: 'Could not create enrollment' }, { status: 500 })
  }

  // 4. Mark registration paid and link person
  await supabase
    .from('public_registrations')
    .update({ status: 'paid', person_id: personId })
    .eq('id', id)

  return NextResponse.json({ ok: true, person_id: personId }, { status: 200 })
}
