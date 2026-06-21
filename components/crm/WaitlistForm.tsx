'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Field, Select, Input, Textarea, Button, Card } from '@/components/crm/ui'

const schema = z.object({
  person_id:          z.string().min(1, 'Required'),
  desired_course_type:z.string().optional(),
  desired_level:      z.string().optional(),
  dance_role:         z.string().optional(),
  has_partner:        z.boolean().default(false),
  partner_name:       z.string().optional(),
  urgency:            z.string().default('normal'),
  status:             z.string().default('new'),
  notes:              z.string().optional(),
})

type F = z.infer<typeof schema>

export function WaitlistForm({ people }: { people: { id: string; full_name: string }[] }) {
  const router = useRouter()
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: { urgency: 'normal', status: 'new' },
  })
  const hasPartner = watch('has_partner')

  const onSubmit = async (values: F) => {
    const supabase = createClient()
    await supabase.from('waitlist_entries').insert({
      ...values,
      desired_course_type: values.desired_course_type || null,
      desired_level: values.desired_level || null,
      partner_name: values.partner_name || null,
      notes: values.notes || null,
    })

    // Update person status to 'waitlist'
    await supabase.from('people').update({ status: 'waitlist' }).eq('id', values.person_id)

    router.push('/crm/waitlist')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="mb-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Person" htmlFor="person_id" error={errors.person_id?.message} className="sm:col-span-2">
            <Select id="person_id" {...register('person_id')}>
              <option value="">Select person…</option>
              {people.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
            </Select>
          </Field>
          <Field label="Desired class type" htmlFor="desired_course_type">
            <Select id="desired_course_type" {...register('desired_course_type')}>
              <option value="">—</option>
              {['partnerwork','caleña','fusion','private','workshop'].map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
          </Field>
          <Field label="Level" htmlFor="desired_level">
            <Select id="desired_level" {...register('desired_level')}>
              <option value="">—</option>
              {['A1','A2','B1','B2','beginner','intermediate','advanced','open'].map(l => <option key={l} value={l}>{l}</option>)}
            </Select>
          </Field>
          <Field label="Dance role" htmlFor="dance_role">
            <Select id="dance_role" {...register('dance_role')}>
              <option value="">—</option>
              {['leader','follower','both','solo','unknown'].map(r => <option key={r} value={r}>{r}</option>)}
            </Select>
          </Field>
          <Field label="Urgency" htmlFor="urgency">
            <Select id="urgency" {...register('urgency')}>
              {['low','normal','high'].map(u => <option key={u} value={u}>{u}</option>)}
            </Select>
          </Field>
          <Field label="" htmlFor="has_partner" className="flex items-center gap-3 pt-6">
            <input id="has_partner" type="checkbox" {...register('has_partner')} className="h-4 w-4" />
            <label htmlFor="has_partner" className="text-sm text-[#171410]">Has a partner</label>
          </Field>
          {hasPartner && (
            <Field label="Partner name" htmlFor="partner_name">
              <Input id="partner_name" {...register('partner_name')} />
            </Field>
          )}
          <Field label="Notes" htmlFor="notes" className="sm:col-span-2">
            <Textarea id="notes" rows={3} {...register('notes')} />
          </Field>
        </div>
      </Card>
      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Add to waitlist'}</Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  )
}
