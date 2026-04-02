<template>
  <div class="create-task">
    <form @submit.prevent="onSubmit" class="create-task-form">
      <BaseInput v-model="title" :placeholder="$t('tasks.whatToDo')" required />
      <div class="form-actions">
        <input v-model="description" class="desc-input" :placeholder="$t('tasks.addDescription')" />
        <BaseButton variant="primary" size="sm" :disabled="!title.trim()" @click="onSubmit">
          {{ $t('tasks.addTask') }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseInput from '@/shared/components/BaseInput.vue'
import BaseButton from '@/shared/components/BaseButton.vue'

const emit = defineEmits(['create'])

const title = ref('')
const description = ref('')

const onSubmit = () => {
  if (!title.value.trim()) return
  emit('create', { title: title.value, description: description.value })
  title.value = ''
  description.value = ''
}
</script>

<style scoped>
.create-task {
  background: white;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  padding: 16px;
  margin-bottom: 16px;
}
.form-actions {
  display: flex;
  gap: 8px;
  margin-top: -8px;
}
.desc-input {
  flex: 1;
  padding: 9px 14px;
  background: var(--bg-input);
  border: 1.5px solid transparent;
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: 13px;
  color: var(--text-primary);
  outline: none;
  transition: all var(--transition);
}
.desc-input:focus {
  border-color: var(--blue);
  background: white;
}
.desc-input::placeholder { color: var(--text-muted); }
</style>
