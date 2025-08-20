import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Exercise {
  id: string
  name: string
  type: 'functional' | 'bodyweight' | 'posture' | 'cardio'
  duration: number // 分钟
  intensity: 'low' | 'medium' | 'high'
  caloriesBurned: number
  notes?: string
  recordedAt: Date
}

export interface ExercisePlan {
  id: string
  name: string
  exercises: ExercisePlanItem[]
  schedule: Schedule
  completed: boolean
}

export interface ExercisePlanItem {
  exerciseId: string
  sets?: number
  reps?: number
  duration?: number
  restTime?: number
}

export interface Schedule {
  frequency: 'daily' | 'weekly' | 'custom'
  days: number[] // 0-6 表示周日到周六
  time?: string
}

export const useExerciseStore = defineStore('exercise', () => {
  // 状态
  const exercises = ref<Exercise[]>([])
  const exercisePlans = ref<ExercisePlan[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getter
  const todayExercises = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return exercises.value.filter(exercise => {
      const exerciseDate = new Date(exercise.recordedAt)
      exerciseDate.setHours(0, 0, 0, 0)
      return exerciseDate.getTime() === today.getTime()
    })
  })

  const weeklyExerciseStats = computed(() => {
    const now = new Date()
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - now.getDay())
    weekStart.setHours(0, 0, 0, 0)

    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    weekEnd.setHours(23, 59, 59, 999)

    const weekExercises = exercises.value.filter(exercise => {
      const exerciseDate = new Date(exercise.recordedAt)
      return exerciseDate >= weekStart && exerciseDate <= weekEnd
    })

    const totalDuration = weekExercises.reduce((sum, ex) => sum + ex.duration, 0)
    const totalCalories = weekExercises.reduce((sum, ex) => sum + ex.caloriesBurned, 0)
    const exerciseDays = new Set(
      weekExercises.map(ex => new Date(ex.recordedAt).getDay())
    ).size

    return {
      totalDuration,
      totalCalories,
      exerciseDays,
      averageDuration: totalDuration / (exerciseDays || 1)
    }
  })

  const activePlans = computed(() =>
    exercisePlans.value.filter(plan => !plan.completed)
  )

  // Action
  async function loadExercises() {
    isLoading.value = true
    error.value = null
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // 模拟运动数据
      exercises.value = [
        {
          id: 'ex-1',
          name: '晨跑',
          type: 'cardio',
          duration: 30,
          intensity: 'medium',
          caloriesBurned: 300,
          recordedAt: new Date('2025-08-20T07:30:00')
        },
        {
          id: 'ex-2',
          name: '深蹲训练',
          type: 'functional',
          duration: 20,
          intensity: 'high',
          caloriesBurned: 200,
          recordedAt: new Date('2025-08-19T18:00:00')
        }
      ]
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载运动记录失败'
      console.error('Failed to load exercises:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function loadExercisePlans() {
    isLoading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 600))
      
      // 模拟训练计划
      exercisePlans.value = [
        {
          id: 'plan-1',
          name: '本周健身计划',
          exercises: [
            { exerciseId: 'ex-1', duration: 30 },
            { exerciseId: 'ex-2', sets: 3, reps: 12 }
          ],
          schedule: {
            frequency: 'weekly',
            days: [1, 3, 5], // 周一、三、五
            time: '19:00'
          },
          completed: false
        }
      ]
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载训练计划失败'
      console.error('Failed to load exercise plans:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function addExercise(exercise: Omit<Exercise, 'id' | 'recordedAt'>) {
    const newExercise: Exercise = {
      ...exercise,
      id: `ex-${Date.now()}`,
      recordedAt: new Date()
    }
    
    exercises.value.push(newExercise)
    // 这里可以添加保存到后端的逻辑
    console.log('Exercise added:', newExercise)
    return newExercise
  }

  async function updateExercise(id: string, updates: Partial<Exercise>) {
    const index = exercises.value.findIndex(ex => ex.id === id)
    if (index !== -1) {
      exercises.value[index] = { ...exercises.value[index], ...updates }
      // 保存到后端
      console.log('Exercise updated:', exercises.value[index])
    }
  }

  async function deleteExercise(id: string) {
    exercises.value = exercises.value.filter(ex => ex.id !== id)
    // 从后端删除
    console.log('Exercise deleted:', id)
  }

  async function createExercisePlan(plan: Omit<ExercisePlan, 'id' | 'completed'>) {
    const newPlan: ExercisePlan = {
      ...plan,
      id: `plan-${Date.now()}`,
      completed: false
    }
    
    exercisePlans.value.push(newPlan)
    console.log('Exercise plan created:', newPlan)
    return newPlan
  }

  async function completeExercisePlan(id: string) {
    const plan = exercisePlans.value.find(p => p.id === id)
    if (plan) {
      plan.completed = true
      console.log('Exercise plan completed:', id)
    }
  }

  async function loadTodayExercise() {
    isLoading.value = true
    error.value = null
    try {
      // 模拟API调用获取今日运动数据
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 这里可以调用实际的API服务
      // 目前使用模拟数据，实际应该从后端获取
      console.log('Loaded today exercise data')
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载今日运动数据失败'
      console.error('Failed to load today exercise:', err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    exercises,
    exercisePlans,
    isLoading,
    error,
    
    // Getter
    todayExercises,
    weeklyExerciseStats,
    activePlans,
    
    // Action
    loadExercises,
    loadExercisePlans,
    addExercise,
    updateExercise,
    deleteExercise,
    createExercisePlan,
    completeExercisePlan,
    loadTodayExercise
  }
})
