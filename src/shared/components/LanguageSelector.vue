<template>
  <div class="lang-selector">
    <button
      v-for="lang in languages"
      :key="lang.code"
      class="lang-btn"
      :class="{ active: currentLocale === lang.code }"
      @click="changeLanguage(lang.code)"
      :title="lang.label"
    >
      <span class="lang-flag">{{ lang.flag }}</span>
      <span class="lang-code">{{ lang.code.toUpperCase() }}</span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const languages = [
  { code: 'es', flag: '🇪🇸', label: 'Español' },
  { code: 'en', flag: '🇺🇸', label: 'English' },
]

const currentLocale = computed(() => locale.value)

const changeLanguage = (code) => {
  locale.value = code
  localStorage.setItem('locale', code)
}
</script>

<style scoped>
.lang-selector {
  display: flex;
  gap: 6px;
  padding: 12px 16px;
}
.lang-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 12px;
  font-family: inherit;
  font-weight: 500;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: var(--radius-sm);
  cursor: pointer;
  background: transparent;
  color: rgba(255,255,255,0.5);
  transition: all var(--transition);
}
.lang-btn.active {
  background: rgba(59,130,246,0.2);
  border-color: rgba(59,130,246,0.4);
  color: white;
}
.lang-btn:hover:not(.active) {
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.8);
}
.lang-flag { font-size: 14px; }
.lang-code { letter-spacing: 0.03em; }
</style>
