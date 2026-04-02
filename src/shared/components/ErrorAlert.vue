<template>
  <div v-if="globalError" class="error-alert">
    <span>{{ globalError }}</span>
    <button @click="clearError" class="error-close">&times;</button>
  </div>
</template>

<script setup>
import { globalError, clearError } from '@/shared/errors/error-handler'
</script>

<style scoped>
.error-alert {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.error-close {
  background: none;
  border: none;
  color: #991b1b;
  font-size: 20px;
  cursor: pointer;
}
</style>
