<template>
  <div class="app-layout" :class="{ 'sidebar-open': sidebarOpen }">
    <!-- Mobile overlay -->
    <div v-if="sidebarOpen" class="sidebar-overlay" @click="sidebarOpen = false"></div>

    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="brand">
          <div class="brand-icon">T</div>
          <span class="brand-text">Task Manager</span>
        </div>
        <button class="close-sidebar" @click="sidebarOpen = false">&times;</button>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/" class="nav-item" @click="sidebarOpen = false">
          <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>
          Dashboard
        </router-link>
        <router-link to="/projects" class="nav-item" @click="sidebarOpen = false">
          <svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/></svg>
          Projects
        </router-link>
        <router-link v-if="authStore.user?.role === 'admin'" to="/admin" class="nav-item" @click="sidebarOpen = false">
          <svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>
          Users
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="user-card">
          <div class="user-avatar">{{ authStore.userName.charAt(0).toUpperCase() }}</div>
          <div class="user-details">
            <span class="user-name">{{ authStore.userName }}</span>
            <span class="user-role">{{ authStore.user?.role }}</span>
          </div>
        </div>
        <button class="logout-btn" @click="onLogout">Sign out</button>
      </div>
    </aside>

    <!-- Main -->
    <div class="main-wrapper">
      <header class="topbar">
        <button class="menu-toggle" @click="sidebarOpen = !sidebarOpen">
          <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
            <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
          </svg>
        </button>
        <h2 class="page-title">{{ pageTitle }}</h2>
      </header>

      <main class="main-content">
        <ErrorAlert />
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth/store/auth.store'
import ErrorAlert from '@/shared/components/ErrorAlert.vue'

defineProps({ pageTitle: { type: String, default: '' } })

const authStore = useAuthStore()
const router = useRouter()
const sidebarOpen = ref(false)

const onLogout = () => {
  authStore.logout()
  localStorage.removeItem('currentProject')
  router.push('/login')
}
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

/* Sidebar */
.sidebar {
  width: 250px;
  background: var(--bg-sidebar);
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0; bottom: 0; left: 0;
  z-index: 60;
  transition: transform 0.3s ease;
}
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.brand { display: flex; align-items: center; gap: 10px; }
.brand-icon {
  width: 32px; height: 32px;
  background: var(--blue);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 15px;
}
.brand-text { font-size: 15px; font-weight: 600; }
.close-sidebar {
  display: none;
  background: none;
  border: none;
  color: rgba(255,255,255,0.5);
  font-size: 24px;
  cursor: pointer;
}

/* Nav */
.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  color: rgba(255,255,255,0.6);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition);
}
.nav-item svg { width: 18px; height: 18px; flex-shrink: 0; }
.nav-item:hover { background: rgba(255,255,255,0.08); color: white; }
.nav-item.router-link-active {
  background: rgba(59,130,246,0.2);
  color: white;
}

/* Footer */
.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(255,255,255,0.08);
}
.user-card {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.user-avatar {
  width: 32px; height: 32px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
}
.user-details { min-width: 0; }
.user-name {
  display: block;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-role {
  display: block;
  font-size: 11px;
  color: rgba(255,255,255,0.4);
  text-transform: capitalize;
}
.logout-btn {
  width: 100%;
  padding: 8px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: var(--radius-md);
  color: rgba(255,255,255,0.6);
  font-family: inherit;
  font-size: 13px;
  cursor: pointer;
  transition: all var(--transition);
}
.logout-btn:hover { background: rgba(239,68,68,0.15); color: #fca5a5; border-color: rgba(239,68,68,0.3); }

/* Main */
.main-wrapper {
  flex: 1;
  margin-left: 250px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.topbar {
  height: 56px;
  background: white;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 40;
}
.menu-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px;
}
.page-title { font-size: 16px; font-weight: 600; }
.main-content {
  flex: 1;
  padding: 24px;
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
}
.sidebar-overlay { display: none; }

/* Responsive */
@media (max-width: 768px) {
  .sidebar { transform: translateX(-100%); }
  .sidebar-open .sidebar { transform: translateX(0); }
  .sidebar-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 55;
  }
  .close-sidebar { display: block; }
  .main-wrapper { margin-left: 0; }
  .menu-toggle { display: flex; }
  .main-content { padding: 16px; }
}
</style>
