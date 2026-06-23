'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format, addWeeks } from 'date-fns'
import { Field, Input, Textarea, Select, Button, Card } from '@/components/crm/ui'
import type { Promotion } from '@/lib/supabase/types'

const schema = z.object({
  person_id:       z.string().min(1, 'Required'),
  promotion_id:    z.string().optional(),
  name:            z.string().min(1, 'Required'),
  price:           z.coerce.number().min(0, 'Required'),
  classes_included:z.coerce.number().min(1, 'At least 1'),
  start_date:      z.string().optional(),
  expiry_date:     z.string().optional(),
  payment_status:  z.enum(['unpaid', 'partial', 'paid']).default('unpaid'),
  notes:           z.string().optional(),
  bonus_items:     z.array(z.object({
    type:    z.string(),
    label:   z.string(),
    include: z.boolean(),
  })).default([]),
})

type F = z.infer<typeof schema>

interface Props {
  people: { id: string; full_name: string }[]
  promotions: Promotion[]
}

export function PackageForm({ people, promotions }: Props) {
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const today = format(new Date(), 'yyyy-MM-dd')

  const { register, handleSubmit, control, setValue, formState: { errors, isSubmitting } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: {
      person_id:        '',
      promotion_id:     '',
      name:             '',
      price:            15000,
      classes_included: 4,
      start_date:       today,
      expiry_date:      format(addWeeks(new Date(), 5), 'yyyy-MM-dd'),
      payment_status:   'unpaid',
      notes:            '',
      bonus_items:      [],
    },
  })

  const promotionId  = useWatch({ control, name: 'promotion_id' })
  const startDateVal = useWatch({ control, name: 'start_date' })

  // Auto-fill from promotion
  useEffect(() => {
    if (!promotionId) return
    const promo = promotions.find(p => p.id === promotionId)
    if (!promo) return

    setValue('name',             promo.name)
    setValue('price',            promo.price)
    setValue('classes_included', promo.classes_included)

    const from = startDateVal ? new Date(startDateVal) : new Date()
    setValue('expiry_date', format(addWeeks(from, promo.validity_weeks), 'yyyy-MM-dd'))

    const bonusItems = (promo.bonus_items as { type: string; label: string }[]).map(b => ({
      type:    b.type,
      label:   b.label,
      include: true,
    }))
    setValue('bonus_items', bonusItems)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promotionId])

  // Recalculate expiry when start_date changes (if promotion selected)
  useEffect(() => {
    if (!promotionId || !startDateVal) return
    const promo = promotions.find(p => p.id === promotionId)
    if (!promo) return
    const from = new Date(startDateVal)
    setValue('expiry_date', format(addWeeks(from, promo.validity_weeks), 'yyyy-MM-dd'))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDateVal])

  const bonusItems = useWatch({ control, name: 'bonus_items' })

  const onSubmit = async (values: F) => {
    setSubmitError(null)

    const selectedBonuses = values.bonus_items
      .filter(b => b.include)
      .map(b => ({ type: b.type, label: b.label }))

    const payload = {
      person_id:        values.person_id,
      promotion_id:     values.promotion_id || null,
      name:             values.name,
      price:            values.price,
      classes_included: values.classes_included,
      start_date:       values.start_date || null,
      expiry_date:      values.expiry_date || null,
      payment_status:   values.payment_status,
      notes:            values.notes || null,
      bonus_items:      selectedBonuses,
    }

    const res = await fetch('/api/crm/packages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      setSubmitError(body.error ?? 'Failed to create package')
      return
    }

    const data = await res.json()
    router.push(`/crm/packages/${data.id}`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="mb-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          <Field label="Student" htmlFor="person_id" error={errors.person_id?.message} className="sm:col-span-2">
            <Select id="person_id" {...register('person_id')}>
              <option value="">Select student…</option>
              {people.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
            </Select>
          </Field>

          <Field label="Promotion (optional)" htmlFor="promotion_id" className="sm:col-span-2">
            <Select id="promotion_id" {...register('promotion_id')}>
              <option value="">Custom package (no promotion)</option>
              {promotions.filter(p => p.active).map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.price.toLocaleString()} HUF / {p.classes_included} classes / {p.validity_weeks}w
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Package name" htmlFor="name" error={errors.name?.message} className="sm:col-span-2">
            <Input id="name" {...register('name')} placeholder="e.g. Standard Monthly Pass" />
          </Field>

          <Field label="Price (HUF)" htmlFor="price" error={errors.price?.message}>
            <Input id="price" type="number" step="500" min="0" {...register('price')} />
          </Field>

          <Field label="Classes included" htmlFor="classes_included" error={errors.classes_included?.message}>
            <Input id="classes_included" type="number" min="1" {...register('classes_included')} />
          </Field>

          <Field label="Start date" htmlFor="start_date">
            <Input id="start_date" type="date" {...register('start_date')} />
          </Field>

          <Field label="Expiry date" htmlFor="expiry_date">
            <Input id="expiry_date" type="date" {...register('expiry_date')} />
          </Field>

          <Field label="Payment status" htmlFor="payment_status">
            <Select id="payment_status" {...register('payment_status')}>
              <option value="unpaid">Unpaid</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
            </Select>
          </Field>

          <Field label="Notes" htmlFor="notes" className="sm:col-span-2">
            <Textarea id="notes" rows={2} {...register('notes')} />
          </Field>
        </div>
      </Card>

      {/* Bonus items from promotion */}
      {bonusItems && bonusItems.length > 0 && (
        <Card className="mb-6">
          <h3 className="mb-4 font-display text-lg font-light text-[#171410]">Bonus Items</h3>
          <div className="space-y-3">
            {bonusItems.map((b, idx) => (
              <label key={idx} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register(`bonus_items.${idx}.include`)}
                  className="h-4 w-4 accent-[#C9A84C]"
                />
                <span className="text-sm text-[#171410]">{b.label}</span>
                <span className="text-xs text-[#9A907F]">({b.type.replace(/_/g, ' ')})</span>
              </label>
            ))}
          </div>
        </Card>
      )}

      {submitError && (
        <p className="mb-4 bg-red-50 px-4 py-2 text-sm text-red-600">{submitError}</p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Assign Package'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  )
}
