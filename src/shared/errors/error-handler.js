import { ref } from 'vue'
import i18n from '@/shared/i18n'

// Global error state
const globalError = ref(null)

// Translate backend error messages using i18n error map
const translateError = (message) => {
  const { t, te } = i18n.global
  const key = `errors.${message}`

  if (te(key)) {
    return t(key)
  }

  return message
}

// Extract readable message from API errors
const extractMessage = (error) => {
  const { t } = i18n.global

  if (error.response?.data?.error) {
    return translateError(error.response.data.error)
  }
  if (error.code === 'ECONNABORTED') {
    return t('errors.timeout_error')
  }
  if (error.code === 'ERR_NETWORK') {
    return t('errors.network_error')
  }
  return t('errors.unknown_error')
}

// Handle API errors centrally
const handleError = (error) => {
  const message = extractMessage(error)
  globalError.value = message
  console.error('[API Error]', message)
  return message
}

// Clear global error
const clearError = () => {
  globalError.value = null
}

export { globalError, handleError, clearError }
