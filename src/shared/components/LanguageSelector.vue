<template>
  <div class="lang-selector">
    <button
      v-for="lang in languages"
      :key="lang.code"
      class="lang-btn"
      :class="{ active: currentLocale === lang.code }"
      @click="changeLanguage(lang.code)"
    >
      {{ lang.flag }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const languages = [
  { code: 'es', flag: 'ES' },
  { code: 'en', flag: 'EN' },
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
  gap: 4px;
  background: rgba(255,255,255,0.08);
  border-radius: var(--radius-sm);
  padding: 3px;
}
.lang-btn {
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  font-family: inherit;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: transparent;
  color: rgba(255,255,255,0.5);
  transition: all var(--transition);
  letter-spacing: 0.03em;
}
.lang-btn.active {
  background: var(--blue);
  color: white;
}
.lang-btn:hover:not(.active) {
  color: white;
}
</style>
