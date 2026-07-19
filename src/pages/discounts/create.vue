<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'
import { fetchBalanceAndInvoicesByBranchID, fetchBranchByStoreID, fetchStores, saveDiscount } from '../../services/DiscountService'
import { commaFormate } from '@/@core/utils/helpers'

const errorMessages = ref<Record<string, any>>({})
const lstStores = ref<any[]>()
const lstInvoices = ref<any[]>()
const balance = ref<number>(0)
const lstBranches = ref<any[]>()
const router = useRouter()

const form = ref<any>({
  store_id: '',
  branch_id: '',
  amount: '',
  invoice_id: '',
  remarks: '',
  date: '',
})

onMounted(() => {
  fetchStores().then((res: any) => {
    lstStores.value = res.data
  }).catch((err: any) => {
    toast.error(err.message)
  })
})

const getBranches = (id: number | string) => {
  if (id) {
    fetchBranchByStoreID(Number(id)).then((res: any) => {
      lstBranches.value = res.data
    }).catch((err: any) => {
      toast.error(err.message)
    })
  }
}

const getBalance = (id: number | string) => {
  if (id) {
    fetchBalanceAndInvoicesByBranchID(Number(id)).then((res: any) => {
      console.log(res)
      balance.value = res.data.balance || 0
      lstInvoices.value = res.data.invoices
    }).catch((err: any) => {
      toast.error(err.message)
    })
  }
}

const handleSubmit = () => {
  saveDiscount(form.value).then((res: any) => {
    toast.success('Discount created successfully!')
    router.push('/discounts')
  }).catch((err: any) => {
    if (err.response.status == '422')
      errorMessages.value = err.response.data.errors

    else if (err.response.status == '401')
      toast.error(err.response.data.message)
    else
      toast.error(err.message)
  })
}
</script>

<template>
  <VCard :title=" balance > 0 ? `Create Discount (${commaFormate(balance)})` : 'Create Discount' ">
    <VCardText>
      <VForm @submit.prevent="handleSubmit">
        <VRow>
          <VCol cols="6">
            <VRow no-gutters>
              <VCol cols="12">
                <label for="sku">Date</label>
              </VCol>

              <VCol cols="12">
                <VTextField
                  id="date"
                  v-model="form.date"
                  type="date"
                  :error-messages="errorMessages.date"
                  placeholder="Please enter date"
                  persistent-placeholder
                />
              </VCol>
            </VRow>
          </VCol>
          <VCol cols="6">
            <VRow no-gutters>
              <VCol cols="12">
                <label for="status">Stores</label>
              </VCol>

              <VCol cols="12">
                <VSelect
                  v-model="form.store_id"
                  :items="lstStores"
                  item-title="name"
                  item-value="id"
                  :error-messages="errorMessages.store_id"
                  variant="outlined"
                  @update:menu="getBranches(form.store_id)"
                />
              </VCol>
            </VRow>
          </VCol>
          <VCol
            v-if="lstBranches && lstBranches.length > 0"
            cols="6"
          >
            <VRow no-gutters>
              <VCol cols="12">
                <label for="status">Branches</label>
              </VCol>

              <VCol cols="12">
                <VSelect
                  v-model="form.branch_id"
                  :items="lstBranches"
                  item-title="name"
                  item-value="id"
                  :error-messages="errorMessages.branch_id"
                  variant="outlined"
                  @update:menu="getBalance(form.branch_id)"
                />
              </VCol>
            </VRow>
          </VCol>
          <VCol
            v-if="lstInvoices && lstInvoices.length > 0"
            cols="6"
          >
            <VRow no-gutters>
              <VCol cols="12">
                <label for="status">Invoices</label>
              </VCol>

              <VCol cols="12">
                <VSelect
                  v-model="form.invoice_id"
                  :items="lstInvoices"
                  item-title="invoice_id"
                  item-value="invoice_id"
                  :error-messages="errorMessages.invoice_id"
                  variant="outlined"
                />
              </VCol>
            </VRow>
          </VCol>
          <VCol
            v-if="balance && balance > 0"
            cols="12"
          >
            <VRow no-gutters>
              <VCol cols="12">
                <label for="sku">Amount</label>
              </VCol>

              <VCol cols="12">
                <VTextField
                  id="phone"
                  v-model="form.amount"
                  type="number"
                  :error-messages="errorMessages.amount"
                  placeholder="Please enter amount"
                  persistent-placeholder
                />
              </VCol>
            </VRow>
          </VCol>
          <VCol
            v-if="balance && balance > 0"
            cols="12"
          >
            <VRow no-gutters>
              <VCol cols="12">
                <label for="sku">Remarks</label>
              </VCol>

              <VCol cols="12">
                <VTextField
                  id="remarks"
                  v-model="form.remarks"
                  :error-messages="errorMessages.remarks"
                  placeholder="Please enter remarks"
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
              Create
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
</template>
