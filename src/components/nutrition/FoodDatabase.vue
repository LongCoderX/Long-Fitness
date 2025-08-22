<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { nutritionService } from '@/services/nutrition.service'
import type { FoodItem } from '@/types/nutrition.types'
import FoodCard from './FoodCard.vue'
import FoodSearch from './FoodSearch.vue'

// 状态管理
const foodItems = ref<FoodItem[]>([])
const filteredItems = ref<FoodItem[]>([])
const isLoading = ref(false)
const searchQuery = ref('')
const selectedCategory = ref<string>('all')
const viewMode = ref<'grid' | 'list'>('grid')

// 分类选项
const categories = computed(() => {
  const allCategories = Array.from(new Set(foodItems.value.map(item => item.category)))
  return [
    { value: 'all', label: '全部分类' },
    ...allCategories.map(category => ({ value: category, label: category }))
  ]
})

// 加载食物数据
const loadFoodData = async () => {
  isLoading.value = true
  try {
    foodItems.value = await nutritionService.getFoodDatabase()
    filteredItems.value = foodItems.value
  } catch (error) {
    console.error('Failed to load food data:', error)
  } finally {
    isLoading.value = false
  }
}

// 搜索食物
const handleSearch = async (query: string) => {
  searchQuery.value = query
  if (query.trim()) {
    filteredItems.value = await nutritionService.searchFoodItems(query)
  } else {
    applyFilters()
  }
}

// 清除搜索
const handleClearSearch = () => {
  searchQuery.value = ''
  applyFilters()
}

// 应用筛选条件
const applyFilters = () => {
  let result = [...foodItems.value]
  
  // 分类筛选
  if (selectedCategory.value !== 'all') {
    result = result.filter(item => item.category === selectedCategory.value)
  }
  
  filteredItems.value = result
}

// 切换视图模式
const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
}

// 处理食物卡片事件
const handleAddToMeal = (food: FoodItem) => {
  console.log('添加到餐食:', food.name)
  // 实现添加到餐食的逻辑
}

const handleViewDetails = (food: FoodItem) => {
  console.log('查看详情:', food.name)
  // 实现查看详情的逻辑
}

const handleToggleFavorite = (food: FoodItem) => {
  console.log('切换收藏:', food.name)
  // 实现收藏功能的逻辑
}

// 初始化加载
onMounted(() => {
  loadFoodData()
})

// 监听分类变化
watch(selectedCategory, applyFilters)
</script>

