// Shared CRM UI primitives — glassmorphism, rounded, Roboto

import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------
type BadgeVariant = 'gold' | 'green' | 'red' | 'orange' | 'gray' | 'blue'

const badgeClasses: Record<BadgeVariant, string> = {
  gold:   'bg-[#C9A84C]/20 text-[#9A6F1E] ring-1 ring-[#C9A84C]/30',
  green:  'bg-emerald-100/80 text-emerald-700 ring-1 ring-emerald-200',
  red:    'bg-red-100/80 text-red-700 ring-1 ring-red-200',
  orange: 'bg-orange-100/80 text-orange-700 ring-1 ring-orange-200',
  gray:   'bg-white/60 text-[#6B6155] ring-1 ring-[#E2DDD5]',
  blue:   'bg-blue-100/80 text-blue-700 ring-1 ring-blue-200',
}

export function Badge({ children, variant = 'gray', className }: {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}) {
  return (
    <span className={cn(
      'inline-block rounded-full px-2.5 py-0.5 text-[0.68rem] font-medium uppercase tracking-wide backdrop-blur-sm',
      badgeClasses[variant],
      className
    )}>
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
    <div className={cn(
      'rounded-2xl border border-white/60 bg-white/60 p-5 shadow-sm backdrop-blur-sm',
      className
    )}>
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
        <h1 className="text-3xl font-light tracking-tight text-[#171410] md:text-4xl">{title}</h1>
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
  primary:   'bg-[#C9A84C] text-[#171410] shadow-md shadow-[#C9A84C]/20 hover:bg-[#b89438] hover:shadow-lg hover:shadow-[#C9A84C]/30',
  secondary: 'border border-white/60 bg-white/50 text-[#171410] shadow-sm backdrop-blur-sm hover:bg-white/80 hover:border-[#C9A84C]/50',
  ghost:     'text-[#6B6155] hover:bg-white/40 hover:text-[#171410]',
  danger:    'bg-red-500 text-white shadow-md shadow-red-500/20 hover:bg-red-600',
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
        'inline-flex items-center gap-2 rounded-xl font-medium tracking-wide transition-all duration-200 disabled:opacity-50',
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
    <th className={cn('border-b border-white/40 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-[#9A907F]', className)}>
      {children}
    </th>
  )
}

export function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={cn('border-b border-white/30 px-4 py-3 text-[#171410]', className)}>
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
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-[#9A907F]">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Input / Select / Textarea
// ---------------------------------------------------------------------------
const inputBase = 'w-full rounded-xl border border-white/50 bg-white/60 px-3 py-2.5 text-sm text-[#171410] shadow-sm backdrop-blur-sm outline-none transition-all duration-200 focus:border-[#C9A84C]/60 focus:bg-white/80 focus:ring-2 focus:ring-[#C9A84C]/20 disabled:opacity-50'

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
    <Card className={cn('flex flex-col gap-1', accent && 'border-[#C9A84C]/30 bg-[#C9A84C]/10')}>
      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#9A907F]">{label}</span>
      <span className={cn('text-4xl font-light tracking-tight', accent ? 'text-[#C9A84C]' : 'text-[#171410]')}>
        {value}
      </span>
      {sub && <span className="text-xs text-[#9A907F]">{sub}</span>}
    </Card>
  )
}
