'use client';

import { useState } from 'react';
import { Highlight, type PrismTheme } from 'prism-react-renderer';

// kraft 팔레트에 맞춘 따뜻한 톤 Prism 테마
const kraftTheme: PrismTheme = {
  plain: {
    color: 'var(--code-text)',
    backgroundColor: 'var(--code-bg)',
  },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: 'var(--code-comment)', fontStyle: 'italic' as const } },
    { types: ['namespace'], style: { opacity: 0.7 } },
    { types: ['string', 'attr-value'], style: { color: 'var(--code-string)' } },
    { types: ['punctuation', 'operator'], style: { color: 'var(--code-punctuation)' } },
    { types: ['entity', 'url', 'symbol', 'number', 'boolean', 'variable', 'constant', 'property', 'regex', 'inserted'], style: { color: 'var(--code-number)' } },
    { types: ['atrule', 'keyword', 'attr-name', 'selector'], style: { color: 'var(--code-keyword)' } },
    { types: ['function', 'deleted', 'tag'], style: { color: 'var(--code-function)' } },
    { types: ['function-variable'], style: { color: 'var(--code-function)' } },
    { types: ['tag', 'selector', 'keyword'], style: { color: 'var(--code-keyword)' } },
    { types: ['class-name'], style: { color: 'var(--code-class)' } },
    { types: ['char', 'builtin'], style: { color: 'var(--code-builtin)' } },
    { types: ['important'], style: { fontWeight: 'bold' as const } },
  ],
};

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock = ({ code, language }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 overflow-hidden rounded-lg" style={{ border: '1px solid var(--border-warm)' }}>
      {/* 상단 바: 언어 라벨 + 복사 버튼 */}
      <div
        className="flex items-center justify-between px-4 py-2 text-xs"
        style={{ backgroundColor: 'var(--kraft-light)', color: 'var(--text-muted)' }}
      >
        <span className="font-medium uppercase tracking-wider">{language || 'text'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors hover:opacity-80"
          style={{ color: 'var(--text-muted)' }}
        >
          {copied ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* 코드 영역 */}
      <Highlight theme={kraftTheme} code={code} language={language || 'text'}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre className="overflow-x-auto p-4 text-[13px] leading-[1.6]" style={{ backgroundColor: kraftTheme.plain.backgroundColor, margin: 0 }}>
            <code>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  <span
                    className="mr-4 inline-block w-8 select-none text-right text-xs"
                    style={{ color: 'var(--kraft-dark)' }}
                  >
                    {i + 1}
                  </span>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  );
};

export default CodeBlock;
