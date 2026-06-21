'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  House,
  Users,
  ListChecks,
  CalendarCheck,
  CurrencyCircleDollar,
  Ticket,
  Chalkboard,
  ClipboardText,
  Star,
  GearSix,
  X,
} from '@phosphor-icons/react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/crm',            label: 'Dashboard',      icon: House },
  { href: '/crm/people',     label: 'People',         icon: Users },
  { href: '/crm/waitlist',   label: 'Waitlist',       icon: ListChecks },
  { href: '/crm/courses',    label: 'Courses',        icon: Chalkboard },
  { href: '/crm/attendance', label: 'Attendance',     icon: CalendarCheck },
  { href: '/crm/payments',   label: 'Payments',       icon: CurrencyCircleDollar },
  { href: '/crm/passes',     label: 'Passes',         icon: Ticket },
  { href: '/crm/private-lessons', label: 'Private Lessons', icon: Star },
  { href: '/crm/workshops',  label: 'Workshops',      icon: ClipboardText },
  { href: '/crm/settings',   label: 'Settings',       icon: GearSix },
]

function NavLink({ href, label, icon: Icon }: (typeof nav)[number]) {
  const pathname = usePathname()
  const active = href === '/crm' ? pathname === '/crm' : pathname.startsWith(href)
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-4 py-3 text-sm transition-colors',
        active
          ? 'border-l-2 border-[#C9A84C] bg-[#C9A84C]/10 text-[#171410]'
          : 'border-l-2 border-transparent text-[#6B6155] hover:border-[#C9A84C]/40 hover:bg-white/40 hover:text-[#171410]'
      )}
    >
      <Icon size={18} weight="light" />
      {label}
    </Link>
  )
}

export function CRMSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile toggle — rendered by CRMTopbar via context; we handle the overlay here */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        id="crm-sidebar"
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[#E2DDD5] bg-white transition-transform duration-300 lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-[#E2DDD5] px-5">
          <span className="font-display text-3xl font-light text-[#C9A84C]">CG</span>
          <span className="text-xs uppercase tracking-[0.2em] text-[#9A907F]">Admin</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-[#9A907F] lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} weight="light" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4">
          {nav.map(item => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-[#E2DDD5] px-5 py-4">
          <p className="text-xs text-[#9A907F]">Salsita with Cris</p>
          <p className="mt-1 text-xs text-[#9A907F]">Budapest · {new Date().getFullYear()}</p>
        </div>
      </aside>
    </>
  )
}
