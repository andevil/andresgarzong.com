import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageHeader, Badge, Table, Th, Td, EmptyState, Button } from '@/components/crm/ui'
import { Plus } from '@phosphor-icons/react/dist/ssr'

export const dynamic = 'force-dynamic'

export default async function PromotionsPage() {
  const supabase = await createClient()
  const { data: promotions } = await supabase
    .from('promotions')
    .select('*')
    .order('active', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <div>
      <PageHeader
        title="Promotions"
        subtitle="Configurable price offers and package templates"
        action={
          <Link href="/crm/promotions/new">
            <Button><Plus size={16} weight="light" /> New Promotion</Button>
          </Link>
        }
      />

      {promotions?.length ? (
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Price</Th>
              <Th>Classes</Th>
              <Th>Validity</Th>
              <Th>Bonuses</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {promotions.map(p => (
              <tr key={p.id} className="hover:bg-white/40 transition-colors">
                <Td>
                  <Link href={`/crm/promotions/${p.id}`} className="font-medium text-[#171410] hover:text-[#C9A84C]">
                    {p.name}
                  </Link>
                  {p.applicable_class && (
                    <p className="mt-0.5 text-xs text-[#9A907F]">{p.applicable_class}</p>
                  )}
                </Td>
                <Td>{p.price.toLocaleString()} HUF</Td>
                <Td>{p.classes_included}</Td>
                <Td>{p.validity_weeks} weeks</Td>
                <Td>
                  {Array.isArray(p.bonus_items) && p.bonus_items.length > 0
                    ? <Badge variant="gold">{p.bonus_items.length} bonus{p.bonus_items.length !== 1 ? 'es' : ''}</Badge>
                    : <span className="text-[#9A907F] text-xs">—</span>
                  }
                </Td>
                <Td>
                  {p.active
                    ? <Badge variant="green">Active</Badge>
                    : <Badge variant="gray">Inactive</Badge>
                  }
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <EmptyState
          message="No promotions yet."
          action={
            <Link href="/crm/promotions/new">
              <Button>Create first promotion</Button>
            </Link>
          }
        />
      )}
    </div>
  )
}
