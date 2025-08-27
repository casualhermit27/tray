import ToolPage from '@/components/tool-page'
import { trays } from '@/data/trays'

export default function ExcelToPDFPage() {
  const tool = trays
    .find(tray => tray.id === 'documents')
    ?.tools.find(tool => tool.id === 'excel-to-pdf')

  if (!tool) {
    return <div>Tool not found</div>
  }

  return <ToolPage tool={tool} />
}
