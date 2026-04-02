import { ref } from 'vue'

// Global error state
const globalError = ref(null)

// Extract readable message from API errors
const extractMessage = (error) => {
  if (error.response?.data?.error) {
    return error.response.data.error
  }
  if (error.code === 'ECONNABORTED') {
    return 'Request timed out. Please try again.'
  }
  if (error.code === 'ERR_NETWORK') {
    return 'Network error. Check your connection.'
  }
  return error.message || 'An unexpected error occurred'
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
