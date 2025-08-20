export enum MealType {
  Breakfast = 'breakfast',
  Lunch = 'lunch',
  Dinner = 'dinner',
  Snack = 'snack'
}

export interface FoodItem {
  id: string
  name: string
  brand?: string
  servingSize: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
  sugar?: number
  sodium?: number
  category: string
  tags: string[]
}

export interface NutritionRecord {
  id: string
  userId: string
  foodItemId?: string
  foodName: string
  mealType: MealType
  servingSize: string
  quantity: number
  calories: number
  protein: number
  carbs: number
  fat: number
  notes?: string
  recordedAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface DailyNutritionSummary {
  date: Date
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  mealCount: number
  goalCompletion: {
    calories: number
    protein: number
    carbs: number
    fat: number
    overall: number
  }
}

export interface NutritionGoal {
  dailyCalories: number
  dailyProtein: number
  dailyCarbs: number
  dailyFat: number
  mealFrequency: number
  waterIntake: number
}

export interface RestaurantRecommendation {
  restaurantType: string
  recommendedDishes: string[]
  avoidDishes: string[]
  portionControlTips: string[]
}

export interface FoodSearchResult {
  items: FoodItem[]
  totalCount: number
  hasMore: boolean
}
