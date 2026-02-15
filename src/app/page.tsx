'use client';

import { resumeData } from '@/data/resume';
import MarkdownSection from '@/components/sections/MarkdownSection';
import { TAB_CONTENT, CONTENT_TAB_DEFS } from '@/content';
import useTabWheel from '@/hooks/useTabWheel';

/* ──────────────────────────────────────────────
 * 탭 정의
 * ────────────────────────────────────────────── */

interface TabDef {
  readonly id: string;
  readonly label: string;
  readonly icon: 'home' | 'settings' | null;
  readonly color: string;
}

// 정적 페이지 탭 (고정 위치)
const HOME_TAB: TabDef = { id: 'home', label: '', icon: 'home', color: 'var(--tab-home)' };
const SETTINGS_TAB: TabDef = { id: 'settings', label: '', icon: 'settings', color: 'var(--tab-settings)' };

// 콘텐츠 탭 색상 팔레트 (CSS 변수와 동기화, 순환 적용)
const TAB_PALETTE = [
  'var(--tab-palette-1)',
  'var(--tab-palette-2)',
  'var(--tab-palette-3)',
  'var(--tab-palette-4)',
  'var(--tab-palette-5)',
];

// 콘텐츠 탭 (content/index.ts에서 동적으로 생성)
const CONTENT_TABS: readonly TabDef[] = CONTENT_TAB_DEFS.map((tab, i) => ({
  ...tab,
  icon: null,
  color: TAB_PALETTE[i % TAB_PALETTE.length],
}));

// 전체 탭 순서 (휠 네비게이션용)
const ALL_TABS: readonly TabDef[] = [HOME_TAB, ...CONTENT_TABS, SETTINGS_TAB];

/* ──────────────────────────────────────────────
 * 아이콘 컴포넌트
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
 * 메인 컴포넌트
 * ────────────────────────────────────────────── */

