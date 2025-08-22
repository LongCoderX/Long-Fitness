<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { FoodItem } from '@/types/nutrition.types'

interface Props {
  placeholder?: string
  debounce?: number
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '搜索食物名称、类别或标签...',
  debounce: 300
})

const emit = defineEmits<{
  (e: 'search', query: string): void
  (e: 'clear'): void
}>()

const searchQuery = ref('')
const isFocused = ref(false)
const debounceTimer = ref<number>()

// 处理搜索输入
const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  searchQuery.value = value
  
  // 防抖处理
  clearTimeout(debounceTimer.value)
  debounceTimer.value = setTimeout(() => {
    if (value.trim()) {
      emit('search', value.trim())
    } else {
      emit('clear')
    }
  }, props.debounce)
}

// 清除搜索
const clearSearch = () => {
  searchQuery.value = ''
  emit('clear')
}

// 处理键盘事件
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    clearSearch()
  }
}

// 是否有搜索内容
const hasQuery = computed(() => searchQuery.value.trim().length > 0)
</script>

<template>
  <div class="food-search">
    <div class="search-container" :class="{ focused: isFocused }">
      <!-- 搜索图标 -->
      <span class="search-icon">🔍</span>
      
      <!-- 搜索输入框 -->
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="placeholder"
        class="search-input"
        @input="handleInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
        @keydown="handleKeydown"
        aria-label="搜索食物"
      />
      
      <!-- 清除按钮 -->
      <button
        v-if="hasQuery"
        class="clear-btn"
        @click="clearSearch"
        aria-label="清除搜索"
      >
        ✕
      </button>
    </div>
    
    <!-- 搜索提示（可选） -->
    <div v-if="isFocused && !hasQuery" class="search-tips">
      <p class="tips-title">搜索提示：</p>
      <ul class="tips-list">
        <li>输入食物名称，如"鸡胸肉"、"苹果"</li>
        <li>按类别搜索，如"蔬菜"、"水果"</li>
        <li>按营养标签搜索，如"高蛋白"、"低脂肪"</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.food-search {
  position: relative;
  width: 100%;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--color-background-primary);
  border: 2px solid var(--color-border-primary);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-sm) var(--spacing-md);
  transition: all 0.2s ease;
}

.search-container.focused {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.search-icon {
  color: var(--color-text-secondary);
  margin-right: var(--spacing-sm);
  font-size: 1.1rem;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: none;
  font-size: var(--font-size-body);
  color: var(--color-text-primary);
  padding: 0;
}

.search-input::placeholder {
  color: var(--color-text-tertiary);
}

.clear-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--border-radius-full);
  font-size: 1.1rem;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.clear-btn:hover {
  color: var(--color-text-primary);
  background: var(--color-gray-100);
}

.search-tips {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--color-background-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  margin-top: var(--spacing-xs);
  box-shadow: var(--shadow-lg);
  z-index: 100;
}

.tips-title {
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
  font-size: var(--font-size-caption);
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-list li {
  font-size: var(--font-size-caption);
  color: var(--color-text-secondary);
  padding: var(--spacing-xs) 0;
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-container {
    padding: var(--spacing-xs) var(--spacing-sm);
  }
  
  .search-input {
    font-size: var(--font-size-caption);
  }
  
  .search-tips {
    position: fixed;
    top: auto;
    bottom: 0;
    left: var(--spacing-sm);
    right: var(--spacing-sm);
    margin-top: 0;
    margin-bottom: var(--spacing-sm);
  }
}
</style>
