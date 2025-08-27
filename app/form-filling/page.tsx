import ToolPage from '@/components/tool-page'
import { trays } from '@/data/trays'

export default function FormFillingPage() {
  const tool = trays
    .find(tray => tray.id === 'e-signature')
    ?.tools.find(tool => tool.id === 'form-filling')

  if (!tool) {
    return <div>Tool not found</div>
  }

  return <ToolPage tool={tool} />
}
