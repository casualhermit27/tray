import { NextAuthProvider } from '@/app/providers'
import { trays } from '@/data/trays'
import Link from 'next/link'
import { ArrowLeft, Home } from 'lucide-react'

export default function PDFMergePage() {
  const tool = trays
    .find(tray => tray.id === 'documents')
    ?.tools.find(tool => tool.id === 'pdf-merge')

  if (!tool) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Tool Not Found</h1>
          <p className="text-muted-foreground">The PDF Merge tool could not be loaded.</p>
        </div>
      </div>
    )
  }

  return (
    <NextAuthProvider>
      <div className="min-h-screen bg-background">
        {/* Navigation Header */}
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-medium">{tool.name}</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{tool.name}</h1>
            <p className="text-muted-foreground">{tool.description}</p>
          </div>
          
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">PDF Merge Tool</h2>
            <p className="text-muted-foreground mb-4">
              This is the PDF Merge tool page. The tool functionality will be implemented here.
            </p>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Tool Details:</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• ID: {tool.id}</li>
                <li>• Category: {tool.trayId}</li>
                <li>• Plan Required: {tool.planRequired}</li>
                <li>• Options: {tool.options?.length || 0} available</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </NextAuthProvider>
  )
}
