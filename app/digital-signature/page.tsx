import ToolPage from '@/components/tool-page'
import { trays } from '@/data/trays'

export default function DigitalSignaturePage() {
  const tool = trays
    .find(tray => tray.id === 'e-signature')
    ?.tools.find(tool => tool.id === 'digital-signature')

  if (!tool) {
    return <div>Tool not found</div>
  }

  return <ToolPage tool={tool} />
}
