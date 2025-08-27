import ToolPage from '@/components/tool-page'
import { trays } from '@/data/trays'

export default function WordToPowerPointPage() {
  const tool = trays
    .find(tray => tray.id === 'documents')
    ?.tools.find(tool => tool.id === 'word-to-powerpoint')

  if (!tool) {
    return <div>Tool not found</div>
  }

  return <ToolPage tool={tool} />
}
