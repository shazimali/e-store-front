<script setup lang="ts">
import { onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import { canAccess } from '@core/utils/helpers'
import { fetchDiscounts } from '@/services/DiscountService'
import type { IVoucherList } from '@/interfaces/IVoucher'

const lstVouchers = ref<any[]>([])
const loading = ref<boolean>(false)
const item_per_page = ref<number>(5)
const search = ref<string>('')
const total_items = ref<number>(0)
const current_page = ref<number>(1)
const router = useRouter()

const headers = [
  { title: 'Store', align: 'start' as const, value: 'store' },
  { title: 'Branch', value: 'branch' },
  { title: 'Amount', value: 'amount' },
  { title: 'Invoice ID', value: 'invoice_id' },
  { title: 'Date', value: 'date' },
  { title: 'Actions', value: 'actions' },
]

onMounted(() => {
  doFetchVouchers()
})

const handleEdit = (id?: number) => {
  if (id !== undefined)
    router.push(`discounts/${id}`)
}

const doFetchVouchers = () => {
  loading.value = true
  fetchDiscounts(current_page.value, item_per_page.value, search.value).then((res: any) => {
    lstVouchers.value = res.data.data
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
        <h3>Discounts</h3>
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
          to="/discounts/create"
        >
          Create Discount
        </VBtn>
      </div>
      <VCard>
        <VDataTableServer
          v-model:search="search"
          v-model:page="current_page"
          v-model:items-per-page="item_per_page"
          :headers="headers"
          :items="lstVouchers"
          :items-length="total_items"
          :loading="loading"
          item-key="id"
          class="elevation-1"
          @update:options="doFetchVouchers"
        >
          <!--
            <template v-slot:item.invoice_id="{item}">
            <a :href="`/print/${item.id}/?type=voucher`" target="_blank">
            vc#{{ item.invoice_id }}
            </a>
            </template>
          -->
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
