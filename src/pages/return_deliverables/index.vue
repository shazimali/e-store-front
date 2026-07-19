<script setup lang="ts">
import { toast } from 'vue3-toastify'
import { canAccess, commaFormate } from '@core/utils/helpers'
import type { IReturnDeliverableList } from '@/interfaces/IReturnDeliverable'
import { fetchReturnDeliverables } from '@/services/ReturnDeliverable'

const lstDeliverables = ref<IReturnDeliverableList[]>([])
const loading = ref<boolean>(false)
const item_per_page = ref<number>(5)
const search = ref<string>('')
const total_items = ref<number>(0)
const current_page = ref<number>(1)
const router = useRouter()

const headers = [
  { title: 'Sr#', align: 'start' as const, value: 'sr' },
  { title: 'Invoice#', value: 'invoice_id' },
  { title: 'Store', value: 'store' },
  { title: 'Branch', value: 'branch' },
  { title: 'Total Quantity', value: 'total_qty' },
  { title: 'Date', value: 'date' },
  { title: 'Return Type', value: 'return_type' },
  { title: 'Created At', value: 'created_at' },
  { title: 'Actions', value: 'actions' },
]

onMounted(() => {
  doFetchDeliverables()
})

const handleEdit = (id?: number) => {
  if (id !== undefined)
    router.push(`return-deliverables/${id}`)
}

const doFetchDeliverables = () => {
  loading.value = true
  fetchReturnDeliverables(current_page.value, item_per_page.value, search.value).then((res: any) => {
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
        <h3>Return Deliverables</h3>
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
          v-if="canAccess('return_deliverable_create')"
          color="primary"
          to="/return-deliverables/create"
        >
          New Return Deliverable
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
              :href="`/print/${item.id}/?type=return-deliverable`"
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
              v-if="canAccess('return_deliverable_edit')"
              class="mr-2 ri-pencil-line"
              @click="handleEdit(item.id)"
            />
          </template>
        </VDataTableServer>
      </VCard>
    </VCol>
  </VRow>
</template>
