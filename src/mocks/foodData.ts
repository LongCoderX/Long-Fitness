import type { FoodItem } from '@/types/nutrition.types'

// 扩展的模拟食物数据库
export const mockFoodDatabase: FoodItem[] = [
  // 肉类
  {
    id: '1',
    name: '鸡胸肉',
    servingSize: '100g',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    sugar: 0,
    sodium: 74,
    category: '肉类',
    tags: ['高蛋白', '低脂肪', '健身食品']
  },
  {
    id: '2',
    name: '牛肉（瘦）',
    servingSize: '100g',
    calories: 250,
    protein: 26,
    carbs: 0,
    fat: 15,
    fiber: 0,
    sugar: 0,
    sodium: 72,
    category: '肉类',
    tags: ['高蛋白', '铁质', '饱腹感强']
  },
  {
    id: '3',
    name: '三文鱼',
    servingSize: '100g',
    calories: 208,
    protein: 20,
    carbs: 0,
    fat: 13,
    fiber: 0,
    sugar: 0,
    sodium: 59,
    category: '海鲜',
    tags: ['Omega-3', '高蛋白', '健康脂肪']
  },

  // 谷物类
  {
    id: '4',
    name: '糙米',
    servingSize: '100g（熟）',
    calories: 111,
    protein: 2.6,
    carbs: 23,
    fat: 0.9,
    fiber: 1.8,
    sugar: 0.4,
    sodium: 5,
    category: '谷物',
    tags: ['碳水化合物', '纤维', '低GI']
  },
  {
    id: '5',
    name: '燕麦片',
    servingSize: '40g（干）',
    calories: 150,
    protein: 5,
    carbs: 27,
    fat: 3,
    fiber: 4,
    sugar: 1,
    sodium: 2,
    category: '谷物',
    tags: ['高纤维', '饱腹感', '早餐优选']
  },
  {
    id: '6',
    name: '全麦面包',
    servingSize: '1片（28g）',
    calories: 69,
    protein: 3.6,
    carbs: 12,
    fat: 1.1,
    fiber: 1.9,
    sugar: 1.6,
    sodium: 132,
    category: '谷物',
    tags: ['全谷物', '纤维', '低脂']
  },

  // 蔬菜类
  {
    id: '7',
    name: '西兰花',
    servingSize: '100g',
    calories: 34,
    protein: 2.8,
    carbs: 7,
    fat: 0.4,
    fiber: 2.6,
    sugar: 1.7,
    sodium: 33,
    category: '蔬菜',
    tags: ['低热量', '高纤维', '维生素C']
  },
  {
    id: '8',
    name: '菠菜',
    servingSize: '100g',
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    fiber: 2.2,
    sugar: 0.4,
    sodium: 79,
    category: '蔬菜',
    tags: ['高铁', '低热量', '维生素K']
  },
  {
    id: '9',
    name: '胡萝卜',
    servingSize: '100g',
    calories: 41,
    protein: 0.9,
    carbs: 10,
    fat: 0.2,
    fiber: 2.8,
    sugar: 4.7,
    sodium: 69,
    category: '蔬菜',
    tags: ['β-胡萝卜素', '维生素A', '低脂肪']
  },

  // 水果类
  {
    id: '10',
    name: '苹果',
    servingSize: '1个中等（182g）',
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fat: 0.3,
    fiber: 4.4,
    sugar: 19,
    sodium: 2,
    category: '水果',
    tags: ['纤维', '抗氧化', '低热量']
  },
  {
    id: '11',
    name: '香蕉',
    servingSize: '1根中等（118g）',
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    fiber: 3.1,
    sugar: 14,
    sodium: 1,
    category: '水果',
    tags: ['钾元素', '能量来源', '易消化']
  },
  {
    id: '12',
    name: '蓝莓',
    servingSize: '100g',
    calories: 57,
    protein: 0.7,
    carbs: 14,
    fat: 0.3,
    fiber: 2.4,
    sugar: 10,
    sodium: 1,
    category: '水果',
    tags: ['抗氧化', '低糖', '维生素C']
  },

  // 乳制品
  {
    id: '13',
    name: '牛奶',
    servingSize: '250ml',
    calories: 150,
    protein: 8,
    carbs: 12,
    fat: 8,
    fiber: 0,
    sugar: 12,
    sodium: 120,
    category: '乳制品',
    tags: ['钙质', '蛋白质', '维生素D']
  },
  {
    id: '14',
    name: '希腊酸奶',
    servingSize: '150g',
    calories: 100,
    protein: 10,
    carbs: 6,
    fat: 5,
    fiber: 0,
    sugar: 4,
    sodium: 65,
    category: '乳制品',
    tags: ['高蛋白', '益生菌', '低糖']
  },
  {
    id: '15',
    name: '奶酪',
    servingSize: '30g',
    calories: 110,
    protein: 7,
    carbs: 1,
    fat: 9,
    fiber: 0,
    sugar: 0,
    sodium: 180,
    category: '乳制品',
    tags: ['钙质', '高蛋白', '高脂肪']
  },

  // 蛋类
  {
    id: '16',
    name: '鸡蛋',
    servingSize: '1个（50g）',
    calories: 78,
    protein: 6.3,
    carbs: 0.6,
    fat: 5.3,
    fiber: 0,
    sugar: 0.6,
    sodium: 62,
    category: '蛋类',
    tags: ['高蛋白', '营养全面', '早餐优选']
  },

  // 豆类
  {
    id: '17',
    name: '豆腐',
    servingSize: '100g',
    calories: 76,
    protein: 8,
    carbs: 2,
    fat: 4,
    fiber: 1,
    sugar: 1,
    sodium: 7,
    category: '豆类',
    tags: ['植物蛋白', '低热量', '素食']
  },
  {
    id: '18',
    name: '黑豆',
    servingSize: '100g（熟）',
    calories: 132,
    protein: 9,
    carbs: 24,
    fat: 0.5,
    fiber: 8,
    sugar: 0,
    sodium: 5,
    category: '豆类',
    tags: ['高纤维', '植物蛋白', '铁质']
  },

  // 坚果类
  {
    id: '19',
    name: '杏仁',
    servingSize: '30g',
    calories: 170,
    protein: 6,
    carbs: 6,
    fat: 15,
    fiber: 3,
    sugar: 1,
    sodium: 0,
    category: '坚果',
    tags: ['健康脂肪', '维生素E', '饱腹感']
  },
  {
    id: '20',
    name: '核桃',
    servingSize: '30g',
    calories: 185,
    protein: 4,
    carbs: 4,
    fat: 18,
    fiber: 2,
    sugar: 1,
    sodium: 1,
    category: '坚果',
    tags: ['Omega-3', '抗氧化', '健脑食品']
  },

  // 饮料类
  {
    id: '21',
    name: '绿茶',
    servingSize: '250ml',
    calories: 2,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 7,
    category: '饮料',
    tags: ['抗氧化', '零热量', '提神']
  },
  {
    id: '22',
    name: '黑咖啡',
    servingSize: '250ml',
    calories: 2,
    protein: 0.3,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 5,
    category: '饮料',
    tags: ['零热量', '提神', '抗氧化']
  },

  // 调味品类
  {
    id: '23',
    name: '橄榄油',
    servingSize: '15ml',
    calories: 120,
    protein: 0,
    carbs: 0,
    fat: 14,
    fiber: 0,
    sugar: 0,
    sodium: 0,
    category: '调味品',
    tags: ['健康脂肪', '单不饱和脂肪酸', '烹饪用油']
  },
  {
    id: '24',
    name: '蜂蜜',
    servingSize: '15ml',
    calories: 64,
    protein: 0.1,
    carbs: 17,
    fat: 0,
    fiber: 0,
    sugar: 17,
    sodium: 1,
    category: '调味品',
    tags: ['天然甜味剂', '能量来源', '抗菌']
  },

  // 零食类
  {
    id: '25',
    name: '黑巧克力（70%）',
    servingSize: '30g',
    calories: 170,
    protein: 2,
    carbs: 13,
    fat: 12,
    fiber: 3,
    sugar: 7,
    sodium: 6,
    category: '零食',
    tags: ['抗氧化', '健康零食', '适量食用']
  }
]