export default function Home() {
  const {
    activeTab,
    setActiveTab,
    hint,
    contentRef,
    handleOuterWheel,
    handleContentWheel,
  } = useTabWheel(ALL_TABS, HOME_TAB.id);

  const activeTabDef = ALL_TABS.find((t) => t.id === activeTab) ?? HOME_TAB;
  const showPaperLines = activeTab !== HOME_TAB.id;

  const renderContent = () => {
    const tab = TAB_CONTENT[activeTab];
    if (!tab) return null;
    if (tab.type === 'markdown') {
      return <MarkdownSection content={tab.content} accentColor={activeTabDef.color} />;
    }
    const Component = tab.component;
    return <Component accentColor={activeTabDef.color} />;
  };

  const getTabStyle = (tab: TabDef) => {
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

  /* 탭 버튼 렌더 (데스크탑 세로) */
  const renderDesktopTab = (tab: TabDef) => {
    const { isActive, buttonStyle, textClass, textColor } = getTabStyle(tab);
    return (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`flex items-center justify-center rounded-r-lg transition-all duration-150 ${isActive ? 'w-[40px]' : 'w-[30px]'}`}
        style={{ ...buttonStyle, height: tab.icon ? '40px' : '80px' }}
      >
        {tab.icon ? (
          <TabIcon icon={tab.icon} color={textColor} />
        ) : (
          <span
            className={textClass}
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              whiteSpace: 'nowrap',
              color: textColor,
            }}
          >
            {tab.label}
          </span>
        )}
      </button>
    );
  };

  /* 탭 버튼 렌더 (모바일 가로) */
  const renderMobileTab = (tab: TabDef) => {
    const { isActive, buttonStyle, textClass, textColor } = getTabStyle(tab);
    return (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`shrink-0 rounded-t-md px-3 transition-all duration-150 ${tab.icon ? '' : textClass}`}
        style={{ ...buttonStyle, color: textColor, height: isActive ? '36px' : '26px' }}
      >
        {tab.icon ? <TabIcon icon={tab.icon} color={textColor} /> : tab.label}
      </button>
    );
  };

  const { profile } = resumeData;

  return (
    <div className="flex h-screen items-stretch justify-center">
      {/* 노트북 전체 컨테이너 */}
      <div
        onWheel={handleOuterWheel}
        className="relative flex w-full overflow-hidden xl:max-w-[1100px] xl:my-6 xl:rounded-md"
        style={{ boxShadow: '0 4px 30px rgba(0,0,0,0.12)' }}
      >

        {/* === 왼쪽 사이드바 (프로필) === */}
        <aside
          className="hidden w-[260px] shrink-0 flex-col items-center px-6 py-10 md:flex"
          style={{ backgroundColor: 'var(--kraft)' }}
        >
          <img
            src="https://avatars.githubusercontent.com/u/18740181"
            alt={profile.name}
            className="mb-5 h-28 w-28 rounded-full object-cover"
            style={{ border: '3px solid var(--kraft-light)' }}
          />
          <h1
            className="mb-1 text-center text-xl font-bold"
            style={{ color: 'var(--sidebar-name)' }}
          >
            {profile.name}
          </h1>
          <p
            className="mb-1 text-center text-sm font-medium"
            style={{ color: 'var(--sidebar-text)' }}
          >
            {profile.title}
          </p>
          <p
            className="mb-6 text-center text-xs"
            style={{ color: 'var(--sidebar-muted)' }}
          >
            {profile.subtitle}
          </p>
          <div
            className="mb-6 w-full"
            style={{ borderTop: '1px solid var(--kraft-dark)' }}
          />
          <div className="mb-6 flex w-full flex-col gap-2 text-sm">
            {profile.email && (
              <div className="flex items-center gap-2">
                <span className="inline-flex w-4 shrink-0 justify-center" style={{ color: 'var(--sidebar-muted)' }}>@</span>
                <a
                  href={`mailto:${profile.email}`}
                  className="break-all underline-offset-2 hover:underline"
                  style={{ color: 'var(--sidebar-text)' }}
                >
                  {profile.email}
                </a>
              </div>
            )}
            {profile.location && (
              <div className="flex items-center gap-2">
                <span className="inline-flex w-4 shrink-0 justify-center" style={{ color: 'var(--sidebar-muted)' }}>&#9906;</span>
                <span style={{ color: 'var(--sidebar-text)' }}>
                  {profile.location}
                </span>
              </div>
            )}
          </div>
          <div className="flex w-full flex-col gap-2">
            {profile.links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded px-3 py-1.5 text-center text-sm transition-colors"
                style={{
                  backgroundColor: 'var(--kraft-dark)',
                  color: 'var(--kraft-light)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--spine)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--kraft-dark)';
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </aside>

        {/* === 바인더 스파인 === */}
        <div
          className="relative hidden w-5 shrink-0 md:block"
          style={{
            background: `linear-gradient(to right, var(--spine), var(--spine-light))`,
          }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="absolute left-1/2 h-4 w-4 -translate-x-1/2 rounded-full"
              style={{
                top: `${18 + i * 16}%`,
                backgroundColor: 'var(--desk)',
                border: '2px solid var(--spine)',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)',
              }}
            />
          ))}
        </div>

        {/* === 메인 콘텐츠 영역 === */}
        <div className="relative flex flex-1 flex-col">
          {/* 모바일: 프로필 헤더 */}
          <div
            className="flex items-center gap-4 px-5 py-4 md:hidden"
            style={{ backgroundColor: 'var(--kraft)' }}
          >
            <img
              src="https://avatars.githubusercontent.com/u/18740181"
              alt={profile.name}
              className="h-14 w-14 shrink-0 rounded-full object-cover"
            />
            <div>
              <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {profile.name}
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {profile.title}
              </p>
            </div>
          </div>

          {/* 모바일: 탭 가로 스크롤 */}
          <div
            className="flex h-[44px] items-end gap-1 overflow-x-auto px-4 md:hidden"
            style={{ backgroundColor: 'var(--paper)' }}
          >
            {/* 홈 (정적) */}
            {renderMobileTab(HOME_TAB)}
            {/* 콘텐츠 탭 (동적) */}
            {CONTENT_TABS.map(renderMobileTab)}
            {/* 설정 (정적, 오른쪽 끝으로 밀기) */}
            <div className="flex-1" />
            {renderMobileTab(SETTINGS_TAB)}
          </div>
          {/* 모바일: 활성 탭 색상 가로 라인 */}
          <div
            className="h-[6px] transition-colors duration-200 md:hidden"
            style={{ backgroundColor: activeTabDef.color }}
          />

          {/* 종이 콘텐츠 */}
          <div
            className={`relative flex-1 overflow-hidden py-4 md:py-6 ${showPaperLines ? 'paper-lines' : ''}`}
            style={{ backgroundColor: 'var(--paper)' }}
          >
            <div
              ref={contentRef}
              onWheel={handleContentWheel}
              className="notebook-content h-full overflow-y-auto py-8 pl-8 pr-4 mr-3 md:py-10 md:pl-10 md:pr-6 md:mr-4"
            >
              {renderContent()}
            </div>

            {/* 스크롤 끝 힌트 */}
            {hint && (
              <div
                className={`pointer-events-none absolute left-0 right-0 flex justify-center animate-fade-in ${hint.direction === 'down' ? 'bottom-3' : 'top-3'}`}
              >
                <span
                  className="rounded-full px-4 py-1 text-xs"
                  style={{
                    backgroundColor: '#e8f1fa',
                    color: '#5a7fa0',
                    border: '1px solid #c4d8ec',
                  }}
                >
                  {hint.direction === 'down'
                    ? `스크롤하여 이동 → ${hint.tab.label || (hint.tab.icon === 'settings' ? '설정' : '홈')}`
                    : `${hint.tab.label || (hint.tab.icon === 'home' ? '홈' : '설정')} ← 스크롤하여 이동`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* === 활성 탭 색상 라인 === */}
        <div
          className="hidden w-[8px] shrink-0 transition-colors duration-200 md:block"
          style={{ backgroundColor: activeTabDef.color }}
        />

        {/* === 오른쪽 탭 스트립 (데스크탑) === */}
        <nav
          className="relative hidden w-[40px] shrink-0 md:flex md:flex-col md:items-start md:py-6"
          style={{ marginRight: '10px' }}
        >
          {/* 상단: 홈 + 콘텐츠 탭 */}
          <div className="flex flex-col gap-1">
            {renderDesktopTab(HOME_TAB)}
            {CONTENT_TABS.map(renderDesktopTab)}
          </div>

          {/* 스페이서 */}
          <div className="flex-1" />

          {/* 하단: 설정 탭 (고정) */}
          <div className="flex flex-col gap-1">
            {renderDesktopTab(SETTINGS_TAB)}
          </div>
        </nav>
      </div>
    </div>
  );
}
