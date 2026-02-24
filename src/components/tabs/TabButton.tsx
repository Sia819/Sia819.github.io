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
 * ────────────────────────────────────────────── */

interface TabButtonProps {
  tab: TabDef;
  activeTab: string;
  onSelect: (id: string) => void;
  variant: 'desktop' | 'mobile';
}

const DesktopTabButton = ({ tab, activeTab, onSelect }: Omit<TabButtonProps, 'variant'>) => {
  const { isActive, buttonStyle, textClass, textColor } = getTabStyle(tab, activeTab);
  return (
    <button
      key={tab.id}
      onClick={() => onSelect(tab.id)}
      className={`relative flex items-center justify-center rounded-r-lg px-1 py-2 overflow-hidden transition-all duration-150 ${isActive ? 'w-[40px]' : 'w-[34px]'}`}
      style={{
        ...buttonStyle,
        height: tab.icon ? '40px' : undefined,
        maxHeight: tab.icon ? undefined : isActive ? '150px' : '100px',
      }}
    >
      {tab.icon ? (
        <TabIcon icon={tab.icon} color={textColor} />
      ) : (
        <>
          {/* 숨겨진 spacer: vertical-rl로 버튼 높이를 텍스트 길이에 맞춤 */}
          <div
            aria-hidden="true"
            className={textClass}
            style={{
              writingMode: 'vertical-rl',
              whiteSpace: 'nowrap',
              visibility: 'hidden',
              maxHeight: '100%',
            }}
          >
            {tab.label}
          </div>
          {/* 실제 텍스트: 가로 텍스트를 90도 회전 */}
          <div
            className={textClass}
            style={{
              position: 'absolute',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: `${(isActive ? 150 : 100) - 16}px`,
              color: textColor,
              transform: 'rotate(90deg)',
            }}
          >
            {tab.label}
          </div>
        </>
      )}
    </button>
  );
};

const MobileTabButton = ({ tab, activeTab, onSelect }: Omit<TabButtonProps, 'variant'>) => {
  const { isActive, buttonStyle, textClass, textColor } = getTabStyle(tab, activeTab);
  return (
    <button
      key={tab.id}
      onClick={() => onSelect(tab.id)}
      className={`shrink-0 rounded-t-md px-3 transition-all duration-150 overflow-hidden text-ellipsis whitespace-nowrap ${tab.icon ? '' : textClass}`}
      style={{
        ...buttonStyle,
        color: textColor,
        height: isActive ? '32px' : '26px',
        maxWidth: tab.icon ? undefined : isActive ? '150px' : '100px',
      }}
    >
      {tab.icon ? <TabIcon icon={tab.icon} color={textColor} /> : tab.label}
    </button>
  );
};

const TabButton = (props: TabButtonProps) => {
  const { variant, ...rest } = props;
  if (variant === 'desktop') return <DesktopTabButton {...rest} />;
  return <MobileTabButton {...rest} />;
};

export default TabButton;
