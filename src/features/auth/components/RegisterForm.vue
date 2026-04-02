<template>
  <div class="auth-page">
    <div class="auth-card fade-enter">
      <div class="auth-brand">
        <div class="brand-icon">T</div>
        <h1>Create Account</h1>
        <p>Get started with Task Manager</p>
      </div>

      <ErrorAlert />

      <form @submit.prevent="onSubmit">
        <BaseInput v-model="name" label="Full Name" placeholder="John Doe" required />
        <BaseInput v-model="email" label="Email" type="email" placeholder="you@example.com" required />
        <BaseInput v-model="password" label="Password" type="password" placeholder="Min 8 characters" required :minlength="8" />
        <BaseButton variant="primary" block :loading="loading" @click="onSubmit">
          Create Account
        </BaseButton>
      </form>

      <p class="auth-footer">
        Already have an account?
        <router-link to="/login">Sign in</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth.store'
import BaseInput from '@/shared/components/BaseInput.vue'
import BaseButton from '@/shared/components/BaseButton.vue'
import ErrorAlert from '@/shared/components/ErrorAlert.vue'

const authStore = useAuthStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)

const onSubmit = async () => {
  loading.value = true
  const success = await authStore.register(name.value, email.value, password.value)
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
}
.auth-card {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 40px;
  width: 100%;
  max-width: 420px;
}
.auth-brand {
  text-align: center;
  margin-bottom: 32px;
}
.brand-icon {
  width: 48px; height: 48px;
  background: var(--blue);
  color: white;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
  margin: 0 auto 16px;
}
.auth-brand h1 { font-size: 22px; font-weight: 700; margin-bottom: 6px; }
.auth-brand p { font-size: 14px; color: var(--text-muted); }
.auth-footer {
  text-align: center;
  margin-top: 24px;
  font-size: 13px;
  color: var(--text-muted);
}
.auth-footer a { color: var(--blue); text-decoration: none; font-weight: 500; }
.auth-footer a:hover { text-decoration: underline; }
</style>
