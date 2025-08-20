export interface StressRecord {
  id: string
  userId: string
  stressLevel: number // 0-10压力等级
  timestamp: Date
  sources: StressSource[]
  physicalSymptoms: PhysicalSymptom[]
  copingStrategies: CopingStrategy[]
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface StressSource {
  type: StressSourceType
  intensity: number // 1-5强度
  description?: string
}

export type StressSourceType = 
  | 'work' 
  | 'relationship' 
  | 'financial' 
  | 'health' 
  | 'family' 
  | 'academic' 
  | 'social' 
  | 'environmental' 
  | 'other'

export interface PhysicalSymptom {
  type: PhysicalSymptomType
  severity: number // 1-5严重程度
}

export type PhysicalSymptomType = 
  | 'headache' 
  | 'muscleTension' 
  | 'stomachIssue' 
  | 'sleepProblem' 
  | 'fatigue' 
  | 'appetiteChange' 
  | 'concentrationIssue' 
  | 'heartPalpitation' 
  | 'other'

export interface CopingStrategy {
  type: CopingStrategyType
  effectiveness: number // 1-5有效性
  duration?: number // 分钟
}

export type CopingStrategyType = 
  | 'deepBreathing' 
  | 'meditation' 
  | 'exercise' 
  | 'talking' 
  | 'relaxation' 
  | 'timeManagement' 
  | 'boundarySetting' 
  | 'hobby' 
  | 'other'

export interface StressSummary {
  date: Date
  averageStressLevel: number
  mainSources: StressSourceType[]
  mainSymptoms: PhysicalSymptomType[]
  copingEffectiveness: number
}

export interface WeeklyStressStats {
  averageStressLevel: number
  stressVariation: number
  mostCommonSources: StressSourceType[]
  mostCommonSymptoms: PhysicalSymptomType[]
  copingSuccessRate: number
}

export interface StressRecommendation {
  type: 'immediate' | 'preventive' | 'coping' | 'lifestyle'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  actionSteps: string[]
  expectedBenefits: string[]
}
