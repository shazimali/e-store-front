<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'
import type { IBranch } from '../../interfaces/IBranch'
import type { ILedger, ILedgerForm } from '../../interfaces/ILedger'
import type { IStore } from '../../interfaces/IStore'
import { fetchBranchesByStoreID, fetchLedger, fetchStores } from '../../services/LedgerService'
import { commaFormate } from '@/@core/utils/helpers'

const lstStores = ref<IStore[]>([])
const lstBranches = ref<IBranch[]>([])
const lstLedgers = ref<ILedger[]>([])
const loading = ref<boolean>(false)
const router = useRouter()

const form = ref<ILedgerForm>({
  store_id: '',
  branch_id: '',
  from_date: '',
  to_date: '',
})

const headers = [
  { title: 'Invoice#', value: 'data_id' },
  { title: 'Description', value: 'type' },
  { title: 'Date', value: 'date' },
  { title: 'Amount', value: 'amount' },
  { title: 'Total', value: 'total' },
]

onMounted(() => {
  doFetchStores()
})

const doFetchStores = () => {
  fetchStores().then((res: any) => {
    lstStores.value = res.data
  }).catch((err: any) => {
    toast.error(err.message)
  })
}

const getBranches = (id: number | string) => {
  lstBranches.value = []
  form.value.branch_id = ''
  if (id) {
    fetchBranchesByStoreID(Number(id)).then((res: any) => {
      lstBranches.value = res.data
    }).catch((err: any) => {
      toast.error(err.message)
    })
  }
}

const handleSubmit = () => {
  loading.value = true

  const paramString = router.replace({ query: form.value as any })
  const searchParams = new URLSearchParams(form.value as any)

  fetchLedger(searchParams.toString()).then((res: any) => {
    const ledgersArr = res.data.data.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())

    ledgersArr.forEach((item: any, index: number) => {
      index == 0
        ? item.total = item.amount
        : item.type == 'invoice'
          ? item.total = (Number.parseFloat(ledgersArr[index - 1].total) + Number.parseFloat(item.amount)).toFixed(2)
          : item.total = (Number.parseFloat(ledgersArr[index - 1].total) - Number.parseFloat(item.amount)).toFixed(2)
    })
    lstLedgers.value = ledgersArr
    loading.value = false
  }).catch((err: any) => {
    toast.error(err.message)
  })
}

const handlePrint = () => {
  const searchParams = new URLSearchParams(form.value as any)
  const url = `print/?type=ledger&${searchParams.toString()}`

  window.open(url, '_blank')
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <div class="py-0 d-flex justify-space-between rounded-lg mb-3">
        <h3>Ledger</h3>
      </div>
      <VCard>
        <VForm @submit.prevent="handleSubmit">
          <VRow>
            <VCol cols="6">
              <VRow no-gutters>
                <VCol cols="12">
                  <label for="name">Stores</label>
                </VCol>

                <VCol cols="12">
                  <VAutocomplete
                    v-model="form.store_id"
                    :items="lstStores"
                    :item-title="item => item ? `${item.code}-${item.name}` : ''"
                    item-value="id"
                    variant="outlined"
                    @update:menu="getBranches(form.store_id)"
                  />
                </VCol>
              </VRow>
            </VCol>
            <VCol cols="6">
              <VRow no-gutters>
                <VCol cols="12">
                  <label for="code">Branches</label>
                </VCol>

                <VCol cols="12">
                  <VAutocomplete

                    v-model="form.branch_id"
                    :items="lstBranches"
                    :item-title="item => item ? `${item.code}-${item.name}` : ''"
                    item-value="id"
                    variant="outlined"
                  />
                </VCol>
              </VRow>
            </VCol>
            <VCol cols="6">
              <VRow no-gutters>
                <VCol cols="12">
                  <label for="code">From Date</label>
                </VCol>

                <VCol cols="12">
                  <VTextField
                    id="date"
                    v-model="form.from_date"
                    type="date"
                    tabindex="1"
                    persistent-placeholder
                  />
                </VCol>
              </VRow>
            </VCol>
            <VCol cols="6">
              <VRow no-gutters>
                <VCol cols="12">
                  <label for="sku">To Date</label>
                </VCol>

                <VCol cols="12">
                  <VTextField
                    id="date"
                    v-model="form.to_date"
                    type="date"
                    tabindex="1"
                    persistent-placeholder
                  />
                </VCol>
              </VRow>
            </VCol>
            <VCol
              cols="12"
              class="d-flex gap-4"
            >
              <VBtn type="submit">
                Search
              </VBtn>
              <VBtn
                v-if="Object.keys(form).length > 0"
                @click="handlePrint"
              >
                Print
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
        <VDataTable
          :headers="headers"
          :items-per-page="-1"
          :items="lstLedgers"
          :loading="loading"
          item-key="id"
          return-object
          class="elevation-1"
        >
          <template #item.invoice_id="{ item }">
            <a
              :href="item.type == 'invoice' ? `/print/${item.id}/?type=invoice` : `/print/${item.id}/?type=voucher`"
              target="_blank"
            >
              inv#{{ item.invoice_id }}
            </a>
          </template>
          <template #item.amount="{ item }">
            {{ commaFormate(item.amount) }}
          </template>
          <template #item.total="{ item }">
            {{ commaFormate(Number(item.total || 0)) }}
          </template>
        </VDataTable>
      </VCard>
    </VCol>
  </VRow>
</template>
