'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Field, Select, Textarea, Button, Card } from '@/components/crm/ui'
import type { WaitlistEntry } from '@/lib/supabase/types'

const schema = z.object({
  status:   z.string(),
  urgency:  z.string(),
  notes:    z.string().optional(),
})

type F = z.infer<typeof schema>

export function WaitlistEditForm({ entry }: { entry: WaitlistEntry & { people?: { full_name: string } } }) {
  const router = useRouter()
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: { status: entry.status, urgency: entry.urgency, notes: entry.notes ?? '' },
  })

  const onSubmit = async (values: F) => {
    const supabase = createClient()
    await supabase
      .from('waitlist_entries')
      .update({ ...values, last_contacted_at: values.status !== entry.status ? new Date().toISOString() : undefined })
      .eq('id', entry.id)
    router.push('/crm/waitlist')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="mb-6">
        <div className="mb-4 text-sm text-[#9A907F]">
          Wants: <strong className="text-[#171410]">{[entry.desired_course_type, entry.desired_level].filter(Boolean).join(' · ')}</strong>
          {' · '}Role: <strong className="text-[#171410]">{entry.dance_role}</strong>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Status" htmlFor="status">
            <Select id="status" {...register('status')}>
              {['new','contacted','invited','registered','not-ready','lost'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </Field>
          <Field label="Urgency" htmlFor="urgency">
            <Select id="urgency" {...register('urgency')}>
              {['low','normal','high'].map(u => <option key={u} value={u}>{u}</option>)}
            </Select>
          </Field>
          <Field label="Notes" htmlFor="notes" className="sm:col-span-2">
            <Textarea id="notes" rows={3} {...register('notes')} />
          </Field>
        </div>
      </Card>
      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Update'}</Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  )
}
