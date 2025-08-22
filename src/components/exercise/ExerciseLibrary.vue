<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { mockExercises, type Exercise, getExercisesByCategory, getExercisesByDifficulty, searchExercises } from '@/mocks/exerciseData'
import ExerciseCard from './ExerciseCard.vue'

// 筛选状态
const selectedCategory = ref<Exercise['category'] | 'all'>('all')
const selectedDifficulty = ref<Exercise['difficulty'] | 'all'>('all')
const searchKeyword = ref('')

// 分类选项
const categoryOptions = [
  { value: 'all', label: '全部分类' },
  { value: 'functional', label: '功能性训练' },
  { value: 'bodyweight', label: '自重训练' },
  { value: 'posture', label: '体态纠正' }
]

// 难度选项
const difficultyOptions = [
  { value: 'all', label: '全部难度' },
  { value: 'beginner', label: '初级' },
  { value: 'intermediate', label: '中级' },
  { value: 'advanced', label: '高级' }
]

// 筛选后的动作列表
const filteredExercises = computed(() => {
  let exercises = [...mockExercises]

  // 按分类筛选
  if (selectedCategory.value !== 'all') {
    exercises = getExercisesByCategory(selectedCategory.value as Exercise['category'])
  }

  // 按难度筛选
  if (selectedDifficulty.value !== 'all') {
    exercises = exercises.filter(exercise => 
      exercise.difficulty === selectedDifficulty.value
    )
  }

  // 关键词搜索
  if (searchKeyword.value.trim()) {
    exercises = searchExercises(searchKeyword.value.trim())
  }

  return exercises
})

// 空状态显示
const isEmpty = computed(() => filteredExercises.value.length === 0)

// 处理动作卡片点击
const handleExerciseClick = (exercise: Exercise) => {
  console.log('点击动作:', exercise.name)
  // 这里可以打开详情模态框或跳转到详情页
}

// 重置筛选
const resetFilters = () => {
  selectedCategory.value = 'all'
  selectedDifficulty.value = 'all'
  searchKeyword.value = ''
}

onMounted(() => {
  console.log('动作库组件加载完成，共加载动作:', mockExercises.length)
})
</script>

<template>
  <div class="exercise-library">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>🏃 动作库</h1>
      <p class="subtitle">探索各种训练动作，找到适合您的练习方式</p>
    </div>

    <!-- 筛选工具栏 -->
    <div class="filter-toolbar">
      <!-- 搜索框 -->
      <div class="search-box">
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="搜索动作名称、描述或目标肌群..."
          class="search-input"
        />
        <span class="search-icon">🔍</span>
      </div>

      <!-- 筛选选项 -->
      <div class="filter-options">
        <div class="filter-group">
          <label for="category-filter">分类：</label>
          <select 
            id="category-filter"
            v-model="selectedCategory"
            class="filter-select"
          >
            <option 
              v-for="option in categoryOptions" 
              :key="option.value" 
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label for="difficulty-filter">难度：</label>
          <select 
            id="difficulty-filter"
            v-model="selectedDifficulty"
            class="filter-select"
          >
            <option 
              v-for="option in difficultyOptions" 
              :key="option.value" 
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>

        <button 
          class="reset-btn"
          @click="resetFilters"
          :disabled="selectedCategory === 'all' && selectedDifficulty === 'all' && !searchKeyword"
        >
          重置筛选
        </button>
      </div>
    </div>

    <!-- 结果统计 -->
    <div class="results-info">
      <span class="results-count">
        共找到 {{ filteredExercises.length }} 个动作
        <span v-if="searchKeyword">（搜索关键词："{{ searchKeyword }}"）</span>
      </span>
    </div>

    <!-- 动作列表 -->
    <div v-if="!isEmpty" class="exercises-grid">
      <ExerciseCard
        v-for="exercise in filteredExercises"
        :key="exercise.id"
        :exercise="exercise"
        :show-details="true"
        @click="handleExerciseClick"
        class="exercise-item"
      />
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <div class="empty-icon">📝</div>
      <h3>没有找到匹配的动作</h3>
      <p>尝试调整筛选条件或搜索关键词</p>
      <button class="reset-empty-btn" @click="resetFilters">
        重置所有筛选
      </button>
    </div>
  </div>
</template>

<style scoped>
.exercise-library {
  padding: var(--spacing-xl);
  max-width: 1200px;
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
  margin: 0;
}

/* 筛选工具栏 */
.filter-toolbar {
  background: var(--color-background-primary);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-lg);
  border: 1px solid var(--color-border-primary);
}

.search-box {
  position: relative;
  margin-bottom: var(--spacing-lg);
}

.search-input {
  width: 100%;
  padding: var(--spacing-md) var(--spacing-xl);
  padding-left: 3rem;
  border: 2px solid var(--color-gray-300);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-body);
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
}

.filter-options {
  display: flex;
  gap: var(--spacing-lg);
  align-items: center;
  flex-wrap: wrap;
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
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-md);
  background: var(--color-white);
  font-size: var(--font-size-body);
  min-width: 120px;
}

.filter-select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.reset-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-md);
  background: var(--color-gray-100);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-btn:hover:not(:disabled) {
  background: var(--color-gray-200);
}

.reset-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 结果信息 */
.results-info {
  margin-bottom: var(--spacing-lg);
}

.results-count {
  color: var(--color-text-secondary);
  font-size: var(--font-size-body);
}

/* 动作网格 */
.exercises-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.exercise-item {
  transition: transform 0.2s ease;
}

.exercise-item:hover {
  transform: translateY(-4px);
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
  margin-bottom: var(--spacing-lg);
}

.reset-empty-btn {
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-size: var(--font-size-body);
  transition: background-color 0.2s ease;
}

.reset-empty-btn:hover {
  background: var(--color-primary-dark);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .exercises-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .exercise-library {
    padding: var(--spacing-md);
  }
  
  .filter-toolbar {
    padding: var(--spacing-md);
  }
  
  .filter-options {
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
  
  .exercises-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .search-input {
    padding: var(--spacing-sm) var(--spacing-md);
    padding-left: 2.5rem;
  }
  
  .search-icon {
    left: 0.75rem;
  }
}
</style>
