'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { Field, Select, Input, Textarea, Button, Card } from '@/components/crm/ui'

const schema = z.object({
  name:       z.string().min(1, 'Required'),
  type:       z.string().optional(),
  date:       z.string(),
  start_time: z.string().optional(),
  end_time:   z.string().optional(),
  location:   z.string().optional(),
  capacity:   z.coerce.number().optional(),
  price:      z.coerce.number().default(0),
  status:     z.string().default('planned'),
  description:z.string().optional(),
  notes:      z.string().optional(),
})

type F = z.infer<typeof schema>

export function WorkshopForm() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: { date: format(new Date(), 'yyyy-MM-dd'), price: 0, status: 'planned' },
  })

  const onSubmit = async (values: F) => {
    const supabase = createClient()
    const { data } = await supabase.from('workshops').insert({
      ...values,
      type: values.type || null,
      start_time: values.start_time || null,
      end_time: values.end_time || null,
      location: values.location || null,
      capacity: values.capacity || null,
      description: values.description || null,
      notes: values.notes || null,
    }).select().single()
    router.push(`/crm/workshops/${data?.id}`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="mb-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Event name" htmlFor="name" error={errors.name?.message} className="sm:col-span-2">
            <Input id="name" {...register('name')} />
          </Field>
          <Field label="Type" htmlFor="type">
            <Select id="type" {...register('type')}>
              <option value="">—</option>
              {['colombian-workshop','caleña-workshop','social-practice','bbq','party','guest-teacher','festival','corporate','bachelorette','wedding','show','other'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Select>
          </Field>
          <Field label="Status" htmlFor="status">
            <Select id="status" {...register('status')}>
              {['planned','active','completed','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
          </Field>
          <Field label="Date" htmlFor="date">
            <Input id="date" type="date" {...register('date')} />
          </Field>
          <Field label="Location" htmlFor="location">
            <Input id="location" {...register('location')} />
          </Field>
          <Field label="Start time" htmlFor="start_time">
            <Input id="start_time" type="time" {...register('start_time')} />
          </Field>
          <Field label="End time" htmlFor="end_time">
            <Input id="end_time" type="time" {...register('end_time')} />
          </Field>
          <Field label="Capacity" htmlFor="capacity">
            <Input id="capacity" type="number" {...register('capacity')} />
          </Field>
          <Field label="Price (HUF)" htmlFor="price">
            <Input id="price" type="number" step="500" {...register('price')} />
          </Field>
          <Field label="Description" htmlFor="description" className="sm:col-span-2">
            <Textarea id="description" rows={3} {...register('description')} />
          </Field>
        </div>
      </Card>
      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Create event'}</Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  )
}
