<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue3-toastify'
import type { ILedgerList } from '../../interfaces/ILedger'
import { fetchStockByBranchID } from '../../services/StockService'
import logo from '@images/avatars/e-logo.png'

const lstStocks = ref<any[]>([])
const store_name = ref<string>('')
const branch_name = ref<string>('')
const router = useRouter()
const route = useRoute()
const queryParams = route.query

onMounted(() => {
  if (queryParams.branch_id) {
    fetchStockByBranchID(Number(queryParams.branch_id)).then((res: any) => {
      lstStocks.value = res.data.data
      store_name.value = res.data.branch.store.name
      branch_name.value = res.data.branch.name
    }).catch((err: any) => {
      toast.error(err.message)
    })
  }
})
</script>

<template>
  <div>
    <VContainer>
      <VRow no-gutters>
        <VCol
          cols="6"
          offset="3"
        >
          <VRow>
            <VCol cols="4">
              <VImg :src="logo" />
            </VCol>
            <VCol
              cols="8"
              class="mt-5"
            >
              <h5>Every Day Plastic Industry</h5>
              <h6 style="margin-left: 0px;">
                {{ store_name }} {{ branch_name ? `/${branch_name}` : '' }}  Stock
              </h6>
            </VCol>
          </VRow>
        </VCol>
      </VRow>
    </VContainer>
    <VContainer>
      <VRow no-gutters>
        <VCol cols="12">
          <VTable>
            <thead>
              <tr>
                <th>Product Title</th>
                <th>In Stock</th>
                <th>Out Stock</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in lstStocks">
                <td>{{ item.title }}</td>
                <td>{{ item.in_stock }}</td>
                <td>{{ item.out_stock }}</td>
                <td>{{ item.total }}</td>
              </tr>
            </tbody>
          </VTable>
        </VCol>
      </VRow>
    </VContainer>
  </div>
</template>
