import ToolPage from '@/components/tool-page'
import { trays } from '@/data/trays'

export default function ImageToHTMLPage() {
  const tool = trays
    .find(tray => tray.id === 'documents')
    ?.tools.find(tool => tool.id === 'image-to-html')

  if (!tool) {
    return <div>Tool not found</div>
  }

  return <ToolPage tool={tool} />
}
