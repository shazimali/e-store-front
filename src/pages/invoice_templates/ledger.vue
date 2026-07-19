<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue3-toastify'
import type { ILedger } from '../../interfaces/ILedger'
import logo from '@images/avatars/e-logo.png'
import { fetchLedger } from '@/services/LedgerService'
import { commaFormate } from '@/@core/utils/helpers'

const lstLedgers = ref<ILedger[]>([])
const store_name = ref<string>('')
const branch_name = ref<string>('')
const router = useRouter()
const route = useRoute()
const queryParams = route.query

onMounted(() => {
  const queryStringParams = new URLSearchParams(queryParams as any).toString()

  fetchLedger(queryStringParams).then((res: any) => {
    store_name.value = res.data.store_name
    branch_name.value = res.data.branch_name

    const ledgersArr = res.data.data.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())

    ledgersArr.forEach((item: any, index: number) => {
      index == 0
        ? item.total = item.amount
        : item.type == 'invoice'
          ? item.total = (Number.parseFloat(ledgersArr[index - 1].total) + Number.parseFloat(item.amount)).toFixed(2)
          : item.total = (Number.parseFloat(ledgersArr[index - 1].total) - Number.parseFloat(item.amount)).toFixed(2)
    })
    lstLedgers.value = ledgersArr
  }).catch((err: any) => {
    toast.error(err.message)
  })
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
                {{ store_name }} {{ branch_name ? `/${branch_name}` : '' }}  Ledger
              </h6>
              <h6 style="margin-left: 0px;">
                {{ queryParams.from_date ? `From:${queryParams.from_date}` : '' }} {{ queryParams.to_date ? `- To:${queryParams.to_date}` : '' }}
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
                <th>Invoice#</th>
                <th>Description</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in lstLedgers">
                <td>{{ item.data_id }}</td>
                <td>{{ item.type }}</td>
                <td>{{ item.date }}</td>
                <td>{{ commaFormate(Number(item.amount || 0)) }}</td>
                <td>{{ commaFormate(Number(item.total || 0)) }}</td>
              </tr>
            </tbody>
          </VTable>
        </VCol>
      </VRow>
    </VContainer>
  </div>
</template>
