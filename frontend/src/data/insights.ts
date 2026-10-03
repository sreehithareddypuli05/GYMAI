import type { AIInsight } from '@/types'

export const insights: AIInsight[] = [
  {
    id: 'ai-1',
    title: 'Recovery trending well',
    body: 'Your readiness has stayed above 75 for four straight days. This is a good window to push intensity on your next lower-body session.',
    tag: 'Recovery',
  },
  {
    id: 'ai-2',
    title: 'Bench press plateau detected',
    body: 'Your bench press load has been flat for three sessions. Consider a deload or switching rep ranges for two weeks.',
    tag: 'Programming',
  },
  {
    id: 'ai-3',
    title: 'Volume is climbing steadily',
    body: 'Weekly volume is up 18% over the last month with no drop in completion rate — a strong sign of building work capacity.',
    tag: 'Performance',
  },
]

export const heroInsight = insights[0]
