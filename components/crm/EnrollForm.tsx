'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { Field, Select, Input, Button, Card } from '@/components/crm/ui'

const schema = z.object({
  person_id:         z.string().min(1, 'Required'),
  enrollment_status: z.string().default('active'),
  start_date:        z.string(),
  package_type:      z.string().default('drop-in'),
  payment_status:    z.string().default('unpaid'),
  notes:             z.string().optional(),
})

type F = z.infer<typeof schema>

export function EnrollForm({ courseId, people }: {
  courseId: string
  people: { id: string; full_name: string; dance_role: string }[]
}) {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: { start_date: format(new Date(), 'yyyy-MM-dd'), enrollment_status: 'active', package_type: 'drop-in', payment_status: 'unpaid' },
  })

  const onSubmit = async (values: F) => {
    const supabase = createClient()
    await supabase.from('course_enrollments').upsert({
      course_id: courseId,
      ...values,
      notes: values.notes || null,
    }, { onConflict: 'person_id,course_id' })
    router.push(`/crm/courses/${courseId}`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="mb-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Person" htmlFor="person_id" error={errors.person_id?.message} className="sm:col-span-2">
            <Select id="person_id" {...register('person_id')}>
              <option value="">Select dancer…</option>
              {people.map(p => <option key={p.id} value={p.id}>{p.full_name} ({p.dance_role})</option>)}
            </Select>
          </Field>
          <Field label="Enrollment status" htmlFor="enrollment_status">
            <Select id="enrollment_status" {...register('enrollment_status')}>
              {['active','trial','invited','paused'].map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
          </Field>
          <Field label="Start date" htmlFor="start_date">
            <Input id="start_date" type="date" {...register('start_date')} />
          </Field>
          <Field label="Package" htmlFor="package_type">
            <Select id="package_type" {...register('package_type')}>
              {['drop-in','monthly-pass','two-month-pass','three-month-pass','custom'].map(p => <option key={p} value={p}>{p}</option>)}
            </Select>
          </Field>
          <Field label="Payment status" htmlFor="payment_status">
            <Select id="payment_status" {...register('payment_status')}>
              {['unpaid','paid','partial','overdue'].map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
          </Field>
        </div>
      </Card>
      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Enroll dancer'}</Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  )
}
