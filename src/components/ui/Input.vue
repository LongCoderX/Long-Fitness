<template>
  <div :class="['lf-input-wrapper', { 'lf-input-wrapper--error': error, 'lf-input-wrapper--disabled': disabled }]">
    <label v-if="label" :for="generatedId" class="lf-input__label">
      {{ label }}
      <span v-if="required" class="lf-input__required">*</span>
    </label>
    
    <div class="lf-input__container">
      <span v-if="$slots.prefix" class="lf-input__prefix">
        <slot name="prefix" />
      </span>
      
      <input
        :id="generatedId"
        ref="inputRef"
        :class="[
          'lf-input',
          { 
            'lf-input--has-prefix': $slots.prefix,
            'lf-input--has-suffix': $slots.suffix
          }
        ]"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />
      
      <span v-if="$slots.suffix" class="lf-input__suffix">
        <slot name="suffix" />
      </span>
    </div>
    
    <div v-if="error || hint" class="lf-input__feedback">
      <span v-if="error" class="lf-input__error">{{ error }}</span>
      <span v-else-if="hint" class="lf-input__hint">{{ hint }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, withDefaults, computed } from 'vue'

interface InputProps {
  modelValue?: string | number
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search' | 'time' | 'textarea'
  label?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  error?: string
  hint?: string
  maxlength?: number
  id?: string
}

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  modelValue: '',
  disabled: false,
  readonly: false,
  required: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'keydown', event: KeyboardEvent): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const isFocused = ref(false)

const generatedId = computed(() => props.id || `input-${Math.random().toString(36).substr(2, 9)}`)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

const handleKeydown = (event: KeyboardEvent) => {
  emit('keydown', event)
}

const focus = () => {
  inputRef.value?.focus()
}

const blur = () => {
  inputRef.value?.blur()
}

defineExpose({
  focus,
  blur
})
</script>

<style scoped>
.lf-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.lf-input__label {
  font-size: var(--font-size-caption);
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.lf-input__required {
  color: var(--color-error);
  margin-left: 2px;
}

.lf-input__container {
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  background-color: var(--color-white);
  transition: all 0.2s ease-in-out;
}

.lf-input__container:focus-within {
  border-color: var(--color-info);
  box-shadow: 0 0 0 3px rgba(69, 183, 209, 0.1);
}

.lf-input-wrapper--error .lf-input__container {
  border-color: var(--color-error);
}

.lf-input-wrapper--error .lf-input__container:focus-within {
  border-color: var(--color-error);
  box-shadow: 0 0 0 3px rgba(245, 101, 101, 0.1);
}

.lf-input-wrapper--disabled .lf-input__container {
  background-color: var(--color-background-disabled);
  border-color: var(--color-border-light);
  cursor: not-allowed;
}

.lf-input {
  flex: 1;
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-family-base);
  font-size: var(--font-size-body);
  color: var(--color-text-primary);
  line-height: 1.5;
}

.lf-input--has-prefix {
  padding-left: var(--spacing-xs);
}

.lf-input--has-suffix {
  padding-right: var(--spacing-xs);
}

.lf-input::placeholder {
  color: var(--color-text-secondary);
}

.lf-input:disabled {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.lf-input:read-only {
  background-color: var(--color-background-disabled);
}

.lf-input__prefix,
.lf-input__suffix {
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-sm);
  color: var(--color-text-secondary);
  font-size: var(--font-size-body);
}

.lf-input__prefix {
  border-right: 1px solid var(--color-border-light);
}

.lf-input__suffix {
  border-left: 1px solid var(--color-border-light);
}

.lf-input__feedback {
  min-height: 20px;
}

.lf-input__error {
  font-size: var(--font-size-small);
  color: var(--color-error);
  line-height: 1.4;
}

.lf-input__hint {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  line-height: 1.4;
}
</style>
