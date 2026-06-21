'use client'

import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Field, Select, Input, Textarea, Button, Card } from '@/components/crm/ui'
import { PageHeader } from '@/components/crm/ui'
import Link from 'next/link'
import { ArrowLeft } from '@phosphor-icons/react'

const schema = z.object({
  channel:          z.string(),
  direction:        z.string(),
  subject:          z.string().optional(),
  summary:          z.string().min(1, 'Required'),
  date:             z.string(),
  follow_up_needed: z.boolean(),
  follow_up_date:   z.string().optional(),
})

type F = z.infer<typeof schema>

export default function AddLogPage() {
  const { id } = useParams<{ id: string }>()
  const router  = useRouter()
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      direction: 'incoming',
      channel: 'whatsapp',
      follow_up_needed: false,
    },
  })

  const needFollowUp = watch('follow_up_needed')

  const onSubmit = async (values: F) => {
    const supabase = createClient()
    await supabase.from('communication_logs').insert({
      person_id: id,
      ...values,
      follow_up_date: values.follow_up_date || null,
      subject: values.subject || null,
    })
    router.push(`/crm/people/${id}`)
    router.refresh()
  }

  return (
    <div>
      <div className="mb-6">
        <Link href={`/crm/people/${id}`} className="flex items-center gap-1 text-sm text-[#9A907F] hover:text-[#C9A84C]">
          <ArrowLeft size={14} weight="light" /> Back
        </Link>
      </div>
      <PageHeader title="Log communication" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mb-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Channel" htmlFor="channel">
              <Select id="channel" {...register('channel')}>
                {['whatsapp','instagram','email','phone','in-person','other'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </Field>
            <Field label="Direction" htmlFor="direction">
              <Select id="direction" {...register('direction')}>
                <option value="incoming">Incoming</option>
                <option value="outgoing">Outgoing</option>
              </Select>
            </Field>
            <Field label="Date" htmlFor="date">
              <Input id="date" type="date" {...register('date')} />
            </Field>
            <Field label="Subject (optional)" htmlFor="subject">
              <Input id="subject" {...register('subject')} />
            </Field>
            <Field label="Summary" htmlFor="summary" error={errors.summary?.message} className="sm:col-span-2">
              <Textarea id="summary" rows={4} {...register('summary')} />
            </Field>
            <Field label="" htmlFor="follow_up_needed" className="flex items-center gap-3">
              <input id="follow_up_needed" type="checkbox" {...register('follow_up_needed')} className="h-4 w-4" />
              <label htmlFor="follow_up_needed" className="text-sm text-[#171410]">Follow-up needed</label>
            </Field>
            {needFollowUp && (
              <Field label="Follow-up date" htmlFor="follow_up_date">
                <Input id="follow_up_date" type="date" {...register('follow_up_date')} />
              </Field>
            )}
          </div>
        </Card>
        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Save note'}</Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  )
}
