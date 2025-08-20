<template>
  <div :class="['lf-grid-item', columnClass, spanClass, offsetClass]">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useResponsive } from '../../composables/usePlatform'

interface GridItemProps {
  /** 列数 (1-12) */
  cols?: number | string
  /** 移动端列数 */
  colsMobile?: number | string
  /** 平板端列数 */
  colsTablet?: number | string
  /** 桌面端列数 */
  colsDesktop?: number | string
  /** 跨列数 */
  span?: number | string
  /** 移动端跨列数 */
  spanMobile?: number | string
  /** 平板端跨列数 */
  spanTablet?: number | string
  /** 桌面端跨列数 */
  spanDesktop?: number | string
  /** 偏移列数 */
  offset?: number | string
  /** 移动端偏移列数 */
  offsetMobile?: number | string
  /** 平板端偏移列数 */
  offsetTablet?: number | string
  /** 桌面端偏移列数 */
  offsetDesktop?: number | string
}

const props = withDefaults(defineProps<GridItemProps>(), {
  cols: 12,
  span: 1
})

const { isMobile, isTablet, isDesktop } = useResponsive()

// 计算当前平台的列数
const currentCols = computed(() => {
  if (isMobile.value && props.colsMobile !== undefined) {
    return props.colsMobile
  }
  if (isTablet.value && props.colsTablet !== undefined) {
    return props.colsTablet
  }
  if (isDesktop.value && props.colsDesktop !== undefined) {
    return props.colsDesktop
  }
  return props.cols
})

// 计算当前平台的跨列数
const currentSpan = computed(() => {
  if (isMobile.value && props.spanMobile !== undefined) {
    return props.spanMobile
  }
  if (isTablet.value && props.spanTablet !== undefined) {
    return props.spanTablet
  }
  if (isDesktop.value && props.spanDesktop !== undefined) {
    return props.spanDesktop
  }
  return props.span
})

// 计算当前平台的偏移列数
const currentOffset = computed(() => {
  if (isMobile.value && props.offsetMobile !== undefined) {
    return props.offsetMobile
  }
  if (isTablet.value && props.offsetTablet !== undefined) {
    return props.offsetTablet
  }
  if (isDesktop.value && props.offsetDesktop !== undefined) {
    return props.offsetDesktop
  }
  return props.offset
})

// 生成列数类名
const columnClass = computed(() => {
  const cols = Number(currentCols.value)
  return `lf-grid-item--cols-${cols}`
})

// 生成跨列类名
const spanClass = computed(() => {
  const span = Number(currentSpan.value)
  if (span > 1) {
    return `lf-grid-item--span-${span}`
  }
  return ''
})

// 生成偏移类名
const offsetClass = computed(() => {
  const offset = Number(currentOffset.value || 0)
  if (offset > 0) {
    return `lf-grid-item--offset-${offset}`
  }
  return ''
})
</script>

<style scoped>
.lf-grid-item {
  grid-column: span 1;
}

/* 列数变体 */
.lf-grid-item--cols-1 { grid-column-end: span 1; }
.lf-grid-item--cols-2 { grid-column-end: span 2; }
.lf-grid-item--cols-3 { grid-column-end: span 3; }
.lf-grid-item--cols-4 { grid-column-end: span 4; }
.lf-grid-item--cols-5 { grid-column-end: span 5; }
.lf-grid-item--cols-6 { grid-column-end: span 6; }
.lf-grid-item--cols-7 { grid-column-end: span 7; }
.lf-grid-item--cols-8 { grid-column-end: span 8; }
.lf-grid-item--cols-9 { grid-column-end: span 9; }
.lf-grid-item--cols-10 { grid-column-end: span 10; }
.lf-grid-item--cols-11 { grid-column-end: span 11; }
.lf-grid-item--cols-12 { grid-column-end: span 12; }

/* 跨列变体 */
.lf-grid-item--span-2 { grid-column: span 2; }
.lf-grid-item--span-3 { grid-column: span 3; }
.lf-grid-item--span-4 { grid-column: span 4; }
.lf-grid-item--span-5 { grid-column: span 5; }
.lf-grid-item--span-6 { grid-column: span 6; }
.lf-grid-item--span-7 { grid-column: span 7; }
.lf-grid-item--span-8 { grid-column: span 8; }
.lf-grid-item--span-9 { grid-column: span 9; }
.lf-grid-item--span-10 { grid-column: span 10; }
.lf-grid-item--span-11 { grid-column: span 11; }
.lf-grid-item--span-12 { grid-column: span 12; }

