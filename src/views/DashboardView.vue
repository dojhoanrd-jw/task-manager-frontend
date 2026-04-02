<template>
  <AppLayout pageTitle="Dashboard">
    <ProjectSelector />

    <div v-if="projectsStore.currentProject" class="tasks-section fade-enter">
      <div class="section-header">
        <div>
          <h2>{{ projectsStore.currentProject.name }}</h2>
          <p class="subtitle">{{ projectsStore.currentProject.description || 'Manage your tasks' }}</p>
        </div>
        <router-link :to="`/projects/${projectsStore.currentProject.id}`" class="detail-link">
          View project details &rarr;
        </router-link>
      </div>
      <TaskList />
    </div>

    <div v-else class="welcome-state fade-enter">
      <div class="welcome-icon">&#128640;</div>
      <h2>Welcome to Task Manager</h2>
      <p>Select a project or create a new one to start managing your tasks.</p>
    </div>
  </AppLayout>
</template>

<script setup>
import { useProjectsStore } from '@/features/projects/store/projects.store'
import AppLayout from '@/shared/components/AppLayout.vue'
import ProjectSelector from '@/features/projects/components/ProjectSelector.vue'
import TaskList from '@/features/tasks/components/TaskList.vue'

const projectsStore = useProjectsStore()
</script>

<style scoped>
.tasks-section { margin-top: 8px; }
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}
.section-header h2 { font-size: 20px; font-weight: 700; }
.subtitle { font-size: 13px; color: var(--text-muted); margin-top: 2px; }
.detail-link {
  font-size: 13px;
  color: var(--blue);
  text-decoration: none;
  font-weight: 500;
}
.detail-link:hover { text-decoration: underline; }
.welcome-state { text-align: center; padding: 64px 24px; }
.welcome-icon { font-size: 48px; margin-bottom: 16px; }
.welcome-state h2 { font-size: 22px; margin-bottom: 8px; }
.welcome-state p { color: var(--text-muted); font-size: 14px; max-width: 400px; margin: 0 auto; }
</style>
