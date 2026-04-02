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

  const getProjectById = async (projectId) => {
    try {
      const { data } = await httpClient.get(`/projects/${projectId}`)
      return data
    } catch (error) {
      handleError(error)
      return null
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

  const updateProject = async (projectId, name, description) => {
    try {
      const { data } = await httpClient.put(`/projects/${projectId}`, { name, description })
      const index = projects.value.findIndex((p) => p.id === projectId)
      if (index !== -1) projects.value[index] = data
      if (currentProject.value?.id === projectId) selectProject(data)
      return data
    } catch (error) {
      handleError(error)
      return null
    }
  }

  const deleteProject = async (projectId) => {
    try {
      await httpClient.delete(`/projects/${projectId}`)
      projects.value = projects.value.filter((p) => p.id !== projectId)
      if (currentProject.value?.id === projectId) selectProject(null)
      return true
    } catch (error) {
      handleError(error)
      return false
    }
  }

  const addMember = async (projectId, userId) => {
    try {
      await httpClient.post(`/projects/${projectId}/members`, { userId })
      return true
    } catch (error) {
      handleError(error)
      return false
    }
  }

  const removeMember = async (projectId, userId) => {
    try {
      await httpClient.delete(`/projects/${projectId}/members/${userId}`)
      return true
    } catch (error) {
      handleError(error)
      return false
    }
  }

  const selectProject = (project) => {
    currentProject.value = project
    localStorage.setItem('currentProject', JSON.stringify(project))
  }

  return {
    projects, currentProject, loading,
    fetchProjects, getProjectById, createProject, updateProject, deleteProject,
    addMember, removeMember, selectProject
  }
})
