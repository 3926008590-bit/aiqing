import React from 'react';
import ReactMarkdown from 'react-markdown';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-tomorrow.css';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  React.useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  return (
    <ReactMarkdown
      components={{
        code({ node, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const isInline = !match && !className;

          if (isInline) {
            return (
              <code className="px-1.5 py-0.5 bg-zinc-700/50 rounded text-sm font-mono text-emerald-400" {...props}>
                {children}
              </code>
            );
          }

          return (
            <pre className="bg-zinc-900/80 rounded-lg p-4 overflow-x-auto text-sm my-3">
              <code className={`${className || ''} font-mono`} {...props}>
                {children}
              </code>
            </pre>
          );
        },
        p({ children }) {
          return <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>;
        },
        ul({ children }) {
          return <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>;
        },
        li({ children }) {
          return <li className="text-zinc-300">{children}</li>;
        },
        h1({ children }) {
          return <h1 className="text-2xl font-bold mb-4 text-white">{children}</h1>;
        },
        h2({ children }) {
          return <h2 className="text-xl font-bold mb-3 text-white">{children}</h2>;
        },
        h3({ children }) {
          return <h3 className="text-lg font-semibold mb-2 text-white">{children}</h3>;
        },
        blockquote({ children }) {
          return (
            <blockquote className="border-l-4 border-emerald-500/50 pl-4 italic text-zinc-400 my-3">
              {children}
            </blockquote>
          );
        },
        a({ href, children }) {
          return (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline">
              {children}
            </a>
          );
        },
        strong({ children }) {
          return <strong className="font-semibold text-white">{children}</strong>;
        },
        em({ children }) {
          return <em className="italic text-zinc-300">{children}</em>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
