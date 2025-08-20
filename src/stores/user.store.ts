import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  username: string
  email: string
  age: number
  weight: number // 公斤
  height: number // 厘米
  gender: 'male' | 'female'
  fitnessGoal: 'weightLoss' | 'maintenance' | 'muscleGain' | 'healthImprovement'
  createdAt: Date
  updatedAt: Date
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  notifications: boolean
  measurementUnit: 'metric' | 'imperial'
  language: string
  weeklyReport: boolean
  dailyReminders: boolean
}

export const useUserStore = defineStore('user', () => {
  // 状态
  const currentUser = ref<User | null>(null)
  const preferences = ref<UserPreferences>({
    theme: 'light',
    notifications: true,
    measurementUnit: 'metric',
    language: 'zh-CN',
    weeklyReport: true,
    dailyReminders: true
  })
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getter
  const isLoggedIn = computed(() => currentUser.value !== null)
  const userProfile = computed(() => currentUser.value)
  const userPreferences = computed(() => preferences.value)

  // 计算每日热量目标
  const dailyCalorieTarget = computed(() => {
    if (!currentUser.value) return null

    const user = currentUser.value
    const bmr = calculateBMR(user)
    const activityLevel = 1.55 // 中等活动水平

    let targetCalories: number
    switch (user.fitnessGoal) {
      case 'weightLoss':
        targetCalories = bmr * activityLevel - 500
        break
      case 'muscleGain':
        targetCalories = bmr * activityLevel + 300
        break
      case 'healthImprovement':
      case 'maintenance':
      default:
        targetCalories = bmr * activityLevel
        break
    }

    return {
      total: Math.round(targetCalories),
      protein: Math.round(targetCalories * 0.3 / 4), // 30%蛋白质
      carbs: Math.round(targetCalories * 0.4 / 4),   // 40%碳水
      fat: Math.round(targetCalories * 0.3 / 9)      // 30%脂肪
    }
  })

  // 计算基础代谢率 (BMR)
  function calculateBMR(user: User): number {
    // Mifflin-St Jeor公式
    if (user.gender === 'male') {
      return 10 * user.weight + 6.25 * user.height - 5 * user.age + 5
    } else {
      return 10 * user.weight + 6.25 * user.height - 5 * user.age - 161
    }
  }

  // Action
  async function loadUserProfile() {
    isLoading.value = true
    error.value = null
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 模拟用户数据
      currentUser.value = {
        id: 'user-123',
        username: '测试用户',
        email: 'test@example.com',
        age: 30,
        weight: 70,
        height: 175,
        gender: 'male',
        fitnessGoal: 'weightLoss',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date()
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载用户信息失败'
      console.error('Failed to load user profile:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function updatePreferences(newPreferences: Partial<UserPreferences>) {
    preferences.value = { ...preferences.value, ...newPreferences }
    // 这里可以添加保存到后端的逻辑
    console.log('Preferences updated:', preferences.value)
  }

  async function updateProfile(updates: Partial<User>) {
    if (!currentUser.value) return
    
    currentUser.value = { ...currentUser.value, ...updates, updatedAt: new Date() }
    // 这里可以添加保存到后端的逻辑
    console.log('Profile updated:', currentUser.value)
  }

  async function logout() {
    currentUser.value = null
    preferences.value = {
      theme: 'light',
      notifications: true,
      measurementUnit: 'metric',
      language: 'zh-CN',
      weeklyReport: true,
      dailyReminders: true
    }
  }

  return {
    // State
    currentUser,
    preferences,
    isLoading,
    error,
    
    // Getter
    isLoggedIn,
    userProfile,
    userPreferences,
    dailyCalorieTarget,
    
    // Action
    loadUserProfile,
    updatePreferences,
    updateProfile,
    logout
  }
})
