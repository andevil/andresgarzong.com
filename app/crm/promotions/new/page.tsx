import Link from 'next/link'
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'
import { PageHeader } from '@/components/crm/ui'
import { PromotionForm } from '@/components/crm/PromotionForm'

export const dynamic = 'force-dynamic'

export default function NewPromotionPage() {
  return (
    <div>
      <div className="mb-6">
        <Link href="/crm/promotions" className="flex items-center gap-1 text-sm text-[#9A907F] hover:text-[#C9A84C]">
          <ArrowLeft size={14} weight="light" /> Promotions
        </Link>
      </div>
      <PageHeader title="New Promotion" subtitle="Create a reusable package template" />
      <PromotionForm />
    </div>
  )
}
