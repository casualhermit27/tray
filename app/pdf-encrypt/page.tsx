import ToolPage from '@/components/tool-page'
import { trays } from '@/data/trays'

export default function PDFEncryptPage() {
  const tool = trays
    .find(tray => tray.id === 'security')
    ?.tools.find(tool => tool.id === 'pdf-encrypt')

  if (!tool) {
    return <div>Tool not found</div>
  }

  return <ToolPage tool={tool} />
}
