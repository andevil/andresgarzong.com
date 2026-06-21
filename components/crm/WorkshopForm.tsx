'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { Field, Select, Input, Textarea, Button, Card } from '@/components/crm/ui'
import { ImageUpload } from '@/components/crm/ImageUpload'
import type { Workshop } from '@/lib/supabase/types'

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const schema = z.object({
  name:        z.string().min(1, 'Required'),
  slug:        z.string().regex(/^[a-z0-9-]*$/, 'Only lowercase letters, numbers and hyphens').optional(),
  type:        z.string().optional(),
  date:        z.string(),
  start_time:  z.string().optional(),
  end_time:    z.string().optional(),
  location:    z.string().optional(),
  capacity:    z.coerce.number().optional(),
  price:       z.coerce.number().default(0),
  status:      z.string().default('planned'),
  description: z.string().optional(),
  notes:       z.string().optional(),
})

type F = z.infer<typeof schema>

export function WorkshopForm({ workshop }: { workshop?: Workshop }) {
  const router = useRouter()
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(workshop?.thumbnail_url ?? null)
  const [slugTouched, setSlugTouched] = useState(!!workshop?.slug)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { register, handleSubmit, control, setValue, formState: { errors, isSubmitting } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: {
      name:        workshop?.name        ?? '',
      slug:        workshop?.slug        ?? '',
      type:        workshop?.type        ?? '',
      date:        workshop?.date        ?? format(new Date(), 'yyyy-MM-dd'),
      start_time:  workshop?.start_time  ?? '',
      end_time:    workshop?.end_time    ?? '',
      location:    workshop?.location    ?? '',
      capacity:    workshop?.capacity    ?? undefined,
      price:       workshop?.price       ?? 0,
      status:      workshop?.status      ?? 'planned',
      description: workshop?.description ?? '',
      notes:       workshop?.notes       ?? '',
    },
  })

  const nameValue = useWatch({ control, name: 'name' })

  // Auto-fill slug from name if user hasn't typed their own
  useEffect(() => {
    if (!slugTouched && nameValue) {
      setValue('slug', toSlug(nameValue))
    }
  }, [nameValue, slugTouched, setValue])

  const onSubmit = async (values: F) => {
    setSubmitError(null)
    const supabase = createClient()
    const payload = {
      ...values,
      slug:        values.slug || null,
      type:        values.type || null,
      start_time:  values.start_time || null,
      end_time:    values.end_time || null,
      location:    values.location || null,
      capacity:    values.capacity || null,
      description: values.description || null,
      notes:       values.notes || null,
      thumbnail_url: thumbnailUrl,
    }

    if (workshop) {
      const { error } = await supabase.from('workshops').update(payload).eq('id', workshop.id)
      if (error) { setSubmitError(error.message); return }
      router.push(`/crm/workshops/${workshop.id}`)
    } else {
      const { data, error } = await supabase.from('workshops').insert(payload).select().single()
      if (error) { setSubmitError(error.message); return }
      router.push(`/crm/workshops/${data?.id}`)
    }
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="mb-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          <Field label="Event name" htmlFor="name" error={errors.name?.message} className="sm:col-span-2">
            <Input id="name" {...register('name')} />
          </Field>

          {/* Slug */}
          <Field
            label="Short URL slug"
            htmlFor="slug"
            error={errors.slug?.message}
            className="sm:col-span-2"
          >
            <div className="flex items-center gap-0">
              <span className="flex h-10 items-center rounded-l-xl border border-r-0 border-white/50 bg-white/30 px-3 text-xs text-[#9A907F] whitespace-nowrap">
                /events/
              </span>
              <Input
                id="slug"
                className="rounded-l-none"
                placeholder="my-summer-workshop"
                {...register('slug', {
                  onChange: () => setSlugTouched(true),
                })}
              />
            </div>
            <p className="mt-1 text-xs text-[#9A907F]">Auto-generated from name · edit to customise</p>
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

          {/* Thumbnail */}
          <Field label="Thumbnail image" className="sm:col-span-2">
            <ImageUpload
              value={thumbnailUrl}
              onChange={setThumbnailUrl}
              folder="workshops"
            />
          </Field>
        </div>
      </Card>

      {submitError && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{submitError}</p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : workshop ? 'Save changes' : 'Create event'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  )
}
