import type { ComponentType } from 'react';

import HomeContent from './1. home';
import resumeMd from './2. resume.md';
import aboutMd from './3. about.md';
import careerMd from './4. career.md';
import portfolioMd from './5. portfolio1.md';
import settingsMd from './99. settings.md';

export type TabContent =
  | { type: 'markdown'; content: string }
  | { type: 'component'; component: ComponentType<{ accentColor: string }> };

// 콘텐츠 탭 정의 (순서대로 표시됨)
// 새 탭을 추가하려면 여기에 항목을 추가하면 자동 반영됩니다.
export const CONTENT_TAB_DEFS: { id: string; label: string }[] = [
  { id: 'resume', label: '기술 스택' },
  { id: 'about', label: '자기소개' },
  { id: 'career', label: '경력' },
  { id: 'portfolio', label: '포트폴리오' },
];

export const TAB_CONTENT: Record<string, TabContent> = {
  home: { type: 'component', component: HomeContent },
  resume: { type: 'markdown', content: resumeMd },
  about: { type: 'markdown', content: aboutMd },
  career: { type: 'markdown', content: careerMd },
  portfolio: { type: 'markdown', content: portfolioMd },
  settings: { type: 'markdown', content: settingsMd },
};
