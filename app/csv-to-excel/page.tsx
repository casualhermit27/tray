import ToolPage from '@/components/tool-page'
import { trays } from '@/data/trays'

export default function CSVToExcelPage() {
  const tool = trays
    .find(tray => tray.id === 'data')
    ?.tools.find(tool => tool.id === 'csv-to-excel')

  if (!tool) {
    return <div>Tool not found</div>
  }

  return <ToolPage tool={tool} />
}
