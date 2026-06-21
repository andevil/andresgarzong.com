// Shared CRM UI primitives — all sharp corners, gold accent, ink palette

import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------
type BadgeVariant = 'gold' | 'green' | 'red' | 'orange' | 'gray' | 'blue'

const badgeClasses: Record<BadgeVariant, string> = {
  gold:   'bg-[#C9A84C]/15 text-[#9A6F1E]',
  green:  'bg-emerald-50 text-emerald-700',
  red:    'bg-red-50 text-red-700',
  orange: 'bg-orange-50 text-orange-700',
  gray:   'bg-[#F7F1E7] text-[#6B6155]',
  blue:   'bg-blue-50 text-blue-700',
}

export function Badge({ children, variant = 'gray', className }: {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}) {
  return (
    <span className={cn('inline-block px-2 py-0.5 text-[0.68rem] uppercase tracking-wide font-medium', badgeClasses[variant], className)}>
      {children}
    </span>
  )
}

// Map enum values → badge variants
export function statusBadge(status: string) {
  const map: Record<string, BadgeVariant> = {
    active: 'green', lead: 'blue', waitlist: 'orange',
    inactive: 'gray', alumni: 'gray', 'private-only': 'gold', 'workshop-only': 'gold',
    paid: 'green', unpaid: 'red', overdue: 'red', partial: 'orange', refunded: 'gray',
    present: 'green', absent: 'red', late: 'orange', 'no-show': 'red', 'cancelled-in-time': 'gray',
    scheduled: 'blue', completed: 'green', cancelled: 'gray',
    new: 'blue', contacted: 'orange', invited: 'gold', registered: 'green', lost: 'gray', 'not-ready': 'gray',
    open: 'orange', done: 'green', dismissed: 'gray',
    high: 'red', medium: 'orange', low: 'gray',
  }
  return map[status] ?? 'gray'
}

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------
export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('border border-[#E2DDD5] bg-white p-5', className)}>
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page header
// ---------------------------------------------------------------------------
export function PageHeader({ title, subtitle, action }: {
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-display text-3xl font-light text-[#171410] md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-[#9A907F]">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------
type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

const btnClasses: Record<BtnVariant, string> = {
  primary:   'bg-[#C9A84C] text-[#171410] hover:bg-[#b89438]',
  secondary: 'border border-[#E2DDD5] bg-white text-[#171410] hover:border-[#C9A84C] hover:text-[#C9A84C]',
  ghost:     'text-[#6B6155] hover:text-[#171410]',
  danger:    'bg-red-600 text-white hover:bg-red-700',
}

export function Button({
  children, variant = 'primary', className, size = 'md', ...props
}: {
  children: React.ReactNode
  variant?: BtnVariant
  size?: 'sm' | 'md'
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'inline-flex items-center gap-2 font-medium tracking-wide transition-colors disabled:opacity-50',
        size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-5 py-2.5 text-sm',
        btnClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Table
// ---------------------------------------------------------------------------
export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full text-sm">{children}</table>
    </div>
  )
}

export function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <th className={cn('border-b border-[#E2DDD5] px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.15em] text-[#9A907F]', className)}>
      {children}
    </th>
  )
}

export function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={cn('border-b border-[#E2DDD5] px-4 py-3 text-[#171410]', className)}>
      {children}
    </td>
  )
}

// ---------------------------------------------------------------------------
// Form field wrapper
// ---------------------------------------------------------------------------
export function Field({ label, htmlFor, error, children, className }: {
  label: string
  htmlFor?: string
  error?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-[#9A907F]">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Input / Select / Textarea
// ---------------------------------------------------------------------------
const inputBase = 'w-full border border-[#E2DDD5] bg-[#FAFAF8] px-3 py-2.5 text-sm text-[#171410] outline-none transition-colors focus:border-[#C9A84C] disabled:opacity-50'

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputBase, className)} {...props} />
}

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(inputBase, 'cursor-pointer', className)} {...props}>
      {children}
    </select>
  )
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(inputBase, 'resize-none', className)} {...props} />
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------
export function EmptyState({ message, action }: { message: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-[#9A907F]">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Stat card (dashboard)
// ---------------------------------------------------------------------------
export function StatCard({ label, value, sub, accent }: {
  label: string
  value: string | number
  sub?: string
  accent?: boolean
}) {
  return (
    <Card className={cn('flex flex-col gap-1', accent && 'border-[#C9A84C]/30 bg-[#C9A84C]/5')}>
      <span className="text-xs uppercase tracking-[0.2em] text-[#9A907F]">{label}</span>
      <span className={cn('font-display text-4xl font-light', accent ? 'text-[#C9A84C]' : 'text-[#171410]')}>
        {value}
      </span>
      {sub && <span className="text-xs text-[#9A907F]">{sub}</span>}
    </Card>
  )
}
