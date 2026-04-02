import { defineStore } from 'pinia'
import { ref } from 'vue'
import httpClient from '@/shared/api/http-client'
import { handleError } from '@/shared/errors/error-handler'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref([])
  const loading = ref(false)
  const loadingMore = ref(false)
  const hasMore = ref(true)

  const PAGE_SIZE = 20

  const fetchTasks = async (projectId) => {
    loading.value = true
    hasMore.value = true
    try {
      const { data } = await httpClient.get(`/projects/${projectId}/tasks`, {
        params: { limit: PAGE_SIZE },
      })
      tasks.value = data
      hasMore.value = data.length >= PAGE_SIZE
    } catch (error) {
      handleError(error)
    } finally {
      loading.value = false
    }
  }

  // Virtual scroll: load more tasks using cursor-based pagination
  const loadMore = async (projectId) => {
    if (loadingMore.value || !hasMore.value || tasks.value.length === 0) return
    loadingMore.value = true
    try {
      const lastId = tasks.value[tasks.value.length - 1].id
      const { data } = await httpClient.get(`/projects/${projectId}/tasks`, {
        params: { limit: PAGE_SIZE, lastId },
      })
      tasks.value.push(...data)
      hasMore.value = data.length >= PAGE_SIZE
    } catch (error) {
      handleError(error)
    } finally {
      loadingMore.value = false
    }
  }

  const createTask = async (projectId, title, description) => {
    try {
      const { data } = await httpClient.post(`/projects/${projectId}/tasks`, { title, description })
      tasks.value.unshift(data)
      return data
    } catch (error) {
      handleError(error)
      return null
    }
  }

  const toggleComplete = async (projectId, task) => {
    try {
      const { data } = await httpClient.put(`/projects/${projectId}/tasks/${task.id}`, {
        completed: !task.completed,
      })
      const index = tasks.value.findIndex((t) => t.id === task.id)
      if (index !== -1) tasks.value[index] = data
    } catch (error) {
      handleError(error)
    }
  }

  const deleteTask = async (projectId, taskId) => {
    try {
      await httpClient.delete(`/projects/${projectId}/tasks/${taskId}`)
      tasks.value = tasks.value.filter((t) => t.id !== taskId)
    } catch (error) {
      handleError(error)
    }
  }

  const clearTasks = () => {
    tasks.value = []
    hasMore.value = true
  }

  return { tasks, loading, loadingMore, hasMore, fetchTasks, loadMore, createTask, toggleComplete, deleteTask, clearTasks }
})
