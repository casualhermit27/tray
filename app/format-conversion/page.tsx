import ToolPage from '@/components/tool-page'
import { trays } from '@/data/trays'

export default function FormatConversionPage() {
  const tool = trays
    .find(tray => tray.id === 'media')
    ?.tools.find(tool => tool.id === 'format-conversion')

  if (!tool) {
    return <div>Tool not found</div>
  }

  return <ToolPage tool={tool} />
}
