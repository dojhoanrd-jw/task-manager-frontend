<template>
  <AppLayout :pageTitle="project?.name || 'Project'">
    <LoadingSpinner v-if="loading" :text="$t('common.loading')" />

    <template v-if="project && !loading">
      <!-- Project info -->
      <div class="detail-card fade-enter">
        <div class="detail-header">
          <div class="detail-icon">{{ project.name.charAt(0).toUpperCase() }}</div>
          <div>
            <h2>{{ project.name }}</h2>
            <p class="detail-desc">{{ project.description || $t('tasks.noDescription') }}</p>
          </div>
        </div>
        <div class="detail-meta">
          <BaseBadge variant="blue">{{ $t('projects.owner') }}: {{ project.ownerId?.slice(0, 8) }}</BaseBadge>
          <BaseBadge variant="green">{{ project.members?.length || 0 }} {{ $t('projects.members') }}</BaseBadge>
          <span class="detail-id">ID: {{ project.id }}</span>
        </div>
      </div>

      <!-- Members section -->
      <div class="section fade-enter">
        <div class="section-top">
          <h3>{{ $t('members.title') }}</h3>
          <BaseButton variant="outline" size="sm" @click="showAddMember = true">{{ $t('members.addMember') }}</BaseButton>
        </div>

        <div class="members-list">
          <div v-for="memberId in project.members" :key="memberId" class="member-item">
            <div class="member-avatar">{{ memberId.charAt(0).toUpperCase() }}</div>
            <span class="member-id">{{ memberId }}</span>
            <BaseButton
              v-if="memberId !== project.ownerId"
              variant="ghost"
              size="sm"
              @click="onRemoveMember(memberId)"
            >
              {{ $t('members.remove') }}
            </BaseButton>
            <BaseBadge v-else variant="yellow">{{ $t('projects.owner') }}</BaseBadge>
          </div>
        </div>
      </div>

      <!-- Tasks section -->
      <div class="section fade-enter">
        <h3>{{ $t('tasks.title') }}</h3>
        <TaskList />
      </div>

      <!-- Add Member Modal -->
      <BaseModal :visible="showAddMember" :title="$t('members.addMemberTitle')" @close="showAddMember = false">
        <form @submit.prevent="onAddMember">
          <BaseInput v-model="memberUserId" :label="$t('members.userId')" :placeholder="$t('members.userIdPlaceholder')" required />
          <div class="modal-actions">
            <BaseButton variant="ghost" @click="showAddMember = false">{{ $t('common.cancel') }}</BaseButton>
            <BaseButton variant="primary" :loading="saving" @click="onAddMember">{{ $t('common.add') }}</BaseButton>
          </div>
        </form>
      </BaseModal>

      <!-- Task Detail Modal -->
      <BaseModal :visible="showTaskDetail" :title="$t('tasks.taskDetail')" @close="showTaskDetail = false">
        <template v-if="taskDetail">
          <div class="task-detail-field">
            <label>ID</label>
            <span class="mono">{{ taskDetail.id }}</span>
          </div>
          <div class="task-detail-field">
            <label>{{ $t('projects.name') }}</label>
            <span>{{ taskDetail.title }}</span>
          </div>
          <div class="task-detail-field">
            <label>{{ $t('projects.description') }}</label>
            <span>{{ taskDetail.description || $t('tasks.noDescription') }}</span>
          </div>
          <div class="task-detail-field">
            <label>{{ $t('tasks.status') }}</label>
            <BaseBadge :variant="taskDetail.completed ? 'green' : 'blue'">
              {{ taskDetail.completed ? $t('tasks.completedStatus') : $t('tasks.pending') }}
            </BaseBadge>
          </div>
          <div class="task-detail-field">
            <label>{{ $t('tasks.created') }}</label>
            <span>{{ taskDetail.createdDate }} {{ $t('common.at') }} {{ taskDetail.createdTime }}</span>
          </div>
          <div class="task-detail-field">
            <label>{{ $t('tasks.project') }}</label>
            <span class="mono">{{ taskDetail.projectId }}</span>
          </div>
        </template>
        <LoadingSpinner v-else />
      </BaseModal>
    </template>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, watch, provide } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectsStore } from '@/features/projects/store/projects.store'
import { useTasksStore } from '@/features/tasks/store/tasks.store'
import AppLayout from '@/shared/components/AppLayout.vue'
import BaseButton from '@/shared/components/BaseButton.vue'
import BaseInput from '@/shared/components/BaseInput.vue'
import BaseModal from '@/shared/components/BaseModal.vue'
import BaseBadge from '@/shared/components/BaseBadge.vue'
import LoadingSpinner from '@/shared/components/LoadingSpinner.vue'
import TaskList from '@/features/tasks/components/TaskList.vue'

const route = useRoute()
const projectsStore = useProjectsStore()
const tasksStore = useTasksStore()

const project = ref(null)
const loading = ref(true)
const saving = ref(false)
const showAddMember = ref(false)
const memberUserId = ref('')
const showTaskDetail = ref(false)
const taskDetail = ref(null)

// Provide a function for TaskItem to open detail
provide('openTaskDetail', async (task) => {
  showTaskDetail.value = true
  taskDetail.value = null
  const data = await tasksStore.getTaskById(route.params.projectId, task.id)
  taskDetail.value = data
})

const loadProject = async () => {
  loading.value = true
  const data = await projectsStore.getProjectById(route.params.projectId)
  if (data) {
    project.value = data
    projectsStore.selectProject(data)
  }
  loading.value = false
}

onMounted(loadProject)
watch(() => route.params.projectId, loadProject)

const onAddMember = async () => {
  if (!memberUserId.value.trim()) return
  saving.value = true
  const success = await projectsStore.addMember(project.value.id, memberUserId.value)
  saving.value = false
  if (success) {
    memberUserId.value = ''
    showAddMember.value = false
    await loadProject()
  }
}

const onRemoveMember = async (userId) => {
  const success = await projectsStore.removeMember(project.value.id, userId)
  if (success) await loadProject()
}
</script>

<style scoped>
.detail-card {
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  margin-bottom: 24px;
}
.detail-header { display: flex; gap: 16px; align-items: center; margin-bottom: 16px; }
.detail-icon {
  width: 48px; height: 48px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 20px;
  flex-shrink: 0;
}
.detail-header h2 { font-size: 20px; }
.detail-desc { font-size: 13px; color: var(--text-muted); margin-top: 2px; }
.detail-meta { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
.detail-id { font-size: 11px; color: var(--text-muted); font-family: monospace; }

.section {
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  margin-bottom: 24px;
}
.section h3 { font-size: 16px; font-weight: 600; margin-bottom: 16px; }
.section-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.section-top h3 { margin-bottom: 0; }

.members-list { display: flex; flex-direction: column; gap: 8px; }
.member-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: var(--bg-primary);
  border-radius: var(--radius-md);
}
.member-avatar {
  width: 30px; height: 30px;
  background: var(--blue);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}
.member-id { flex: 1; font-size: 13px; font-family: monospace; color: var(--text-secondary); }

.modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 12px; }

.task-detail-field {
  margin-bottom: 14px;
}
.task-detail-field label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}
.task-detail-field span { font-size: 14px; }
.mono { font-family: monospace; font-size: 13px; color: var(--text-secondary); }

@media (max-width: 768px) {
  .detail-header { flex-direction: column; align-items: flex-start; }
}
</style>
