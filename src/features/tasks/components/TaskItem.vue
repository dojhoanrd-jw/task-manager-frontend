<template>
  <div class="task-item fade-enter" :class="{ 'task-completed': task.completed }">
    <button class="task-checkbox" :class="{ checked: task.completed }" @click="$emit('toggle', task)">
      <svg v-if="task.completed" viewBox="0 0 16 16" fill="none">
        <path d="M13.5 4.5L6 12L2.5 8.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <div class="task-body" @click="onViewDetail">
      <span class="task-title clickable" :class="{ strikethrough: task.completed }">{{ task.title }}</span>
      <span v-if="task.description" class="task-desc">{{ task.description }}</span>
      <div class="task-meta">
        <BaseBadge variant="default">{{ task.id.slice(0, 8) }}</BaseBadge>
        <span class="meta-date">{{ task.createdDate }}</span>
        <span class="meta-time">{{ task.createdTime }}</span>
      </div>
    </div>

    <button class="task-delete" @click="$emit('delete', task.id)" :title="$t('tasks.deleteTask')">
      <svg viewBox="0 0 16 16" fill="none">
        <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 011.334-1.334h2.666a1.333 1.333 0 011.334 1.334V4m2 0v9.333a1.333 1.333 0 01-1.334 1.334H4.667a1.333 1.333 0 01-1.334-1.334V4h9.334z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import BaseBadge from '@/shared/components/BaseBadge.vue'

const props = defineProps({ task: { type: Object, required: true } })
defineEmits(['toggle', 'delete'])

const openTaskDetail = inject('openTaskDetail', null)

const onViewDetail = () => {
  if (openTaskDetail) openTaskDetail(props.task)
}
</script>

<style scoped>
.task-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px;
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  transition: all var(--transition);
}
.task-item:hover { box-shadow: var(--shadow-sm); }
.task-completed { opacity: 0.6; }

.task-checkbox {
  width: 22px; height: 22px;
  border: 2px solid var(--border);
  border-radius: 6px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
  transition: all var(--transition);
}
.task-checkbox:hover { border-color: var(--green); }
.task-checkbox.checked {
  background: var(--green);
  border-color: var(--green);
}
.task-checkbox svg { width: 12px; height: 12px; }

.task-body { flex: 1; min-width: 0; cursor: pointer; }
.clickable:hover { color: var(--blue); }
.task-title {
  display: block;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.4;
}
.strikethrough {
  text-decoration: line-through;
  color: var(--text-muted);
}
.task-desc {
  display: block;
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 3px;
  line-height: 1.4;
}
.task-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}
.meta-date, .meta-time {
  font-size: 11px;
  color: var(--text-muted);
}

.task-delete {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: var(--radius-sm);
  transition: all var(--transition);
  flex-shrink: 0;
  opacity: 0;
}
.task-item:hover .task-delete { opacity: 1; }
.task-delete:hover { color: var(--red); background: #fef2f2; }
.task-delete svg { width: 16px; height: 16px; }
</style>
