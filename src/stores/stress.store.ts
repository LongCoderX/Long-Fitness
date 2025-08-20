import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { 
  StressRecord, 
  StressSummary, 
  WeeklyStressStats, 
  StressRecommendation,
  StressSourceType,
  PhysicalSymptomType,
  CopingStrategyType
} from '@/types/stress.types'
import { stressService } from '@/services/stress.service'
import { useUserStore } from './user.store'

export const useStressStore = defineStore('stress', () => {
  const userStore = useUserStore()
  
  // 状态
  const stressRecords = ref<StressRecord[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const recommendations = ref<StressRecommendation[]>([])
  const currentSummary = ref<StressSummary | null>(null)
  const weeklyStats = ref<WeeklyStressStats | null>(null)

  // Getter
  const todayStressRecords = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return stressRecords.value.filter(record => {
      const recordDate = new Date(record.timestamp)
      recordDate.setHours(0, 0, 0, 0)
      return recordDate.getTime() === today.getTime()
    })
  })

  const currentStressLevel = computed(() => {
    const todayRecords = todayStressRecords.value
    if (todayRecords.length === 0) return null
    
    const latestRecord = todayRecords.reduce((latest, record) => 
      new Date(record.timestamp) > new Date(latest.timestamp) ? record : latest
    )
    
    return latestRecord.stressLevel
  })

  const stressTrend = computed(() => {
    const last7Days = stressRecords.value
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 7)
      .reverse()

    return last7Days.map(record => ({
      date: new Date(record.timestamp),
      stressLevel: record.stressLevel,
      copingEffectiveness: calculateAverageCopingEffectiveness(record.copingStrategies)
    }))
  })

  const commonStressSources = computed(() => {
    const sourceCount: Record<StressSourceType, number> = {} as Record<StressSourceType, number>
    
    stressRecords.value.forEach(record => {
      record.sources.forEach(source => {
        sourceCount[source.type] = (sourceCount[source.type] || 0) + 1
      })
    })
    
    return Object.entries(sourceCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([type]) => type as StressSourceType)
  })

  const commonSymptoms = computed(() => {
    const symptomCount: Record<PhysicalSymptomType, number> = {} as Record<PhysicalSymptomType, number>
    
    stressRecords.value.forEach(record => {
      record.physicalSymptoms.forEach(symptom => {
        symptomCount[symptom.type] = (symptomCount[symptom.type] || 0) + 1
      })
    })
    
    return Object.entries(symptomCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([type]) => type as PhysicalSymptomType)
  })

  const effectiveCopingStrategies = computed(() => {
    const strategyEffectiveness: Record<CopingStrategyType, { count: number; totalEffectiveness: number }> = {} as Record<CopingStrategyType, { count: number; totalEffectiveness: number }>
    
    stressRecords.value.forEach(record => {
      record.copingStrategies.forEach(strategy => {
        if (!strategyEffectiveness[strategy.type]) {
          strategyEffectiveness[strategy.type] = { count: 0, totalEffectiveness: 0 }
        }
        strategyEffectiveness[strategy.type].count++
        strategyEffectiveness[strategy.type].totalEffectiveness += strategy.effectiveness
      })
    })
    
    return Object.entries(strategyEffectiveness)
      .map(([type, data]) => ({
        type: type as CopingStrategyType,
        averageEffectiveness: data.totalEffectiveness / data.count,
        usageCount: data.count
      }))
      .sort((a, b) => b.averageEffectiveness - a.averageEffectiveness)
      .slice(0, 5)
  })

  // Action
  async function loadStressRecords() {
    if (!userStore.currentUser) return
    
    isLoading.value = true
    error.value = null
    try {
      const records = await stressService.getStressRecords(userStore.currentUser.id)
      stressRecords.value = records
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载压力记录失败'
      console.error('Failed to load stress records:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function addStressRecord(recordData: Omit<StressRecord, 'id' | 'timestamp' | 'createdAt' | 'updatedAt'>) {
    if (!userStore.currentUser) throw new Error('用户未登录')
    
    try {
      const newRecord = await stressService.createStressRecord({
        ...recordData,
        userId: userStore.currentUser.id
      })
      stressRecords.value.push(newRecord)
      console.log('Stress record added:', newRecord)
      return newRecord
    } catch (err) {
      error.value = err instanceof Error ? err.message : '添加压力记录失败'
      console.error('Failed to add stress record:', err)
      throw err
    }
  }

  async function updateStressRecord(id: string, updates: Partial<StressRecord>) {
    try {
      await stressService.updateStressRecord(id, updates)
      const index = stressRecords.value.findIndex(record => record.id === id)
      if (index !== -1) {
        stressRecords.value[index] = { ...stressRecords.value[index], ...updates }
      }
      console.log('Stress record updated:', id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : '更新压力记录失败'
      console.error('Failed to update stress record:', err)
      throw err
    }
  }

  async function deleteStressRecord(id: string) {
    try {
      await stressService.deleteStressRecord(id)
      stressRecords.value = stressRecords.value.filter(record => record.id !== id)
      console.log('Stress record deleted:', id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : '删除压力记录失败'
      console.error('Failed to delete stress record:', err)
      throw err
    }
  }

  async function loadStressSummary(period: 'day' | 'week' | 'month' = 'week') {
    if (!userStore.currentUser) return
    
    try {
      const summary = await stressService.getStressSummary(userStore.currentUser.id, period)
      currentSummary.value = summary
    } catch (err) {
      console.error('Failed to load stress summary:', err)
    }
  }

  async function loadWeeklyStats() {
    if (!userStore.currentUser) return
    
    try {
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - 7)
      const stats = await stressService.getWeeklyStats(userStore.currentUser.id, weekStart)
      weeklyStats.value = stats
    } catch (err) {
      console.error('Failed to load weekly stress stats:', err)
    }
  }

  async function loadStressRecommendations() {
    if (!userStore.currentUser) return
    
    try {
      const currentLevel = currentStressLevel.value || 5 // 默认中等压力
      const recs = await stressService.getStressRecommendations(userStore.currentUser.id, currentLevel)
      recommendations.value = recs
    } catch (err) {
      console.error('Failed to load stress recommendations:', err)
    }
  }

  async function analyzeStressPatterns(days: number = 30) {
    if (!userStore.currentUser) return null
    
    try {
      return await stressService.analyzeStressPatterns(userStore.currentUser.id, days)
    } catch (err) {
      console.error('Failed to analyze stress patterns:', err)
      return null
    }
  }

  async function exportStressData(format: 'json' | 'csv' = 'json') {
    if (!userStore.currentUser) return null
    
    try {
      return await stressService.exportStressData(userStore.currentUser.id, format)
    } catch (err) {
      console.error('Failed to export stress data:', err)
      return null
    }
  }

  // 工具函数
  function calculateAverageCopingEffectiveness(strategies: { effectiveness: number }[]): number {
    if (strategies.length === 0) return 0
    return strategies.reduce((sum, strategy) => sum + strategy.effectiveness, 0) / strategies.length
  }

  function generateQuickStressAssessment(level: number, _sources: StressSourceType[]): string {
    if (level <= 3) return '压力水平较低，继续保持良好的压力管理习惯'
    if (level <= 6) return '中等压力水平，建议采取一些放松措施'
    if (level <= 8) return '压力水平较高，需要积极应对'
    return '压力水平非常高，建议寻求专业帮助或采取紧急减压措施'
  }

  return {
    // State
    stressRecords,
    isLoading,
    error,
    recommendations,
    currentSummary,
    weeklyStats,
    
    // Getter
    todayStressRecords,
    currentStressLevel,
    stressTrend,
    commonStressSources,
    commonSymptoms,
    effectiveCopingStrategies,
    
    // Action
    loadStressRecords,
    addStressRecord,
    updateStressRecord,
    deleteStressRecord,
    loadStressSummary,
    loadWeeklyStats,
    loadStressRecommendations,
    analyzeStressPatterns,
    exportStressData,
    
    // 工具函数
    generateQuickStressAssessment
  }
})
