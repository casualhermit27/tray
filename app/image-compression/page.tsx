import ToolPage from '@/components/tool-page'
import { trays } from '@/data/trays'

export default function ImageCompressionPage() {
  const tool = trays
    .find(tray => tray.id === 'media')
    ?.tools.find(tool => tool.id === 'image-compression')

  if (!tool) {
    return <div>Tool not found</div>
  }

  return <ToolPage tool={tool} />
}
