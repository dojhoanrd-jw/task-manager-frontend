<template>
  <div class="container">
    <header class="dashboard-header">
      <h1>Task Manager</h1>
      <div class="header-right">
        <span class="user-name">{{ authStore.userName }}</span>
        <button @click="onLogout" class="btn btn-secondary btn-sm">Logout</button>
      </div>
    </header>

    <ErrorAlert />

    <ProjectSelector />

    <div v-if="projectsStore.currentProject" class="card">
      <h2 class="section-title">
        Tasks - {{ projectsStore.currentProject.name }}
      </h2>
      <TaskList />
    </div>

    <div v-else class="card empty-state">
      <p>Select or create a project to manage tasks.</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { useProjectsStore } from '@/features/projects/store/projects.store'
import ProjectSelector from '@/features/projects/components/ProjectSelector.vue'
import TaskList from '@/features/tasks/components/TaskList.vue'
import ErrorAlert from '@/shared/components/ErrorAlert.vue'

const authStore = useAuthStore()
const projectsStore = useProjectsStore()
const router = useRouter()

const onLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.user-name {
  font-size: 14px;
  color: #6b7280;
}
.section-title {
  margin-bottom: 16px;
  font-size: 18px;
}
.empty-state {
  text-align: center;
  color: #9ca3af;
  padding: 48px;
}
</style>
