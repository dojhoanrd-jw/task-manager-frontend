<template>
  <div class="input-group">
    <label v-if="label" class="input-label">{{ label }}</label>
    <div class="input-wrapper">
      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :minlength="minlength"
        class="base-input"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  required: { type: Boolean, default: false },
  minlength: { type: Number, default: undefined },
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.input-group { margin-bottom: 16px; }
.input-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 6px;
  letter-spacing: 0.01em;
}
.base-input {
  width: 100%;
  padding: 11px 14px;
  background: var(--bg-input);
  border: 1.5px solid transparent;
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: 14px;
  color: var(--text-primary);
  outline: none;
  transition: all var(--transition);
}
.base-input:focus {
  border-color: var(--blue);
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
.base-input::placeholder { color: var(--text-muted); }
</style>
