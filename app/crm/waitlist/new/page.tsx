import { PageHeader } from '@/components/crm/ui'
import Link from 'next/link'
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'
import { WaitlistForm } from '@/components/crm/WaitlistForm'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function NewWaitlistPage() {
  const supabase = await createClient()
  const { data: people } = await supabase.from('people').select('id, full_name').order('full_name')
  return (
    <div>
      <div className="mb-6">
        <Link href="/crm/waitlist" className="flex items-center gap-1 text-sm text-[#9A907F] hover:text-[#C9A84C]">
          <ArrowLeft size={14} weight="light" /> Back
        </Link>
      </div>
      <PageHeader title="Add to waitlist" />
      <WaitlistForm people={people ?? []} />
    </div>
  )
}
