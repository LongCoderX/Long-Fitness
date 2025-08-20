import { defineStore } from 'pinia'
import { NutritionRecord, FoodItem, MealType, DailyNutritionSummary } from '@/types/nutrition.types'
import { nutritionService } from '@/services/nutrition.service'

export const useNutritionStore = defineStore('nutrition', {
  state: (): {
    nutritionRecords: NutritionRecord[]
    foodDatabase: FoodItem[]
    dailySummary: DailyNutritionSummary | null
    isLoading: boolean
    selectedDate: Date
  } => ({
    nutritionRecords: [],
    foodDatabase: [],
    dailySummary: null,
    isLoading: false,
    selectedDate: new Date()
  }),

  actions: {
    async loadNutritionRecords(date?: Date) {
      this.isLoading = true
      try {
        const targetDate = date || this.selectedDate
        const records = await nutritionService.getNutritionRecords(targetDate)
        this.nutritionRecords = records
        this.selectedDate = targetDate
        await this.calculateDailySummary()
      } catch (error) {
        console.error('Failed to load nutrition records:', error)
      } finally {
        this.isLoading = false
      }
    },

    async addNutritionRecord(record: Omit<NutritionRecord, 'id' | 'createdAt' | 'updatedAt'>) {
      try {
        const newRecord = await nutritionService.createNutritionRecord(record)
        this.nutritionRecords.push(newRecord)
        await this.calculateDailySummary()
        return newRecord
      } catch (error) {
        console.error('Failed to add nutrition record:', error)
        throw error
      }
    },

    async updateNutritionRecord(id: string, updates: Partial<NutritionRecord>) {
      try {
        const updatedRecord = await nutritionService.updateNutritionRecord(id, updates)
        const index = this.nutritionRecords.findIndex(record => record.id === id)
        if (index !== -1) {
          this.nutritionRecords[index] = updatedRecord
        }
        await this.calculateDailySummary()
        return updatedRecord
      } catch (error) {
        console.error('Failed to update nutrition record:', error)
        throw error
      }
    },

    async deleteNutritionRecord(id: string) {
      try {
        await nutritionService.deleteNutritionRecord(id)
        this.nutritionRecords = this.nutritionRecords.filter(record => record.id !== id)
        await this.calculateDailySummary()
      } catch (error) {
        console.error('Failed to delete nutrition record:', error)
        throw error
      }
    },

    async loadTodayNutrition() {
      this.isLoading = true
      try {
        // 加载今日营养数据
        const today = new Date()
        const records = await nutritionService.getNutritionRecords(today)
        this.nutritionRecords = records
        this.selectedDate = today
        await this.calculateDailySummary()
      } catch (error) {
        console.error('Failed to load today nutrition data:', error)
      } finally {
        this.isLoading = false
      }
    },

    async loadFoodDatabase() {
      try {
        this.foodDatabase = await nutritionService.getFoodDatabase()
      } catch (error) {
        console.error('Failed to load food database:', error)
      }
    },

    async searchFoodItems(query: string): Promise<FoodItem[]> {
      try {
        return await nutritionService.searchFoodItems(query)
      } catch (error) {
        console.error('Failed to search food items:', error)
        return []
      }
    },

    async calculateDailySummary() {
      const totalCalories = this.nutritionRecords.reduce((sum: number, record: NutritionRecord) => sum + record.calories, 0)
      const totalProtein = this.nutritionRecords.reduce((sum: number, record: NutritionRecord) => sum + record.protein, 0)
      const totalCarbs = this.nutritionRecords.reduce((sum: number, record: NutritionRecord) => sum + record.carbs, 0)
      const totalFat = this.nutritionRecords.reduce((sum: number, record: NutritionRecord) => sum + record.fat, 0)

      this.dailySummary = {
        date: this.selectedDate,
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat,
        mealCount: this.nutritionRecords.length,
        goalCompletion: this.calculateGoalCompletion(totalCalories, totalProtein, totalCarbs, totalFat)
      }
    },

    calculateGoalCompletion(calories: number, protein: number, carbs: number, fat: number): {
      calories: number
      protein: number
      carbs: number
      fat: number
      overall: number
    } {
      // 这里需要从user store获取用户的目标值
      const calorieGoal = 1800 // 示例值，实际应从user store获取
      const proteinGoal = 120 // 示例值
      const carbGoal = 200 // 示例值
      const fatGoal = 60 // 示例值

      return {
        calories: Math.min(calories / calorieGoal, 1),
        protein: Math.min(protein / proteinGoal, 1),
        carbs: Math.min(carbs / carbGoal, 1),
        fat: Math.min(fat / fatGoal, 1),
        overall: (calories / calorieGoal + protein / proteinGoal + carbs / carbGoal + fat / fatGoal) / 4
      }
    },

    getRecordsByMealType(mealType: MealType) {
      return this.nutritionRecords.filter(record => record.mealType === mealType)
    },

    getRecentRecords(limit: number = 5) {
      return [...this.nutritionRecords]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit)
    }
  },

  getters: {
    breakfastRecords: (state) => state.nutritionRecords.filter(record => record.mealType === MealType.Breakfast),
    lunchRecords: (state) => state.nutritionRecords.filter(record => record.mealType === MealType.Lunch),
    dinnerRecords: (state) => state.nutritionRecords.filter(record => record.mealType === MealType.Dinner),
    snackRecords: (state) => state.nutritionRecords.filter(record => record.mealType === MealType.Snack),

    todayCalories: (state) => state.dailySummary?.totalCalories || 0,
    todayProtein: (state) => state.dailySummary?.totalProtein || 0,
    todayCarbs: (state) => state.dailySummary?.totalCarbs || 0,
    todayFat: (state) => state.dailySummary?.totalFat || 0,

    hasRecords: (state) => state.nutritionRecords.length > 0,
    isLoadingData: (state) => state.isLoading
  }
})
