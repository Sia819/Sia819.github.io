'use client';

import { homeContent, HOME_TAB } from '@/lib/tabs';
import TabContentRenderer from '@/components/sections/TabContentRenderer';

export default function HomePage() {
  return <TabContentRenderer tab={homeContent} accentColor={HOME_TAB.color} />;
}
