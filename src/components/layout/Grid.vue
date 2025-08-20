<template>
  <div :class="['lf-grid', containerClass, { 'lf-grid--fluid': fluid }]">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useResponsive } from '../../composables/usePlatform'

interface GridProps {
  fluid?: boolean
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** 网格列数 (1-12) */
  columns?: number
  /** 移动端列数 */
  columnsMobile?: number
  /** 平板端列数 */
  columnsTablet?: number
  /** 桌面端列数 */
  columnsDesktop?: number
}

const props = withDefaults(defineProps<GridProps>(), {
  fluid: false,
  spacing: 'md',
  columns: 12,
  columnsMobile: 1,
  columnsTablet: 6,
  columnsDesktop: 12
})

const { isMobile, isTablet, isDesktop } = useResponsive()

const containerClass = computed(() => {
  if (props.fluid) return ''

  return {
    'lf-grid-container--mobile': isMobile.value,
    'lf-grid-container--tablet': isTablet.value,
    'lf-grid-container--desktop': isDesktop.value
  }
})

</script>

<style scoped>
.lf-grid {
  display: grid;
  gap: var(--spacing-md);
}

/* 间距变体 */
.lf-grid--spacing-none {
  gap: 0;
}

.lf-grid--spacing-xs {
  gap: var(--spacing-xs);
}

.lf-grid--spacing-sm {
  gap: var(--spacing-sm);
}

.lf-grid--spacing-md {
  gap: var(--spacing-md);
}

.lf-grid--spacing-lg {
  gap: var(--spacing-lg);
}

.lf-grid--spacing-xl {
  gap: var(--spacing-xl);
}

/* 容器宽度 */
.lf-grid-container--mobile {
  max-width: 100%;
  padding: 0 var(--spacing-md);
}

.lf-grid-container--tablet {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.lf-grid-container--desktop {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-xl);
}

/* 流体布局 */
.lf-grid--fluid {
  max-width: none;
  margin: 0;
  padding: 0;
}
</style>
