export interface SleepRecord {
  id: string
  userId: string
  bedtime: Date
  wakeupTime: Date
  duration: number // 小时
  quality: number // 1-5星评分
  factors: SleepFactor[]
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface SleepFactor {
  type: SleepFactorType
  description: string
}

export type SleepFactorType = 
  | 'caffeine' 
  | 'stress' 
  | 'noise' 
  | 'screenTime' 
  | 'temperature' 
  | 'alcohol' 
  | 'medication' 
  | 'other'

export interface SleepQualitySummary {
  date: Date
  duration: number
  quality: number
  factors: SleepFactorType[]
}

export interface WeeklySleepStats {
  averageDuration: number
  averageQuality: number
  consistencyScore: number
  bedTimeVariation: number
  wakeTimeVariation: number
}

export interface SleepRecommendation {
  type: 'duration' | 'quality' | 'consistency' | 'routine'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  actionSteps: string[]
}
