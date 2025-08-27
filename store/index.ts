import { create } from 'zustand'
import { Tray, Tool, ProcessingJob, FileUpload, PlanType } from '@/types'
import { PLANS, PLAN_LIMITS } from '@/lib/plans'

interface AppState {
  // Current view
  currentView: 'landing' | 'dashboard' | 'tool' | 'tool-showcase' | 'account'
  currentTrayId: string | null
  currentToolId: string | null
  
  // Plan management
  currentPlan: PlanType
  isPlanToggleVisible: boolean
  
  // File processing
  jobs: ProcessingJob[]
  uploads: FileUpload[]
  
  // Actions
  setView: (view: 'landing' | 'dashboard' | 'tool' | 'tool-showcase' | 'account') => void
  setCurrentTray: (trayId: string) => void
  setCurrentTrayId: (trayId: string) => void
  setCurrentTool: (toolId: string) => void
  setCurrentToolId: (toolId: string) => void
  setCurrentPlan: (plan: PlanType) => void
  togglePlanToggle: () => void
  addJob: (job: ProcessingJob) => void
  updateJob: (jobId: string, updates: Partial<ProcessingJob>) => void
  removeJob: (jobId: string) => void
  addUpload: (upload: FileUpload) => void
  removeUpload: (uploadId: string) => void
  clearJobs: () => void
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  currentView: 'landing',
  currentTrayId: null,
  currentToolId: null,
  currentPlan: 'free',
  isPlanToggleVisible: false,
  jobs: [],
  uploads: [],
  
  // Actions
  setView: (view) => set({ currentView: view }),
  setCurrentTray: (trayId) => set({ currentTrayId: trayId }),
  setCurrentTrayId: (trayId) => set({ currentTrayId: trayId }),
  setCurrentTool: (toolId) => set({ currentToolId: toolId }),
  setCurrentToolId: (toolId) => set({ currentToolId: toolId }),
  setCurrentPlan: (plan) => set({ currentPlan: plan }),
  togglePlanToggle: () => set((state) => ({ isPlanToggleVisible: !state.isPlanToggleVisible })),
  
  addJob: (job) => set((state) => ({ 
    jobs: [...state.jobs, job] 
  })),
  
  updateJob: (jobId, updates) => set((state) => ({
    jobs: state.jobs.map(job => 
      job.id === jobId ? { ...job, ...updates } : job
    )
  })),
  
  removeJob: (jobId) => set((state) => ({
    jobs: state.jobs.filter(job => job.id !== jobId)
  })),
  
  addUpload: (upload) => set((state) => ({ 
    uploads: [...state.uploads, upload] 
  })),
  
  removeUpload: (uploadId) => set((state) => ({
    uploads: state.uploads.filter(upload => upload.id !== uploadId)
  })),
  
  clearJobs: () => set({ jobs: [] }),
}))

// Helper functions for plan management
export const usePlanStore = () => {
  const { currentPlan, setCurrentPlan } = useAppStore()
  
  return {
    currentPlan,
    setCurrentPlan,
    planDetails: PLANS[currentPlan],
    planLimits: PLAN_LIMITS[currentPlan],
    canProcessFile: (fileSize: number, currentFileCount: number) => {
      const limits = PLAN_LIMITS[currentPlan]
      
      // Check file size limit
      if (limits.maxFileSize !== -1 && fileSize > limits.maxFileSize) {
        return false
      }
      
      // Check file count limit
      if (limits.maxFilesAtOnce !== -1 && currentFileCount >= limits.maxFilesAtOnce) {
        return false
      }
      
      return true
    },
    hasFeature: (feature: keyof typeof PLAN_LIMITS.free) => {
      const limits = PLAN_LIMITS[currentPlan]
      return limits[feature] === true || (typeof limits[feature] === 'number' && limits[feature] > 0)
    }
  }
}
