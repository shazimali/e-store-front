<script setup lang="ts">
import { toast } from 'vue3-toastify'
import type { IStockForm } from '../../interfaces/IStock'
import type { InfInvoice } from '../../interfaces/InfInvoice'
import { canAccess, commaFormate } from '@core/utils/helpers'
import { cancelInvoice, fetchBranchesByStoreID, fetchInvoices, fetchStoresAndCompany } from '@/services/InvoiceService'
import type { IStoreList } from '@/interfaces/IStore'
import type { IBranchList } from '@/interfaces/IBranch'

const lstInvoices = ref<InfInvoice[]>([])
const loading = ref<boolean>(false)
const item_per_page = ref<number>(10)
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
  { title: 'Invoice#', value: 'invoice_id' },
  { title: 'Store', value: 'store' },
  { title: 'Branch', value: 'branch' },
  { title: 'Total Quantity', value: 'total_qty' },
  { title: 'Total Price', value: 'total_price' },
  { title: 'Date', value: 'date' },
  { title: 'FBR Status', value: 'fbr_status' },
  { title: 'FBR IRN', value: 'fbr_irn' },
  { title: 'Created At', value: 'created_at' },
  { title: 'Actions', value: 'actions' },
]

onMounted(() => {
  doFetchInvoices()
  doFetchStores()
})

const doFetchStores = () => {
  fetchStoresAndCompany().then((res: any) => {
    lstStores.value = res.data.stores
  }).catch((err: any) => {
    toast.error(err.message)
  })
}

const getBranchesByStoreID = (id: any) => {
  doFetchInvoices()
  if (id) {
    fetchBranchesByStoreID(id).then((res: any) => {
      lstBranches.value = res.data
    }).catch((err: any) => {
      toast.error(err.message)
    })
  }
}

const handleEdit = (id?: number) => {
  if (id !== undefined)
    router.push(`invoices/${id}`)
}

const handleCancel = (id?: number) => {
  if (id !== undefined && confirm('Are you sure you want to cancel this invoice? This will register a full Credit Note reversal with FBR.')) {
    cancelInvoice(id).then((res: any) => {
      toast.success('Invoice cancelled successfully')
      doFetchInvoices()
    }).catch((err: any) => {
      toast.error(err.response?.data?.message || err.message || 'Failed to cancel invoice')
    })
  }
}

const doFetchInvoices = () => {
  loading.value = true
  fetchInvoices(current_page.value, item_per_page.value, search.value, form.value.store_id, form.value.branch_id).then((res: any) => {
    lstInvoices.value = res.data.data
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
        <h3>Invoices</h3>
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
          @update:menu="doFetchInvoices"
        />
        <VSpacer />
        <VBtn
          v-if="canAccess('invoice_create')"
          color="primary"
          to="/invoices/create"
        >
          New Invoice
        </VBtn>
      </div>
      <VCard>
        <VDataTableServer
          v-model:search="search"
          v-model:page="current_page"
          v-model:items-per-page="item_per_page"
          :headers="headers"
          :items="lstInvoices"
          :items-length="total_items"
          :loading="loading"
          item-key="id"
          class="elevation-1"
          @update:options="doFetchInvoices"
        >
          <template #item.sr="{ index }">
            {{ index + 1 }}
          </template>
          <template #item.invoice_id="{ item }">
            <div class="d-flex align-center">
              <a
                :href="`/print/${item.id}/?type=invoice`"
                target="_blank"
                :class="{ 'text-decoration-line-through text-error': item.is_cancelled }"
              >
                inv#{{ item.invoice_id }}
              </a>
              <VChip
                v-if="item.is_cancelled"
                color="error"
                size="x-small"
                class="ml-1"
                label
              >
                Cancelled
              </VChip>
            </div>
          </template>
          <template #item.total_qty="{ item }">
            {{ commaFormate(Number(item.total_qty)) }}
          </template>
          <template #item.fbr_status="{ item }">
            <VChip
              :color="item.fbr_status === 'submitted' ? 'success' : (item.fbr_status === 'pending' ? 'warning' : (item.fbr_status === 'failed' ? 'error' : 'default'))"
              size="small"
              label
              class="text-capitalize"
            >
              {{ item.fbr_status || 'N/A' }}
            </VChip>
          </template>
          <template #item.fbr_irn="{ item }">
            <span class="text-caption font-mono">{{ item.fbr_irn || '—' }}</span>
          </template>
          <template #item.actions="{ item }">
            <VIcon
              v-if="canAccess('invoice_edit') && !item.is_cancelled"
              class="mr-2 ri-pencil-line"
              @click="handleEdit(item.id)"
            />
            <VIcon
              v-if="canAccess('invoice_delete') && !item.is_cancelled"
              class="ri-delete-bin-line text-error"
              title="Cancel Invoice"
              @click="handleCancel(item.id)"
            />
          </template>
        </VDataTableServer>
      </VCard>
    </VCol>
  </VRow>
</template>
