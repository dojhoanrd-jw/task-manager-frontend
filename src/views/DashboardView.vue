<template>
  <div class="layout">
    <!-- Top bar -->
    <header class="topbar">
      <div class="topbar-left">
        <div class="brand-icon">T</div>
        <h1 class="brand-text">Task Manager</h1>
      </div>
      <div class="topbar-right">
        <div class="user-info">
          <div class="user-avatar">{{ authStore.userName.charAt(0).toUpperCase() }}</div>
          <span class="user-name">{{ authStore.userName }}</span>
        </div>
        <button class="logout-btn" @click="onLogout" title="Sign out">
          <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
            <path fill-rule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clip-rule="evenodd"/>
            <path fill-rule="evenodd" d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-1.047a.75.75 0 111.06-1.06l2.353 2.353a.75.75 0 010 1.06l-2.353 2.354a.75.75 0 11-1.06-1.06l1.047-1.05H6.75A.75.75 0 016 10z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- Main content -->
    <main class="main-content">
      <div class="container">
        <ErrorAlert />
        <ProjectSelector />

        <div v-if="projectsStore.currentProject" class="tasks-section fade-enter">
          <div class="tasks-header">
            <div>
              <h2>{{ projectsStore.currentProject.name }}</h2>
              <p class="tasks-subtitle">{{ projectsStore.currentProject.description || 'Manage your tasks' }}</p>
            </div>
          </div>
          <TaskList />
        </div>

        <div v-else class="welcome-state fade-enter">
          <div class="welcome-icon">&#128640;</div>
          <h2>Welcome to Task Manager</h2>
          <p>Select a project or create a new one to start managing your tasks.</p>
        </div>
      </div>
    </main>
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
  projectsStore.selectProject(null)
  router.push('/login')
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Top bar */
.topbar {
  background: white;
  border-bottom: 1px solid var(--border);
  padding: 0 24px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 50;
}
.topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.brand-icon {
  width: 32px; height: 32px;
  background: var(--blue);
  color: white;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
}
.brand-text {
  font-size: 16px;
  font-weight: 700;
}
.topbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}
.user-avatar {
  width: 30px; height: 30px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
}
.user-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}
.logout-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 6px;
  border-radius: var(--radius-sm);
  transition: all var(--transition);
  display: flex;
}
.logout-btn:hover { color: var(--red); background: #fef2f2; }

/* Main */
.main-content {
  flex: 1;
  padding: 28px 0;
}
.container {
  max-width: 820px;
  margin: 0 auto;
  padding: 0 24px;
}
.tasks-section { margin-top: 8px; }
.tasks-header {
  margin-bottom: 20px;
}
.tasks-header h2 {
  font-size: 20px;
  font-weight: 700;
}
.tasks-subtitle {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 2px;
}

/* Welcome */
.welcome-state {
  text-align: center;
  padding: 64px 24px;
}
.welcome-icon {
  font-size: 48px;
  margin-bottom: 16px;
}
.welcome-state h2 {
  font-size: 22px;
  margin-bottom: 8px;
}
.welcome-state p {
  color: var(--text-muted);
  font-size: 14px;
  max-width: 400px;
  margin: 0 auto;
}
</style>