<template>
  <div class="food-database">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>🍎 食物数据库</h1>
      <p class="subtitle">探索丰富的食物营养信息，管理您的饮食记录</p>
    </div>

    <!-- 搜索和筛选工具栏 -->
    <div class="toolbar">
      <!-- 搜索框 -->
      <div class="search-section">
        <FoodSearch
          :placeholder="'搜索食物名称、类别或营养标签...'"
          @search="handleSearch"
          @clear="handleClearSearch"
        />
      </div>

      <!-- 筛选选项 -->
      <div class="filter-section">
        <div class="filter-group">
          <label for="category-filter">分类：</label>
          <select
            id="category-filter"
            v-model="selectedCategory"
            class="filter-select"
          >
            <option
              v-for="category in categories"
              :key="category.value"
              :value="category.value"
            >
              {{ category.label }}
            </option>
          </select>
        </div>

        <!-- 视图切换 -->
        <div class="view-toggle">
          <button
            class="view-btn"
            :class="{ active: viewMode === 'grid' }"
            @click="viewMode = 'grid'"
            aria-label="网格视图"
          >
            ▢
          </button>
          <button
            class="view-btn"
            :class="{ active: viewMode === 'list' }"
            @click="viewMode = 'list'"
            aria-label="列表视图"
          >
            ≡
          </button>
        </div>
      </div>
    </div>

    <!-- 结果统计 -->
    <div class="results-info">
      <span class="results-count">
        共找到 {{ filteredItems.length }} 种食物
        <span v-if="searchQuery">（搜索关键词："{{ searchQuery }}"）</span>
        <span v-if="selectedCategory !== 'all'">（分类：{{ selectedCategory }}）</span>
      </span>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>正在加载食物数据...</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="filteredItems.length === 0" class="empty-state">
      <div class="empty-icon">🍽️</div>
      <h3>没有找到匹配的食物</h3>
      <p v-if="searchQuery">尝试调整搜索关键词或筛选条件</p>
      <p v-else>食物数据库为空，请添加食物数据</p>
    </div>

    <!-- 食物列表 -->
    <div v-else class="food-content">
      <!-- 网格视图 -->
      <div
        v-if="viewMode === 'grid'"
        class="food-grid"
        :class="`view-${viewMode}`"
      >
        <FoodCard
          v-for="food in filteredItems"
          :key="food.id"
          :food="food"
          @add-to-meal="handleAddToMeal"
          @view-details="handleViewDetails"
          @toggle-favorite="handleToggleFavorite"
        />
      </div>

      <!-- 列表视图 -->
      <div
        v-else
        class="food-list"
        :class="`view-${viewMode}`"
      >
        <FoodCard
          v-for="food in filteredItems"
          :key="food.id"
          :food="food"
          @add-to-meal="handleAddToMeal"
          @view-details="handleViewDetails"
          @toggle-favorite="handleToggleFavorite"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.food-database {
  padding: var(--spacing-xl);
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.page-header h1 {
  font-size: 2.5rem;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.subtitle {
  font-size: 1.1rem;
  color: var(--color-text-secondary);
}

/* 工具栏 */
.toolbar {
  background: var(--color-background-primary);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-lg);
  border: 1px solid var(--color-border-primary);
}

.search-section {
  margin-bottom: var(--spacing-lg);
}

.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.filter-group label {
  font-weight: 600;
  color: var(--color-text-primary);
  white-space: nowrap;
}

.filter-select {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--border-radius-md);
  background: var(--color-background-primary);
  font-size: var(--font-size-body);
  min-width: 120px;
}

.filter-select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.view-toggle {
  display: flex;
  background: var(--color-background-secondary);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-xs);
}

.view-btn {
  padding: var(--spacing-sm);
  border: none;
  background: none;
  cursor: pointer;
  border-radius: var(--border-radius-sm);
  font-size: 1.2rem;
  transition: all 0.2s ease;
}

.view-btn:hover {
  background: var(--color-background-tertiary);
}

.view-btn.active {
  background: var(--color-primary);
  color: white;
}

/* 结果信息 */
.results-info {
  margin-bottom: var(--spacing-lg);
}

.results-count {
  color: var(--color-text-secondary);
  font-size: var(--font-size-body);
}

/* 加载状态 */
.loading-state {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-secondary);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border-primary);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--spacing-md);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: var(--spacing-xl);
  background: var(--color-background-primary);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--color-border-primary);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
}

.empty-state h3 {
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.empty-state p {
  color: var(--color-text-secondary);
  margin: 0;
}

/* 食物内容 */
.food-content {
  margin-bottom: var(--spacing-xl);
}

/* 网格视图 */
.food-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

/* 列表视图 */
.food-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.food-list .food-card {
  flex-direction: row;
  align-items: center;
  padding: var(--spacing-md);
}

.food-list .food-header {
  flex: 1;
  margin-bottom: 0;
  margin-right: var(--spacing-md);
}

.food-list .nutrition-info {
  display: none;
}

.food-list .food-tags {
  margin-bottom: 0;
  margin-right: var(--spacing-md);
}

.food-list .food-actions {
  margin-top: 0;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .food-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .food-database {
    padding: var(--spacing-md);
  }
  
  .toolbar {
    padding: var(--spacing-md);
  }
  
  .filter-section {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-md);
  }
  
  .filter-group {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group label {
    margin-bottom: var(--spacing-xs);
  }
  
  .food-grid {
    grid-template-columns: 1fr;
  }
  
  .food-list .food-card {
    flex-direction: column;
    align-items: stretch;
  }
  
  .food-list .food-header {
    margin-right: 0;
    margin-bottom: var(--spacing-md);
  }
  
  .food-list .food-tags {
    margin-right: 0;
    margin-bottom: var(--spacing-md);
  }
}
</style>
