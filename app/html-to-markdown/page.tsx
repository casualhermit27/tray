import ToolPage from '@/components/tool-page'
import { trays } from '@/data/trays'

export default function HTMLToMarkdownPage() {
  const tool = trays
    .find(tray => tray.id === 'web')
    ?.tools.find(tool => tool.id === 'html-to-markdown')

  if (!tool) {
    return <div>Tool not found</div>
  }

  return <ToolPage tool={tool} />
}
