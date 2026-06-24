'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, CheckCircle, WarningCircle } from '@phosphor-icons/react'

const PHONE_RE = /^[+\d][\d\s\-().]{5,28}$/

const schema = z.object({
  name:  z.string().min(1, 'Name is required').max(100).trim(),
  email: z.string().min(1, 'Email is required').email('Invalid email address').max(200).trim(),
  instagram: z.string().max(100).trim().optional(),
  phone: z.string().trim().optional()
    .refine(v => !v || PHONE_RE.test(v), { message: 'Enter a valid phone number, e.g. +36 20 123 4567' }),
  dance_level:         z.string().min(1, 'Please select your level'),
  dance_role:          z.string().optional(),
  coming_with_partner: z.boolean().optional(),
  partner_name:        z.string().max(100).trim().optional(),
})

type F = z.infer<typeof schema>

interface Props {
  eventId:       string
  eventType:     'course' | 'workshop'
  eventName:     string
  isPartnerwork: boolean
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-[#9A907F]">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
          <WarningCircle size={12} weight="fill" className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}

function cls(err?: string) {
  return `w-full border ${err ? 'border-red-400 bg-red-50/20' : 'border-[#E2DDD5] bg-white'} px-3 py-2.5 text-sm text-[#171410] outline-none focus:border-[#C9A84C] transition-colors`
}

export function AttendModal({ eventId, eventType, eventName, isPartnerwork }: Props) {
  const [open, setOpen]         = useState(false)
  const [success, setSuccess]   = useState(false)
  const [serverError, setError] = useState<string | null>(null)
  const [shaking, setShaking]   = useState(false)

  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: { coming_with_partner: false },
  })

  const withPartner = watch('coming_with_partner')

  const openModal = () => {
    reset()
    setSuccess(false)
    setError(null)
    setOpen(true)
  }
  const closeModal = () => setOpen(false)

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const onSubmit = async (data: F) => {
    setError(null)
    const res = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        event_id:   eventId,
        event_type: eventType,
        event_name: eventName,
      }),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      setError((body as { error?: string }).error ?? 'Something went wrong. Please try again.')
      return
    }
    setSuccess(true)
  }

  return (
    <>
      <button
        onClick={openModal}
        className="w-full bg-[#C9A84C] px-8 py-4 text-sm font-semibold uppercase tracking-widest text-[#171410] transition-opacity hover:opacity-80"
      >
        I want to attend
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#171410]/70" onClick={closeModal} />

          {/* Panel */}
          <div className="relative w-full max-w-lg bg-[#F7F1E7] shadow-2xl sm:max-h-[90vh] overflow-y-auto">

            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E2DDD5] bg-[#F7F1E7] px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">Registration</p>
                <h2 className="font-display text-2xl font-light text-[#171410]">{eventName}</h2>
              </div>
              <button onClick={closeModal} aria-label="Close" className="text-[#9A907F] hover:text-[#171410]">
                <X size={20} weight="light" />
              </button>
            </div>

            {success ? (
              /* ── Success state ─────────────────────────────────────────── */
              <div className="flex flex-col items-center px-6 py-12 text-center">
                <CheckCircle size={52} weight="light" className="mb-4 text-[#C9A84C]" />
                <p className="font-display text-2xl font-light text-[#171410]">You&apos;re signed up!</p>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#6B6155]">
                  Thanks for enrolling in <span className="font-medium text-[#171410]">{eventName}</span>.
                  Soon you&apos;ll receive all the payment details — we&apos;ll send you the Revolut or Wise link
                  to confirm your spot. See you on the dance floor!
                </p>
                <button
                  onClick={closeModal}
                  className="mt-8 bg-[#171410] px-8 py-3 text-sm font-medium text-white transition-opacity hover:opacity-80"
                >
                  Close
                </button>
              </div>
            ) : (
              /* ── Form ──────────────────────────────────────────────────── */
              <form
                onSubmit={handleSubmit(onSubmit, () => {
                  setShaking(true)
                  setTimeout(() => setShaking(false), 400)
                })}
                className={`space-y-4 px-6 py-6 ${shaking ? 'shake' : ''}`}
              >

                <Field label="Full name *" error={errors.name?.message}>
                  <input
                    {...register('name')}
                    className={cls(errors.name?.message)}
                    placeholder="Maria García"
                    autoComplete="name"
                  />
                </Field>

                <Field label="Email *" error={errors.email?.message}>
                  <input
                    {...register('email')}
                    type="email"
                    className={cls(errors.email?.message)}
                    placeholder="maria@example.com"
                    autoComplete="email"
                  />
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Instagram">
                    <div className="flex">
                      <span className="flex items-center border border-r-0 border-[#E2DDD5] bg-[#E2DDD5] px-3 text-sm text-[#9A907F]">@</span>
                      <input
                        {...register('instagram')}
                        className={cls() + ' border-l-0'}
                        placeholder="mariadance"
                        autoComplete="off"
                      />
                    </div>
                  </Field>

                  <Field label="WhatsApp / phone" error={errors.phone?.message}>
                    <input
                      {...register('phone')}
                      type="tel"
                      className={cls(errors.phone?.message)}
                      placeholder="+36 20 123 4567"
                      autoComplete="tel"
                    />
                  </Field>
                </div>

                <Field label="Dance level *" error={errors.dance_level?.message}>
                  <select {...register('dance_level')} className={cls(errors.dance_level?.message)}>
                    <option value="">Select your level…</option>
                    <option value="absolute-beginner">Absolute beginner — never danced salsa</option>
                    <option value="beginner">Beginner — I know the basics</option>
                    <option value="intermediate">Intermediate — comfortable with combos</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </Field>

                {/* Partnerwork-only fields */}
                {isPartnerwork && (
                  <>
                    <Field label="I want to dance as">
                      <select {...register('dance_role')} className={cls()}>
                        <option value="">—</option>
                        <option value="leader">Leader</option>
                        <option value="follower">Follower</option>
                        <option value="both">Both — I want to learn both roles</option>
                      </select>
                    </Field>

                    <div className="flex items-center gap-3">
                      <input
                        id="with_partner"
                        type="checkbox"
                        {...register('coming_with_partner')}
                        className="h-4 w-4 accent-[#C9A84C]"
                      />
                      <label htmlFor="with_partner" className="cursor-pointer text-sm text-[#171410]">
                        I&apos;m coming with a partner
                      </label>
                    </div>

                    {withPartner && (
                      <Field label="Partner's name">
                        <input
                          {...register('partner_name')}
                          className={cls()}
                          placeholder="Partner's full name"
                        />
                      </Field>
                    )}
                  </>
                )}

                {serverError && (
                  <p className="bg-red-50 px-3 py-2 text-xs text-red-600">{serverError}</p>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#C9A84C] px-6 py-3.5 text-sm font-semibold uppercase tracking-widest text-[#171410] transition-opacity hover:opacity-80 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending…' : 'Send my registration'}
                  </button>
                  <p className="mt-3 text-center text-xs text-[#9A907F]">
                    No payment required now — you&apos;ll receive the payment link shortly.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
