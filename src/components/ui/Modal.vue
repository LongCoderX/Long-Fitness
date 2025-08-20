<template>
  <teleport to="body">
    <transition
      name="modal"
      @before-enter="beforeEnter"
      @after-enter="afterEnter"
      @before-leave="beforeLeave"
      @after-leave="afterLeave"
    >
      <div
        v-if="modelValue"
        class="modal-overlay"
        :class="{ 'modal-overlay--blur': blurBackground }"
        @click.self="handleOverlayClick"
      >
        <div
          class="modal"
          :class="[
            `modal--${size}`,
            { 'modal--fullscreen': fullscreen }
          ]"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title ? `${id}-title` : undefined"
          :aria-describedby="description ? `${id}-description` : undefined"
        >
          <!-- 头部区域 -->
          <header v-if="showHeader" class="modal-header">
            <div class="modal-header-content">
              <h2 v-if="title" :id="`${id}-title`" class="modal-title">
                {{ title }}
              </h2>
              <slot name="header">
                <p v-if="description" :id="`${id}-description`" class="modal-description">
                  {{ description }}
                </p>
              </slot>
            </div>
            <button
              v-if="showCloseButton"
              class="modal-close-button"
              @click="handleClose"
              aria-label="关闭模态框"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M12.8536 3.14645C13.0488 3.34171 13.0488 3.65829 12.8536 3.85355L8.70711 8L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L8 8.70711L3.85355 12.8536C3.65829 13.0488 3.34171 13.0488 3.14645 12.8536C2.95118 12.6583 2.95118 12.3417 3.14645 12.1464L7.29289 8L3.14645 3.85355C2.95118 3.65829 2.95118 3.34171 3.14645 3.14645C3.34171 2.95118 3.65829 2.95118 3.85355 3.14645L8 7.29289L12.1464 3.14645C12.3417 2.95118 12.6583 2.95118 12.8536 3.14645Z"/>
              </svg>
            </button>
          </header>

          <!-- 内容区域 -->
          <div class="modal-content">
            <slot></slot>
          </div>

          <!-- 底部区域 -->
          <footer v-if="showFooter" class="modal-footer">
            <slot name="footer">
              <Button variant="secondary" @click="handleClose">
                取消
              </Button>
              <Button @click="handleConfirm">
                确认
              </Button>
            </slot>
          </footer>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import Button from './Button.vue'

export interface ModalProps {
  modelValue: boolean
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fullscreen?: boolean
  showCloseButton?: boolean
  showHeader?: boolean
  showFooter?: boolean
  closeOnOverlayClick?: boolean
  closeOnEsc?: boolean
  blurBackground?: boolean
  persistent?: boolean
}

const props = withDefaults(defineProps<ModalProps>(), {
  modelValue: false,
  size: 'md',
  showCloseButton: true,
  showHeader: true,
  showFooter: false,
  closeOnOverlayClick: true,
  closeOnEsc: true,
  blurBackground: true,
  persistent: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'close': []
  'confirm': []
  'opened': []
  'closed': []
}>()

const id = computed(() => `modal-${Math.random().toString(36).substr(2, 9)}`)

const handleClose = () => {
  if (props.persistent) return
  emit('update:modelValue', false)
  emit('close')
}

const handleConfirm = () => {
  emit('confirm')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlayClick && !props.persistent) {
    handleClose()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closeOnEsc && !props.persistent) {
    handleClose()
  }
}

const beforeEnter = () => {
  document.body.style.overflow = 'hidden'
}

const afterEnter = () => {
  emit('opened')
}

const beforeLeave = () => {
  // 保持body overflow hidden直到动画完成
}

const afterLeave = () => {
  document.body.style.overflow = ''
  emit('closed')
}

onMounted(() => {
  if (props.closeOnEsc) {
    document.addEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-md);
}

.modal-overlay--blur {
  backdrop-filter: blur(4px);
}

.modal {
  background: var(--color-white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-xl);
  max-width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modal-scale-in 0.2s ease-out;
}

.modal--sm {
  width: 400px;
}

.modal--md {
  width: 500px;
}

.modal--lg {
  width: 600px;
}

.modal--xl {
  width: 800px;
}

.modal--fullscreen {
  width: 100%;
  height: 100%;
  border-radius: 0;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-gray-100);
  flex-shrink: 0;
}

.modal-header-content {
  flex: 1;
  min-width: 0;
}

.modal-title {
  font-size: var(--font-size-h3);
  font-weight: 600;
  color: var(--color-gray-800);
  margin: 0 0 var(--spacing-xs) 0;
  line-height: 1.4;
}

.modal-description {
  font-size: var(--font-size-caption);
  color: var(--color-gray-600);
  margin: 0;
  line-height: 1.5;
}

.modal-close-button {
  background: none;
  border: none;
  padding: var(--spacing-xs);
  margin: calc(var(--spacing-xs) * -1);
  color: var(--color-gray-500);
  cursor: pointer;
  border-radius: var(--border-radius-sm);
  transition: all 0.15s ease;
  flex-shrink: 0;
  margin-left: var(--spacing-md);
}

.modal-close-button:hover {
  color: var(--color-gray-700);
  background-color: var(--color-gray-100);
}

.modal-close-button:active {
  transform: scale(0.95);
}

.modal-content {
  padding: var(--spacing-lg);
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-gray-100);
  flex-shrink: 0;
}

/* 动画效果 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: scale(0.95);
  opacity: 0;
}

@keyframes modal-scale-in {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modal-overlay {
    padding: var(--spacing-sm);
  }
  
  .modal--sm,
  .modal--md,
  .modal--lg,
  .modal--xl {
    width: 100%;
    max-width: none;
  }
  
  .modal-header,
  .modal-content,
  .modal-footer {
    padding: var(--spacing-md);
  }
}

@media (max-width: 480px) {
  .modal-header,
  .modal-content,
  .modal-footer {
    padding: var(--spacing-sm);
  }
  
  .modal-footer {
    flex-direction: column;
    align-items: stretch;
  }
  
  .modal-footer :deep(.button) {
    width: 100%;
  }
}
</style>
