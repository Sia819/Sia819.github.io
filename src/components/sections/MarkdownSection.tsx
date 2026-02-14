'use client';

import Markdown from 'react-markdown';
import type { Components } from 'react-markdown';

interface MarkdownSectionProps {
  content: string;
  accentColor: string;
}

const MarkdownSection = ({ content, accentColor }: MarkdownSectionProps) => {
  const components: Components = {
    h1: ({ children }) => (
      <h1 className="mb-6 text-xl font-bold" style={{ color: accentColor }}>
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        className="mt-8 mb-3 text-lg font-semibold first:mt-0"
        style={{ color: 'var(--text-primary)' }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        className="mt-4 mb-2 text-sm font-semibold uppercase tracking-wider"
        style={{ color: 'var(--text-muted)' }}
      >
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="mb-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {children}
      </p>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold" style={{ color: accentColor }}>
        {children}
      </strong>
    ),
    ul: ({ children }) => <ul className="mb-3 flex flex-col gap-1.5">{children}</ul>,
    li: ({ children }) => (
      <li
        className="text-sm before:mr-2 before:content-['•']"
        style={{ color: 'var(--text-secondary)' }}
      >
        {children}
      </li>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm underline underline-offset-2"
        style={{ color: accentColor }}
      >
        {children}
      </a>
    ),
    hr: () => (
      <hr className="my-6" style={{ borderColor: 'var(--border-warm)' }} />
    ),
    code: ({ children }) => (
      <code
        className="rounded-md px-2.5 py-0.5 text-xs"
        style={{
          backgroundColor: 'var(--kraft-light)',
          color: 'var(--text-primary)',
        }}
      >
        {children}
      </code>
    ),
    blockquote: ({ children }) => (
      <blockquote
        className="my-4 pl-4"
        style={{ borderLeft: `3px solid ${accentColor}` }}
      >
        {children}
      </blockquote>
    ),
  };

  return (
    <div>
      <Markdown components={components}>{content}</Markdown>
    </div>
  );
};

export default MarkdownSection;
