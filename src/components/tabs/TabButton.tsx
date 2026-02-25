import { CONTENT_TAB_DEFS } from '@/generated/content';

/* ──────────────────────────────────────────────
 * 타입 & 상수
 * ────────────────────────────────────────────── */

export interface TabDef {
  readonly id: string;
  readonly label: string;
  readonly icon: 'home' | 'settings' | null;
  readonly color: string;
}

// 정적 페이지 탭 (고정 위치)
export const HOME_TAB: TabDef = { id: 'home', label: '', icon: 'home', color: 'var(--tab-home)' };
export const SETTINGS_TAB: TabDef = { id: 'settings', label: '', icon: 'settings', color: 'var(--tab-settings)' };

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
export const ALL_TABS: readonly TabDef[] = [HOME_TAB, ...CONTENT_TABS, SETTINGS_TAB];
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

const GearIcon = ({ color }: { color: string }) => (
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
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const TabIcon = ({ icon, color }: { icon: 'home' | 'settings'; color: string }) => {
  if (icon === 'home') return <HomeIcon color={color} />;
  return <GearIcon color={color} />;
};

/* ──────────────────────────────────────────────
 * 공통 스타일
 * ────────────────────────────────────────────── */

const getTabStyle = (tab: TabDef, activeTab: string) => {
  const isActive = activeTab === tab.id;
  return {
    isActive,
    buttonStyle: {
      backgroundColor: tab.color,
      opacity: isActive ? 1 : 0.7,
      boxShadow: isActive ? 'none' : '1px 1px 3px rgba(0,0,0,0.1)',
    } as React.CSSProperties,
    textClass: `text-sm transition-all duration-150 ${isActive ? 'font-bold' : 'font-normal'}`,
    textColor: isActive ? '#101010' : '#faf5eb',
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

const ACTIVE_SIZE = '32px';
const INACTIVE_SIZE = '26px';
const ACTIVE_MAX = '150px';
const INACTIVE_MAX = '100px';

const TabButton = ({ tab, activeTab, onSelect, variant }: TabButtonProps) => {
  const vertical = variant === 'desktop';
  const { isActive, buttonStyle, textClass, textColor } = getTabStyle(tab, activeTab);

  const mainSize = isActive ? ACTIVE_SIZE : INACTIVE_SIZE;
  const maxCrossSize = tab.icon ? undefined : isActive ? ACTIVE_MAX : INACTIVE_MAX;

  return (
    <button
      key={tab.id}
      onClick={() => onSelect(tab.id)}
      className={[
        'flex items-center justify-center overflow-hidden transition-all duration-150',
        vertical ? 'shrink-0 rounded-r-lg py-3' : 'rounded-t-lg px-3',
        vertical ? '' : (tab.icon ? 'shrink-0' : 'min-w-0'),
        tab.icon ? '' : textClass,
      ].join(' ')}
      style={{
        ...buttonStyle,
        color: textColor,
        ...(vertical
          ? { width: mainSize, maxHeight: maxCrossSize }
          : { height: mainSize, maxWidth: maxCrossSize }),
      }}
    >
      {tab.icon ? (
        <TabIcon icon={tab.icon} color={textColor} />
      ) : (
        <span
          className={`block overflow-hidden whitespace-nowrap text-ellipsis ${vertical ? textClass : ''}`}
          style={vertical ? {
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            maxHeight: '100%',
            color: textColor,
          } : { color: textColor }}
        >
          {tab.label}
        </span>
      )}
    </button>
  );
};

/* ──────────────────────────────────────────────
 * 탭 스트립 (탭 목록 + 액센트 라인)
 *
 * 모바일/데스크탑 공통 구조를 한 곳에서 관리.
 * ────────────────────────────────────────────── */

const ACCENT_SIZE = '6px';
const STRIP_SIZE = '44px';
const STRIP_PADDING = 4; // Tailwind 단위 (16px)

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
      <TabButton tab={SETTINGS_TAB} activeTab={activeTab} onSelect={onSelect} variant={variant} />
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
        <nav
          className={`relative flex flex-col items-start gap-1 py-${STRIP_PADDING}`}
          style={{ width: STRIP_SIZE }}
        >
          {tabList}
        </nav>
      </>
    );
  }

  return (
    <>
      <div
        className={`flex items-end gap-1 overflow-x-auto px-${STRIP_PADDING}`}
        style={{ height: STRIP_SIZE, backgroundColor: 'var(--paper)' }}
      >
        {tabList}
      </div>
      {accentLine}
    </>
  );
};

export default TabButton;
