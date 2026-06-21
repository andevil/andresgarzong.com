import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { WaitlistEditForm } from '@/components/crm/WaitlistEditForm'
import { PageHeader } from '@/components/crm/ui'
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'

export const dynamic = 'force-dynamic'

export default async function EditWaitlistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: entry } = await supabase
    .from('waitlist_entries')
    .select('*, people(full_name)')
    .eq('id', id)
    .single()
  if (!entry) notFound()

  return (
    <div>
      <div className="mb-6">
        <Link href="/crm/waitlist" className="flex items-center gap-1 text-sm text-[#9A907F] hover:text-[#C9A84C]">
          <ArrowLeft size={14} weight="light" /> Waitlist
        </Link>
      </div>
      <PageHeader title={`Update — ${entry.people?.full_name}`} />
      <WaitlistEditForm entry={entry} />
    </div>
  )
}
