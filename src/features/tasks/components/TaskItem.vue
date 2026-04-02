<template>
  <div class="task-item" :class="{ completed: task.completed }">
    <div class="task-check">
      <input
        type="checkbox"
        :checked="task.completed"
        @change="$emit('toggle', task)"
      />
    </div>
    <div class="task-content">
      <span class="task-title" :class="{ strikethrough: task.completed }">
        {{ task.title }}
      </span>
      <span v-if="task.description" class="task-desc">{{ task.description }}</span>
      <div class="task-meta">
        <span class="task-id">ID: {{ task.id }}</span>
        <span class="task-date">{{ task.createdDate }} {{ task.createdTime }}</span>
      </div>
    </div>
    <button @click="$emit('delete', task.id)" class="btn btn-danger btn-sm">Delete</button>
  </div>
</template>

<script setup>
defineProps({ task: { type: Object, required: true } })
defineEmits(['toggle', 'delete'])
</script>

<style scoped>
.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s;
}
.task-item.completed {
  background: #f9fafb;
  opacity: 0.7;
}
.task-check input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #10b981;
}
.task-content {
  flex: 1;
  min-width: 0;
}
.task-title {
  display: block;
  font-weight: 500;
  font-size: 15px;
}
.strikethrough {
  text-decoration: line-through;
  color: #9ca3af;
}
.task-desc {
  display: block;
  font-size: 13px;
  color: #6b7280;
  margin-top: 2px;
}
.task-meta {
  display: flex;
  gap: 12px;
  margin-top: 4px;
  font-size: 11px;
  color: #9ca3af;
}
</style>
