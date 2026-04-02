<template>
  <button
    :class="['base-btn', `btn-${variant}`, `btn-${size}`, { 'btn-loading': loading, 'btn-block': block }]"
    :disabled="disabled || loading"
    @click="$emit('click')"
  >
    <span v-if="loading" class="spinner"></span>
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
})
defineEmits(['click'])
</script>

<style scoped>
.base-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
  font-weight: 500;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition);
  white-space: nowrap;
}
.base-btn:hover { transform: translateY(-1px); }
.base-btn:active { transform: translateY(0); }
.base-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.btn-sm { padding: 6px 14px; font-size: 13px; }
.btn-md { padding: 10px 20px; font-size: 14px; }
.btn-lg { padding: 12px 24px; font-size: 15px; }
.btn-block { width: 100%; }

.btn-primary { background: var(--blue); color: white; }
.btn-primary:hover { background: var(--blue-dark); }
.btn-danger { background: var(--red); color: white; }
.btn-success { background: var(--green); color: white; }
.btn-ghost { background: transparent; color: var(--text-secondary); }
.btn-ghost:hover { background: var(--bg-input); }
.btn-outline { background: transparent; color: var(--blue); border: 1px solid var(--border); }
.btn-outline:hover { border-color: var(--blue); background: var(--bg-accent); }

.spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.5s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
