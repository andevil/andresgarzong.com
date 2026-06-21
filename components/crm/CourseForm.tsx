'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Field, Input, Select, Textarea, Button, Card } from '@/components/crm/ui'
import type { Course } from '@/lib/supabase/types'

const schema = z.object({
  name:               z.string().min(1, 'Required'),
  style:              z.string(),
  level:              z.string().optional(),
  description:        z.string().optional(),
  location:           z.string().optional(),
  day_of_week:        z.string().optional(),
  start_time:         z.string().optional(),
  end_time:           z.string().optional(),
  capacity:           z.coerce.number().optional(),
  status:             z.string(),
  season:             z.string().optional(),
  default_price:      z.coerce.number(),
  monthly_pass_price: z.coerce.number(),
  notes:              z.string().optional(),
})

type F = z.infer<typeof schema>

export function CourseForm({ course }: { course?: Course }) {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: course?.name ?? '',
      style: course?.style ?? 'partnerwork',
      level: course?.level ?? '',
      description: course?.description ?? '',
      location: course?.location ?? '',
      day_of_week: course?.day_of_week ?? '',
      start_time: course?.start_time ?? '',
      end_time: course?.end_time ?? '',
      capacity: course?.capacity ?? undefined,
      status: course?.status ?? 'active',
      season: course?.season ?? '',
      default_price: course?.default_price ?? 4000,
      monthly_pass_price: course?.monthly_pass_price ?? 15000,
      notes: course?.notes ?? '',
    },
  })

  const onSubmit = async (values: F) => {
    const supabase = createClient()
    const clean = {
      ...values,
      level: values.level || null,
      location: values.location || null,
      day_of_week: values.day_of_week || null,
      start_time: values.start_time || null,
      end_time: values.end_time || null,
      season: values.season || null,
      notes: values.notes || null,
    }
    if (course) {
      await supabase.from('courses').update(clean).eq('id', course.id)
      router.push(`/crm/courses/${course.id}`)
    } else {
      const { data } = await supabase.from('courses').insert(clean).select().single()
      router.push(`/crm/courses/${data?.id}`)
    }
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="mb-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Course name" htmlFor="name" error={errors.name?.message} className="sm:col-span-2">
            <Input id="name" {...register('name')} />
          </Field>
          <Field label="Style" htmlFor="style">
            <Select id="style" {...register('style')}>
              {['partnerwork','caleña','fusion','private','workshop','other'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </Field>
          <Field label="Level" htmlFor="level">
            <Select id="level" {...register('level')}>
              <option value="">—</option>
              {['A1','A2','B1','B2','beginner','intermediate','advanced','open'].map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </Select>
          </Field>
          <Field label="Day of week" htmlFor="day_of_week">
            <Select id="day_of_week" {...register('day_of_week')}>
              <option value="">—</option>
              {['monday','tuesday','wednesday','thursday','friday','saturday','sunday'].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </Select>
          </Field>
          <Field label="Location" htmlFor="location">
            <Select id="location" {...register('location')}>
              <option value="">—</option>
              <option value="BackStage Studio, Dohány u. 5b">BackStage Studio</option>
              <option value="Roxy Studio, Tátra u. 4">Roxy Studio</option>
            </Select>
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
          <Field label="Status" htmlFor="status">
            <Select id="status" {...register('status')}>
              {['planned','active','paused','finished'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </Field>
          <Field label="Default price (HUF)" htmlFor="default_price">
            <Input id="default_price" type="number" step="500" {...register('default_price')} />
          </Field>
          <Field label="Monthly pass price (HUF)" htmlFor="monthly_pass_price">
            <Input id="monthly_pass_price" type="number" step="500" {...register('monthly_pass_price')} />
          </Field>
          <Field label="Notes" htmlFor="notes" className="sm:col-span-2">
            <Textarea id="notes" rows={3} {...register('notes')} />
          </Field>
        </div>
      </Card>
      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : course ? 'Save changes' : 'Add course'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  )
}
