import ToolPage from '@/components/tool-page'
import { trays } from '@/data/trays'

export default function PDFToMarkdownPage() {
  const tool = trays
    .find(tray => tray.id === 'documents')
    ?.tools.find(tool => tool.id === 'pdf-to-markdown')

  if (!tool) {
    return <div>Tool not found</div>
  }

  return <ToolPage tool={tool} />
}
