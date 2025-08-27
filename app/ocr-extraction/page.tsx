import ToolPage from '@/components/tool-page'
import { trays } from '@/data/trays'

export default function OCRExtractionPage() {
  const tool = trays
    .find(tray => tray.id === 'media')
    ?.tools.find(tool => tool.id === 'ocr-extraction')

  if (!tool) {
    return <div>Tool not found</div>
  }

  return <ToolPage tool={tool} />
}
