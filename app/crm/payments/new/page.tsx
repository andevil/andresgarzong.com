import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/crm/ui'
import { PaymentForm } from '@/components/crm/PaymentForm'
import Link from 'next/link'
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'

export const dynamic = 'force-dynamic'

export default async function NewPaymentPage() {
  const supabase = await createClient()
  const { data: people } = await supabase.from('people').select('id, full_name').order('full_name')
  const { data: courses } = await supabase.from('courses').select('id, name').eq('status', 'active')

  return (
    <div>
      <div className="mb-6">
        <Link href="/crm/payments" className="flex items-center gap-1 text-sm text-[#9A907F] hover:text-[#C9A84C]">
          <ArrowLeft size={14} weight="light" /> Back to Payments
        </Link>
      </div>
      <PageHeader title="Add payment" />
      <PaymentForm people={people ?? []} courses={courses ?? []} />
    </div>
  )
}
