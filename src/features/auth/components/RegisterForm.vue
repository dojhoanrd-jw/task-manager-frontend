<template>
  <div class="auth-page">
    <div class="auth-lang">
      <button :class="{ active: locale === 'es' }" @click="setLang('es')">🇪🇸 ES</button>
      <button :class="{ active: locale === 'en' }" @click="setLang('en')">🇺🇸 EN</button>
    </div>
    <div class="auth-card fade-enter">
      <div class="auth-brand">
        <div class="brand-icon">T</div>
        <h1>{{ $t('auth.createAccount') }}</h1>
        <p>{{ $t('auth.registerSubtitle') }}</p>
      </div>

      <ErrorAlert />

      <form @submit.prevent="onSubmit">
        <BaseInput v-model="name" :label="$t('auth.name')" :placeholder="$t('auth.namePlaceholder')" required />
        <BaseInput v-model="email" :label="$t('auth.email')" type="email" :placeholder="$t('auth.emailPlaceholder')" required />
        <BaseInput v-model="password" :label="$t('auth.password')" type="password" :placeholder="$t('auth.minPassword')" required :minlength="8" />
        <BaseButton variant="primary" block :loading="loading" @click="onSubmit">
          {{ $t('auth.createAccount') }}
        </BaseButton>
      </form>

      <p class="auth-footer">
        {{ $t('auth.hasAccount') }}
        <router-link to="/login">{{ $t('auth.signInLink') }}</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../store/auth.store'
import BaseInput from '@/shared/components/BaseInput.vue'
import BaseButton from '@/shared/components/BaseButton.vue'
import ErrorAlert from '@/shared/components/ErrorAlert.vue'

const { locale } = useI18n()
const authStore = useAuthStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)

const setLang = (code) => { locale.value = code; localStorage.setItem('locale', code) }

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
  position: relative;
}
.auth-lang {
  position: absolute;
  top: 20px;
  right: 24px;
  display: flex;
  gap: 4px;
  background: rgba(255,255,255,0.15);
  border-radius: 6px;
  padding: 3px;
}
.auth-lang button {
  padding: 4px 12px;
  font-size: 11px;
  font-weight: 600;
  font-family: inherit;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: transparent;
  color: rgba(255,255,255,0.6);
  transition: all 0.2s;
}
.auth-lang button.active { background: white; color: #1f2937; }
.auth-card {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 40px;
  width: 100%;
  max-width: 420px;
}
.auth-brand { text-align: center; margin-bottom: 32px; }
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
.auth-footer { text-align: center; margin-top: 24px; font-size: 13px; color: var(--text-muted); }
.auth-footer a { color: var(--blue); text-decoration: none; font-weight: 500; }
.auth-footer a:hover { text-decoration: underline; }
</style>
