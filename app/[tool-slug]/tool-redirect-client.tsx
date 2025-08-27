'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store'

interface ToolRedirectClientProps {
  trayId: string
  toolId: string
}

export default function ToolRedirectClient({ trayId, toolId }: ToolRedirectClientProps) {
  const router = useRouter()
  const { setCurrentTrayId, setCurrentToolId, setView } = useAppStore()

  useEffect(() => {
    // Set the current tool and tray in the store
    setCurrentTrayId(trayId)
    setCurrentToolId(toolId)
    setView('tool')
    
    // Redirect to the main tool page
    router.push('/tool')
  }, [trayId, toolId, router, setCurrentTrayId, setCurrentToolId, setView])

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading tool...</p>
      </div>
    </div>
  )
}
