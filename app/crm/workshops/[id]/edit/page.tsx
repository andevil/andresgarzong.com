import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/crm/ui'
import { WorkshopForm } from '@/components/crm/WorkshopForm'

export const dynamic = 'force-dynamic'

export default async function EditWorkshopPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: workshop } = await supabase.from('workshops').select('*').eq('id', id).single()
  if (!workshop) notFound()

  return (
    <div>
      <PageHeader title="Edit event" subtitle={workshop.name} />
      <WorkshopForm workshop={workshop} />
    </div>
  )
}
