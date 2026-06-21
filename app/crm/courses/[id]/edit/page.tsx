import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CourseForm } from '@/components/crm/CourseForm'
import { PageHeader } from '@/components/crm/ui'
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'
export const dynamic = 'force-dynamic'
export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: course } = await supabase.from('courses').select('*').eq('id', id).single()
  if (!course) notFound()
  return (
    <div>
      <div className="mb-6">
        <Link href={`/crm/courses/${id}`} className="flex items-center gap-1 text-sm text-[#9A907F] hover:text-[#C9A84C]">
          <ArrowLeft size={14} weight="light" /> Back
        </Link>
      </div>
      <PageHeader title={`Edit — ${course.name}`} />
      <CourseForm course={course} />
    </div>
  )
}
