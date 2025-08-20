import { invoke } from '@tauri-apps/api/core'
import { SleepRecord, SleepQualitySummary, WeeklySleepStats, SleepRecommendation } from '../types/sleep.types'

export const sleepService = {
  // 获取睡眠记录
  async getSleepRecords(startDate: Date, endDate: Date): Promise<SleepRecord[]> {
    try {
      return await invoke('get_sleep_records', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      })
    } catch (error) {
      console.error('Failed to get sleep records:', error)
      return []
    }
  },

  // 创建睡眠记录
  async createSleepRecord(record: Omit<SleepRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<SleepRecord> {
    try {
      return await invoke('create_sleep_record', { record })
    } catch (error) {
      console.error('Failed to create sleep record:', error)
      throw error
    }
  },

  // 更新睡眠记录
  async updateSleepRecord(id: string, updates: Partial<SleepRecord>): Promise<SleepRecord> {
    try {
      return await invoke('update_sleep_record', { id, updates })
    } catch (error) {
      console.error('Failed to update sleep record:', error)
      throw error
    }
  },

  // 删除睡眠记录
  async deleteSleepRecord(id: string): Promise<void> {
    try {
      await invoke('delete_sleep_record', { id })
    } catch (error) {
      console.error('Failed to delete sleep record:', error)
      throw error
    }
  },

  // 获取睡眠质量摘要
  async getSleepQualitySummary(date: Date): Promise<SleepQualitySummary> {
    try {
      return await invoke('get_sleep_quality_summary', { date: date.toISOString() })
    } catch (error) {
      console.error('Failed to get sleep quality summary:', error)
      return {
        date,
        duration: 0,
        quality: 0,
        factors: []
      }
    }
  },

  // 获取周睡眠统计
  async getWeeklySleepStats(startDate: Date): Promise<WeeklySleepStats> {
    try {
      return await invoke('get_weekly_sleep_stats', { startDate: startDate.toISOString() })
    } catch (error) {
      console.error('Failed to get weekly sleep stats:', error)
      return {
        averageDuration: 0,
        averageQuality: 0,
        consistencyScore: 0,
        bedTimeVariation: 0,
        wakeTimeVariation: 0
      }
    }
  },

  // 获取睡眠建议
  async getSleepRecommendations(): Promise<SleepRecommendation[]> {
    try {
      return await invoke('get_sleep_recommendations')
    } catch (error) {
      console.error('Failed to get sleep recommendations:', error)
      return []
    }
  },

  // 分析睡眠模式
  async analyzeSleepPatterns(days: number = 30): Promise<{
    averageBedtime: string
    averageWakeTime: string
    sleepEfficiency: number
    remSleepPercentage: number
    deepSleepPercentage: number
  }> {
    try {
      return await invoke('analyze_sleep_patterns', { days })
    } catch (error) {
      console.error('Failed to analyze sleep patterns:', error)
      return {
        averageBedtime: '22:00',
        averageWakeTime: '06:00',
        sleepEfficiency: 85,
        remSleepPercentage: 25,
        deepSleepPercentage: 15
      }
    }
  },

  // 导出睡眠数据
  async exportSleepData(startDate: Date, endDate: Date, format: 'csv' | 'json' = 'csv'): Promise<string> {
    try {
      return await invoke('export_sleep_data', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        format
      })
    } catch (error) {
      console.error('Failed to export sleep data:', error)
      throw error
    }
  }
}

// 模拟数据（开发环境使用）
if (import.meta.env.DEV) {
  // 开发环境下的模拟实现
  Object.assign(sleepService, {
    async getSleepRecords(): Promise<SleepRecord[]> {
      return [
        {
          id: '1',
          userId: 'user-123',
          bedtime: new Date('2025-08-19T22:30:00'),
          wakeupTime: new Date('2025-08-20T06:30:00'),
          duration: 8,
          quality: 4,
          factors: [
            { type: 'screenTime', description: '睡前使用手机1小时' },
            { type: 'caffeine', description: '下午喝了咖啡' }
          ],
          notes: '睡眠质量不错，但入睡较晚',
          createdAt: new Date('2025-08-20T07:00:00'),
          updatedAt: new Date('2025-08-20T07:00:00')
        },
        {
          id: '2',
          userId: 'user-123',
          bedtime: new Date('2025-08-18T23:00:00'),
          wakeupTime: new Date('2025-08-19T07:00:00'),
          duration: 8,
          quality: 3,
          factors: [
            { type: 'stress', description: '工作压力较大' },
            { type: 'noise', description: '窗外有噪音' }
          ],
          notes: '中途醒来几次',
          createdAt: new Date('2025-08-19T07:30:00'),
          updatedAt: new Date('2025-08-19T07:30:00')
        }
      ]
    },

    async getSleepQualitySummary(): Promise<SleepQualitySummary> {
      return {
        date: new Date(),
        duration: 7.5,
        quality: 4,
        factors: ['screenTime', 'caffeine']
      }
    },

    async getWeeklySleepStats(): Promise<WeeklySleepStats> {
      return {
        averageDuration: 7.2,
        averageQuality: 3.8,
        consistencyScore: 75,
        bedTimeVariation: 45,
        wakeTimeVariation: 30
      }
    },

    async getSleepRecommendations(): Promise<SleepRecommendation[]> {
      return [
        {
          type: 'routine',
          title: '建立规律作息',
          description: '每天固定时间上床和起床，帮助身体建立生物钟',
          priority: 'high',
          actionSteps: [
            '设定固定的上床时间（如22:30）',
            '设定固定的起床时间（如06:30）',
            '周末也尽量保持相同作息'
          ]
        },
        {
          type: 'quality',
          title: '改善睡眠环境',
          description: '优化卧室环境以提高睡眠质量',
          priority: 'medium',
          actionSteps: [
            '保持卧室温度在18-22°C',
            '使用遮光窗帘',
            '减少噪音干扰'
          ]
        }
      ]
    }
  })
}
