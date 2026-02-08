import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Headings
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold text-white mb-6 mt-8">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold text-white mb-4 mt-8">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold text-white mb-3 mt-6">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-semibold text-white mb-2 mt-4">{children}</h4>
    ),
    h5: ({ children }) => (
      <h5 className="text-lg font-semibold text-white mb-2 mt-3">{children}</h5>
    ),
    h6: ({ children }) => (
      <h6 className="text-base font-semibold text-white mb-2 mt-2">
        {children}
      </h6>
    ),

    // Paragraphs and text
    p: ({ children }) => (
      <p className="text-gray-300 mb-4 leading-relaxed">{children}</p>
    ),
    strong: ({ children }) => (
      <strong className="text-white font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="text-gray-200 italic">{children}</em>,

    // Links
    a: ({ href, children }) => (
      <Link
        href={href || "#"}
        className="text-cyan-400 hover:text-cyan-300 underline transition-colors">
        {children}
      </Link>
    ),

    // Lists
    ul: ({ children }) => (
      <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-1">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="text-gray-300">{children}</li>,

    // Code
    code: ({ children }) => (
      <code className="bg-[#1E1E1E] text-cyan-300 px-2 py-1 rounded text-sm font-mono">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <div className="bg-[#141414] border border-cyan-500/15 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre className="text-gray-200 text-sm">{children}</pre>
      </div>
    ),

    // Blockquotes
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-cyan-500 pl-4 py-2 bg-[#1E1E1E]/50 rounded-r-lg mb-4">
        <div className="text-gray-300 italic">{children}</div>
      </blockquote>
    ),

    // Tables
    table: ({ children }) => (
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full bg-[#141414] border border-cyan-500/15 rounded-lg">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-[#1E1E1E]">{children}</thead>,
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => (
      <tr className="border-b border-cyan-500/15">{children}</tr>
    ),
    th: ({ children }) => (
      <th className="px-4 py-3 text-left text-white font-semibold">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-3 text-gray-300">{children}</td>
    ),

    // Horizontal rule
    hr: () => <hr className="border-cyan-500/15 my-8" />,

    // Images
    img: ({ src, alt }) => (
      <img
        src={src}
        alt={alt}
        className="max-w-full h-auto rounded-lg border border-cyan-500/15 mb-4"
      />
    ),

    // Custom components
    warning: ({ children }) => (
      <div className="bg-cyan-900/20 border border-cyan-600/30 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="text-cyan-400 text-xl">⚠️</div>
          <div className="text-cyan-200">{children}</div>
        </div>
      </div>
    ),

    note: ({ children }) => (
      <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="text-blue-400 text-xl">ℹ️</div>
          <div className="text-blue-200">{children}</div>
        </div>
      </div>
    ),

    tip: ({ children }) => (
      <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="text-green-400 text-xl">💡</div>
          <div className="text-green-200">{children}</div>
        </div>
      </div>
    ),

    danger: ({ children }) => (
      <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="text-red-400 text-xl">🚨</div>
          <div className="text-red-200">{children}</div>
        </div>
      </div>
    ),

    ...components,
  };
}
