import ToolPage from '@/components/tool-page'
import { trays } from '@/data/trays'

export default function ContentCleaningPage() {
  const tool = trays
    .find(tray => tray.id === 'ai')
    ?.tools.find(tool => tool.id === 'content-cleaning')

  if (!tool) {
    return <div>Tool not found</div>
  }

  return <ToolPage tool={tool} />
}
