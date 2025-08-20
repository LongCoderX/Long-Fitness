<template>
  <button
    :class="[
      'lf-button',
      `lf-button--${variant}`,
      `lf-button--${normalizedSize}`,
      { 'lf-button--disabled': disabled, 'lf-button--loading': loading }
    ]"
    :disabled="disabled || loading"
    :type="nativeType"
    @click="handleClick"
  >
    <span v-if="loading" class="lf-button__loading">
      <svg class="lf-button__spinner" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" />
      </svg>
    </span>
    <span v-else class="lf-button__content">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { withDefaults, computed } from 'vue'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'text'
  size?: 'small' | 'medium' | 'large' | 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  nativeType?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'medium',
  disabled: false,
  loading: false,
  nativeType: 'button'
})

// 尺寸映射：简写形式映射到完整形式
const normalizedSize = computed(() => {
  const sizeMap: Record<string, 'small' | 'medium' | 'large'> = {
    'sm': 'small',
    'md': 'medium', 
    'lg': 'large',
    'small': 'small',
    'medium': 'medium',
    'large': 'large'
  }
  return sizeMap[props.size] || 'medium'
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.lf-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  cursor: pointer;
  font-family: var(--font-family-base);
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease-in-out;
  user-select: none;
  position: relative;
}

/* 按钮变体样式 */
.lf-button--primary {
  background-color: var(--color-primary);
  color: var(--color-white);
  border-radius: var(--border-radius-md);
}

.lf-button--primary:hover:not(.lf-button--disabled):not(.lf-button--loading) {
  background-color: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.lf-button--primary:active:not(.lf-button--disabled):not(.lf-button--loading) {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.lf-button--secondary {
  background-color: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  border-radius: var(--border-radius-md);
}

.lf-button--secondary:hover:not(.lf-button--disabled):not(.lf-button--loading) {
  background-color: var(--color-primary);
  color: var(--color-white);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.lf-button--secondary:active:not(.lf-button--disabled):not(.lf-button--loading) {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.lf-button--text {
  background-color: transparent;
  color: var(--color-info);
  border: none;
  padding: 0;
}

.lf-button--text:hover:not(.lf-button--disabled):not(.lf-button--loading) {
  color: var(--color-info-dark);
  text-decoration: underline;
}

/* 按钮尺寸 */
.lf-button--small {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-caption);
  min-height: 32px;
}

.lf-button--medium {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-body);
  min-height: 40px;
}

.lf-button--large {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-h3);
  min-height: 48px;
}

/* 禁用状态 */
.lf-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* 加载状态 */
.lf-button--loading {
  cursor: wait;
}

.lf-button__loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.lf-button__spinner {
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.lf-button__content {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}
</style>
