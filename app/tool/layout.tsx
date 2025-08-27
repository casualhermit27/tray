import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'File Processing Tools | Trayyy',
  description: 'Process your files with our powerful online tools. Convert, compress, extract, and transform documents, images, and data files.',
}

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
