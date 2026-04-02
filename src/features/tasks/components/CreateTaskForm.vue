<template>
  <form @submit.prevent="onSubmit" class="create-task-form">
    <input v-model="title" class="input" placeholder="Task title" required />
    <input v-model="description" class="input" placeholder="Description (optional)" />
    <button type="submit" class="btn btn-primary btn-sm" :disabled="!title.trim()">Add</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['create'])

const title = ref('')
const description = ref('')

const onSubmit = () => {
  emit('create', { title: title.value, description: description.value })
  title.value = ''
  description.value = ''
}
</script>

<style scoped>
.create-task-form {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.create-task-form .input {
  flex: 1;
}
</style>
