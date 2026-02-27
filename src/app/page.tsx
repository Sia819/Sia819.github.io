'use client';

import MarkdownSection from '@/components/sections/MarkdownSection';
import { TAB_CONTENT } from '@/generated/content';
import { TabStrip, ALL_TABS, ALL_TAB_IDS, HOME_TAB } from '@/components/tabs/TabButton';
import useTabWheel from '@/hooks/useTabWheel';
import useHashSync from '@/hooks/useHashSync';
import ProfileSidebar from '@/components/layout/ProfileSidebar';
import ProfileMobile from '@/components/layout/ProfileMobile';

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

  return (
    <div className="flex h-screen items-stretch justify-center">
      {/* 노트북 전체 컨테이너 */}
      <div
        onWheel={handleOuterWheel}
        className="relative flex w-full overflow-hidden xl:max-w-[1100px] xl:my-6 xl:rounded-md"
        style={{ boxShadow: 'var(--shadow-notebook)' }}
      >

        {/* === 왼쪽 사이드바 (프로필) === */}
        <ProfileSidebar />

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
                boxShadow: 'var(--shadow-binder-pin)',
              }}
            />
          ))}
        </div>

        {/* === 메인 콘텐츠 영역 === */}
        <div className="relative flex min-w-0 flex-1 flex-col">
          {/* 모바일: 프로필 헤더 */}
          <ProfileMobile />

          {/* 모바일: 탭 스트립 */}
          <div className="min-w-0 md:hidden">
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
                    backgroundColor: 'var(--hint-bg)',
                    color: 'var(--hint-text)',
                    border: '1px solid var(--hint-border)',
                  }}
                >
                  {hint.direction === 'down'
                    ? `스크롤하여 이동 → ${hint.tab.label || (hint.tab.icon === 'about' ? 'About' : '홈')}`
                    : `${hint.tab.label || (hint.tab.icon === 'home' ? '홈' : 'About')} ← 스크롤하여 이동`}
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
