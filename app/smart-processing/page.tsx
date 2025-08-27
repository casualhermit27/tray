import ToolPage from '@/components/tool-page'
import { trays } from '@/data/trays'

export default function SmartProcessingPage() {
  const tool = trays
    .find(tray => tray.id === 'ai')
    ?.tools.find(tool => tool.id === 'smart-processing')

  if (!tool) {
    return <div>Tool not found</div>
  }

  return <ToolPage tool={tool} />
}
