<template>
  <Transition name="slide">
    <div v-if="globalError" class="error-alert fade-enter">
      <div class="error-icon">!</div>
      <span>{{ globalError }}</span>
      <button @click="clearError" class="error-close">&times;</button>
    </div>
  </Transition>
</template>

<script setup>
import { globalError, clearError } from '@/shared/errors/error-handler'
</script>

<style scoped>
.error-alert {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
  border-radius: var(--radius-md);
  padding: 12px 16px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}
.error-icon {
  width: 22px; height: 22px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}
.error-close {
  background: none;
  border: none;
  color: #991b1b;
  font-size: 18px;
  cursor: pointer;
  margin-left: auto;
  padding: 0 2px;
}
.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
