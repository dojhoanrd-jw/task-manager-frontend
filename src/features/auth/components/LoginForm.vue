<template>
  <div class="auth-page">
    <div class="card auth-card">
      <h2>Login</h2>
      <form @submit.prevent="onSubmit">
        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" class="input" placeholder="your@email.com" required />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" class="input" placeholder="Min 8 characters" required />
        </div>
        <button type="submit" class="btn btn-primary" :disabled="loading" style="width:100%">
          {{ loading ? 'Loading...' : 'Login' }}
        </button>
      </form>
      <p class="auth-link">
        Don't have an account? <router-link to="/register">Register</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth.store'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)

const onSubmit = async () => {
  loading.value = true
  const success = await authStore.login(email.value, password.value)
  loading.value = false
  if (success) router.push('/')
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.auth-card {
  width: 100%;
  max-width: 400px;
}
.auth-card h2 {
  margin-bottom: 24px;
  text-align: center;
}
.auth-link {
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  color: #6b7280;
}
.auth-link a {
  color: #3b82f6;
  text-decoration: none;
}
</style>
