'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format, addWeeks, addDays } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { Field, Select, Input, Button, Card } from '@/components/crm/ui'

const PACKAGE_CREDITS: Record<string, { credits: number; weeks: number }> = {
  'monthly-pass':       { credits: 4, weeks: 5 },
  'two-month-pass':     { credits: 8, weeks: 10 },
  'three-month-pass':   { credits: 12, weeks: 15 },
  'private-lesson-pack':{ credits: 4, weeks: 16 },
  'custom':             { credits: 1, weeks: 8 },
}

const schema = z.object({
  person_id:    z.string().min(1, 'Required'),
  package_name: z.string().optional(),
  package_type: z.string(),
  total_credits:z.coerce.number().min(1),
  valid_from:   z.string(),
  valid_until:  z.string(),
  notes:        z.string().optional(),
})

type F = z.infer<typeof schema>

export function PassForm({ people }: { people: { id: string; full_name: string }[] }) {
  const router = useRouter()
  const today = format(new Date(), 'yyyy-MM-dd')
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: {
      package_type: 'monthly-pass',
      total_credits: 4,
      valid_from: today,
      valid_until: format(addWeeks(new Date(), 5), 'yyyy-MM-dd'),
    },
  })

  const onTypeChange = (type: string) => {
    const defaults = PACKAGE_CREDITS[type]
    if (defaults) {
      setValue('total_credits', defaults.credits)
      const from = new Date()
      setValue('valid_until', format(addWeeks(from, defaults.weeks), 'yyyy-MM-dd'))
    }
  }

  const onSubmit = async (values: F) => {
    const supabase = createClient()
    await supabase.from('passes').insert({
      ...values,
      used_credits: 0,
      status: 'active',
      package_name: values.package_name || null,
      notes: values.notes || null,
    })
    router.push('/crm/passes')
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
          <Field label="Package type" htmlFor="package_type">
            <Select id="package_type" {...register('package_type')} onChange={e => { register('package_type').onChange(e); onTypeChange(e.target.value) }}>
              {Object.keys(PACKAGE_CREDITS).map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
          </Field>
          <Field label="Package name (optional)" htmlFor="package_name">
            <Input id="package_name" placeholder="e.g. June Monthly Pass" {...register('package_name')} />
          </Field>
          <Field label="Credits" htmlFor="total_credits">
            <Input id="total_credits" type="number" min="1" {...register('total_credits')} />
          </Field>
          <Field label="Valid from" htmlFor="valid_from">
            <Input id="valid_from" type="date" {...register('valid_from')} />
          </Field>
          <Field label="Valid until" htmlFor="valid_until">
            <Input id="valid_until" type="date" {...register('valid_until')} />
          </Field>
        </div>
      </Card>
      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Add pass'}</Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  )
}
