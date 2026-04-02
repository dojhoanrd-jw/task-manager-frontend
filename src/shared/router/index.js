import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/features/auth/store/auth.store'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/features/auth/components/LoginForm.vue'),
    meta: { guest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/features/auth/components/RegisterForm.vue'),
    meta: { guest: true },
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { auth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guards
router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.auth && !authStore.isAuthenticated) {
    return '/login'
  }

  if (to.meta.guest && authStore.isAuthenticated) {
    return '/'
  }
})

export default router
