import ToolPage from '@/components/tool-page'
import { trays } from '@/data/trays'

export default function PDFPasswordRemovePage() {
  const tool = trays
    .find(tray => tray.id === 'security')
    ?.tools.find(tool => tool.id === 'pdf-password-remove')

  if (!tool) {
    return <div>Tool not found</div>
  }

  return <ToolPage tool={tool} />
}
