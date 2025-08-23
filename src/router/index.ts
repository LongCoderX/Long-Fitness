import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 路由配置类型定义
export interface RouteMeta {
  title: string
  requiresAuth?: boolean
  icon?: string
}

// 路由配置
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: {
      title: '首页',
      icon: '🏠',
      requiresAuth: true
    }
  },
  {
    path: '/exercise',
    name: 'Exercise',
    component: () => import('@/views/Exercise.vue'),
    meta: {
      title: '运动',
      icon: '🏃',
      requiresAuth: true
    }
  },
  {
    path: '/nutrition',
    name: 'Nutrition',
    component: () => import('@/views/Nutrition.vue'),
    meta: {
      title: '饮食',
      icon: '🍎',
      requiresAuth: true
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings.vue'),
    meta: {
      title: '设置',
      icon: '⚙️',
      requiresAuth: true
    }
  },
  // 404页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: '页面未找到'
    }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 全局路由守卫
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  const title = to.meta.title as string
  if (title) {
    document.title = `${title} - Long Fitness`
  }

  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    // 这里可以添加认证逻辑
    // const isAuthenticated = checkAuth()
    // if (!isAuthenticated) {
    //   next('/login')
    // } else {
    //   next()
    // }
    next()
  } else {
    next()
  }
})

export default router
