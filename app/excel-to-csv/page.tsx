import ToolPage from '@/components/tool-page'
import { trays } from '@/data/trays'

export default function ExcelToCSVPage() {
  const tool = trays
    .find(tray => tray.id === 'data')
    ?.tools.find(tool => tool.id === 'excel-to-csv')

  if (!tool) {
    return <div>Tool not found</div>
  }

  return <ToolPage tool={tool} />
}
