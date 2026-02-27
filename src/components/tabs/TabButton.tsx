import { useRef, useEffect, useState } from 'react';
import { CONTENT_TAB_DEFS } from '@/generated/content';

/* ──────────────────────────────────────────────
 * 타입 & 상수
 * ────────────────────────────────────────────── */

export interface TabDef {
  readonly id: string;
  readonly label: string;
  readonly icon: 'home' | 'about' | null;
  readonly color: string;
}

// 정적 페이지 탭 (고정 위치)
export const HOME_TAB: TabDef = { id: 'home', label: '', icon: 'home', color: 'var(--tab-home)' };
export const ABOUT_TAB: TabDef = { id: 'about', label: '', icon: 'about', color: 'var(--tab-about)' };

// 콘텐츠 탭 색상 팔레트 (CSS 변수와 동기화, 순환 적용)
const TAB_PALETTE = [
  'var(--tab-palette-1)',
  'var(--tab-palette-2)',
  'var(--tab-palette-3)',
  'var(--tab-palette-4)',
  'var(--tab-palette-5)',
];

// 콘텐츠 탭 (content에서 동적으로 생성)
export const CONTENT_TABS: readonly TabDef[] = CONTENT_TAB_DEFS.map((tab, i) => ({
  ...tab,
  icon: null,
  color: TAB_PALETTE[i % TAB_PALETTE.length],
}));

// 전체 탭 순서 (휠 네비게이션용)
export const ALL_TABS: readonly TabDef[] = [HOME_TAB, ...CONTENT_TABS, ABOUT_TAB];
export const ALL_TAB_IDS = ALL_TABS.map((t) => t.id);

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
 *
 * 배경색, 투명도, 그림자, 폰트 굵기, 글자색을
 * 활성 여부에 따라 반환한다.
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
    textClass: `text-sm transition-all duration-150 ${isActive ? 'font-bold' : 'font-normal'}`,
    textColor: isActive ? 'var(--tab-text-active)' : 'var(--tab-text-inactive)',
  };
};

/* ──────────────────────────────────────────────
 * 탭 버튼 컴포넌트
 *
 * desktop(세로)과 mobile(가로)은 축만 다르고 로직은 동일.
 * vertical 플래그로 축을 전환한다.
 * ────────────────────────────────────────────── */

interface TabButtonProps {
  tab: TabDef;
  activeTab: string;
  onSelect: (id: string) => void;
  variant: 'desktop' | 'mobile';
}

const ACTIVE_SIZE = '32px';    // 활성 탭의 두께 (데스크탑: width, 모바일: height)
const INACTIVE_SIZE = '26px';  // 비활성 탭의 두께
const ACTIVE_MAX = '150px';    // 활성 탭의 최대 길이 (데스크탑: maxHeight, 모바일: maxWidth)
const INACTIVE_MAX = '130px';  // 비활성 탭의 최대 길이
const VERTICAL_WORD_SPACING = '-0.6em'; // 세로 쓰기 시 공백 간격 축소 (upright 모드에서 공백이 1em 전체를 차지하므로)

