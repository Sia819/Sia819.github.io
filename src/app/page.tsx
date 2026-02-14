'use client';

import { useState, useCallback, useRef } from 'react';
import { resumeData } from '@/data/resume';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import CareerSection from '@/components/sections/CareerSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import EducationSection from '@/components/sections/EducationSection';

const TABS = [
  { id: 'about', label: '자기소개', color: 'var(--tab-about)' },
  { id: 'career', label: '경력', color: 'var(--tab-career)' },
  { id: 'skills', label: '기술', color: 'var(--tab-skills)' },
  { id: 'projects', label: '포트폴리오', color: 'var(--tab-projects)' },
  { id: 'education', label: '학력', color: 'var(--tab-education)' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('about');
  const wheelCooldown = useRef(false);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (wheelCooldown.current) return;
      const delta = e.deltaY;
      if (Math.abs(delta) < 10) return;

      const currentIndex = TABS.findIndex((t) => t.id === activeTab);
      if (delta > 0 && currentIndex < TABS.length - 1) {
        setActiveTab(TABS[currentIndex + 1].id);
      } else if (delta < 0 && currentIndex > 0) {
        setActiveTab(TABS[currentIndex - 1].id);
      } else {
        return;
      }

      wheelCooldown.current = true;
      setTimeout(() => { wheelCooldown.current = false; }, 200);
    },
    [activeTab],
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return <AboutSection paragraphs={resumeData.about} />;
      case 'career':
        return <CareerSection careers={resumeData.careers} />;
      case 'skills':
        return <SkillsSection skills={resumeData.skills} />;
      case 'projects':
        return <ProjectsSection projects={resumeData.projects} />;
      case 'education':
        return (
          <EducationSection
            educations={resumeData.educations}
            certifications={resumeData.certifications}
          />
        );
    }
  };

  const { profile } = resumeData;

  return (
    <div className="flex h-screen items-stretch justify-center">
      {/* 노트북 전체 컨테이너 - 넓은 화면에서 공책처럼 중앙 정렬 */}
      <div
        className="relative flex w-full overflow-hidden xl:max-w-[1100px] xl:my-6 xl:rounded-md"
        style={{ boxShadow: '0 4px 30px rgba(0,0,0,0.12)' }}
      >

        {/* === 왼쪽 사이드바 (프로필) === */}
        <aside
          className="hidden w-[260px] shrink-0 flex-col items-center px-6 py-10 md:flex"
          style={{ backgroundColor: 'var(--kraft)' }}
        >
          {/* 프로필 아바타 */}
          <div
            className="mb-5 flex h-28 w-28 items-center justify-center rounded-full text-3xl font-bold"
            style={{
              backgroundColor: 'var(--kraft-dark)',
              color: 'var(--kraft-light)',
              border: '3px solid var(--kraft-light)',
            }}
          >
            {profile.name.charAt(0)}
          </div>

          {/* 이름 & 직함 */}
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

          {/* 구분선 */}
          <div
            className="mb-6 w-full"
            style={{ borderTop: '1px solid var(--kraft-dark)' }}
          />

          {/* 연락처 */}
          <div className="mb-6 flex w-full flex-col gap-2 text-sm">
            {profile.email && (
              <div className="flex items-start gap-2">
                <span style={{ color: 'var(--sidebar-muted)' }}>@</span>
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
              <div className="flex items-start gap-2">
                <span style={{ color: 'var(--sidebar-muted)' }}>&#9906;</span>
                <span style={{ color: 'var(--sidebar-text)' }}>
                  {profile.location}
                </span>
              </div>
            )}
          </div>

          {/* 소셜 링크 */}
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
          {/* 바인더 링 구멍 */}
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
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold"
              style={{
                backgroundColor: 'var(--kraft-dark)',
                color: 'var(--kraft-light)',
              }}
            >
              {profile.name.charAt(0)}
            </div>
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
            className="flex gap-1 overflow-x-auto px-4 py-2 md:hidden"
            style={{ backgroundColor: 'var(--paper)' }}
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="shrink-0 rounded-t-md px-3 py-1.5 text-xs font-medium transition-all"
                style={{
                  backgroundColor: activeTab === tab.id ? tab.color : 'transparent',
                  color: activeTab === tab.id ? '#fff' : 'var(--text-muted)',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 종이 콘텐츠 */}
          <div
            onWheel={handleWheel}
            className="notebook-content paper-lines flex-1 overflow-hidden px-8 py-8 md:px-10 md:py-10"
            style={{ backgroundColor: 'var(--paper)' }}
          >
            {renderContent()}
          </div>
        </div>

        {/* === 활성 탭 색상 라인 === */}
        <div
          className="hidden w-[8px] shrink-0 transition-colors duration-200 md:block"
          style={{
            backgroundColor: TABS.find((t) => t.id === activeTab)?.color,
          }}
        />

        {/* === 오른쪽 탭 스트립 (데스크탑) === */}
        <nav
          className="relative hidden shrink-0 md:flex md:flex-col md:items-start md:pt-6"
          style={{ marginRight: '10px' }}
        >
          <div className="flex flex-col gap-1">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex w-[40px] items-center justify-center rounded-r-lg transition-all"
                  style={{
                    backgroundColor: tab.color,
                    height: '80px',
                    opacity: isActive ? 1 : 0.7,
                    boxShadow: isActive
                      ? '3px 2px 8px rgba(0,0,0,0.25)'
                      : '1px 1px 3px rgba(0,0,0,0.1)',
                  }}
                >
                  <span
                    className="text-sm font-bold"
                    style={{
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed',
                      whiteSpace: 'nowrap',
                      color: '#faf5eb',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    }}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
