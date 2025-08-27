import { redirect } from 'next/navigation'
import { getSEODataBySlug } from '@/data/seo-data'
import { trays } from '@/data/trays'
import ToolRedirectClient from './tool-redirect-client'

interface ToolSEOPageProps {
  params: {
    'tool-slug': string
  }
}

export default function ToolSEOPage({ params }: ToolSEOPageProps) {
  const slug = params['tool-slug']
  const seoData = getSEODataBySlug(slug)
  
  if (!seoData) {
    redirect('/404')
  }

  // Find the tool and tray
  let foundTray = null
  let foundTool = null

  for (const tray of trays) {
    const tool = tray.tools.find(t => t.id === seoData.toolId)
    if (tool) {
      foundTray = tray
      foundTool = tool
      break
    }
  }

  if (!foundTray || !foundTool) {
    redirect('/404')
  }

  return (
    <ToolRedirectClient 
      trayId={foundTray.id} 
      toolId={foundTool.id} 
    />
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ToolSEOPageProps) {
  const slug = params['tool-slug']
  const seoData = getSEODataBySlug(slug)
  
  if (!seoData) {
    return {
      title: 'Tool Not Found | Trayyy',
      description: 'The requested tool could not be found.'
    }
  }

  return {
    title: seoData.title,
    description: seoData.metaDescription,
    keywords: seoData.keywords.join(', '),
    openGraph: {
      title: seoData.title,
      description: seoData.metaDescription,
      type: 'website',
      siteName: 'Trayyy'
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData.title,
      description: seoData.metaDescription
    },
    alternates: {
      canonical: `https://trayyy.com/${slug}`
    }
  }
}

// Generate static params for all SEO tool slugs
export async function generateStaticParams() {
  const { seoToolData } = await import('@/data/seo-data')
  
  return seoToolData.map((tool) => ({
    'tool-slug': tool.slug
  }))
}
