import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import httpClient from '@/shared/api/http-client'
import { handleError } from '@/shared/errors/error-handler'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  const isAuthenticated = computed(() => !!token.value)
  const userName = computed(() => user.value?.name || '')

  const setAuth = (authData) => {
    token.value = authData.token
    user.value = authData.user
    localStorage.setItem('token', authData.token)
    localStorage.setItem('user', JSON.stringify(authData.user))
  }

  const register = async (name, email, password) => {
    try {
      const { data } = await httpClient.post('/auth/register', { name, email, password })
      setAuth(data)
      return true
    } catch (error) {
      handleError(error)
      return false
    }
  }

  const login = async (email, password) => {
    try {
      const { data } = await httpClient.post('/auth/login', { email, password })
      setAuth(data)
      return true
    } catch (error) {
      handleError(error)
      return false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return { token, user, isAuthenticated, userName, register, login, logout }
})
