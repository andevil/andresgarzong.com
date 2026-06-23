import Link from 'next/link'
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/crm/ui'
import { PackageForm } from '@/components/crm/PackageForm'

export const dynamic = 'force-dynamic'

export default async function NewPackagePage() {
  const supabase = await createClient()

  const [{ data: people }, { data: promotions }] = await Promise.all([
    supabase
      .from('people')
      .select('id, full_name')
      .order('full_name'),
    supabase
      .from('promotions')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false }),
  ])

  return (
    <div>
      <div className="mb-6">
        <Link href="/crm/packages" className="flex items-center gap-1 text-sm text-[#9A907F] hover:text-[#C9A84C]">
          <ArrowLeft size={14} weight="light" /> Packages
        </Link>
      </div>
      <PageHeader title="Assign Package" subtitle="Create a new student package" />
      <PackageForm
        people={people ?? []}
        promotions={(promotions ?? []) as import('@/lib/supabase/types').Promotion[]}
      />
    </div>
  )
}
