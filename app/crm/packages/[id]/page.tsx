import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format, parseISO, addDays } from 'date-fns'
import { createClient } from '@/lib/supabase/server'
import {
  PageHeader, Badge, Card, StatCard
} from '@/components/crm/ui'
import { statusBadge } from '@/components/crm/ui'
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'
import { BonusTracker } from '@/components/crm/BonusTracker'
import { PackageActions } from '@/components/crm/PackageActions'
import type { StudentPackage, PackageBonus } from '@/lib/supabase/types'

export const dynamic = 'force-dynamic'

export default async function PackageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: pkg } = await supabase
    .from('student_packages')
    .select('*, people(id, full_name), promotions(name), package_bonuses(*)')
    .eq('id', id)
    .single()

  if (!pkg) notFound()

  const today = new Date()
  const in14days = addDays(today, 14)
  const remaining = pkg.override_remaining !== null
    ? pkg.override_remaining
    : pkg.classes_included - pkg.classes_attended

  const expiryDate = pkg.expiry_date ? parseISO(pkg.expiry_date) : null
  const expiringSoon = expiryDate && expiryDate <= in14days && expiryDate >= today

  return (
    <div>
      <div className="mb-6">
        <Link href="/crm/packages" className="flex items-center gap-1 text-sm text-[#9A907F] hover:text-[#C9A84C]">
          <ArrowLeft size={14} weight="light" /> Packages
        </Link>
      </div>

      <PageHeader
        title={pkg.name}
        subtitle={pkg.people?.full_name ?? ''}
      />

      {/* Stats row */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Classes included" value={pkg.classes_included} />
        <StatCard label="Attended" value={pkg.classes_attended} />
        <StatCard
          label="Remaining"
          value={remaining}
          accent={remaining > 0}
        />
        <Card className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#9A907F]">Expiry</span>
          <span className={`text-2xl font-light ${expiringSoon ? 'text-orange-500' : 'text-[#171410]'}`}>
            {expiryDate ? format(expiryDate, 'dd MMM') : '—'}
          </span>
          {expiryDate && (
            <span className="text-xs text-[#9A907F]">{format(expiryDate, 'yyyy')}</span>
          )}
        </Card>
      </div>

      {/* Payment + promotion info */}
      <div className="mb-6 flex flex-wrap gap-3 items-center">
        <Badge variant={statusBadge(pkg.payment_status)}>{pkg.payment_status}</Badge>
        {pkg.promotions && (
          <span className="text-xs text-[#9A907F]">Promotion: {pkg.promotions.name}</span>
        )}
        {pkg.archived && <Badge variant="gray">Archived</Badge>}
      </div>

      {/* Bonus tracker */}
      <BonusTracker
        packageId={pkg.id}
        bonuses={(pkg.package_bonuses ?? []) as PackageBonus[]}
      />

      {/* Notes */}
      {pkg.notes && (
        <Card className="mb-6">
          <h3 className="mb-2 font-display text-lg font-light text-[#171410]">Notes</h3>
          <p className="text-sm text-[#6B6155] whitespace-pre-wrap">{pkg.notes}</p>
        </Card>
      )}

      {/* Package history */}
      <Card className="mb-6">
        <h3 className="mb-2 font-display text-lg font-light text-[#171410]">History</h3>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-[#9A907F]">Created</dt>
            <dd>{format(parseISO(pkg.created_at), 'dd MMM yyyy')}</dd>
          </div>
          {pkg.start_date && (
            <div className="flex justify-between">
              <dt className="text-[#9A907F]">Start date</dt>
              <dd>{format(parseISO(pkg.start_date), 'dd MMM yyyy')}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-[#9A907F]">Price paid</dt>
            <dd>{pkg.price.toLocaleString()} HUF</dd>
          </div>
        </dl>
      </Card>

      {/* Actions */}
      {!pkg.archived && (
        <Card>
          <h3 className="mb-4 font-display text-lg font-light text-[#171410]">Actions</h3>
          <PackageActions pkg={pkg as StudentPackage} />
        </Card>
      )}
    </div>
  )
}
