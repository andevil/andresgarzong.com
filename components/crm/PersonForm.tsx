'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Field, Input, Select, Textarea, Button, Card } from '@/components/crm/ui'
import type { Person } from '@/lib/supabase/types'

const schema = z.object({
  first_name:       z.string().min(1, 'Required'),
  last_name:        z.string().min(1, 'Required'),
  email:            z.string().email('Invalid email').or(z.literal('')).optional(),
  phone:            z.string().optional(),
  instagram_handle: z.string().optional(),
  whatsapp_number:  z.string().optional(),
  nationality:      z.string().optional(),
  source:           z.string().optional(),
  status:           z.string(),
  dance_role:       z.string(),
  dance_experience: z.string(),
  notes:            z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function PersonForm({ person }: { person?: Person }) {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name:       person?.first_name ?? '',
      last_name:        person?.last_name ?? '',
      email:            person?.email ?? '',
      phone:            person?.phone ?? '',
      instagram_handle: person?.instagram_handle ?? '',
      whatsapp_number:  person?.whatsapp_number ?? '',
      nationality:      person?.nationality ?? '',
      source:           person?.source ?? '',
      status:           person?.status ?? 'lead',
      dance_role:       person?.dance_role ?? 'unknown',
      dance_experience: person?.dance_experience ?? 'unknown',
      notes:            person?.notes ?? '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    const supabase = createClient()
    if (person) {
      await supabase.from('people').update(values).eq('id', person.id)
      router.push(`/crm/people/${person.id}`)
    } else {
      const { data } = await supabase.from('people').insert(values).select().single()
      router.push(`/crm/people/${data?.id}`)
    }
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="mb-6">
        <h2 className="mb-6 font-display text-xl font-light text-[#171410]">Basic info</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="First name" htmlFor="first_name" error={errors.first_name?.message}>
            <Input id="first_name" {...register('first_name')} />
          </Field>
          <Field label="Last name" htmlFor="last_name" error={errors.last_name?.message}>
            <Input id="last_name" {...register('last_name')} />
          </Field>
          <Field label="Email" htmlFor="email" error={errors.email?.message}>
            <Input id="email" type="email" {...register('email')} />
          </Field>
          <Field label="Phone" htmlFor="phone">
            <Input id="phone" {...register('phone')} />
          </Field>
          <Field label="Instagram" htmlFor="instagram_handle">
            <Input id="instagram_handle" placeholder="@handle" {...register('instagram_handle')} />
          </Field>
          <Field label="WhatsApp" htmlFor="whatsapp_number">
            <Input id="whatsapp_number" {...register('whatsapp_number')} />
          </Field>
          <Field label="Nationality" htmlFor="nationality">
            <Input id="nationality" {...register('nationality')} />
          </Field>
          <Field label="How did they find us?" htmlFor="source">
            <Select id="source" {...register('source')}>
              <option value="">—</option>
              {['instagram','whatsapp','friend-referral','facebook','workshop','party','website','other'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </Field>
        </div>
      </Card>

      <Card className="mb-6">
        <h2 className="mb-6 font-display text-xl font-light text-[#171410]">Dance profile</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Field label="Status" htmlFor="status">
            <Select id="status" {...register('status')}>
              {['lead','waitlist','active','inactive','alumni','private-only','workshop-only'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </Field>
          <Field label="Dance role" htmlFor="dance_role">
            <Select id="dance_role" {...register('dance_role')}>
              {['leader','follower','both','solo','unknown'].map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </Select>
          </Field>
          <Field label="Experience level" htmlFor="dance_experience">
            <Select id="dance_experience" {...register('dance_experience')}>
              {['absolute-beginner','beginner','intermediate','advanced','unknown'].map(e => (
                <option key={e} value={e}>{e}</option>
              ))}
            </Select>
          </Field>
        </div>
      </Card>

      <Card className="mb-6">
        <h2 className="mb-6 font-display text-xl font-light text-[#171410]">Notes</h2>
        <Textarea rows={4} {...register('notes')} placeholder="Internal notes…" />
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : person ? 'Save changes' : 'Add person'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
