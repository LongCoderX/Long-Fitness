import { invoke } from '@tauri-apps/api/core'
import type { 
  StressRecord, 
  StressSummary, 
  WeeklyStressStats, 
  StressRecommendation 
} from '../types/stress.types'

// 开发环境下的模拟数据
const mockStressRecords: StressRecord[] = [
  {
    id: 'stress-1',
    userId: 'user-1',
    stressLevel: 6,
    timestamp: new Date('2025-08-20T18:30:00'),
    sources: [
      { type: 'work', intensity: 4 },
      { type: 'relationship', intensity: 3 }
    ],
    physicalSymptoms: [
      { type: 'headache', severity: 3 },
      { type: 'muscleTension', severity: 2 }
    ],
    copingStrategies: [
      { type: 'deepBreathing', effectiveness: 4 },
      { type: 'exercise', effectiveness: 3 }
    ],
    notes: '今天工作压力较大，晚上需要放松',
    createdAt: new Date('2025-08-20T18:30:00'),
    updatedAt: new Date('2025-08-20T18:30:00')
  },
  {
    id: 'stress-2',
    userId: 'user-1',
    stressLevel: 4,
    timestamp: new Date('2025-08-19T21:00:00'),
    sources: [
      { type: 'health', intensity: 3 }
    ],
    physicalSymptoms: [
      { type: 'sleepProblem', severity: 4 }
    ],
    copingStrategies: [
      { type: 'meditation', effectiveness: 4 }
    ],
    notes: '睡眠质量不太好，需要调整作息',
    createdAt: new Date('2025-08-19T21:00:00'),
    updatedAt: new Date('2025-08-19T21:00:00')
  }
]

const mockStressSummary: StressSummary = {
  date: new Date('2025-08-20'),
  averageStressLevel: 5.0,
  mainSources: ['work', 'health'],
  mainSymptoms: ['headache', 'sleepProblem'],
  copingEffectiveness: 3.5
}

const mockWeeklyStats: WeeklyStressStats = {
  averageStressLevel: 5.2,
  stressVariation: 2.1,
  mostCommonSources: ['work', 'health', 'financial'],
  mostCommonSymptoms: ['headache', 'sleepProblem', 'fatigue'],
  copingSuccessRate: 0.65
}

const mockRecommendations: StressRecommendation[] = [
  {
    type: 'immediate',
    title: '深呼吸练习',
    description: '每天进行5分钟的深呼吸练习，可以有效降低压力水平',
    priority: 'high',
    actionSteps: ['找一个安静的地方坐下', '深吸气5秒，屏气2秒，呼气7秒', '重复5-10次'],
    expectedBenefits: ['降低心率', '缓解焦虑', '改善专注力']
  },
  {
    type: 'lifestyle',
    title: '规律作息',
    description: '保持规律的睡眠时间，改善睡眠质量',
    priority: 'medium',
    actionSteps: ['固定起床和睡觉时间', '睡前1小时避免使用电子设备', '创建放松的睡前仪式'],
    expectedBenefits: ['提高睡眠质量', '增强免疫力', '改善情绪稳定性']
  }
]

// 检查是否在开发环境
const isDev = import.meta.env.DEV

