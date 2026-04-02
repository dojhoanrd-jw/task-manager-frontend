<template>
  <div>
    <CreateTaskForm @create="onCreateTask" />

    <LoadingSpinner v-if="tasksStore.loading" text="Loading tasks..." />

    <template v-else>
      <div v-if="tasksStore.tasks.length > 0" class="task-stats">
        <span>{{ tasksStore.tasks.length }} tasks</span>
        <span>{{ completedCount }} completed</span>
      </div>

      <div ref="scrollContainer" class="task-list" @scroll="onScroll">
        <TaskItem
          v-for="task in tasksStore.tasks"
          :key="task.id"
          :task="task"
          @toggle="onToggle"
          @delete="onDelete"
        />

        <LoadingSpinner v-if="tasksStore.loadingMore" />

        <div v-if="!tasksStore.hasMore && tasksStore.tasks.length > 0" class="end-message">
          All tasks loaded
        </div>
      </div>

      <div v-if="tasksStore.tasks.length === 0" class="empty-tasks">
        <div class="empty-icon">&#10003;</div>
        <p>No tasks yet</p>
        <span>Create your first task above</span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useTasksStore } from '../store/tasks.store'
import { useProjectsStore } from '@/features/projects/store/projects.store'
import TaskItem from './TaskItem.vue'
import CreateTaskForm from './CreateTaskForm.vue'
import LoadingSpinner from '@/shared/components/LoadingSpinner.vue'

const tasksStore = useTasksStore()
const projectsStore = useProjectsStore()
const scrollContainer = ref(null)

const completedCount = computed(() => tasksStore.tasks.filter(t => t.completed).length)

watch(
  () => projectsStore.currentProject,
  (project) => {
    if (project) {
      tasksStore.fetchTasks(project.id)
    } else {
      tasksStore.clearTasks()
    }
  },
  { immediate: true }
)

const onScroll = () => {
  const el = scrollContainer.value
  if (!el) return
  const reachedBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100
  if (reachedBottom && projectsStore.currentProject) {
    tasksStore.loadMore(projectsStore.currentProject.id)
  }
}

const onCreateTask = async ({ title, description }) => {
  if (!projectsStore.currentProject) return
  await tasksStore.createTask(projectsStore.currentProject.id, title, description)
}

const onToggle = (task) => {
  if (!projectsStore.currentProject) return
  tasksStore.toggleComplete(projectsStore.currentProject.id, task)
}

const onDelete = (taskId) => {
  if (!projectsStore.currentProject) return
  tasksStore.deleteTask(projectsStore.currentProject.id, taskId)
}
</script>

<style scoped>
.task-stats {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 12px;
  padding: 0 4px;
}
.task-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 55vh;
  overflow-y: auto;
  padding-right: 4px;
}
.end-message {
  text-align: center;
  font-size: 12px;
  color: var(--text-muted);
  padding: 16px;
}
.empty-tasks {
  text-align: center;
  padding: 48px 24px;
  color: var(--text-muted);
}
.empty-icon {
  width: 48px; height: 48px;
  background: var(--bg-input);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin: 0 auto 16px;
}
.empty-tasks p {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 4px;
}
.empty-tasks span { font-size: 13px; }
</style>
