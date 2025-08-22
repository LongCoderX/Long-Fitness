<script setup lang="ts">
import { computed } from 'vue'
import { useLayoutStore } from '@/stores/layout.store'
import SidebarNavigation from './SidebarNavigation.vue'
import ShowSidebarButton from './ShowSidebarButton.vue'

const layoutStore = useLayoutStore()

// 主内容区域样式
const mainContentStyle = computed(() => ({
  marginLeft: layoutStore.sidebarVisible ? '240px' : '0',
  transition: 'margin-left 0.3s ease'
}))
</script>

<template>
  <div class="main-layout">
    <!-- 侧边栏导航 -->
    <SidebarNavigation />
    
    <!-- 显示侧边栏按钮（当侧边栏隐藏时显示） -->
    <ShowSidebarButton v-if="!layoutStore.sidebarVisible" />
    
    <!-- 主内容区域 -->
    <main class="main-content" :style="mainContentStyle">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.main-layout {
  position: relative;
  min-height: 100vh;
}

.main-content {
  min-height: 100vh;
  padding: var(--spacing-lg);
  background-color: var(--color-gray-50);
  transition: margin-left 0.3s ease;
}

/* 响应式设计 - 移动端 */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0 !important;
    padding: var(--spacing-md);
  }
}
</style>
