<template>
  <AppLayout :pageTitle="$t('projects.title')">
    <div class="projects-top">
      <p class="projects-count">{{ projectsStore.projects.length }} {{ $t('nav.projects').toLowerCase() }}</p>
      <BaseButton variant="primary" size="sm" @click="showCreate = true">{{ $t('projects.newProject') }}</BaseButton>
    </div>

    <LoadingSpinner v-if="projectsStore.loading" :text="$t('common.loading')" />

    <div v-else class="projects-grid">
      <div v-for="project in projectsStore.projects" :key="project.id" class="project-card fade-enter">
        <div class="project-card-header">
          <div class="project-icon">{{ project.name.charAt(0).toUpperCase() }}</div>
          <div class="project-info">
            <h3>{{ project.name }}</h3>
            <p>{{ project.description || $t('tasks.noDescription') }}</p>
          </div>
        </div>
        <div class="project-meta">
          <BaseBadge variant="blue">{{ project.members?.length || 0 }} {{ $t('projects.members') }}</BaseBadge>
          <span class="project-id">{{ project.id.slice(0, 8) }}</span>
        </div>
        <div class="project-actions">
          <BaseButton variant="outline" size="sm" @click="$router.push(`/projects/${project.id}`)">
            {{ $t('projects.open') }}
          </BaseButton>
          <BaseButton variant="ghost" size="sm" @click="openEdit(project)">{{ $t('projects.edit') }}</BaseButton>
          <BaseButton variant="ghost" size="sm" @click="confirmDelete(project)">{{ $t('projects.delete') }}</BaseButton>
        </div>
      </div>
    </div>

    <div v-if="!projectsStore.loading && projectsStore.projects.length === 0" class="empty fade-enter">
      <p>{{ $t('projects.noProjects') }}. {{ $t('projects.createFirst') }}.</p>
    </div>

    <!-- Create Modal -->
    <BaseModal :visible="showCreate" :title="$t('projects.newProject')" @close="showCreate = false">
      <form @submit.prevent="onCreate">
        <BaseInput v-model="createName" :label="$t('projects.name')" placeholder="My Project" required />
        <BaseInput v-model="createDesc" :label="$t('projects.description')" :placeholder="$t('projects.descriptionOptional')" />
        <div class="modal-actions">
          <BaseButton variant="ghost" @click="showCreate = false">{{ $t('projects.cancel') }}</BaseButton>
          <BaseButton variant="primary" :loading="saving" @click="onCreate">{{ $t('projects.create') }}</BaseButton>
        </div>
      </form>
    </BaseModal>

    <!-- Edit Modal -->
    <BaseModal :visible="showEdit" :title="$t('projects.editProject')" @close="showEdit = false">
      <form @submit.prevent="onEdit">
        <BaseInput v-model="editName" :label="$t('projects.name')" required />
        <BaseInput v-model="editDesc" :label="$t('projects.description')" />
        <div class="modal-actions">
          <BaseButton variant="ghost" @click="showEdit = false">{{ $t('projects.cancel') }}</BaseButton>
          <BaseButton variant="primary" :loading="saving" @click="onEdit">{{ $t('projects.save') }}</BaseButton>
        </div>
      </form>
    </BaseModal>

    <!-- Delete Confirm Modal -->
    <BaseModal :visible="showDeleteConfirm" :title="$t('projects.deleteProject')" @close="showDeleteConfirm = false">
      <p class="confirm-text">{{ $t('projects.deleteConfirm') }} <strong>{{ deleteTarget?.name }}</strong>? {{ $t('projects.deleteWarning') }}</p>
      <div class="modal-actions">
        <BaseButton variant="ghost" @click="showDeleteConfirm = false">{{ $t('projects.cancel') }}</BaseButton>
        <BaseButton variant="danger" :loading="saving" @click="onDelete">{{ $t('projects.delete') }}</BaseButton>
      </div>
    </BaseModal>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProjectsStore } from '@/features/projects/store/projects.store'
import AppLayout from '@/shared/components/AppLayout.vue'
import BaseButton from '@/shared/components/BaseButton.vue'
import BaseInput from '@/shared/components/BaseInput.vue'
import BaseModal from '@/shared/components/BaseModal.vue'
import BaseBadge from '@/shared/components/BaseBadge.vue'
import LoadingSpinner from '@/shared/components/LoadingSpinner.vue'

const projectsStore = useProjectsStore()

const showCreate = ref(false)
const showEdit = ref(false)
const showDeleteConfirm = ref(false)
const saving = ref(false)

const createName = ref('')
const createDesc = ref('')
const editName = ref('')
const editDesc = ref('')
const editTarget = ref(null)
const deleteTarget = ref(null)

onMounted(() => { projectsStore.fetchProjects() })

const onCreate = async () => {
  if (!createName.value.trim()) return
  saving.value = true
  const result = await projectsStore.createProject(createName.value, createDesc.value)
  saving.value = false
  if (result) {
    createName.value = ''
    createDesc.value = ''
    showCreate.value = false
  }
}

const openEdit = (project) => {
  editTarget.value = project
  editName.value = project.name
  editDesc.value = project.description || ''
  showEdit.value = true
}

const onEdit = async () => {
  if (!editName.value.trim()) return
  saving.value = true
  await projectsStore.updateProject(editTarget.value.id, editName.value, editDesc.value)
  saving.value = false
  showEdit.value = false
}

const confirmDelete = (project) => {
  deleteTarget.value = project
  showDeleteConfirm.value = true
}

const onDelete = async () => {
  saving.value = true
  await projectsStore.deleteProject(deleteTarget.value.id)
  saving.value = false
  showDeleteConfirm.value = false
}
</script>

<style scoped>
.projects-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.projects-count { font-size: 13px; color: var(--text-muted); }
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
}
.project-card {
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px;
  transition: all var(--transition);
}
.project-card:hover { box-shadow: var(--shadow-md); }
.project-card-header { display: flex; gap: 14px; margin-bottom: 14px; }
.project-icon {
  width: 40px; height: 40px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 17px;
  flex-shrink: 0;
}
.project-info { min-width: 0; }
.project-info h3 { font-size: 15px; font-weight: 600; }
.project-info p { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
.project-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}
.project-id { font-size: 11px; color: var(--text-muted); font-family: monospace; }
.project-actions { display: flex; gap: 6px; }
.modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 12px; }
.confirm-text { font-size: 14px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 8px; }
.empty { text-align: center; padding: 48px; color: var(--text-muted); font-size: 14px; }

@media (max-width: 768px) {
  .projects-grid { grid-template-columns: 1fr; }
}
</style>
