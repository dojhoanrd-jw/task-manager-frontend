<template>
  <div class="spinner-container">
    <div class="spinner"></div>
    <span v-if="text" class="spinner-text">{{ text }}</span>
  </div>
</template>

<script setup>
defineProps({ text: { type: String, default: '' } })
</script>

<style scoped>
.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 32px;
}
.spinner {
  width: 28px; height: 28px;
  border: 2.5px solid var(--border);
  border-top-color: var(--blue);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
.spinner-text {
  font-size: 13px;
  color: var(--text-muted);
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
