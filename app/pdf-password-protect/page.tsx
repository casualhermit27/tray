import ToolPage from '@/components/tool-page'
import { trays } from '@/data/trays'

export default function PDFPasswordProtectPage() {
  const tool = trays
    .find(tray => tray.id === 'security')
    ?.tools.find(tool => tool.id === 'pdf-password-protect')

  if (!tool) {
    return <div>Tool not found</div>
  }

  return <ToolPage tool={tool} />
}