const TabButton = ({ tab, activeTab, onSelect, variant }: TabButtonProps) => {
  const vertical = variant === 'desktop';
  const { isActive, buttonStyle, textClass, textColor } = getTabStyle(tab, activeTab);
  const btnRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  const mainSize = isActive ? ACTIVE_SIZE : INACTIVE_SIZE;
  const maxCrossSize = tab.icon ? undefined : isActive ? ACTIVE_MAX : INACTIVE_MAX;

  // 활성 탭이 스크롤 영역 밖이면 자동으로 보이게 스크롤
  useEffect(() => {
    if (isActive && btnRef.current) {
      btnRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }, [isActive]);

  // 텍스트 잘림 감지 (ResizeObserver로 transition 완료 후 재측정)
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

  return (
    <button
      ref={btnRef}
      key={tab.id}
      onClick={() => onSelect(tab.id)}
      title={!tab.icon && isTruncated ? tab.label : undefined}
      className={[
        'relative flex items-center justify-center shrink-0 overflow-hidden transition-all duration-150',
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
    </button>
  );
};

/* ──────────────────────────────────────────────
 * 탭 스크롤 컨테이너
 *
 * 가로(모바일)/세로(데스크탑) 공용.
 * 스크롤 가능한 방향에 페이드 그라데이션 표시.
 * ────────────────────────────────────────────── */

const FADE_SIZE = 24; // 스크롤 끝 페이드 그라데이션 크기 (px)

interface TabScrollContainerProps {
  vertical: boolean;
  size: string;
  padding: number;
  children: React.ReactNode;
}

const TabScrollContainer = ({ vertical, size, padding, children }: TabScrollContainerProps) => {
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
    ? `flex flex-col items-start gap-1 overflow-y-auto h-full py-${padding} tab-strip-scroll`
    : `flex items-end gap-1 overflow-x-auto h-full px-${padding} tab-strip-scroll`;

  const containerStyle = vertical
    ? { width: size }
    : { height: size, backgroundColor: 'var(--paper)' } as React.CSSProperties;

  const scrollStyle: React.CSSProperties = { scrollbarWidth: 'none' };

  const startFade = vertical
    ? { top: 0, left: 0, right: 0, height: FADE_SIZE, background: 'linear-gradient(to bottom, var(--paper), transparent)' }
    : { left: 0, top: 0, bottom: 0, width: FADE_SIZE, background: 'linear-gradient(to right, var(--paper), transparent)' };

  const endFade = vertical
    ? { bottom: 0, left: 0, right: 0, height: FADE_SIZE, background: 'linear-gradient(to top, var(--paper), transparent)' }
    : { right: 0, top: 0, bottom: 0, width: FADE_SIZE, background: 'linear-gradient(to left, var(--paper), transparent)' };

  return (
    <div className="relative" style={containerStyle}>
      <div ref={scrollRef} className={scrollClass} style={scrollStyle}>
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
 * 탭 스트립 (탭 목록 + 액센트 라인)
 *
 * 모바일/데스크탑 공통 구조를 한 곳에서 관리.
 * ────────────────────────────────────────────── */

const ACCENT_SIZE = '6px';  // 활성 탭 색상을 나타내는 액센트 라인 두께
const STRIP_SIZE = '44px';  // 탭 스트립 전체 두께 (데스크탑: width, 모바일: height)
const STRIP_PADDING = 4;    // 탭 스트립 안쪽 여백 (Tailwind 단위, 16px)

interface TabStripProps {
  activeTab: string;
  accentColor: string;
  onSelect: (id: string) => void;
  variant: 'desktop' | 'mobile';
}

export const TabStrip = ({ activeTab, accentColor, onSelect, variant }: TabStripProps) => {
  const vertical = variant === 'desktop';

  const tabList = (
    <>
      <TabButton tab={HOME_TAB} activeTab={activeTab} onSelect={onSelect} variant={variant} />
      {CONTENT_TABS.map((tab) => (
        <TabButton key={tab.id} tab={tab} activeTab={activeTab} onSelect={onSelect} variant={variant} />
      ))}
      <div className="flex-1" />
      <TabButton tab={ABOUT_TAB} activeTab={activeTab} onSelect={onSelect} variant={variant} />
    </>
  );

  const accentLine = (
    <div
      className="shrink-0 transition-colors duration-200"
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
        <TabScrollContainer vertical size={STRIP_SIZE} padding={STRIP_PADDING}>
          {tabList}
        </TabScrollContainer>
      </>
    );
  }

  return (
    <>
      <TabScrollContainer vertical={false} size={STRIP_SIZE} padding={STRIP_PADDING}>
        {tabList}
      </TabScrollContainer>
      {accentLine}
    </>
  );
};

export default TabButton;
