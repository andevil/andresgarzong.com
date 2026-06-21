'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { Field, Input, Select, Textarea, Button, Card } from '@/components/crm/ui'

const schema = z.object({
  person_id:       z.string().min(1, 'Required'),
  amount:          z.coerce.number().min(1, 'Required'),
  currency:        z.string().default('HUF'),
  payment_method:  z.string().optional(),
  payment_type:    z.string().optional(),
  related_course_id: z.string().optional(),
  payment_date:    z.string(),
  period_start:    z.string().optional(),
  period_end:      z.string().optional(),
  status:          z.string().default('paid'),
  reference_note:  z.string().optional(),
  admin_notes:     z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function PaymentForm({
  people,
  courses,
}: {
  people: { id: string; full_name: string }[]
  courses: { id: string; name: string }[]
}) {
  const router = useRouter()
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      payment_date: format(new Date(), 'yyyy-MM-dd'),
      currency: 'HUF',
      status: 'paid',
    },
  })

  const paymentType = watch('payment_type')

  const onSubmit = async (values: FormValues) => {
    const supabase = createClient()
    const clean = {
      ...values,
      related_course_id: values.related_course_id || null,
      period_start: values.period_start || null,
      period_end: values.period_end || null,
      reference_note: values.reference_note || null,
      admin_notes: values.admin_notes || null,
    }
    await supabase.from('payments').insert(clean)
    router.push('/crm/payments')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="mb-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Person" htmlFor="person_id" error={errors.person_id?.message} className="sm:col-span-2">
            <Select id="person_id" {...register('person_id')}>
              <option value="">Select a person…</option>
              {people.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
            </Select>
          </Field>

          <Field label="Amount (HUF)" htmlFor="amount" error={errors.amount?.message}>
            <Input id="amount" type="number" step="500" {...register('amount')} />
          </Field>

          <Field label="Payment date" htmlFor="payment_date">
            <Input id="payment_date" type="date" {...register('payment_date')} />
          </Field>

          <Field label="Payment type" htmlFor="payment_type">
            <Select id="payment_type" {...register('payment_type')}>
              <option value="">—</option>
              {['single-class','monthly-pass','two-month-pass','three-month-pass','private-lesson','workshop','event','custom'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Select>
          </Field>

          <Field label="Payment method" htmlFor="payment_method">
            <Select id="payment_method" {...register('payment_method')}>
              <option value="">—</option>
              {['cash','revolut','wise','bank-transfer','other'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </Select>
          </Field>

          {['monthly-pass','two-month-pass','three-month-pass','single-class'].includes(paymentType ?? '') && (
            <>
              <Field label="Course" htmlFor="related_course_id">
                <Select id="related_course_id" {...register('related_course_id')}>
                  <option value="">—</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
              </Field>
              <Field label="Period start" htmlFor="period_start">
                <Input id="period_start" type="date" {...register('period_start')} />
              </Field>
              <Field label="Period end" htmlFor="period_end">
                <Input id="period_end" type="date" {...register('period_end')} />
              </Field>
            </>
          )}

          <Field label="Status" htmlFor="status">
            <Select id="status" {...register('status')}>
              {['paid','pending','overdue','refunded'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </Field>

          <Field label="Reference note" htmlFor="reference_note" className="sm:col-span-2">
            <Input id="reference_note" placeholder="e.g. Revolut ref, invoice #…" {...register('reference_note')} />
          </Field>

          <Field label="Admin notes" htmlFor="admin_notes" className="sm:col-span-2">
            <Textarea id="admin_notes" rows={2} {...register('admin_notes')} />
          </Field>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Add payment'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
