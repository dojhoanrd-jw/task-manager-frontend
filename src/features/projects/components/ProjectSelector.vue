<template>
  <div class="project-selector">
    <div class="project-header">
      <h3>Projects</h3>
      <button @click="showForm = !showForm" class="btn btn-primary btn-sm">
        {{ showForm ? 'Cancel' : '+ New' }}
      </button>
    </div>

    <!-- Create project form -->
    <form v-if="showForm" @submit.prevent="onCreateProject" class="project-form">
      <input v-model="newName" class="input" placeholder="Project name" required />
      <input v-model="newDesc" class="input" placeholder="Description (optional)" />
      <button type="submit" class="btn btn-success btn-sm">Create</button>
    </form>

    <LoadingSpinner v-if="projectsStore.loading" />

    <!-- Project list -->
    <div v-else class="project-list">
      <div
        v-for="project in projectsStore.projects"
        :key="project.id"
        class="project-item"
        :class="{ active: projectsStore.currentProject?.id === project.id }"
        @click="onSelect(project)"
      >
        <span class="project-name">{{ project.name }}</span>
        <span class="project-desc">{{ project.description }}</span>
      </div>
      <p v-if="projectsStore.projects.length === 0" class="empty-text">
        No projects yet. Create one to get started.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProjectsStore } from '../store/projects.store'
import LoadingSpinner from '@/shared/components/LoadingSpinner.vue'

const projectsStore = useProjectsStore()

const showForm = ref(false)
const newName = ref('')
const newDesc = ref('')

onMounted(() => {
  projectsStore.fetchProjects()
})

const onSelect = (project) => {
  projectsStore.selectProject(project)
}

const onCreateProject = async () => {
  const project = await projectsStore.createProject(newName.value, newDesc.value)
  if (project) {
    projectsStore.selectProject(project)
    newName.value = ''
    newDesc.value = ''
    showForm.value = false
  }
}
</script>

<style scoped>
.project-selector {
  margin-bottom: 24px;
}
.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.project-form {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.project-form .input {
  flex: 1;
}
.project-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.project-item {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  min-width: 180px;
}
.project-item:hover {
  border-color: #3b82f6;
}
.project-item.active {
  border-color: #3b82f6;
  background: #eff6ff;
}
.project-name {
  display: block;
  font-weight: 600;
  font-size: 14px;
}
.project-desc {
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}
.empty-text {
  color: #9ca3af;
  font-size: 14px;
}
</style>