export const stressService = {
  // 获取压力记录
  async getStressRecords(userId: string, startDate?: Date, endDate?: Date): Promise<StressRecord[]> {
    if (isDev) {
      // 开发环境下返回模拟数据
      await new Promise(resolve => setTimeout(resolve, 500))
      return mockStressRecords
    }

    try {
      return await invoke('get_stress_records', {
        userId,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString()
      })
    } catch (error) {
      console.error('Failed to get stress records:', error)
      throw new Error('获取压力记录失败')
    }
  },

  // 创建压力记录
  async createStressRecord(record: Omit<StressRecord, 'id' | 'timestamp' | 'createdAt' | 'updatedAt'>): Promise<StressRecord> {
    if (isDev) {
      await new Promise(resolve => setTimeout(resolve, 300))
      const newRecord: StressRecord = {
        ...record,
        id: `stress-${Date.now()}`,
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      mockStressRecords.push(newRecord)
      return newRecord
    }

    try {
      return await invoke('create_stress_record', { record })
    } catch (error) {
      console.error('Failed to create stress record:', error)
      throw new Error('创建压力记录失败')
    }
  },

  // 更新压力记录
  async updateStressRecord(id: string, updates: Partial<StressRecord>): Promise<void> {
    if (isDev) {
      await new Promise(resolve => setTimeout(resolve, 300))
      const index = mockStressRecords.findIndex(r => r.id === id)
      if (index !== -1) {
        mockStressRecords[index] = { ...mockStressRecords[index], ...updates }
      }
      return
    }

    try {
      await invoke('update_stress_record', { id, updates })
    } catch (error) {
      console.error('Failed to update stress record:', error)
      throw new Error('更新压力记录失败')
    }
  },

  // 删除压力记录
  async deleteStressRecord(id: string): Promise<void> {
    if (isDev) {
      await new Promise(resolve => setTimeout(resolve, 300))
      const index = mockStressRecords.findIndex(r => r.id === id)
      if (index !== -1) {
        mockStressRecords.splice(index, 1)
      }
      return
    }

    try {
      await invoke('delete_stress_record', { id })
    } catch (error) {
      console.error('Failed to delete stress record:', error)
      throw new Error('删除压力记录失败')
    }
  },

  // 获取压力摘要
  async getStressSummary(userId: string, period: 'day' | 'week' | 'month' = 'week'): Promise<StressSummary> {
    if (isDev) {
      await new Promise(resolve => setTimeout(resolve, 600))
      return mockStressSummary
    }

    try {
      return await invoke('get_stress_summary', { userId, period })
    } catch (error) {
      console.error('Failed to get stress summary:', error)
      throw new Error('获取压力摘要失败')
    }
  },

  // 获取周统计
  async getWeeklyStats(userId: string, weekStart: Date): Promise<WeeklyStressStats> {
    if (isDev) {
      await new Promise(resolve => setTimeout(resolve, 700))
      return mockWeeklyStats
    }

    try {
      return await invoke('get_weekly_stress_stats', {
        userId,
        weekStart: weekStart.toISOString()
      })
    } catch (error) {
      console.error('Failed to get weekly stress stats:', error)
      throw new Error('获取周压力统计失败')
    }
  },

  // 获取压力建议
  async getStressRecommendations(userId: string, stressLevel: number): Promise<StressRecommendation[]> {
    if (isDev) {
      await new Promise(resolve => setTimeout(resolve, 800))
      return mockRecommendations
    }

    try {
      return await invoke('get_stress_recommendations', { userId, stressLevel })
    } catch (error) {
      console.error('Failed to get stress recommendations:', error)
      throw new Error('获取压力建议失败')
    }
  },

  // 分析压力模式
  async analyzeStressPatterns(userId: string, days: number = 30): Promise<any> {
    if (isDev) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return {
        peakStressTimes: ['09:00-11:00', '14:00-16:00'],
        commonTriggers: ['meetings', 'deadlines'],
        effectiveInterventions: ['walking', 'meditation'],
        improvementRate: 0.15
      }
    }

    try {
      return await invoke('analyze_stress_patterns', { userId, days })
    } catch (error) {
      console.error('Failed to analyze stress patterns:', error)
      throw new Error('分析压力模式失败')
    }
  },

  // 导出压力数据
  async exportStressData(userId: string, format: 'json' | 'csv' = 'json'): Promise<string> {
    if (isDev) {
      await new Promise(resolve => setTimeout(resolve, 1200))
      return JSON.stringify(mockStressRecords, null, 2)
    }

    try {
      return await invoke('export_stress_data', { userId, format })
    } catch (error) {
      console.error('Failed to export stress data:', error)
      throw new Error('导出压力数据失败')
    }
  }
}
