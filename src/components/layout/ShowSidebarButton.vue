<script setup lang="ts">
import { ref } from 'vue'
import { useLayoutStore } from '@/stores/layout.store'

const layoutStore = useLayoutStore()
const isHovered = ref(false)

// 显示侧边栏
const showSidebar = () => {
  layoutStore.showSidebar()
}

// 鼠标进入区域
const handleMouseEnter = () => {
  isHovered.value = true
}

// 鼠标离开区域
const handleMouseLeave = () => {
  isHovered.value = false
}
</script>

<template>
  <div 
    class="sidebar-trigger-area"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <button 
      class="show-sidebar-button"
      :class="{ visible: isHovered }"
      @click="showSidebar" 
      aria-label="显示侧边栏"
    >
      <span class="show-icon">→</span>
    </button>
  </div>
</template>

<style scoped>
.sidebar-trigger-area {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 20px;
  z-index: 98;
  transition: background-color 0.3s ease;
}

.sidebar-trigger-area:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.show-sidebar-button {
  position: absolute;
  left: 4px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 0 8px 8px 0;
  background-color: var(--color-primary);
  color: var(--color-white);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(-50%) translateX(-100%);
  z-index: 99;
}

.show-sidebar-button.visible {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}

.show-sidebar-button:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-50%) translateX(0) scale(1.05);
}

.show-sidebar-button:active {
  transform: translateY(-50%) translateX(0) scale(0.95);
}

.show-icon {
  font-size: 16px;
  font-weight: 600;
}

/* 移动端隐藏显示按钮 */
@media (max-width: 768px) {
  .sidebar-trigger-area {
    display: none;
  }
}
</style>
