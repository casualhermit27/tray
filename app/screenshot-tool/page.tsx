import ToolPage from '@/components/tool-page'
import { trays } from '@/data/trays'

export default function ScreenshotToolPage() {
  const tool = trays
    .find(tray => tray.id === 'web')
    ?.tools.find(tool => tool.id === 'screenshot-tool')

  if (!tool) {
    return <div>Tool not found</div>
  }

  return <ToolPage tool={tool} />
}
