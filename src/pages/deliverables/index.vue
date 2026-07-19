<script setup lang="ts">
import { toast } from 'vue3-toastify'
import type { IStockForm } from '../../interfaces/IStock'
import { canAccess, commaFormate } from '@core/utils/helpers'
import type { IBranchList } from '@/interfaces/IBranch'
import type { IDeliverableList } from '@/interfaces/IDeliverable'
import type { IStoreList } from '@/interfaces/IStore'
import { fetchDeliverables, fetchStores } from '@/services/Deliverable'
import { fetchBranchesByStoreID } from '@/services/InvoiceService'

const lstDeliverables = ref<any[]>([])
const loading = ref<boolean>(false)
const item_per_page = ref<number>(5)
const search = ref<string>('')
const total_items = ref<number>(0)
const current_page = ref<number>(1)
const lstStores = ref<any[]>()
const lstBranches = ref<any[]>([])
const router = useRouter()

const form = ref<IStockForm>({
  store_id: '',
  branch_id: '',
})

const headers = [
  { title: 'Sr#', align: 'start' as const, value: 'sr' },
  { title: 'Deliverable#', value: 'invoice_id' },
  { title: 'Store', value: 'store' },
  { title: 'Branch', value: 'branch' },
  { title: 'Total Quantity', value: 'total_qty' },
  { title: 'Date', value: 'date' },
  { title: 'Created At', value: 'created_at' },
  { title: 'Actions', value: 'actions' },
]

onMounted(() => {
  doFetchDeliverables()
  doFetchStores()
})

const doFetchStores = () => {
  fetchStores().then((res: any) => {
    lstStores.value = res.data
  }).catch((err: any) => {
    toast.error(err.message)
  })
}

const getBranchesByStoreID = (id: any) => {
  doFetchDeliverables()
  if (id) {
    fetchBranchesByStoreID(id).then((res: any) => {
      lstBranches.value = res.data
    }).catch((err: any) => {
      toast.error(err.message)
    })
  }
}

const handleEdit = (id: number) => {
  router.push(`deliverables/${id}`)
}

const doFetchDeliverables = () => {
  loading.value = true
  fetchDeliverables(current_page.value, item_per_page.value, search.value, form.value.store_id, form.value.branch_id).then((res: any) => {
    lstDeliverables.value = res.data.data
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
        <h3>Deliverables</h3>
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
        <VAutocomplete
          v-model="form.store_id"
          :items="lstStores"
          label="stores"
          :item-title="item => item ? `${item.code}-${item.name}` : ''"
          item-value="id"
          variant="outlined"
          @update:menu="getBranchesByStoreID(form.store_id)"
        />
        <VSpacer />
        <VAutocomplete
          v-model="form.branch_id"
          :items="lstBranches"
          label="Branches"
          :item-title="item => item ? `${item.code}-${item.name}` : ''"
          item-value="id"
          variant="outlined"
          @update:menu="doFetchDeliverables"
        />
        <VSpacer />

        <VBtn
          v-if="canAccess('deliverable_create')"
          color="primary"
          to="/deliverables/create"
        >
          New Deliverable
        </VBtn>
      </div>
      <VCard>
        <VDataTableServer
          v-model:search="search"
          v-model:page="current_page"
          v-model:items-per-page="item_per_page"
          :headers="headers"
          :items="lstDeliverables"
          :items-length="total_items"
          :loading="loading"
          item-key="id"
          class="elevation-1"
          @update:options="doFetchDeliverables"
        >
          <template #item.sr="{ index }">
            {{ index + 1 }}
          </template>
          <template #item.invoice_id="{ item }">
            <a
              :href="`/print/${item.id}/?type=deliverable`"
              target="_blank"
            >
              {{ item.invoice_id }}
            </a>
          </template>
          <template #item.total_qty="{ item }">
            {{ commaFormate(item.total_qty) }}
          </template>
          <template #item.actions="{ item }">
            <VIcon
              v-if="canAccess('deliverable_edit')"
              class="mr-2 ri-pencil-line"
              @click="handleEdit(item.id)"
            />
          </template>
        </VDataTableServer>
      </VCard>
    </VCol>
  </VRow>
</template>
