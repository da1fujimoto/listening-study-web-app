'use client'

import ReactMarkdown from 'react-markdown'

type Props = {
  content: string
}

export default function MarkdownViewer({ content }: Props) {
  return (
    <div className="prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-li:text-gray-700">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}
