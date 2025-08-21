<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useLayoutStore } from '@/stores/layout.store'

const router = useRouter()
const route = useRoute()
const layoutStore = useLayoutStore()

// 导航项配置
const navItems = ref([
  { id: 'dashboard', path: '/', icon: '🏠', label: '首页', active: true },
  { id: 'exercise', path: '/exercise', icon: '🏃', label: '运动', active: false },
  { id: 'nutrition', path: '/nutrition', icon: '🍎', label: '饮食', active: false },
  { id: 'sleep', path: '/sleep', icon: '😴', label: '睡眠', active: false },
  { id: 'stress', path: '/stress', icon: '😌', label: '压力', active: false },
  { id: 'knowledge', path: '/knowledge', icon: '📚', label: '知识库', active: false },
  { id: 'settings', path: '/settings', icon: '⚙️', label: '设置', active: false }
])

// 计算当前激活的导航项
const activeNavItem = computed(() => {
  return navItems.value.find(item => item.path === route.path) || navItems.value[0]
})

// 处理导航点击
const handleNavigation = (item: any) => {
  if (item.path !== route.path) {
    router.push(item.path)
  }
}

// 隐藏侧边栏
const hideSidebar = () => {
  layoutStore.hideSidebar()
}
</script>

<template>
  <aside class="sidebar-navigation">
    <!-- 导航项列表 -->
    <nav class="nav-list">
      <div
        v-for="item in navItems"
        :key="item.id"
        class="nav-item"
        :class="{ active: activeNavItem.id === item.id }"
        @click="handleNavigation(item)"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-label">{{ item.label }}</span>
      </div>
    </nav>

    <!-- 隐藏侧边栏按钮 -->
    <div class="hide-button" @click="hideSidebar">
      <span class="hide-icon">←</span>
      <span class="hide-label">隐藏</span>
    </div>
  </aside>
</template>

<style scoped>
.sidebar-navigation {
  width: 240px;
  height: 100vh;
  background-color: var(--color-white);
  border-right: 1px solid var(--color-gray-200);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-sm);
}

.nav-list {
  flex: 1;
  padding: var(--spacing-md) 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  margin: 0 var(--spacing-sm);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--color-text-secondary);
}

.nav-item:hover {
  background-color: var(--color-gray-100);
  color: var(--color-text-primary);
}

.nav-item.active {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 600;
}

.nav-icon {
  font-size: 18px;
  margin-right: var(--spacing-md);
  width: 24px;
  text-align: center;
}

.nav-label {
  font-size: var(--font-size-body);
  line-height: 1.4;
}

.hide-button {
  display: flex;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  margin: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--color-text-secondary);
  border-top: 1px solid var(--color-gray-200);
  margin-top: auto;
}

.hide-button:hover {
  background-color: var(--color-gray-100);
  color: var(--color-text-primary);
}

.hide-icon {
  font-size: 16px;
  margin-right: var(--spacing-md);
  width: 24px;
  text-align: center;
  font-weight: 600;
}

.hide-label {
  font-size: var(--font-size-body);
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar-navigation {
    display: none;
  }
}
</style>
