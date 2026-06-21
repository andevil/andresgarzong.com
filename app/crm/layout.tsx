import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import { headers } from 'next/headers'
import { CRMSidebar } from '@/components/crm/CRMSidebar'
import { CRMTopbar } from '@/components/crm/CRMTopbar'

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Salsita Admin — CRM',
  robots: { index: false },
}

export default async function CRMLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? ''
  const isLogin = pathname === '/crm/login'

  const background = 'linear-gradient(135deg, #fefaf3 0%, #fdf0d5 40%, #f0ddb0 100%)'

  if (isLogin) {
    return (
      <div
        className={`${roboto.className} crm-root flex min-h-screen items-center justify-center`}
        style={{ background }}
      >
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#C9A84C]/10 blur-3xl" />
          <div className="absolute top-1/2 -right-48 h-[500px] w-[500px] rounded-full bg-[#C9A84C]/8 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-amber-300/10 blur-3xl" />
        </div>
        <div className="relative w-full">{children}</div>
      </div>
    )
  }

  return (
    <div
      className={`${roboto.className} crm-root flex min-h-screen`}
      style={{ background }}
    >
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#C9A84C]/10 blur-3xl" />
        <div className="absolute top-1/2 -right-48 h-[500px] w-[500px] rounded-full bg-[#C9A84C]/8 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-amber-300/10 blur-3xl" />
      </div>

      <CRMSidebar />
      <div className="relative flex flex-1 flex-col lg:ml-64">
        <CRMTopbar />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
