<template>
  <AppLayout pageTitle="User Management">
    <LoadingSpinner v-if="adminStore.loading" text="Loading users..." />

    <template v-else>
      <p class="user-count">{{ adminStore.users.length }} registered users</p>

      <div class="users-table-wrapper">
        <table class="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in adminStore.users" :key="user.id" class="fade-enter">
              <td>
                <div class="user-cell">
                  <div class="user-avatar">{{ (user.name || 'U').charAt(0).toUpperCase() }}</div>
                  <div>
                    <span class="user-name">{{ user.name }}</span>
                    <span class="user-id">{{ user.id.slice(0, 10) }}</span>
                  </div>
                </div>
              </td>
              <td>{{ user.email }}</td>
              <td>
                <BaseBadge :variant="roleBadge(user.role)">{{ user.role }}</BaseBadge>
              </td>
              <td>
                <BaseButton variant="outline" size="sm" @click="openRoleModal(user)">
                  Change Role
                </BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="adminStore.users.length === 0" class="empty fade-enter">
        <p>No users found.</p>
      </div>
    </template>

    <!-- Change Role Modal -->
    <BaseModal :visible="showRoleModal" title="Change User Role" @close="showRoleModal = false">
      <template v-if="selectedUser">
        <p class="role-info">
          Changing role for <strong>{{ selectedUser.name }}</strong>
        </p>
        <div class="role-options">
          <label v-for="role in roles" :key="role" class="role-option" :class="{ active: selectedRole === role }">
            <input v-model="selectedRole" type="radio" :value="role" />
            <div class="role-card">
              <span class="role-name">{{ role }}</span>
              <span class="role-desc">{{ roleDescriptions[role] }}</span>
            </div>
          </label>
        </div>
        <div class="modal-actions">
          <BaseButton variant="ghost" @click="showRoleModal = false">Cancel</BaseButton>
          <BaseButton variant="primary" :loading="saving" @click="onChangeRole">Save</BaseButton>
        </div>
      </template>
    </BaseModal>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAdminStore } from '@/features/admin/store/admin.store'
import AppLayout from '@/shared/components/AppLayout.vue'
import BaseButton from '@/shared/components/BaseButton.vue'
import BaseModal from '@/shared/components/BaseModal.vue'
import BaseBadge from '@/shared/components/BaseBadge.vue'
import LoadingSpinner from '@/shared/components/LoadingSpinner.vue'

const adminStore = useAdminStore()

const showRoleModal = ref(false)
const selectedUser = ref(null)
const selectedRole = ref('')
const saving = ref(false)

const roles = ['admin', 'member', 'viewer']
const roleDescriptions = {
  admin: 'Full access to all features',
  member: 'Can manage tasks and projects',
  viewer: 'Read-only access',
}

onMounted(() => { adminStore.fetchUsers() })

const roleBadge = (role) => {
  const map = { admin: 'red', member: 'blue', viewer: 'default' }
  return map[role] || 'default'
}

const openRoleModal = (user) => {
  selectedUser.value = user
  selectedRole.value = user.role
  showRoleModal.value = true
}

const onChangeRole = async () => {
  saving.value = true
  const success = await adminStore.updateRole(selectedUser.value.id, selectedRole.value)
  saving.value = false
  if (success) showRoleModal.value = false
}
</script>

<style scoped>
.user-count { font-size: 13px; color: var(--text-muted); margin-bottom: 16px; }

.users-table-wrapper {
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.users-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.users-table th {
  text-align: left;
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border);
}
.users-table td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}
.users-table tr:last-child td { border-bottom: none; }
.users-table tr:hover td { background: var(--bg-hover); }

.user-cell { display: flex; align-items: center; gap: 10px; }
.user-avatar {
  width: 32px; height: 32px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}
.user-name { display: block; font-weight: 500; }
.user-id { display: block; font-size: 11px; color: var(--text-muted); font-family: monospace; }

.role-info { font-size: 14px; color: var(--text-secondary); margin-bottom: 16px; }
.role-options { display: flex; flex-direction: column; gap: 8px; }
.role-option {
  cursor: pointer;
}
.role-option input { display: none; }
.role-card {
  padding: 12px 16px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  transition: all var(--transition);
}
.role-option.active .role-card {
  border-color: var(--blue);
  background: var(--bg-accent);
}
.role-option:hover .role-card { border-color: var(--blue); }
.role-name {
  display: block;
  font-weight: 600;
  font-size: 14px;
  text-transform: capitalize;
}
.role-desc { font-size: 12px; color: var(--text-muted); }

.modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; }
.empty { text-align: center; padding: 48px; color: var(--text-muted); }

/* Responsive table */
@media (max-width: 768px) {
  .users-table-wrapper { overflow-x: auto; }
  .users-table { min-width: 500px; }
}
</style>
