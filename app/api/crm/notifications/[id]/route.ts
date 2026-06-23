import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const body = await request.json()

  const update: Record<string, unknown> = {}

  if (body.status === 'viewed') {
    update.status = 'viewed'
    update.viewed_at = new Date().toISOString()
  } else if (body.status === 'dismissed') {
    update.status = 'dismissed'
    update.dismissed_at = new Date().toISOString()
  } else if (body.status === 'sent') {
    update.status = 'sent'
  }

  const { data, error } = await supabase
    .from('package_notifications')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
