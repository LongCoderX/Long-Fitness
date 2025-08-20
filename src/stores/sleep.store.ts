import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { 
  SleepRecord, 
  WeeklySleepStats, 
  SleepRecommendation 
} from '@/types/sleep.types'
import { sleepService } from '@/services/sleep.service'

export const useSleepStore = defineStore('sleep', () => {
  // 状态
  const sleepRecords = ref<SleepRecord[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const recommendations = ref<SleepRecommendation[]>([])

  // Getter
  const lastNightSleep = computed(() => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(0, 0, 0, 0)
    
    return sleepRecords.value.find(record => {
      const recordDate = new Date(record.bedtime)
      recordDate.setHours(0, 0, 0, 0)
      return recordDate.getTime() === yesterday.getTime()
    })
  })

  const weeklySleepStats = computed(() => {
    const now = new Date()
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - 7)
    weekStart.setHours(0, 0, 0, 0)

    const weekRecords = sleepRecords.value.filter(record => 
      new Date(record.bedtime) >= weekStart
    )

    if (weekRecords.length === 0) {
      return {
        averageDuration: 0,
        averageQuality: 0,
        consistencyScore: 0,
        bedTimeVariation: 0,
        wakeTimeVariation: 0
      }
    }

    const durations = weekRecords.map(r => r.duration)
    const qualities = weekRecords.map(r => r.quality)
    const bedTimes = weekRecords.map(r => new Date(r.bedtime).getHours() * 60 + new Date(r.bedtime).getMinutes())
    const wakeTimes = weekRecords.map(r => new Date(r.wakeupTime).getHours() * 60 + new Date(r.wakeupTime).getMinutes())

    const averageDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length
    const averageQuality = qualities.reduce((sum, q) => sum + q, 0) / qualities.length
    
    // 计算一致性分数（基于起床时间的一致性）
    const wakeTimeStdDev = calculateStandardDeviation(wakeTimes)
    const consistencyScore = Math.max(0, 100 - wakeTimeStdDev * 2)

    return {
      averageDuration: parseFloat(averageDuration.toFixed(1)),
      averageQuality: parseFloat(averageQuality.toFixed(1)),
      consistencyScore: parseFloat(consistencyScore.toFixed(1)),
      bedTimeVariation: calculateStandardDeviation(bedTimes),
      wakeTimeVariation: calculateStandardDeviation(wakeTimes)
    }
  })

  const sleepQualityTrend = computed(() => {
    const last7Days = sleepRecords.value
      .sort((a, b) => new Date(b.bedtime).getTime() - new Date(a.bedtime).getTime())
      .slice(0, 7)
      .reverse()

    return last7Days.map(record => ({
      date: new Date(record.bedtime),
      duration: record.duration,
      quality: record.quality
    }))
  })

  // Action
  async function loadSleepRecords(startDate?: Date, endDate?: Date) {
    isLoading.value = true
    error.value = null
    try {
      const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 默认30天前
      const end = endDate || new Date() // 默认现在
      const records = await sleepService.getSleepRecords(start, end)
      sleepRecords.value = records
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载睡眠记录失败'
      console.error('Failed to load sleep records:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function addSleepRecord(recordData: Omit<SleepRecord, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const newRecord = await sleepService.createSleepRecord(recordData)
      sleepRecords.value.push(newRecord)
      console.log('Sleep record added:', newRecord)
      return newRecord
    } catch (err) {
      error.value = err instanceof Error ? err.message : '添加睡眠记录失败'
      console.error('Failed to add sleep record:', err)
      throw err
    }
  }

  async function updateSleepRecord(id: string, updates: Partial<SleepRecord>) {
    try {
      const updatedRecord = await sleepService.updateSleepRecord(id, updates)
      const index = sleepRecords.value.findIndex(record => record.id === id)
      if (index !== -1) {
        sleepRecords.value[index] = updatedRecord
      }
      console.log('Sleep record updated:', updatedRecord)
      return updatedRecord
    } catch (err) {
      error.value = err instanceof Error ? err.message : '更新睡眠记录失败'
      console.error('Failed to update sleep record:', err)
      throw err
    }
  }

  async function deleteSleepRecord(id: string) {
    try {
      await sleepService.deleteSleepRecord(id)
      sleepRecords.value = sleepRecords.value.filter(record => record.id !== id)
      console.log('Sleep record deleted:', id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : '删除睡眠记录失败'
      console.error('Failed to delete sleep record:', err)
      throw err
    }
  }

  async function loadLastNightSleep() {
    isLoading.value = true
    error.value = null
    try {
      // 加载最近7天的睡眠记录，确保包含昨晚的数据
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 7)
      
      const records = await sleepService.getSleepRecords(startDate, endDate)
      sleepRecords.value = records
      
      console.log('Loaded sleep records for last 7 days:', records.length)
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载睡眠数据失败'
      console.error('Failed to load last night sleep data:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function loadSleepRecommendations() {
    try {
      const stats = weeklySleepStats.value
      // 基于睡眠统计数据生成建议
      recommendations.value = generateSleepRecommendations(stats)
    } catch (err) {
      console.error('Failed to generate sleep recommendations:', err)
    }
  }

  // 工具函数
  function calculateStandardDeviation(values: number[]): number {
    if (values.length === 0) return 0
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length
    const squareDiffs = values.map(val => Math.pow(val - mean, 2))
    const variance = squareDiffs.reduce((sum, diff) => sum + diff, 0) / values.length
    return Math.sqrt(variance)
  }

  function generateSleepRecommendations(stats: WeeklySleepStats): SleepRecommendation[] {
    const recs: SleepRecommendation[] = []

    // 基于平均睡眠时长给出建议
    if (stats.averageDuration < 7) {
      recs.push({
        type: 'duration',
        title: '增加睡眠时长',
        description: '您的平均睡眠时长不足7小时，建议增加睡眠时间以获得更好的休息。',
        priority: 'high',
        actionSteps: [
          '提前30分钟上床睡觉',
          '建立固定的睡前作息',
          '避免睡前使用电子设备'
        ]
      })
    }

    // 基于睡眠质量给出建议
    if (stats.averageQuality < 3) {
      recs.push({
        type: 'quality',
        title: '改善睡眠质量',
        description: '您的睡眠质量有待提高，建议优化睡眠环境。',
        priority: 'medium',
        actionSteps: [
          '保持卧室温度适宜（18-22°C）',
          '使用遮光窗帘减少光线干扰',
          '尝试白噪音或放松音乐'
        ]
      })
    }

    // 基于一致性给出建议
    if (stats.consistencyScore < 70) {
      recs.push({
        type: 'consistency',
        title: '建立规律作息',
        description: '您的作息时间不够规律，建议固定起床和睡觉时间。',
        priority: 'medium',
        actionSteps: [
          '每天在同一时间起床（包括周末）',
          '建立睡前放松仪式',
          '避免周末补觉过多'
        ]
      })
    }

    return recs
  }

  return {
    // State
    sleepRecords,
    isLoading,
    error,
    recommendations,
    
    // Getter
    lastNightSleep,
    weeklySleepStats,
    sleepQualityTrend,
    
    // Action
    loadSleepRecords,
    addSleepRecord,
    updateSleepRecord,
    deleteSleepRecord,
    loadLastNightSleep,
    loadSleepRecommendations
  }
})
