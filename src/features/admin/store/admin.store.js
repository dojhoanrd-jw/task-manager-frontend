import { defineStore } from 'pinia'
import { ref } from 'vue'
import httpClient from '@/shared/api/http-client'
import { handleError } from '@/shared/errors/error-handler'

export const useAdminStore = defineStore('admin', () => {
  const users = ref([])
  const loading = ref(false)

  const fetchUsers = async () => {
    loading.value = true
    try {
      const { data } = await httpClient.get('/users')
      users.value = data
    } catch (error) {
      handleError(error)
    } finally {
      loading.value = false
    }
  }

  const updateRole = async (userId, role) => {
    try {
      await httpClient.put(`/users/${userId}/role`, { role })
      const index = users.value.findIndex((u) => u.id === userId)
      if (index !== -1) users.value[index].role = role
      return true
    } catch (error) {
      handleError(error)
      return false
    }
  }

  return { users, loading, fetchUsers, updateRole }
})
