<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'
import { canAccess } from '@core/utils/helpers'
import { deleteUser, fetchUsers } from '@/services/UserService'
import type { IUser } from '@/interfaces/IUser'

const lstUsers = ref<IUser[]>([])
const loading = ref<boolean>(false)
const router = useRouter()

const headers = [
  { title: 'Name', align: 'start' as const, value: 'name' },
  { title: 'Email', value: 'email' },
  { title: 'Assigned Roles', value: 'assigned_roles' },
  { title: 'Created At', value: 'created_at' },
  { title: 'Actions', value: 'actions' },
]

onMounted(() => {
  doFetchUsers()
})

const handleEdit = (id?: number) => {
  if (id !== undefined)
    router.push(`users/${id}`)
}

const handleDelete = (id?: number) => {
  if (id !== undefined && confirm('Do you really want to delete?')) {
    deleteUser(id).then(res => {
      toast.success(res.data)
      doFetchUsers()
    }).catch(err => {
      toast.error(err.response?.data || err.message)
    })
  }
}

const doFetchUsers = () => {
  loading.value = true
  fetchUsers().then(res => {
    lstUsers.value = res.data.data
    loading.value = false
  }).catch(err => {
    toast.error(err.message)
    loading.value = false
  })
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <div class="py-0 d-flex justify-space-between rounded-lg mb-3">
        <h3>Users</h3>
        <VBtn
          v-if="canAccess('user_create')"
          color="primary"
          to="/users/create"
        >
          Create User
        </VBtn>
      </div>
      <VCard>
        <VDataTable
          :headers="headers"
          :items="lstUsers"
          :loading="loading"
          :items-per-page="10"
          item-key="id"
          class="elevation-1"
        >
          <template #item.actions="{ item }">
            <VIcon
              v-if="canAccess('user_edit')"
              class="mr-2 ri-pencil-line"
              @click="handleEdit(item.id)"
            />
            <VIcon
              v-if="canAccess('user_delete')"
              size="small"
              class="ri-close-circle-fill"
              @click="handleDelete(item.id)"
            />
          </template>
        </VDataTable>
      </VCard>
    </VCol>
  </VRow>
</template>
