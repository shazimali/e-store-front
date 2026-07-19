<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'
import type { IBranch } from '../../interfaces/IBranch'
import type { IStore } from '../../interfaces/IStore'
import { canAccess } from '@core/utils/helpers'
import { fetchBranchesAndStock, fetchStockByBranchID, fetchStores } from '@/services/StockService'
import type { IStock, IStockForm } from '@/interfaces/IStock'

const lstStores = ref<IStore[]>([])
const lstBranches = ref<IBranch[]>([])
const loading = ref<boolean>(false)
const item_per_page = ref<number>(5)
const search = ref<string>('')
const total_items = ref<number>(0)
const current_page = ref<number>(1)
const router = useRouter()
const lstStocks = ref<IStock[]>([])

const form = ref<IStockForm>({
  store_id: '',
  branch_id: '',
})

const headers = [
  { title: 'Product Title', align: 'start' as const, value: 'title' },
  { title: 'In Stock', value: 'in_stock' },
  { title: 'Out Stock', value: 'out_stock' },
  { title: 'Total', value: 'total' },
]

onMounted(() => {
  doFetchStores()
})

const handleEdit = (id?: number) => {
  if (id !== undefined)
    router.push(`stores/${id}`)
}

const doFetchStores = () => {
  loading.value = true
  fetchStores().then((res: any) => {
    lstStores.value = res.data
    loading.value = false
  }).catch((err: any) => {
    toast.error(err.message)
    loading.value = false
  })
}

const getBranchesAndStock = (id: number | string) => {
  lstBranches.value = []
  form.value.branch_id = ''
  if (id) {
    fetchBranchesAndStock(Number(id)).then((res: any) => {
      lstBranches.value = res.data.branches
      lstStocks.value = res.data.stocks
    }).catch((err: any) => {
      toast.error(err.message)
    })
  }
}

const getStockByBranchID = (id: number | string) => {
  if (id) {
    fetchStockByBranchID(Number(id)).then((res: any) => {
      lstStocks.value = res.data.data
    }).catch((err: any) => {
      toast.error(err.message)
    })
  }
}

const handlePrint = () => {
  const searchParams = new URLSearchParams(form.value as any)
  const url = `reports/print/?type=stock&${searchParams.toString()}`

  window.open(url, '_blank')
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <div class="py-0 d-flex justify-space-between rounded-lg mb-3">
        <h3>Stocks</h3>
        <VSpacer />
        <VAutocomplete
          v-model="form.store_id"
          :items="lstStores"
          label="stores"
          :item-title="item => item ? `${item.code}-${item.name}` : ''"
          item-value="id"
          variant="outlined"
          @update:menu="getBranchesAndStock(form.store_id)"
        />
        <VSpacer />
        <VAutocomplete
          v-if="lstBranches && lstBranches.length"
          v-model="form.branch_id"
          :items="lstBranches"
          label="Branches"
          :item-title="item => item ? `${item.code}-${item.name}` : ''"
          item-value="id"
          variant="outlined"
          @update:menu="getStockByBranchID(form.branch_id)"
        />
        <VSpacer />
        <VBtn
          v-if="form.branch_id"
          color="primary"
          @click="handlePrint"
        >
          Print
        </VBtn>
      </div>
      <VCard>
        <VDataTableServer
          v-model:page="current_page"
          v-model:items-per-page="item_per_page"
          :headers="headers"
          :items="lstStocks"
          :items-length="total_items"
          :loading="loading"
          item-key="id"
          class="elevation-1"
          @update:options="doFetchStores"
        />
      </VCard>
    </VCol>
  </VRow>
</template>
