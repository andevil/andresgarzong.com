import { PageHeader, Card } from '@/components/crm/ui'

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" subtitle="Business configuration" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-display text-xl font-light text-[#171410]">Business info</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-[#9A907F]">Name</dt><dd>Salsita with Cris</dd></div>
            <div className="flex justify-between"><dt className="text-[#9A907F]">Teacher</dt><dd>Cristhian Garzón</dd></div>
            <div className="flex justify-between"><dt className="text-[#9A907F]">Location</dt><dd>Budapest, Hungary</dd></div>
            <div className="flex justify-between"><dt className="text-[#9A907F]">Currency</dt><dd>HUF</dd></div>
            <div className="flex justify-between"><dt className="text-[#9A907F]">Timezone</dt><dd>Europe/Budapest</dd></div>
          </dl>
        </Card>
        <Card>
          <h2 className="mb-4 font-display text-xl font-light text-[#171410]">Pricing defaults</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-[#9A907F]">Group class</dt><dd>4,000 HUF</dd></div>
            <div className="flex justify-between"><dt className="text-[#9A907F]">Monthly pass (4 classes)</dt><dd>15,000 HUF</dd></div>
            <div className="flex justify-between"><dt className="text-[#9A907F]">Private lesson</dt><dd>14,000 HUF / hr</dd></div>
            <div className="flex justify-between"><dt className="text-[#9A907F]">Private pack (4+ hrs)</dt><dd>12,000 HUF / hr</dd></div>
          </dl>
        </Card>
        <Card>
          <h2 className="mb-4 font-display text-xl font-light text-[#171410]">Locations</h2>
          <ul className="space-y-2 text-sm text-[#6B6155]">
            <li>BackStage Studio — Dohány u. 5b, Budapest</li>
            <li>Roxy Studio — Tátra u. 4, Budapest</li>
          </ul>
        </Card>
        <Card>
          <h2 className="mb-4 font-display text-xl font-light text-[#171410]">Payment methods</h2>
          <ul className="space-y-2 text-sm text-[#6B6155]">
            {['Cash', 'Revolut', 'Wise', 'Bank transfer', 'Other'].map(m => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
