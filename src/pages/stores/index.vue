<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'
import { canAccess } from '@core/utils/helpers'
import { fetchStores } from '@/services/StoreService'
import type { IStore } from '@/interfaces/IStore'

const lstStores = ref<IStore[]>([])
const loading = ref<boolean>(false)
const item_per_page = ref<number>(5)
const search = ref<string>('')
const total_items = ref<number>(0)
const current_page = ref<number>(1)
const router = useRouter()

const headers = [
  { title: 'Code', align: 'start' as const, value: 'code' },
  { title: 'Name', value: 'name' },
  { title: 'Head Office', value: 'city' },
  { title: 'Status', value: 'status' },
  { title: 'Created At', value: 'created_at' },
  { title: 'Actions', value: 'actions' },
]

onMounted(() => {
  doFetchStores()
})

const handleEdit = (id?: number) => {
  if (id !== undefined)
    router.push(`stores/${id}`)
}

const handleDashboard = (id?: number) => {
  if (id !== undefined)
    router.push(`store/dashboard/${id}`)
}

const doFetchStores = () => {
  loading.value = true
  fetchStores(current_page.value, item_per_page.value, search.value).then(res => {
    lstStores.value = res.data.data
    total_items.value = res.data.meta.total
    loading.value = false
  }).catch((err: any) => {
    toast.error(err.message)
    loading.value = false
  })
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <div class="py-0 d-flex justify-space-between rounded-lg mb-3">
        <h3>Stores</h3>
        <VSpacer />
        <VTextField
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          density="compact"
          label="Search"
          single-line
          flat
          hide-details
          variant="solo-filled"
        />
        <VSpacer />

        <VBtn
          v-if="canAccess('store_create')"
          color="primary"
          to="/stores/create"
        >
          Create Store
        </VBtn>
      </div>
      <VCard>
        <VDataTableServer
          v-model:search="search"
          v-model:page="current_page"
          v-model:items-per-page="item_per_page"
          :headers="headers"
          :items="lstStores"
          :items-length="total_items"
          :loading="loading"
          item-key="id"
          class="elevation-1"
          @update:options="doFetchStores"
        >
          <template #item.status="{ item }">
            <div>
              <VChip
                :color="item.status == 'ACTIVE' ? 'green' : 'red'"
                :text="item.status"
              />
            </div>
          </template>
          <template #item.actions="{ item }">
            <VIcon
              v-if="canAccess('store_edit')"
              class="mr-2 ri-pencil-line"
              @click="handleEdit(item.id)"
            />
            <VIcon
              v-if="canAccess('store_edit')"
              class="mr-2 ri-dashboard-2-line"
              @click="handleDashboard(item.id)"
            />
          </template>
        </VDataTableServer>
      </VCard>
    </VCol>
  </VRow>
</template>
