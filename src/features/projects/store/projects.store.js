import { defineStore } from 'pinia'
import { ref } from 'vue'
import httpClient from '@/shared/api/http-client'
import { handleError } from '@/shared/errors/error-handler'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref([])
  const currentProject = ref(JSON.parse(localStorage.getItem('currentProject') || 'null'))
  const loading = ref(false)

  const fetchProjects = async () => {
    loading.value = true
    try {
      const { data } = await httpClient.get('/projects')
      projects.value = data
    } catch (error) {
      handleError(error)
    } finally {
      loading.value = false
    }
  }

  const createProject = async (name, description) => {
    try {
      const { data } = await httpClient.post('/projects', { name, description })
      projects.value.unshift(data)
      return data
    } catch (error) {
      handleError(error)
      return null
    }
  }

  const selectProject = (project) => {
    currentProject.value = project
    localStorage.setItem('currentProject', JSON.stringify(project))
  }

  return { projects, currentProject, loading, fetchProjects, createProject, selectProject }
})
