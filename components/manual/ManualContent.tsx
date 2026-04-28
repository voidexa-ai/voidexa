// components/manual/ManualContent.tsx
//
// AFS-18c - react-markdown wrapper with a custom component map applying
// Tailwind classes to every output element. remark-gfm gives us GFM
// tables (etape 03 + 05 use them heavily). Server component - SSR works
// out of the box for react-markdown 10.x without hooks/state.

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'

interface ChildOnly {
  children?: React.ReactNode
}

interface AnchorProps {
  href?: string
  children?: React.ReactNode
}

const components = {
  h1: ({ children }: ChildOnly) => (
    <h1 className="mb-4 mt-8 text-3xl font-bold tracking-tight">{children}</h1>
  ),
  h2: ({ children }: ChildOnly) => (
    <h2 className="mb-3 mt-10 border-b border-zinc-800 pb-2 text-2xl font-bold">
      {children}
    </h2>
  ),
  h3: ({ children }: ChildOnly) => (
    <h3 className="mb-2 mt-6 text-xl font-semibold">{children}</h3>
  ),
  h4: ({ children }: ChildOnly) => (
    <h4 className="mb-2 mt-4 text-lg font-semibold">{children}</h4>
  ),
  p: ({ children }: ChildOnly) => (
    <p className="mb-4 leading-relaxed">{children}</p>
  ),
  ul: ({ children }: ChildOnly) => (
    <ul className="mb-4 list-disc space-y-1 pl-6">{children}</ul>
  ),
  ol: ({ children }: ChildOnly) => (
    <ol className="mb-4 list-decimal space-y-1 pl-6">{children}</ol>
  ),
  li: ({ children }: ChildOnly) => (
    <li className="leading-relaxed">{children}</li>
  ),
  code: ({ children }: ChildOnly) => (
    <code className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-sm">
      {children}
    </code>
  ),
  pre: ({ children }: ChildOnly) => (
    <pre className="mb-4 overflow-x-auto rounded-md bg-zinc-900 p-4 font-mono text-sm">
      {children}
    </pre>
  ),
  table: ({ children }: ChildOnly) => (
    <div className="mb-4 overflow-x-auto">
      <table className="min-w-full border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }: ChildOnly) => (
    <thead className="bg-zinc-900">{children}</thead>
  ),
  th: ({ children }: ChildOnly) => (
    <th className="border border-zinc-700 px-3 py-2 text-left text-sm font-semibold">
      {children}
    </th>
  ),
  td: ({ children }: ChildOnly) => (
    <td className="border border-zinc-800 px-3 py-2 text-sm">{children}</td>
  ),
  a: ({ href, children }: AnchorProps) => {
    if (href && href.startsWith('/')) {
      return (
        <Link
          href={href}
          className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300"
        >
          {children}
        </Link>
      )
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300"
      >
        {children}
      </a>
    )
  },
  blockquote: ({ children }: ChildOnly) => (
    <blockquote className="my-4 border-l-4 border-zinc-700 pl-4 italic opacity-80">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-zinc-800" />,
  strong: ({ children }: ChildOnly) => (
    <strong className="font-bold">{children}</strong>
  ),
  em: ({ children }: ChildOnly) => <em className="italic">{children}</em>,
}

export default function ManualContent({ markdown }: { markdown: string }) {
  return (
    <div className="text-zinc-200">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </ReactMarkdown>
    </div>
  )
}