/* 偏移变体 */
.lf-grid-item--offset-1 { grid-column-start: 2; }
.lf-grid-item--offset-2 { grid-column-start: 3; }
.lf-grid-item--offset-3 { grid-column-start: 4; }
.lf-grid-item--offset-4 { grid-column-start: 5; }
.lf-grid-item--offset-5 { grid-column-start: 6; }
.lf-grid-item--offset-6 { grid-column-start: 7; }
.lf-grid-item--offset-7 { grid-column-start: 8; }
.lf-grid-item--offset-8 { grid-column-start: 9; }
.lf-grid-item--offset-9 { grid-column-start: 10; }
.lf-grid-item--offset-10 { grid-column-start: 11; }
.lf-grid-item--offset-11 { grid-column-start: 12; }
.lf-grid-item--offset-12 { grid-column-start: 13; }

/* 响应式媒体查询 */
@media (max-width: 767px) {
  .lf-grid-item {
    grid-column: span 12;
  }
  
  .lf-grid-item--cols-mobile-1 { grid-column-end: span 1; }
  .lf-grid-item--cols-mobile-2 { grid-column-end: span 2; }
  .lf-grid-item--cols-mobile-3 { grid-column-end: span 3; }
  .lf-grid-item--cols-mobile-4 { grid-column-end: span 4; }
  .lf-grid-item--cols-mobile-5 { grid-column-end: span 5; }
  .lf-grid-item--cols-mobile-6 { grid-column-end: span 6; }
  .lf-grid-item--cols-mobile-7 { grid-column-end: span 7; }
  .lf-grid-item--cols-mobile-8 { grid-column-end: span 8; }
  .lf-grid-item--cols-mobile-9 { grid-column-end: span 9; }
  .lf-grid-item--cols-mobile-10 { grid-column-end: span 10; }
  .lf-grid-item--cols-mobile-11 { grid-column-end: span 11; }
  .lf-grid-item--cols-mobile-12 { grid-column-end: span 12; }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .lf-grid-item {
    grid-column: span 6;
  }
  
  .lf-grid-item--cols-tablet-1 { grid-column-end: span 1; }
  .lf-grid-item--cols-tablet-2 { grid-column-end: span 2; }
  .lf-grid-item--cols-tablet-3 { grid-column-end: span 3; }
  .lf-grid-item--cols-tablet-4 { grid-column-end: span 4; }
  .lf-grid-item--cols-tablet-5 { grid-column-end: span 5; }
  .lf-grid-item--cols-tablet-6 { grid-column-end: span 6; }
  .lf-grid-item--cols-tablet-7 { grid-column-end: span 7; }
  .lf-grid-item--cols-tablet-8 { grid-column-end: span 8; }
  .lf-grid-item--cols-tablet-9 { grid-column-end: span 9; }
  .lf-grid-item--cols-tablet-10 { grid-column-end: span 10; }
  .lf-grid-item--cols-tablet-11 { grid-column-end: span 11; }
  .lf-grid-item--cols-tablet-12 { grid-column-end: span 12; }
}

@media (min-width: 1024px) {
  .lf-grid-item {
    grid-column: span 4;
  }
  
  .lf-grid-item--cols-desktop-1 { grid-column-end: span 1; }
  .lf-grid-item--cols-desktop-2 { grid-column-end: span 2; }
  .lf-grid-item--cols-desktop-3 { grid-column-end: span 3; }
  .lf-grid-item--cols-desktop-4 { grid-column-end: span 4; }
  .lf-grid-item--cols-desktop-5 { grid-column-end: span 5; }
  .lf-grid-item--cols-desktop-6 { grid-column-end: span 6; }
  .lf-grid-item--cols-desktop-7 { grid-column-end: span 7; }
  .lf-grid-item--cols-desktop-8 { grid-column-end: span 8; }
  .lf-grid-item--cols-desktop-9 { grid-column-end: span 9; }
  .lf-grid-item--cols-desktop-10 { grid-column-end: span 10; }
  .lf-grid-item--cols-desktop-11 { grid-column-end: span 11; }
  .lf-grid-item--cols-desktop-12 { grid-column-end: span 12; }
}
</style>
