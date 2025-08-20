import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 平台检测和响应式工具函数
 */
export function usePlatform() {
  const isMobile = ref(false)
  const isTablet = ref(false)
  const isDesktop = ref(false)

  const checkScreenSize = () => {
    const width = window.innerWidth
    isMobile.value = width < 768
    isTablet.value = width >= 768 && width < 1024
    isDesktop.value = width >= 1024
  }

  onMounted(() => {
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', checkScreenSize)
  })

  return {
    isMobile,
    isTablet,
    isDesktop,
    screenWidth: ref(window.innerWidth)
  }
}

/**
 * 断点常量定义
 */
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280
} as const

/**
 * 响应式工具函数
 */
export function useResponsive() {
  const platform = usePlatform()

  const responsiveClass = (baseClass: string) => {
    return {
      [`${baseClass}`]: true,
      [`${baseClass}--mobile`]: platform.isMobile.value,
      [`${baseClass}--tablet`]: platform.isTablet.value,
      [`${baseClass}--desktop`]: platform.isDesktop.value
    }
  }

  return {
    ...platform,
    responsiveClass
  }
}