// 食物搜索函数
export const searchFoodItems = (query: string, limit: number = 50): FoodItem[] => {
  const lowerQuery = query.toLowerCase()
  return mockFoodDatabase
    .filter(item =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.category.toLowerCase().includes(lowerQuery) ||
      item.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      (item.brand && item.brand.toLowerCase().includes(lowerQuery))
    )
    .slice(0, limit)
}

// 按分类获取食物
export const getFoodsByCategory = (category: string): FoodItem[] => {
  if (category === 'all') {
    return mockFoodDatabase
  }
  return mockFoodDatabase.filter(item => item.category === category)
}

// 获取所有分类
export const getAllCategories = (): string[] => {
  return Array.from(new Set(mockFoodDatabase.map(item => item.category))).sort()
}

// 获取热门标签
export const getPopularTags = (limit: number = 10): string[] => {
  const tagCounts: Record<string, number> = {}
  
  mockFoodDatabase.forEach(item => {
    item.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })
  
  return Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([tag]) => tag)
}

// 获取营养范围
export const getNutritionRange = () => {
  const calories = mockFoodDatabase.map(item => item.calories)
  const protein = mockFoodDatabase.map(item => item.protein)
  const carbs = mockFoodDatabase.map(item => item.carbs)
  const fat = mockFoodDatabase.map(item => item.fat)
  
  return {
    calories: {
      min: Math.min(...calories),
      max: Math.max(...calories),
      avg: Math.round(calories.reduce((a, b) => a + b, 0) / calories.length)
    },
    protein: {
      min: Math.min(...protein),
      max: Math.max(...protein),
      avg: Math.round(protein.reduce((a, b) => a + b, 0) / protein.length * 10) / 10
    },
    carbs: {
      min: Math.min(...carbs),
      max: Math.max(...carbs),
      avg: Math.round(carbs.reduce((a, b) => a + b, 0) / carbs.length * 10) / 10
    },
    fat: {
      min: Math.min(...fat),
      max: Math.max(...fat),
      avg: Math.round(fat.reduce((a, b) => a + b, 0) / fat.length * 10) / 10
    }
  }
}

// 导出接口，便于后期网络数据替换
export interface FoodDataService {
  getFoodDatabase: () => Promise<FoodItem[]>
  searchFoodItems: (query: string, limit?: number) => Promise<FoodItem[]>
  getFoodsByCategory: (category: string) => Promise<FoodItem[]>
  getAllCategories: () => Promise<string[]>
  getPopularTags: (limit?: number) => Promise<string[]>
  getNutritionRange: () => Promise<ReturnType<typeof getNutritionRange>>
}

// 当前使用的模拟服务
export const currentFoodService: FoodDataService = {
  getFoodDatabase: async () => mockFoodDatabase,
  searchFoodItems: async (query: string, limit = 50) => searchFoodItems(query, limit),
  getFoodsByCategory: async (category: string) => getFoodsByCategory(category),
  getAllCategories: async () => getAllCategories(),
  getPopularTags: async (limit = 10) => getPopularTags(limit),
  getNutritionRange: async () => getNutritionRange()
}
