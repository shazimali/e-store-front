<script setup lang="ts">
import { onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import type { IRole } from '@/interfaces/IRole'
import { deleteRole, fetchRoles } from '@/services/RoleService'

const lstRoles = ref<IRole[]>([])
const loading = ref<boolean>(false)
const router = useRouter()

const headers = [
  { title: 'Name', align: 'start' as const, value: 'name' },
  { title: 'Permissions', value: 'permissions' },
  { title: 'Created At', value: 'created_at' },
  { title: 'Actions', value: 'actions' },
]

onMounted(() => {
  doFetchRoles()
})

const handleEdit = (id?: number) => {
  if (id !== undefined)
    router.push(`/roles/${id}`)
}

const handleDelete = (id?: number) => {
  if (id !== undefined && confirm('Do you really want to delete?')) {
    deleteRole(id).then(res => {
      if (res.data.status == 200) {
        toast.success(res.data.message)
        doFetchRoles()
      } if (res.data.status == 201)
        toast.error(res.data.message)
    }).catch(err => {
      toast.error(err.response?.data || err.message)
    })
  }
}

const doFetchRoles = () => {
  loading.value = true
  fetchRoles().then(res => {
    lstRoles.value = res.data.data
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
        <h3>Roles</h3>
        <VBtn
          color="primary"
          to="/roles/create"
        >
          Create Role
        </VBtn>
      </div>
      <VCard>
        <VDataTable
          :headers="headers"
          :items="lstRoles"
          :loading="loading"
          :items-per-page="10"
          class="elevation-1"
        >
          <template #item.actions="{ item }">
            <VIcon
              class="mr-2 ri-pencil-line"
              @click="handleEdit(item.id)"
            />
            <VIcon
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
