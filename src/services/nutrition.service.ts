import { invoke } from '@tauri-apps/api/core'
import { NutritionRecord, FoodItem } from '../types/nutrition.types'

export const nutritionService = {
  // 获取营养记录
  async getNutritionRecords(date: Date): Promise<NutritionRecord[]> {
    try {
      return await invoke('get_nutrition_records', { date: date.toISOString() })
    } catch (error) {
      console.error('Failed to get nutrition records:', error)
      return []
    }
  },

  // 创建营养记录
  async createNutritionRecord(record: Omit<NutritionRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<NutritionRecord> {
    try {
      return await invoke('create_nutrition_record', { record })
    } catch (error) {
      console.error('Failed to create nutrition record:', error)
      throw error
    }
  },

  // 更新营养记录
  async updateNutritionRecord(id: string, updates: Partial<NutritionRecord>): Promise<NutritionRecord> {
    try {
      return await invoke('update_nutrition_record', { id, updates })
    } catch (error) {
      console.error('Failed to update nutrition record:', error)
      throw error
    }
  },

  // 删除营养记录
  async deleteNutritionRecord(id: string): Promise<void> {
    try {
      await invoke('delete_nutrition_record', { id })
    } catch (error) {
      console.error('Failed to delete nutrition record:', error)
      throw error
    }
  },

  // 获取食物数据库
  async getFoodDatabase(): Promise<FoodItem[]> {
    try {
      return await invoke('get_food_database')
    } catch (error) {
      console.error('Failed to get food database:', error)
      return []
    }
  },

  // 搜索食物项
  async searchFoodItems(query: string, limit: number = 20): Promise<FoodItem[]> {
    try {
      return await invoke('search_food_items', { query, limit })
    } catch (error) {
      console.error('Failed to search food items:', error)
      return []
    }
  },

  // 获取餐厅建议
  async getRestaurantRecommendations(restaurantType: string): Promise<{
    recommended: string[]
    avoid: string[]
    tips: string[]
  }> {
    try {
      return await invoke('get_restaurant_recommendations', { restaurantType })
    } catch (error) {
      console.error('Failed to get restaurant recommendations:', error)
      return { recommended: [], avoid: [], tips: [] }
    }
  },

  // 计算营养成分
  async calculateNutrition(foodName: string, quantity: number, unit: string): Promise<{
    calories: number
    protein: number
    carbs: number
    fat: number
  }> {
    try {
      return await invoke('calculate_nutrition', { foodName, quantity, unit })
    } catch (error) {
      console.error('Failed to calculate nutrition:', error)
      return { calories: 0, protein: 0, carbs: 0, fat: 0 }
    }
  },

  // 获取今日营养摘要
  async getTodayNutritionSummary(): Promise<{
    totalCalories: number
    totalProtein: number
    totalCarbs: number
    totalFat: number
    mealCount: number
  }> {
    try {
      return await invoke('get_today_nutrition_summary')
    } catch (error) {
      console.error('Failed to get today nutrition summary:', error)
      return { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, mealCount: 0 }
    }
  },

  // 导出营养数据
  async exportNutritionData(startDate: Date, endDate: Date, format: 'csv' | 'json' = 'csv'): Promise<string> {
    try {
      return await invoke('export_nutrition_data', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        format
      })
    } catch (error) {
      console.error('Failed to export nutrition data:', error)
      throw error
    }
  }
}

// 模拟数据（开发环境使用）
if (import.meta.env.DEV) {
  // 模拟食物数据库
  const mockFoodDatabase: FoodItem[] = [
    {
      id: '1',
      name: '鸡胸肉',
      servingSize: '100g',
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      category: '肉类',
      tags: ['高蛋白', '低脂肪']
    },
    {
      id: '2',
      name: '糙米',
      servingSize: '100g',
      calories: 111,
      protein: 2.6,
      carbs: 23,
      fat: 0.9,
      category: '谷物',
      tags: ['碳水化合物', '纤维']
    },
    {
      id: '3',
      name: '西兰花',
      servingSize: '100g',
      calories: 34,
      protein: 2.8,
      carbs: 7,
      fat: 0.4,
      category: '蔬菜',
      tags: ['低热量', '高纤维']
    },
    {
      id: '4',
      name: '鸡蛋',
      servingSize: '1个',
      calories: 78,
      protein: 6.3,
      carbs: 0.6,
      fat: 5.3,
      category: '蛋类',
      tags: ['高蛋白', '营养丰富']
    },
    {
      id: '5',
      name: '牛奶',
      servingSize: '250ml',
      calories: 150,
      protein: 8,
      carbs: 12,
      fat: 8,
      category: '乳制品',
      tags: ['钙质', '蛋白质']
    }
  ]

  // 开发环境下的模拟实现
  Object.assign(nutritionService, {
    async getFoodDatabase(): Promise<FoodItem[]> {
      return mockFoodDatabase
    },

    async searchFoodItems(query: string): Promise<FoodItem[]> {
      return mockFoodDatabase.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
    }
  })
}
