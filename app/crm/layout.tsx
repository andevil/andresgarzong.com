import type { Metadata } from 'next'
import { CRMSidebar } from '@/components/crm/CRMSidebar'
import { CRMTopbar } from '@/components/crm/CRMTopbar'

export const metadata: Metadata = {
  title: 'Salsita Admin — CRM',
  robots: { index: false },
}

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F7F1E7]">
      <CRMSidebar />
      <div className="flex flex-1 flex-col lg:ml-64">
        <CRMTopbar />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
