<script setup lang="ts">
import { ref } from 'vue'
import type { FoodItem } from '@/types/nutrition.types'

interface Props {
  food: FoodItem
  showActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true
})

const emit = defineEmits<{
  (e: 'add-to-meal', food: FoodItem): void
  (e: 'view-details', food: FoodItem): void
  (e: 'toggle-favorite', food: FoodItem): void
}>()

const isFavorite = ref(false)

const handleAddToMeal = () => {
  emit('add-to-meal', props.food)
}

const handleViewDetails = () => {
  emit('view-details', props.food)
}

const handleToggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  emit('toggle-favorite', props.food)
}

// 获取食物图标
const getFoodIcon = (category: string) => {
  const icons: Record<string, string> = {
    '肉类': '🍖',
    '谷物': '🌾',
    '蔬菜': '🥦',
    '水果': '🍎',
    '乳制品': '🥛',
    '蛋类': '🥚',
    '海鲜': '🐟',
    '豆类': '🫘',
    '坚果': '🥜',
    '饮料': '🧃',
    '调味品': '🧂',
    '零食': '🍪'
  }
  return icons[category] || '🍽️'
}
</script>

<template>
  <div class="food-card">
    <!-- 食物图标和基本信息 -->
    <div class="food-header">
      <div class="food-icon">
        {{ getFoodIcon(food.category) }}
      </div>
      <div class="food-info">
        <h4 class="food-name">{{ food.name }}</h4>
        <p class="food-category">{{ food.category }}</p>
        <p class="food-serving">{{ food.servingSize }}</p>
      </div>
      <button 
        v-if="showActions"
        class="favorite-btn"
        :class="{ active: isFavorite }"
        @click="handleToggleFavorite"
        aria-label="收藏食物"
      >
        ♥
      </button>
    </div>

    <!-- 营养信息 -->
    <div class="nutrition-info">
      <div class="nutrition-item">
        <span class="label">热量</span>
        <span class="value">{{ food.calories }} kcal</span>
      </div>
      <div class="nutrition-item">
        <span class="label">蛋白质</span>
        <span class="value">{{ food.protein }}g</span>
      </div>
      <div class="nutrition-item">
        <span class="label">碳水</span>
        <span class="value">{{ food.carbs }}g</span>
      </div>
      <div class="nutrition-item">
        <span class="label">脂肪</span>
        <span class="value">{{ food.fat }}g</span>
      </div>
    </div>

    <!-- 标签 -->
    <div v-if="food.tags.length" class="food-tags">
      <span 
        v-for="tag in food.tags.slice(0, 3)" 
        :key="tag"
        class="tag"
      >
        {{ tag }}
      </span>
      <span v-if="food.tags.length > 3" class="tag-more">
        +{{ food.tags.length - 3 }}
      </span>
    </div>

    <!-- 操作按钮 -->
    <div v-if="showActions" class="food-actions">
      <button class="btn-secondary" @click="handleViewDetails">
        详情
      </button>
      <button class="btn-primary" @click="handleAddToMeal">
        添加到餐食
      </button>
    </div>
  </div>
</template>

<style scoped>
.food-card {
  background: var(--color-background-primary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border-primary);
  padding: var(--spacing-lg);
  transition: all 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.food-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary);
}

.food-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
  gap: var(--spacing-md);
}

.food-icon {
  font-size: 2rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background-secondary);
  border-radius: var(--border-radius-md);
  flex-shrink: 0;
}

.food-info {
  flex: 1;
  min-width: 0;
}

.food-name {
  font-size: var(--font-size-h3);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.food-category {
  font-size: var(--font-size-caption);
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-xs) 0;
}

.food-serving {
  font-size: var(--font-size-small);
  color: var(--color-text-tertiary);
  margin: 0;
}

.favorite-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: var(--color-gray-400);
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--border-radius-full);
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.favorite-btn:hover {
  color: var(--color-warning);
  background: rgba(236, 201, 75, 0.1);
}

.favorite-btn.active {
  color: var(--color-warning);
}

.nutrition-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.nutrition-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-background-secondary);
  border-radius: var(--border-radius-sm);
}

.nutrition-item .label {
  font-size: var(--font-size-caption);
  color: var(--color-text-secondary);
  font-weight: 500;
}

.nutrition-item .value {
  font-size: var(--font-size-caption);
  color: var(--color-text-primary);
  font-weight: 600;
}

.food-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-lg);
}

.tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-gray-100);
  color: var(--color-text-secondary);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-small);
  border: 1px solid var(--color-gray-300);
}

.tag-more {
  padding: var(--spacing-xs) var(--spacing-sm);
  color: var(--color-text-tertiary);
  font-size: var(--font-size-small);
}

.food-actions {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: auto;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-body);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
}

.btn-secondary {
  background-color: var(--color-gray-100);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-gray-300);
}

.btn-secondary:hover {
  background-color: var(--color-gray-200);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .food-card {
    padding: var(--spacing-md);
  }
  
  .food-header {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-sm);
  }
  
  .food-icon {
    align-self: center;
  }
  
  .nutrition-info {
    grid-template-columns: 1fr;
  }
  
  .food-actions {
    flex-direction: column;
  }
}
</style>
