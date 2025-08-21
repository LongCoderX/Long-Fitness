import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useLayoutStore = defineStore('layout', () => {
  // 侧边栏显示状态
  const sidebarVisible = ref(true)
  
  // 切换侧边栏显示状态
  const toggleSidebar = () => {
    sidebarVisible.value = !sidebarVisible.value
  }
  
  // 显示侧边栏
  const showSidebar = () => {
    sidebarVisible.value = true
  }
  
  // 隐藏侧边栏
  const hideSidebar = () => {
    sidebarVisible.value = false
  }
  
  // 侧边栏宽度（固定240px）
  const sidebarWidth = computed(() => sidebarVisible.value ? '240px' : '0px')
  
  // 侧边栏折叠状态class
  const sidebarCollapsedClass = computed(() => ({
    'sidebar-collapsed': !sidebarVisible.value
  }))
  
  return {
    sidebarVisible,
    toggleSidebar,
    showSidebar,
    hideSidebar,
    sidebarWidth,
    sidebarCollapsedClass
  }
})
