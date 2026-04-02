<template>
  <div class="projects-section">
    <div class="section-header">
      <h3>{{ $t('projects.yourProjects') }}</h3>
      <BaseButton variant="outline" size="sm" @click="showModal = true">{{ $t('projects.newProject') }}</BaseButton>
    </div>

    <LoadingSpinner v-if="projectsStore.loading" :text="$t('common.loading')" />

    <div v-else class="project-grid">
      <div
        v-for="project in projectsStore.projects"
        :key="project.id"
        class="project-card fade-enter"
        :class="{ active: projectsStore.currentProject?.id === project.id }"
        @click="projectsStore.selectProject(project)"
      >
        <div class="project-icon">{{ project.name.charAt(0).toUpperCase() }}</div>
        <div class="project-info">
          <span class="project-name">{{ project.name }}</span>
          <span class="project-desc">{{ project.description || 'No description' }}</span>
        </div>
      </div>

      <div v-if="projectsStore.projects.length === 0" class="empty-state">
        <p>{{ $t('projects.noProjects') }}</p>
        <BaseButton variant="primary" size="sm" @click="showModal = true">{{ $t('projects.createFirst') }}</BaseButton>
      </div>
    </div>

    <!-- Create Project Modal -->
    <BaseModal :visible="showModal" :title="$t('projects.newProject')" @close="showModal = false">
      <form @submit.prevent="onCreateProject">
        <BaseInput v-model="newName" :label="$t('projects.name')" placeholder="My Project" required />
        <BaseInput v-model="newDesc" :label="$t('projects.description')" :placeholder="$t('projects.descriptionOptional')" />
        <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:8px">
          <BaseButton variant="ghost" @click="showModal = false">{{ $t('projects.cancel') }}</BaseButton>
          <BaseButton variant="primary" :loading="creating" @click="onCreateProject">{{ $t('projects.create') }}</BaseButton>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProjectsStore } from '../store/projects.store'
import BaseButton from '@/shared/components/BaseButton.vue'
import BaseInput from '@/shared/components/BaseInput.vue'
import BaseModal from '@/shared/components/BaseModal.vue'
import LoadingSpinner from '@/shared/components/LoadingSpinner.vue'

const projectsStore = useProjectsStore()

const showModal = ref(false)
const newName = ref('')
const newDesc = ref('')
const creating = ref(false)

onMounted(() => { projectsStore.fetchProjects() })

const onCreateProject = async () => {
  if (!newName.value.trim()) return
  creating.value = true
  const project = await projectsStore.createProject(newName.value, newDesc.value)
  creating.value = false
  if (project) {
    projectsStore.selectProject(project)
    newName.value = ''
    newDesc.value = ''
    showModal.value = false
  }
}
</script>

<style scoped>
.projects-section { margin-bottom: 28px; }
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}
.section-header h3 { font-size: 15px; font-weight: 600; color: var(--text-secondary); }
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
}
.project-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: white;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition);
}
.project-card:hover { border-color: var(--blue); box-shadow: var(--shadow-sm); }
.project-card.active { border-color: var(--blue); background: var(--bg-accent); }
.project-icon {
  width: 36px; height: 36px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 15px;
  flex-shrink: 0;
}
.project-info { min-width: 0; }
.project-name {
  display: block;
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.project-desc {
  display: block;
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 32px;
  color: var(--text-muted);
  font-size: 14px;
}
.empty-state p { margin-bottom: 12px; }
</style>
