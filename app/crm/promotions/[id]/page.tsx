import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/crm/ui'
import { PromotionForm } from '@/components/crm/PromotionForm'
import type { Promotion } from '@/lib/supabase/types'

export const dynamic = 'force-dynamic'

export default async function EditPromotionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: promotion }, { count: packagesCount }] = await Promise.all([
    supabase.from('promotions').select('*').eq('id', id).single(),
    supabase
      .from('student_packages')
      .select('*', { count: 'exact', head: true })
      .eq('promotion_id', id),
  ])

  if (!promotion) notFound()

  return (
    <div>
      <div className="mb-6">
        <Link href="/crm/promotions" className="flex items-center gap-1 text-sm text-[#9A907F] hover:text-[#C9A84C]">
          <ArrowLeft size={14} weight="light" /> Promotions
        </Link>
      </div>
      <PageHeader
        title={promotion.name}
        subtitle={`Used in ${packagesCount ?? 0} package${packagesCount !== 1 ? 's' : ''}`}
      />
      <PromotionForm promotion={promotion as Promotion} />
    </div>
  )
}
