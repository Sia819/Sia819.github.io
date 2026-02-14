import type { ComponentType } from 'react';

import HomeContent from './home';
import aboutMd from './about.md';
import careerMd from './career.md';
import skillsMd from './skills.md';
import projectsMd from './projects.md';
import educationMd from './education.md';
import settingsMd from './settings.md';

export type TabContent =
  | { type: 'markdown'; content: string }
  | { type: 'component'; component: ComponentType<{ accentColor: string }> };

export const TAB_CONTENT: Record<string, TabContent> = {
  home: { type: 'component', component: HomeContent },
  about: { type: 'markdown', content: aboutMd },
  career: { type: 'markdown', content: careerMd },
  skills: { type: 'markdown', content: skillsMd },
  projects: { type: 'markdown', content: projectsMd },
  education: { type: 'markdown', content: educationMd },
  settings: { type: 'markdown', content: settingsMd },
};
