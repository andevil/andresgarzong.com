'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Field, Input, Textarea, Select, Button, Card } from '@/components/crm/ui'
import { Plus, Trash } from '@phosphor-icons/react'
import type { Promotion } from '@/lib/supabase/types'

const BONUS_TYPES = [
  { value: 'free_private_lesson',   label: '1 free private lesson' },
  { value: 'half_price_private',    label: '50% off one private lesson' },
  { value: 'free_workshop',         label: 'Free workshop class' },
  { value: 'free_salsa_fusion',     label: 'Free Salsa Fusion class' },
  { value: 'free_colombian_salsa',  label: 'Free Colombian Salsa class' },
  { value: 'custom',                label: 'Custom bonus' },
]

const bonusItemSchema = z.object({
  type:  z.string().min(1),
  label: z.string().min(1, 'Label required'),
})

const schema = z.object({
  name:             z.string().min(1, 'Required'),
  month_season:     z.string().optional(),
  start_date:       z.string().optional(),
  end_date:         z.string().optional(),
  applicable_class: z.string().optional(),
  price:            z.coerce.number().min(0, 'Required'),
  classes_included: z.coerce.number().min(1, 'At least 1 class'),
  validity_weeks:   z.coerce.number().min(1, 'At least 1 week'),
  notes:            z.string().optional(),
  active:           z.boolean().default(true),
  bonus_items:      z.array(bonusItemSchema).default([]),
})

type F = z.infer<typeof schema>

export function PromotionForm({ promotion }: { promotion?: Promotion }) {
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: {
      name:             promotion?.name             ?? '',
      month_season:     promotion?.month_season     ?? '',
      start_date:       promotion?.start_date       ?? '',
      end_date:         promotion?.end_date         ?? '',
      applicable_class: promotion?.applicable_class ?? '',
      price:            promotion?.price            ?? 15000,
      classes_included: promotion?.classes_included ?? 4,
      validity_weeks:   promotion?.validity_weeks   ?? 5,
      notes:            promotion?.notes            ?? '',
      active:           promotion?.active           ?? true,
      bonus_items:      (promotion?.bonus_items as { type: string; label: string }[]) ?? [],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'bonus_items' })

  const onSubmit = async (values: F) => {
    setSubmitError(null)
    const payload = {
      ...values,
      month_season:     values.month_season     || null,
      start_date:       values.start_date       || null,
      end_date:         values.end_date         || null,
      applicable_class: values.applicable_class || null,
      notes:            values.notes            || null,
    }

    const url = promotion
      ? `/api/crm/promotions/${promotion.id}`
      : '/api/crm/promotions'

    const res = await fetch(url, {
      method: promotion ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      setSubmitError(body.error ?? 'Failed to save promotion')
      return
    }

    router.push('/crm/promotions')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="mb-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          <Field label="Name" htmlFor="name" error={errors.name?.message} className="sm:col-span-2">
            <Input id="name" {...register('name')} placeholder="e.g. Standard Monthly Pass" />
          </Field>

          <Field label="Month / Season" htmlFor="month_season">
            <Input id="month_season" {...register('month_season')} placeholder="e.g. June 2025" />
          </Field>

          <Field label="Applicable class" htmlFor="applicable_class">
            <Input id="applicable_class" {...register('applicable_class')} placeholder="e.g. Partnerwork Monday" />
          </Field>

          <Field label="Start date" htmlFor="start_date">
            <Input id="start_date" type="date" {...register('start_date')} />
          </Field>

          <Field label="End date" htmlFor="end_date">
            <Input id="end_date" type="date" {...register('end_date')} />
          </Field>

          <Field label="Price (HUF)" htmlFor="price" error={errors.price?.message}>
            <Input id="price" type="number" step="500" min="0" {...register('price')} />
          </Field>

          <Field label="Classes included" htmlFor="classes_included" error={errors.classes_included?.message}>
            <Input id="classes_included" type="number" min="1" {...register('classes_included')} />
          </Field>

          <Field label="Validity (weeks)" htmlFor="validity_weeks" error={errors.validity_weeks?.message}>
            <Input id="validity_weeks" type="number" min="1" {...register('validity_weeks')} />
          </Field>

          <Field label="Active" htmlFor="active" className="flex items-end gap-3">
            <div className="flex items-center gap-2 pb-1">
              <input id="active" type="checkbox" {...register('active')} className="h-4 w-4 accent-[#C9A84C]" />
              <span className="text-sm text-[#6B6155]">Show in promotion selector</span>
            </div>
          </Field>

          <Field label="Notes" htmlFor="notes" className="sm:col-span-2">
            <Textarea id="notes" rows={2} {...register('notes')} />
          </Field>
        </div>
      </Card>

      {/* Bonus items */}
      <Card className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-light text-[#171410]">Bonus Items</h3>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => append({ type: 'free_workshop', label: 'Free workshop class' })}
          >
            <Plus size={14} weight="light" /> Add Bonus
          </Button>
        </div>

        {fields.length === 0 && (
          <p className="text-sm text-[#9A907F]">No bonus items. Add extras like free lessons or discounts.</p>
        )}

        <div className="space-y-3">
          {fields.map((field, idx) => (
            <div key={field.id} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto] items-end border-b border-white/40 pb-3 last:border-0 last:pb-0">
              <Field label="Type" htmlFor={`bonus_items.${idx}.type`}>
                <Select id={`bonus_items.${idx}.type`} {...register(`bonus_items.${idx}.type`)}>
                  {BONUS_TYPES.map(bt => (
                    <option key={bt.value} value={bt.value}>{bt.label}</option>
                  ))}
                </Select>
              </Field>
              <Field
                label="Label"
                htmlFor={`bonus_items.${idx}.label`}
                error={errors.bonus_items?.[idx]?.label?.message}
              >
                <Input
                  id={`bonus_items.${idx}.label`}
                  {...register(`bonus_items.${idx}.label`)}
                  placeholder="Display text"
                />
              </Field>
              <button
                type="button"
                onClick={() => remove(idx)}
                className="mb-1 flex h-9 w-9 items-center justify-center text-red-400 hover:text-red-600 transition-colors"
                aria-label="Remove bonus"
              >
                <Trash size={16} weight="light" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {submitError && (
        <p className="mb-4 bg-red-50 px-4 py-2 text-sm text-red-600">{submitError}</p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : promotion ? 'Save changes' : 'Create promotion'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  )
}
