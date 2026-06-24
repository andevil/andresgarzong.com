import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

// Server-side schema — all string inputs are trimmed and length-capped.
// Supabase uses parameterised queries so SQL injection is not possible,
// but we still sanitise to avoid garbage data in the CRM.
const schema = z.object({
  event_id:   z.string().uuid('Invalid event reference'),
  event_type: z.enum(['course', 'workshop']),
  event_name: z.string().min(1).max(200).trim(),

  name:  z.string().min(1, 'Name is required').max(100).trim(),
  email: z
    .string()
    .max(200)
    .trim()
    .toLowerCase()
    .optional()
    .transform(v => (v && v.length > 0 ? v : null))
    .pipe(z.string().email('Invalid email address').nullable()),

  instagram: z
    .string()
    .max(100)
    .trim()
    .optional()
    .transform(v => (v ? v.replace(/^@+/, '').trim() || null : null)),

  phone: z
    .string()
    .max(30)
    .trim()
    .optional()
    .transform(v => v || null),

  dance_level: z
    .string()
    .max(50)
    .trim()
    .optional()
    .transform(v => v || null),

  dance_role: z
    .enum(['leader', 'follower', 'both'])
    .optional()
    .transform(v => v ?? null),

  coming_with_partner: z.boolean().optional().transform(v => v ?? null),

  partner_name: z
    .string()
    .max(100)
    .trim()
    .optional()
    .transform(v => v || null),
})

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    const first = parsed.error.errors[0]
    return NextResponse.json(
      { error: first?.message ?? 'Validation failed' },
      { status: 422 }
    )
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('public_registrations')
    .insert(parsed.data)

  if (error) {
    console.error('Registration insert error:', error.message)
    return NextResponse.json(
      { error: 'Could not save your registration. Please try again.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
