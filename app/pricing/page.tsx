import { Metadata } from 'next'
import { PricingTable } from '@/components/pricing-table'
import { PricingHero } from '@/components/pricing-hero'

export const metadata: Metadata = {
  title: 'Pricing - Free vs Pro Plans | Trayyy',
  description: 'Choose between our Free plan with core features or Pro plan with unlimited processing, batch support, and advanced tools. Start free, upgrade when you need more.',
  keywords: 'pricing, free plan, pro plan, PDF tools, file processing, batch processing, unlimited usage',
  openGraph: {
    title: 'Pricing - Free vs Pro Plans | Trayyy',
    description: 'Choose between our Free plan with core features or Pro plan with unlimited processing, batch support, and advanced tools.',
    type: 'website',
  },
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <PricingHero />
      <PricingTable />
    </div>
  )
}
