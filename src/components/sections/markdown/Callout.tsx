import type { ReactNode } from 'react';

type CalloutType = 'NOTE' | 'TIP' | 'WARNING' | 'IMPORTANT';

interface CalloutProps {
  type: CalloutType;
  children: ReactNode;
}

const CALLOUT_CONFIG: Record<CalloutType, { icon: ReactNode; bg: string; border: string; iconColor: string; label: string }> = {
  NOTE: {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
    bg: 'var(--callout-note-bg)',
    border: 'var(--callout-note-border)',
    iconColor: 'var(--callout-note-border)',
    label: 'Note',
  },
  TIP: {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    bg: 'var(--callout-tip-bg)',
    border: 'var(--callout-tip-border)',
    iconColor: 'var(--callout-tip-border)',
    label: 'Tip',
  },
  WARNING: {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    bg: 'var(--callout-warning-bg)',
    border: 'var(--callout-warning-border)',
    iconColor: 'var(--callout-warning-border)',
    label: 'Warning',
  },
  IMPORTANT: {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
      </svg>
    ),
    bg: 'var(--callout-important-bg)',
    border: 'var(--callout-important-border)',
    iconColor: 'var(--callout-important-border)',
    label: 'Important',
  },
};

const Callout = ({ type, children }: CalloutProps) => {
  const config = CALLOUT_CONFIG[type];

  return (
    <div
      className="callout-content my-4 flex gap-3 rounded-lg p-4"
      style={{
        backgroundColor: config.bg,
        borderLeft: `3px solid ${config.border}`,
      }}
    >
      <div className="mt-0.5 shrink-0" style={{ color: config.iconColor }}>
        {config.icon}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className="mb-1 text-sm font-semibold"
          style={{ color: config.border }}
        >
          {config.label}
        </p>
        <div className="text-[14px] leading-[1.7]" style={{ color: 'var(--text-secondary)' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Callout;
