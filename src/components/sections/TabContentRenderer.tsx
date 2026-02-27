'use client';

import MarkdownSection from '@/components/sections/MarkdownSection';
import type { TabContent } from '@/generated/tab-home';

interface TabContentRendererProps {
  tab: TabContent;
  accentColor: string;
}

const TabContentRenderer = ({ tab, accentColor }: TabContentRendererProps) => {
  if (tab.type === 'markdown') {
    return <MarkdownSection content={tab.content} accentColor={accentColor} />;
  }
  const Component = tab.component;
  return <Component accentColor={accentColor} />;
};

export default TabContentRenderer;
