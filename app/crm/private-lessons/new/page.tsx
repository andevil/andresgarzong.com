import { PageHeader } from '@/components/crm/ui'
import Link from 'next/link'
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'
import { PrivateLessonForm } from '@/components/crm/PrivateLessonForm'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function NewPrivateLessonPage() {
  const supabase = await createClient()
  const { data: people } = await supabase.from('people').select('id, full_name').order('full_name')
  return (
    <div>
      <div className="mb-6">
        <Link href="/crm/private-lessons" className="flex items-center gap-1 text-sm text-[#9A907F] hover:text-[#C9A84C]">
          <ArrowLeft size={14} weight="light" /> Back
        </Link>
      </div>
      <PageHeader title="Schedule private lesson" />
      <PrivateLessonForm people={people ?? []} />
    </div>
  )
}
