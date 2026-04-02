<template>
  <div>
    <CreateTaskForm @create="onCreateTask" />

    <LoadingSpinner v-if="tasksStore.loading" />

    <div v-else ref="scrollContainer" class="task-list" @scroll="onScroll">
      <TaskItem
        v-for="task in tasksStore.tasks"
        :key="task.id"
        :task="task"
        @toggle="onToggle"
        @delete="onDelete"
      />

      <LoadingSpinner v-if="tasksStore.loadingMore" />

      <p v-if="tasksStore.tasks.length === 0" class="empty-text">
        No tasks yet. Create one above.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useTasksStore } from '../store/tasks.store'
import { useProjectsStore } from '@/features/projects/store/projects.store'
import TaskItem from './TaskItem.vue'
import CreateTaskForm from './CreateTaskForm.vue'
import LoadingSpinner from '@/shared/components/LoadingSpinner.vue'

const tasksStore = useTasksStore()
const projectsStore = useProjectsStore()
const scrollContainer = ref(null)

// Fetch tasks when project changes
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

// Virtual scroll: load more when reaching bottom
const onScroll = () => {
  const el = scrollContainer.value
  if (!el) return

  const threshold = 100
  const reachedBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold

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
.task-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 4px;
}
.empty-text {
  text-align: center;
  color: #9ca3af;
  padding: 32px;
  font-size: 14px;
}
</style>
