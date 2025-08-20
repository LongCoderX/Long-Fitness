<template>
  <div
    :class="[
      'lf-card',
      `lf-card--${shadow}`,
      { 'lf-card--hover': hover, 'lf-card--border': border }
    ]"
  >
    <div v-if="$slots.header || title" class="lf-card__header">
      <slot name="header">
        <h3 v-if="title" class="lf-card__title">{{ title }}</h3>
      </slot>
    </div>
    
    <div class="lf-card__body">
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="lf-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">

interface CardProps {
  title?: string
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  border?: boolean
}

const { shadow = 'md', hover = false, border = false } = defineProps<CardProps>()

defineSlots<{
  header?: (props: Record<string, never>) => any
  default?: (props: Record<string, never>) => any
  footer?: (props: Record<string, never>) => any
}>()
</script>

<style scoped>
.lf-card {
  background-color: var(--color-white);
  border-radius: var(--border-radius-md);
  transition: all 0.2s ease-in-out;
}

/* 阴影变体 */
.lf-card--none {
  box-shadow: none;
}

.lf-card--sm {
  box-shadow: var(--shadow-sm);
}

.lf-card--md {
  box-shadow: var(--shadow-md);
}

.lf-card--lg {
  box-shadow: var(--shadow-lg);
}

/* 边框变体 */
.lf-card--border {
  border: 1px solid var(--color-border);
}

/* 悬停效果 */
.lf-card--hover:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* 卡片头部 */
.lf-card__header {
  padding: var(--spacing-lg) var(--spacing-lg) 0;
  border-bottom: 1px solid var(--color-border-light);
  margin-bottom: var(--spacing-md);
}

.lf-card__title {
  margin: 0;
  font-size: var(--font-size-h3);
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.4;
}

/* 卡片主体 */
.lf-card__body {
  padding: var(--spacing-lg);
}

.lf-card__body:first-child {
  padding-top: var(--spacing-lg);
}

.lf-card__body:last-child {
  padding-bottom: var(--spacing-lg);
}

/* 卡片底部 */
.lf-card__footer {
  padding: 0 var(--spacing-lg) var(--spacing-lg);
  border-top: 1px solid var(--color-border-light);
  margin-top: var(--spacing-md);
}

.lf-card__footer:first-child {
  padding-top: var(--spacing-lg);
}
</style>
