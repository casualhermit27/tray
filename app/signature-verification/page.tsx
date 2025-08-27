import ToolPage from '@/components/tool-page'
import { trays } from '@/data/trays'

export default function SignatureVerificationPage() {
  const tool = trays
    .find(tray => tray.id === 'e-signature')
    ?.tools.find(tool => tool.id === 'signature-verification')

  if (!tool) {
    return <div>Tool not found</div>
  }

  return <ToolPage tool={tool} />
}
