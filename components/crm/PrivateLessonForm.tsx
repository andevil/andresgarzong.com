'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { Field, Select, Input, Textarea, Button, Card } from '@/components/crm/ui'

const schema = z.object({
  person_id:           z.string().min(1, 'Required'),
  partner_person_id:   z.string().optional(),
  date:                z.string(),
  start_time:          z.string().optional(),
  end_time:            z.string().optional(),
  location:            z.string().optional(),
  focus_area:          z.string().optional(),
  price:               z.coerce.number().default(14000),
  room_rental_included:z.boolean().default(false),
  payment_status:      z.string().default('unpaid'),
  status:              z.string().default('scheduled'),
  notes:               z.string().optional(),
})

type F = z.infer<typeof schema>

export function PrivateLessonForm({ people }: { people: { id: string; full_name: string }[] }) {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: { date: format(new Date(), 'yyyy-MM-dd'), price: 14000, payment_status: 'unpaid', status: 'scheduled' },
  })

  const onSubmit = async (values: F) => {
    const supabase = createClient()
    await supabase.from('private_lessons').insert({
      ...values,
      partner_person_id: values.partner_person_id || null,
      start_time: values.start_time || null,
      end_time: values.end_time || null,
      location: values.location || null,
      focus_area: values.focus_area || null,
      notes: values.notes || null,
    })
    router.push('/crm/private-lessons')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="mb-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Student" htmlFor="person_id" error={errors.person_id?.message}>
            <Select id="person_id" {...register('person_id')}>
              <option value="">Select person…</option>
              {people.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
            </Select>
          </Field>
          <Field label="Partner (optional)" htmlFor="partner_person_id">
            <Select id="partner_person_id" {...register('partner_person_id')}>
              <option value="">None</option>
              {people.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
            </Select>
          </Field>
          <Field label="Date" htmlFor="date">
            <Input id="date" type="date" {...register('date')} />
          </Field>
          <Field label="Location" htmlFor="location">
            <Select id="location" {...register('location')}>
              <option value="">—</option>
              <option value="BackStage Studio, Dohány u. 5b">BackStage Studio</option>
              <option value="Roxy Studio, Tátra u. 4">Roxy Studio</option>
              <option value="Online">Online</option>
            </Select>
          </Field>
          <Field label="Start time" htmlFor="start_time">
            <Input id="start_time" type="time" {...register('start_time')} />
          </Field>
          <Field label="End time" htmlFor="end_time">
            <Input id="end_time" type="time" {...register('end_time')} />
          </Field>
          <Field label="Focus area" htmlFor="focus_area" className="sm:col-span-2">
            <Input id="focus_area" placeholder="e.g. Timing, body movement, turn patterns…" {...register('focus_area')} />
          </Field>
          <Field label="Price (HUF)" htmlFor="price">
            <Input id="price" type="number" step="1000" {...register('price')} />
          </Field>
          <Field label="Payment status" htmlFor="payment_status">
            <Select id="payment_status" {...register('payment_status')}>
              {['unpaid','paid','partial','overdue'].map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
          </Field>
          <Field label="Notes" htmlFor="notes" className="sm:col-span-2">
            <Textarea id="notes" rows={3} {...register('notes')} />
          </Field>
        </div>
      </Card>
      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Schedule lesson'}</Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  )
}
