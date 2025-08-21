<script setup lang="ts">
import { useLayoutStore } from '@/stores/layout.store'

const layoutStore = useLayoutStore()

// 显示侧边栏
const showSidebar = () => {
  layoutStore.showSidebar()
}
</script>

<template>
  <button class="show-sidebar-button" @click="showSidebar" aria-label="显示侧边栏">
    <span class="show-icon">→</span>
  </button>
</template>

<style scoped>
.show-sidebar-button {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: var(--color-white);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
  z-index: 99;
}

.show-sidebar-button:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-50%) scale(1.05);
}

.show-sidebar-button:active {
  transform: translateY(-50%) scale(0.95);
}

.show-icon {
  font-size: 18px;
  font-weight: 600;
}

/* 移动端隐藏显示按钮 */
@media (max-width: 768px) {
  .show-sidebar-button {
    display: none;
  }
}
</style>
