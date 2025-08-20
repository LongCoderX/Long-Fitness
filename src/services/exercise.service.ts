import { invoke } from '@tauri-apps/api/core'
import { Exercise, ExercisePlan } from '../stores/exercise.store'

export const exerciseService = {
  // 获取运动记录
  async getExercises(date: Date): Promise<Exercise[]> {
    try {
      return await invoke('get_exercises', { date: date.toISOString() })
    } catch (error) {
      console.error('Failed to get exercises:', error)
      return []
    }
  },

  // 创建运动记录
  async createExercise(record: Omit<Exercise, 'id' | 'recordedAt'>): Promise<Exercise> {
    try {
      return await invoke('create_exercise', { record })
    } catch (error) {
      console.error('Failed to create exercise:', error)
      throw error
    }
  },

  // 更新运动记录
  async updateExercise(id: string, updates: Partial<Exercise>): Promise<Exercise> {
    try {
      return await invoke('update_exercise', { id, updates })
    } catch (error) {
      console.error('Failed to update exercise:', error)
      throw error
    }
  },

  // 删除运动记录
  async deleteExercise(id: string): Promise<void> {
    try {
      await invoke('delete_exercise', { id })
    } catch (error) {
      console.error('Failed to delete exercise:', error)
      throw error
    }
  },

  // 获取训练计划
  async getExercisePlans(): Promise<ExercisePlan[]> {
    try {
      return await invoke('get_exercise_plans')
    } catch (error) {
      console.error('Failed to get exercise plans:', error)
      return []
    }
  },

  // 创建训练计划
  async createExercisePlan(plan: Omit<ExercisePlan, 'id' | 'completed'>): Promise<ExercisePlan> {
    try {
      return await invoke('create_exercise_plan', { plan })
    } catch (error) {
      console.error('Failed to create exercise plan:', error)
      throw error
    }
  },

  // 更新训练计划
  async updateExercisePlan(id: string, updates: Partial<ExercisePlan>): Promise<ExercisePlan> {
    try {
      return await invoke('update_exercise_plan', { id, updates })
    } catch (error) {
      console.error('Failed to update exercise plan:', error)
      throw error
    }
  },

  // 删除训练计划
  async deleteExercisePlan(id: string): Promise<void> {
    try {
      await invoke('delete_exercise_plan', { id })
    } catch (error) {
      console.error('Failed to delete exercise plan:', error)
      throw error
    }
  },

  // 完成训练计划
  async completeExercisePlan(id: string): Promise<void> {
    try {
      await invoke('complete_exercise_plan', { id })
    } catch (error) {
      console.error('Failed to complete exercise plan:', error)
      throw error
    }
  },

  // 获取运动统计
  async getExerciseStats(startDate: Date, endDate: Date): Promise<{
    totalDuration: number
    totalCalories: number
    exerciseDays: number
    averageDuration: number
  }> {
    try {
      return await invoke('get_exercise_stats', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      })
    } catch (error) {
      console.error('Failed to get exercise stats:', error)
      return { totalDuration: 0, totalCalories: 0, exerciseDays: 0, averageDuration: 0 }
    }
  },

  // 获取动作库
  async getExerciseLibrary(): Promise<{
    id: string
    name: string
    type: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    targetMuscles: string[]
    instructions: string[]
    videoUrl?: string
  }[]> {
    try {
      return await invoke('get_exercise_library')
    } catch (error) {
      console.error('Failed to get exercise library:', error)
      return []
    }
  },

  // 搜索动作
  async searchExercises(query: string, type?: string): Promise<{
    id: string
    name: string
    type: string
    difficulty: string
    targetMuscles: string[]
  }[]> {
    try {
      return await invoke('search_exercises', { query, type })
    } catch (error) {
      console.error('Failed to search exercises:', error)
      return []
    }
  },

  // 获取今日运动摘要
  async getTodayExerciseSummary(): Promise<{
    totalDuration: number
    totalCalories: number
    exerciseCount: number
    completedPlans: number
  }> {
    try {
      return await invoke('get_today_exercise_summary')
    } catch (error) {
      console.error('Failed to get today exercise summary:', error)
      return { totalDuration: 0, totalCalories: 0, exerciseCount: 0, completedPlans: 0 }
    }
  }
}

// 模拟数据（开发环境使用）
if (import.meta.env.DEV) {
  // 模拟动作库
  const mockExerciseLibrary = [
    {
      id: 'ex-1',
      name: '深蹲',
      type: 'functional',
      difficulty: 'intermediate',
      targetMuscles: ['股四头肌', '臀大肌', '腘绳肌'],
      instructions: [
        '双脚与肩同宽站立',
        '保持背部挺直，慢慢下蹲',
        '下蹲至大腿与地面平行',
        '用脚跟发力站起'
      ],
      videoUrl: 'https://example.com/squat.mp4'
    },
    {
      id: 'ex-2',
      name: '平板支撑',
      type: 'bodyweight',
      difficulty: 'beginner',
      targetMuscles: ['核心肌群', '肩部', '背部'],
      instructions: [
        '俯卧，肘部支撑地面',
        '身体保持一条直线',
        '收紧核心，保持30-60秒'
      ]
    },
    {
      id: 'ex-3',
      name: '桥式',
      type: 'posture',
      difficulty: 'beginner',
      targetMuscles: ['臀大肌', '下背部'],
      instructions: [
        '仰卧，膝盖弯曲',
        '抬起臀部，形成桥形',
        '保持2-3秒，然后慢慢放下'
      ]
    }
  ]

  // 开发环境下的模拟实现
  Object.assign(exerciseService, {
    async getExerciseLibrary() {
      return mockExerciseLibrary
    },

    async searchExercises(query: string, type?: string) {
      let results = mockExerciseLibrary.filter(exercise =>
        exercise.name.toLowerCase().includes(query.toLowerCase()) ||
        exercise.targetMuscles.some(muscle => muscle.toLowerCase().includes(query.toLowerCase()))
      )

      if (type) {
        results = results.filter(exercise => exercise.type === type)
      }

      return results
    }
  })
}
