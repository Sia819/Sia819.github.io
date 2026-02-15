import type { ComponentType } from 'react';

import HomeContent from './home';
import aboutMd from './about.md';
import skillsMd from './skills.md';
import projectsMd from './projects.md';
import educationMd from './education.md';
import settingsMd from './settings.md';

export type TabContent =
  | { type: 'markdown'; content: string }
  | { type: 'component'; component: ComponentType<{ accentColor: string }> };

// 콘텐츠 탭 정의 (순서대로 표시됨)
// 새 탭을 추가하려면 여기에 항목을 추가하면 자동 반영됩니다.
export const CONTENT_TAB_DEFS: { id: string; label: string }[] = [
  { id: 'about', label: '자기소개' },
  { id: 'skills', label: '기술' },
  { id: 'projects', label: '포트폴리오' },
  { id: 'education', label: '학력' },
];

export const TAB_CONTENT: Record<string, TabContent> = {
  home: { type: 'component', component: HomeContent },
  about: { type: 'markdown', content: aboutMd },
  skills: { type: 'markdown', content: skillsMd },
  projects: { type: 'markdown', content: projectsMd },
  education: { type: 'markdown', content: educationMd },
  settings: { type: 'markdown', content: settingsMd },
};
