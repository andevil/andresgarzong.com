import Link from 'next/link'
import { format, parseISO, addDays } from 'date-fns'
import { createClient } from '@/lib/supabase/server'
import {
  PageHeader, Badge, Table, Th, Td, EmptyState, Button, Card
} from '@/components/crm/ui'
import { statusBadge } from '@/components/crm/ui'
import { Plus, Warning } from '@phosphor-icons/react/dist/ssr'

export const dynamic = 'force-dynamic'

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const { filter = 'all' } = await searchParams
  const supabase = await createClient()
  const today = new Date()
  const todayStr = format(today, 'yyyy-MM-dd')
  const in14days = format(addDays(today, 14), 'yyyy-MM-dd')

  let query = supabase
    .from('student_packages')
    .select('*, people(id, full_name), package_bonuses(*)')
    .order('created_at', { ascending: false })

  if (filter === 'archived') {
    query = query.eq('archived', true)
  } else {
    query = query.eq('archived', false)
    if (filter === 'expiring') {
      query = query.lte('expiry_date', in14days).gte('expiry_date', todayStr)
    } else if (filter === 'unpaid') {
      query = query.eq('payment_status', 'unpaid')
    } else if (filter === 'active') {
      query = query.gte('expiry_date', todayStr)
    }
  }

  const { data: packages } = await query

  // Count for expiry banner
  const { count: expiringCount } = await supabase
    .from('student_packages')
    .select('*', { count: 'exact', head: true })
    .eq('archived', false)
    .lte('expiry_date', in14days)
    .gte('expiry_date', todayStr)

  const tabs = [
    { key: 'all',      label: 'All' },
    { key: 'active',   label: 'Active' },
    { key: 'expiring', label: 'Expiring Soon' },
    { key: 'unpaid',   label: 'Unpaid' },
    { key: 'archived', label: 'Archived' },
  ]

  return (
    <div>
      <PageHeader
        title="Student Packages"
        subtitle="Track assigned packages and bonus usage"
        action={
          <Link href="/crm/packages/new">
            <Button><Plus size={16} weight="light" /> Assign Package</Button>
          </Link>
        }
      />

      {/* Expiry alert banner */}
      {expiringCount && expiringCount > 0 ? (
        <Card className="mb-6 border-orange-200 bg-orange-50/80">
          <div className="flex items-center gap-3">
            <Warning size={20} weight="light" className="shrink-0 text-orange-500" />
            <p className="text-sm text-orange-700">
              <strong>{expiringCount}</strong> package{expiringCount !== 1 ? 's' : ''} expiring within 14 days.{' '}
              <Link href="/crm/packages?filter=expiring" className="underline hover:text-orange-900">View them</Link>
            </p>
          </div>
        </Card>
      ) : null}

      {/* Filter tabs */}
      <div className="mb-6 flex gap-1 border-b border-[#E2DDD5]">
        {tabs.map(t => (
          <Link
            key={t.key}
            href={`/crm/packages?filter=${t.key}`}
            className={`px-4 py-2 text-sm transition-colors ${
              filter === t.key
                ? 'border-b-2 border-[#C9A84C] text-[#171410] font-medium'
                : 'text-[#9A907F] hover:text-[#171410]'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {packages?.length ? (
        <Table>
          <thead>
            <tr>
              <Th>Student</Th>
              <Th>Package</Th>
              <Th>Price</Th>
              <Th>Classes</Th>
              <Th>Expiry</Th>
              <Th>Payment</Th>
              <Th>Bonuses</Th>
            </tr>
          </thead>
          <tbody>
            {packages.map(pkg => {
              const bonuses = pkg.package_bonuses ?? []
              const usedBonuses = bonuses.filter((b: { used: boolean }) => b.used).length
              const expiringSoon = pkg.expiry_date && pkg.expiry_date <= in14days && pkg.expiry_date >= todayStr

              return (
                <tr key={pkg.id} className="hover:bg-white/40 transition-colors">
                  <Td>
                    <Link href={`/crm/people/${pkg.people?.id}`} className="font-medium text-[#171410] hover:text-[#C9A84C]">
                      {pkg.people?.full_name}
                    </Link>
                  </Td>
                  <Td>
                    <Link href={`/crm/packages/${pkg.id}`} className="text-[#171410] hover:text-[#C9A84C]">
                      {pkg.name}
                    </Link>
                  </Td>
                  <Td>{pkg.price.toLocaleString()} HUF</Td>
                  <Td>
                    <span className={pkg.classes_attended >= pkg.classes_included ? 'text-red-600 font-medium' : ''}>
                      {pkg.classes_attended}/{pkg.classes_included}
                    </span>
                  </Td>
                  <Td>
                    {pkg.expiry_date ? (
                      <span className={expiringSoon ? 'text-orange-600 font-medium' : ''}>
                        {format(parseISO(pkg.expiry_date), 'dd MMM yyyy')}
                      </span>
                    ) : '—'}
                  </Td>
                  <Td>
                    <Badge variant={statusBadge(pkg.payment_status)}>{pkg.payment_status}</Badge>
                  </Td>
                  <Td>
                    {bonuses.length > 0
                      ? <span className="text-xs text-[#6B6155]">{usedBonuses}/{bonuses.length} used</span>
                      : <span className="text-[#9A907F] text-xs">—</span>
                    }
                  </Td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      ) : (
        <EmptyState
          message={filter === 'all' ? 'No packages assigned yet.' : `No ${filter} packages.`}
          action={
            filter === 'all'
              ? <Link href="/crm/packages/new"><Button>Assign first package</Button></Link>
              : undefined
          }
        />
      )}
    </div>
  )
}
