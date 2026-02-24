'use client';

import { resumeData } from '@/data/resume';
import MarkdownSection from '@/components/sections/MarkdownSection';
import { TAB_CONTENT } from '@/generated/content';
import { TabStrip, ALL_TABS, ALL_TAB_IDS, HOME_TAB } from '@/components/tabs/TabButton';
import useTabWheel from '@/hooks/useTabWheel';
import useHashSync from '@/hooks/useHashSync';

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

  useHashSync(activeTab, setActiveTab, contentRef, ALL_TAB_IDS);

  const activeTabDef = ALL_TABS.find((t) => t.id === activeTab) ?? HOME_TAB;
  const showPaperLines = false;

  const renderContent = () => {
    const tab = TAB_CONTENT[activeTab];
    if (!tab) return null;
    if (tab.type === 'markdown') {
      return <MarkdownSection content={tab.content} accentColor={activeTabDef.color} />;
    }
    const Component = tab.component;
    return <Component accentColor={activeTabDef.color} />;
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

          {/* 모바일: 탭 스트립 */}
          <div className="md:hidden">
            <TabStrip activeTab={activeTab} accentColor={activeTabDef.color} onSelect={setActiveTab} variant="mobile" />
          </div>

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

        {/* 데스크탑: 탭 스트립 */}
        <div className="hidden md:flex">
          <TabStrip activeTab={activeTab} accentColor={activeTabDef.color} onSelect={setActiveTab} variant="desktop" />
        </div>
      </div>
    </div>
  );
}
