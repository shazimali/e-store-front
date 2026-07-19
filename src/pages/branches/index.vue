<script setup lang="ts">
import { onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import { canAccess } from '@/@core/utils/helpers'
import type { IStoreList } from '@/interfaces/IStore'
import { fetchBranches } from '@/services/BranchService'
import { fetchStores } from '@/services/ProductService'

const lstBranches = ref<any[]>([])
const loading = ref<boolean>(false)
const item_per_page = ref<number>(5)
const lstStores = ref<any[]>([])
const store_id = ref<any>(null)
const search = ref<string>('')
const total_items = ref<number>(0)
const current_page = ref<number>(1)
const router = useRouter()

const headers = [
  { title: 'Code', align: 'start' as const, value: 'code' },
  { title: 'Name', value: 'name' },
  { title: 'Store', value: 'store' },
  { title: 'NTN', value: 'ntn' },
  { title: 'Sale Tax ', value: 'sale_tax_number' },
  { title: 'Phone', value: 'phone' },
  { title: 'City', value: 'city' },
  { title: 'Status', value: 'status' },
  { title: 'Created At', value: 'created_at' },
  { title: 'Actions', value: 'actions' },
]

onMounted(() => {
  doFetchStores()
  fetchStores().then((res: any) => {
    lstStores.value = res.data
  }).catch((err: any) => {
    toast.error(err.message)
  })
})

const handleEdit = (id: number) => {
  router.push(`branches/${id}`)
}

const doFetchStores = () => {
  loading.value = true
  fetchBranches(current_page.value, item_per_page.value, search.value, store_id.value).then((res: any) => {
    lstBranches.value = res.data.data
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
        <h3>Branches</h3>
        <VSpacer />
        <VBtn
          v-if="canAccess('branch_create')"
          color="primary"
          to="/branches/create"
        >
          Create Branch
        </VBtn>
      </div>
      <div class="py-0 d-flex justify-space-between rounded-lg mb-3">
        <h5>Filters</h5>
        <VSpacer />
        <VAutocomplete
          v-model="store_id"
          clearable
          label="Select Store"
          :items="lstStores"
          :item-title="item => item ? `${item.code}-${item.name}` : ''"
          item-value="id"
          variant="outlined"
          @update:menu="doFetchStores"
        />
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
      </div>
      <VCard>
        <VDataTableServer
          v-model:page="current_page"
          v-model:items-per-page="item_per_page"
          :headers="headers"
          :search="search"
          :items="lstBranches"
          :items-length="total_items"
          :loading="loading"
          item-key="id"
          class="elevation-1"
          @update:options="doFetchStores"
        >
          <template #item.status="{ item }">
            <div class="text-end">
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
          </template>
        </VDataTableServer>
      </VCard>
    </VCol>
  </VRow>
</template>
