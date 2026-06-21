import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { EnrollForm } from '@/components/crm/EnrollForm'
import { PageHeader } from '@/components/crm/ui'
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'
export const dynamic = 'force-dynamic'
export default async function EnrollPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const [{ data: course }, { data: people }] = await Promise.all([
    supabase.from('courses').select('id, name').eq('id', id).single(),
    supabase.from('people').select('id, full_name, dance_role').order('full_name'),
  ])
  if (!course) notFound()
  return (
    <div>
      <div className="mb-6">
        <Link href={`/crm/courses/${id}`} className="flex items-center gap-1 text-sm text-[#9A907F] hover:text-[#C9A84C]">
          <ArrowLeft size={14} weight="light" /> Back to {course.name}
        </Link>
      </div>
      <PageHeader title="Enroll dancer" subtitle={course.name} />
      <EnrollForm courseId={id} people={people ?? []} />
    </div>
  )
}
