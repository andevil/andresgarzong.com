import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; bonusId: string }> }
) {
  const { bonusId } = await params
  const supabase = await createClient()
  const body = await request.json()

  const update: Record<string, unknown> = {}

  if (typeof body.used === 'boolean') {
    update.used = body.used
    update.used_date = body.used ? (body.used_date ?? format(new Date(), 'yyyy-MM-dd')) : null
  }
  if ('used_for' in body) update.used_for = body.used_for ?? null
  if ('notes'    in body) update.notes    = body.notes    ?? null

  const { data, error } = await supabase
    .from('package_bonuses')
    .update(update)
    .eq('id', bonusId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
