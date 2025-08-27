import ToolPage from '@/components/tool-page'
import { trays } from '@/data/trays'

export default function JSONFormatterPage() {
  const tool = trays
    .find(tray => tray.id === 'data')
    ?.tools.find(tool => tool.id === 'json-formatter')

  if (!tool) {
    return <div>Tool not found</div>
  }

  return <ToolPage tool={tool} />
}
