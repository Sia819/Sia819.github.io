'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ALL_TABS,
  HOME_TAB,
  ABOUT_TAB,
  CONTENT_TABS,
  tabIdToPath,
  type TabDef,
} from '@/lib/tabs';


/* ──────────────────────────────────────────────
 * 아이콘
 * ────────────────────────────────────────────── */

const HomeIcon = ({ color }: { color: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const InfoIcon = ({ color }: { color: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const TabIcon = ({ icon, color }: { icon: 'home' | 'about'; color: string }) => {
  if (icon === 'home') return <HomeIcon color={color} />;
  return <InfoIcon color={color} />;
};

/* ──────────────────────────────────────────────
 * 탭 활성/비활성 상태별 스타일 계산
 * ────────────────────────────────────────────── */

const getTabStyle = (tab: TabDef, activeTab: string) => {
  const isActive = activeTab === tab.id;
  return {
    isActive,
    buttonStyle: {
      backgroundColor: tab.color,
      opacity: isActive ? 1 : 0.7,
      boxShadow: isActive ? 'none' : 'var(--shadow-tab)',
    } as React.CSSProperties,
    textClass: `text-sm ${isActive ? 'font-bold' : 'font-normal'}`,
    textColor: isActive ? 'var(--tab-text-active)' : 'var(--tab-text-inactive)',
  };
};

/* ──────────────────────────────────────────────
 * 탭 버튼 컴포넌트
 * ────────────────────────────────────────────── */

interface TabButtonProps {
  tab: TabDef;
  activeTab: string;
  variant: 'desktop' | 'mobile';
  onTabClick?: (tabId: string) => void;
}

const ACTIVE_SIZE = '32px';
const INACTIVE_SIZE = '26px';
const ACTIVE_MAX = '150px';
const INACTIVE_MAX = '130px';
const VERTICAL_WORD_SPACING = '-0.6em';
const FADE_SIZE = 24;

const TabButton = ({ tab, activeTab, variant, onTabClick }: TabButtonProps) => {
  const vertical = variant === 'desktop';
  const { isActive, buttonStyle, textClass, textColor } = getTabStyle(tab, activeTab);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  const mainSize = isActive ? ACTIVE_SIZE : INACTIVE_SIZE;
  const maxCrossSize = tab.icon ? undefined : isActive ? ACTIVE_MAX : INACTIVE_MAX;

  // 활성 탭이 스크롤 영역 밖이면 자동으로 보이게 스크롤
  useEffect(() => {
    if (isActive && linkRef.current) {
      linkRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }, [isActive]);

  // 텍스트 잘림 감지
  useEffect(() => {
    const el = textRef.current;
    if (!el || tab.icon) return;
    const check = () => {
      setIsTruncated(
        vertical
          ? el.scrollHeight > el.clientHeight + 1
          : el.scrollWidth > el.clientWidth + 1,
      );
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [tab.icon, tab.label, vertical]);

  const href = tabIdToPath(tab.id);

  return (
    <Link
      ref={linkRef}
      href={href}
      prefetch={false}
      onClick={(e) => {
        if (onTabClick) {
          e.preventDefault();
          onTabClick(tab.id);
        }
      }}
      title={!tab.icon && isTruncated ? tab.label : undefined}
      className={[
        'relative flex items-center justify-center shrink-0 overflow-hidden tab-btn',
        vertical ? 'rounded-r-lg py-3' : 'rounded-t-lg px-3',
        tab.icon ? '' : textClass,
      ].join(' ')}
      style={{
        ...buttonStyle,
        color: textColor,
        scrollMargin: FADE_SIZE,
        ...(vertical
          ? { width: mainSize, maxHeight: maxCrossSize }
          : { height: mainSize, maxWidth: maxCrossSize }),
      }}
    >
      {tab.icon ? (
        <TabIcon icon={tab.icon} color={textColor} />
      ) : (
        <>
          <span
            ref={textRef}
            className={`block overflow-hidden whitespace-nowrap ${vertical ? textClass : 'text-ellipsis'}`}
            style={vertical ? {
              writingMode: 'vertical-rl',
              textOrientation: 'upright',
              wordSpacing: VERTICAL_WORD_SPACING,
              maxHeight: '100%',
              color: textColor,
            } : { color: textColor }}
          >
            {tab.label}
          </span>
          {vertical && isTruncated && (
            <span
              className="pointer-events-none absolute bottom-2 left-0 right-0 flex flex-col items-center"
              style={{
                fontSize: '8px',
                lineHeight: '5px',
                color: textColor,
                background: `linear-gradient(to top, ${buttonStyle.backgroundColor} 50%, transparent)`,
                paddingTop: '4px',
                paddingBottom: '2px',
              }}
            >
              <span>.</span><span>.</span><span>.</span>
            </span>
          )}
        </>
      )}
    </Link>
  );
};

/* ──────────────────────────────────────────────
 * 탭 스크롤 컨테이너
 * ────────────────────────────────────────────── */

interface TabScrollContainerProps {
  vertical: boolean;
  size: string;
  children: React.ReactNode;
}

const TabScrollContainer = ({ vertical, size, children }: TabScrollContainerProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollStart, setCanScrollStart] = useState(false);
  const [canScrollEnd, setCanScrollEnd] = useState(false);

  const updateFade = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (vertical) {
      setCanScrollStart(el.scrollTop > 0);
      setCanScrollEnd(el.scrollTop + el.clientHeight < el.scrollHeight - 1);
    } else {
      setCanScrollStart(el.scrollLeft > 0);
      setCanScrollEnd(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateFade();
    el.addEventListener('scroll', updateFade, { passive: true });
    const ro = new ResizeObserver(updateFade);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateFade);
      ro.disconnect();
    };
  }, [vertical]);

  const scrollClass = vertical
    ? 'flex flex-col items-start gap-1 overflow-y-auto h-full py-4 tab-strip-scroll'
    : 'flex items-end gap-1 overflow-x-auto h-full px-4 tab-strip-scroll';

  const containerStyle = vertical
    ? { width: size }
    : { height: size, backgroundColor: 'var(--paper)' } as React.CSSProperties;

  const startFade = vertical
    ? { top: 0, left: 0, right: 0, height: FADE_SIZE, background: 'linear-gradient(to bottom, var(--paper), transparent)' }
    : { left: 0, top: 0, bottom: 0, width: FADE_SIZE, background: 'linear-gradient(to right, var(--paper), transparent)' };

  const endFade = vertical
    ? { bottom: 0, left: 0, right: 0, height: FADE_SIZE, background: 'linear-gradient(to top, var(--paper), transparent)' }
    : { right: 0, top: 0, bottom: 0, width: FADE_SIZE, background: 'linear-gradient(to left, var(--paper), transparent)' };

  return (
    <div className="relative" style={containerStyle}>
      <div ref={scrollRef} className={scrollClass}>
        {children}
      </div>
      {canScrollStart && (
        <div className="pointer-events-none absolute" style={startFade} />
      )}
      {canScrollEnd && (
        <div className="pointer-events-none absolute" style={endFade} />
      )}
    </div>
  );
};

/* ──────────────────────────────────────────────
 * 탭 스트립
 * ────────────────────────────────────────────── */

const ACCENT_SIZE = '6px';
const STRIP_SIZE = '44px';

interface TabStripProps {
  activeTab: string;
  accentColor: string;
  variant: 'desktop' | 'mobile';
  onTabClick?: (tabId: string) => void;
}

export const TabStrip = ({ activeTab, accentColor, variant, onTabClick }: TabStripProps) => {
  const vertical = variant === 'desktop';

  const tabList = (
    <>
      <TabButton tab={HOME_TAB} activeTab={activeTab} variant={variant} onTabClick={onTabClick} />
      {CONTENT_TABS.map((tab) => (
        <TabButton key={tab.id} tab={tab} activeTab={activeTab} variant={variant} onTabClick={onTabClick} />
      ))}
      <div className="flex-1" />
      <TabButton tab={ABOUT_TAB} activeTab={activeTab} variant={variant} onTabClick={onTabClick} />
    </>
  );

  const accentLine = (
    <div
      className="shrink-0"
      style={{
        backgroundColor: accentColor,
        ...(vertical ? { width: ACCENT_SIZE } : { height: ACCENT_SIZE }),
      }}
    />
  );

  if (vertical) {
    return (
      <>
        {accentLine}
        <TabScrollContainer vertical size={STRIP_SIZE}>
          {tabList}
        </TabScrollContainer>
      </>
    );
  }

  return (
    <>
      <TabScrollContainer vertical={false} size={STRIP_SIZE}>
        {tabList}
      </TabScrollContainer>
      {accentLine}
    </>
  );
};

export default TabButton;
