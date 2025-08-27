import ToolPage from '@/components/tool-page'
import { trays } from '@/data/trays'

export default function BatchConversionPage() {
  const tool = trays
    .find(tray => tray.id === 'advanced')
    ?.tools.find(tool => tool.id === 'batch-conversion')

  if (!tool) {
    return <div>Tool not found</div>
  }

  return <ToolPage tool={tool} />
}
