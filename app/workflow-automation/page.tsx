import ToolPage from '@/components/tool-page'
import { trays } from '@/data/trays'

export default function WorkflowAutomationPage() {
  const tool = trays
    .find(tray => tray.id === 'advanced')
    ?.tools.find(tool => tool.id === 'workflow-automation')

  if (!tool) {
    return <div>Tool not found</div>
  }

  return <ToolPage tool={tool} />
}
