import { PersonForm } from '@/components/crm/PersonForm'
import { PageHeader } from '@/components/crm/ui'
import Link from 'next/link'
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'

export default function NewPersonPage() {
  return (
    <div>
      <div className="mb-6">
        <Link href="/crm/people" className="flex items-center gap-1 text-sm text-[#9A907F] hover:text-[#C9A84C]">
          <ArrowLeft size={14} weight="light" /> Back to People
        </Link>
      </div>
      <PageHeader title="Add person" />
      <PersonForm />
    </div>
  )
}
