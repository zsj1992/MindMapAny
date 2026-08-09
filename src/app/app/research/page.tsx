import type { Metadata } from 'next';
import { DeepResearchWorkspace } from '@/components/research/DeepResearchWorkspace';

export const metadata: Metadata = {
  title: '深度研究',
  description: '检索多个网页来源，生成带引用的研究报告和可编辑思维导图。',
};

export default function ResearchPage() {
  return <DeepResearchWorkspace />;
}

