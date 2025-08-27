import ToolPage from '@/components/tool-page'
import { trays } from '@/data/trays'

export default function BackgroundRemovalPage() {
  const tool = trays
    .find(tray => tray.id === 'media')
    ?.tools.find(tool => tool.id === 'background-removal')

  if (!tool) {
    return <div>Tool not found</div>
  }

  return <ToolPage tool={tool} />
}
