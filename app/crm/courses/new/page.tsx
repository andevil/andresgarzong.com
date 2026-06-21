import { PageHeader } from '@/components/crm/ui'
import Link from 'next/link'
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'
import { CourseForm } from '@/components/crm/CourseForm'

export default function NewCoursePage() {
  return (
    <div>
      <div className="mb-6">
        <Link href="/crm/courses" className="flex items-center gap-1 text-sm text-[#9A907F] hover:text-[#C9A84C]">
          <ArrowLeft size={14} weight="light" /> Back
        </Link>
      </div>
      <PageHeader title="Add course" />
      <CourseForm />
    </div>
  )
}
