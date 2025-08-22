<script setup lang="ts">
import { computed } from 'vue'
import type { Exercise } from '@/mocks/exerciseData'

interface Props {
  exercise: Exercise
  showDetails?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showDetails: false
})

const emit = defineEmits<{
  (e: 'click', exercise: Exercise): void
}>()

// 分类颜色映射
const categoryColors = {
  functional: 'var(--color-primary)',
  bodyweight: 'var(--color-success)',
  posture: '#6B46C1' // 深紫色，确保与白色文字有足够对比度
}

// 难度颜色映射
const difficultyColors = {
  beginner: 'var(--color-success)',
  intermediate: 'var(--color-warning)',
  advanced: 'var(--color-error)'
}

// 难度文本映射
const difficultyText = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级'
}

// 分类文本映射
const categoryText = {
  functional: '功能性',
  bodyweight: '自重训练',
  posture: '体态纠正'
}

const categoryColor = computed(() => categoryColors[props.exercise.category])
const difficultyColor = computed(() => difficultyColors[props.exercise.difficulty])

const handleClick = () => {
  emit('click', props.exercise)
}
</script>

<template>
  <div class="exercise-card" @click="handleClick">
    <!-- 卡片头部 -->
    <div class="card-header">
      <h3 class="exercise-name">{{ exercise.name }}</h3>
      <div class="exercise-meta">
        <span 
          class="category-badge"
          :style="{ backgroundColor: categoryColor }"
        >
          {{ categoryText[exercise.category] }}
        </span>
        <span 
          class="difficulty-badge"
          :style="{ backgroundColor: difficultyColor }"
        >
          {{ difficultyText[exercise.difficulty] }}
        </span>
      </div>
    </div>

    <!-- 卡片内容 -->
    <div class="card-content">
      <p class="exercise-description">{{ exercise.description }}</p>
      
      <!-- 目标肌群 -->
      <div class="target-muscles" v-if="exercise.targetMuscles.length">
        <span class="section-label">目标肌群：</span>
        <div class="muscles-list">
          <span 
            v-for="muscle in exercise.targetMuscles" 
            :key="muscle"
            class="muscle-tag"
          >
            {{ muscle }}
          </span>
        </div>
      </div>

      <!-- 所需器材 -->
      <div class="equipment" v-if="exercise.equipment.length">
        <span class="section-label">所需器材：</span>
        <span class="equipment-list">{{ exercise.equipment.join('、') }}</span>
      </div>

      <!-- 详细信息（可选显示） -->
      <div v-if="showDetails" class="exercise-details">
        <div class="detail-item">
          <span class="detail-label">建议时长：</span>
          <span class="detail-value">{{ exercise.duration }}分钟</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">预估消耗：</span>
          <span class="detail-value">{{ exercise.calories }}卡路里</span>
        </div>
      </div>
    </div>

    <!-- 卡片底部 -->
    <div class="card-footer">
      <div class="action-buttons">
        <button class="btn-primary">开始训练</button>
        <button class="btn-secondary">收藏</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.exercise-card {
  background: var(--color-background-primary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border-primary);
  padding: var(--spacing-lg);
  cursor: pointer;
  transition: all 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.exercise-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary-light);
}

.card-header {
  margin-bottom: var(--spacing-md);
}

.exercise-name {
  font-size: var(--font-size-h3);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
  line-height: 1.3;
}

.exercise-meta {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.category-badge,
.difficulty-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-caption);
  font-weight: 500;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-content {
  flex: 1;
  margin-bottom: var(--spacing-lg);
}

.exercise-description {
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0 0 var(--spacing-md) 0;
  font-size: var(--font-size-body);
}

.section-label {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: var(--font-size-caption);
  margin-right: var(--spacing-xs);
}

.target-muscles,
.equipment {
  margin-bottom: var(--spacing-sm);
}

.muscles-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-xs);
}

.muscle-tag {
  background-color: var(--color-gray-100);
  color: var(--color-text-secondary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-caption);
  border: 1px solid var(--color-gray-300);
}

.equipment-list {
  color: var(--color-text-secondary);
  font-size: var(--font-size-caption);
}

.exercise-details {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-gray-200);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-xs);
}

.detail-label {
  color: var(--color-text-secondary);
  font-size: var(--font-size-caption);
}

.detail-value {
  color: var(--color-text-primary);
  font-weight: 600;
  font-size: var(--font-size-caption);
}

.card-footer {
  margin-top: auto;
}

.action-buttons {
  display: flex;
  gap: var(--spacing-sm);
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
  .exercise-card {
    padding: var(--spacing-md);
  }
  
  .exercise-name {
    font-size: var(--font-size-h4);
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .muscles-list {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .muscle-tag {
    margin-bottom: var(--spacing-xs);
  }
}
</style>
