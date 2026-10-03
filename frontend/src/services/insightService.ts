import { insights } from '@/data/insights'
import type { AIInsight } from '@/types'

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms))

export async function getInsights(): Promise<AIInsight[]> {
  await delay()
  return insights
}
