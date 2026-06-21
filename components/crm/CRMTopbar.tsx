'use client'

import { useRouter } from 'next/navigation'
import { List, SignOut, Bell } from '@phosphor-icons/react'
import { createClient } from '@/lib/supabase/client'

export function CRMTopbar() {
  const router = useRouter()

  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/crm/login')
    router.refresh()
  }

  const toggleSidebar = () => {
    const sidebar = document.getElementById('crm-sidebar')
    if (!sidebar) return
    const isHidden = sidebar.classList.contains('-translate-x-full')
    sidebar.classList.toggle('-translate-x-full', !isHidden)
    sidebar.classList.toggle('translate-x-0', isHidden)
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-[#E2DDD5] bg-white px-4 md:px-6">
      <button
        onClick={toggleSidebar}
        className="text-[#6B6155] transition-colors hover:text-[#171410] lg:hidden"
        aria-label="Toggle menu"
      >
        <List size={24} weight="light" />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-3">
        <button className="text-[#9A907F] hover:text-[#C9A84C]" aria-label="Notifications">
          <Bell size={20} weight="light" />
        </button>
        <button
          onClick={signOut}
          className="flex items-center gap-2 text-sm text-[#9A907F] transition-colors hover:text-[#171410]"
        >
          <SignOut size={18} weight="light" />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  )
}
