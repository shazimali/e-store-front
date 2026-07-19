<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'
import type { IBranch } from '../../interfaces/IBranch'
import type { IProfitLossForm } from '../../interfaces/ILedger'
import type { IStore } from '../../interfaces/IStore'
import { fetchBranchesByStoreID, fetchProfitLoss, fetchStores } from '../../services/LedgerService'
import { commaFormate } from '@/@core/utils/helpers'

const lstStores = ref<IStore[]>([])
const lstBranches = ref<IBranch[]>([])
const lstProfitLoss = ref<any[]>([])
const loading = ref<boolean>(false)
const total_items = ref<number>()
const total_discount = ref<number>(0)
const total_profit_loss = ref<number>(0)
const router = useRouter()

const form = ref<IProfitLossForm>({
  store_id: '',
  branch_id: '',
  from_date: '',
  to_date: '',
})

const headers = [
  { title: 'name', value: 'name' },
  { title: 'Purchase', value: 'purchases' },
  { title: 'Sale', value: 'sales' },
  { title: 'Profit/Loss', value: 'diff' },
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

const fetchMeanPrice = (data: any[]) => {
  // fetch all prices from invoices regarding  this product
  const prices = data.length > 0 ? data.map((current: any) => { return current.price }) : []

  // sum all prices from invoices regarding  this product
  const prices_sum = prices.length > 0
    ? prices.reduce((accumulator: any, currentValue: any) => {
      return Number.parseFloat(accumulator) + Number.parseFloat(currentValue)
    }, 0)
    : 0

  // return  mean price value of the array
  return prices.length > 0 ? prices_sum / prices.length : 0
}

const doFetchProfitLoss = () => {
  loading.value = true

  const paramString = router.replace({ query: form.value as any })
  const searchParams = new URLSearchParams(form.value as any)

  fetchProfitLoss(searchParams.toString()).then((res: any) => {
    // total_items.value= res.data.total
    total_discount.value = res.data.discount
    total_profit_loss.value = 0

    const dataSet = [] as any[]

    res.data.products.forEach((item: any, index: number) => {
      let sales = 0
      let return_sales = 0

      // let purchases = 0;
      let invoice_qty = 0
      let return_invoice_qty = 0
      const mean_sale_price = fetchMeanPrice(item.invoices)

      // calculate qty sold by multiplying quantity with price per unit
      item.invoices.length > 0 ? item.invoices.map((inv: any, index: number) => {
        invoice_qty = Number(invoice_qty) + Number(inv.qty)
        sales = (Number(sales) + Number(mean_sale_price * inv.qty))
      })
        : []

      // calculate qty sold by multiplying quantity with price per unit
      item.return_invoices.length > 0
        ? item.return_invoices.map((r_inv: any, index: number) => {
          return_invoice_qty = Number(return_invoice_qty) + Number(r_inv.qty)
          return_sales = Number(return_sales) + Number(mean_sale_price * r_inv.qty)
        })
        : []

      // set total purchase as per mean price
      const mean_purchase_price = item.purchases && item.purchases.length > 0 ? fetchMeanPrice(item.purchases) : 0
      const purchases = mean_purchase_price * (Number(invoice_qty) - Number(return_invoice_qty))

      console.log(mean_purchase_price)
      console.log(invoice_qty)
      console.log(return_invoice_qty)
      console.log(purchases)

      const obj = {
        name: item.name,
        sales: Number(sales) - Number(return_sales),
        purchases,
        diff: Number(Math.abs((sales - return_sales) - purchases)).toFixed(2),
      }

      dataSet.push(obj)
      total_profit_loss.value += Number(obj.diff)
    })
    lstProfitLoss.value = dataSet
    loading.value = false
  }).catch((err: any) => {
    toast.error(err.message)
  })
}

const handleSubmit = () => {
  doFetchProfitLoss()
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <div class="py-0 d-flex justify-space-between rounded-lg mb-3">
        <h3>Profit Loss</h3>
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
              <label for="from_date">From Date</label>
              <VTextField
                id="from_date"
                v-model="form.from_date"
                type="date"
                tabindex="1"
                persistent-placeholder
              />
            </VCol>
            <VCol cols="6">
              <label for="to_date">To Date</label>
              <VTextField
                id="to_date"
                v-model="form.to_date"
                type="date"
                tabindex="1"
                persistent-placeholder
              />
            </VCol>
            <VCol
              cols="12"
              class="d-flex gap-4"
            >
              <VBtn type="submit">
                Search
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
        <VTable>
          <thead>
            <tr>
              <th class="text-left">
                Name
              </th>
              <th class="text-left">
                Purchase
              </th>
              <th class="text-left">
                Sale
              </th>
              <th class="text-left">
                Profit/Loss
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in lstProfitLoss">
              <td>{{ item.name }}</td>
              <td>{{ item.purchases }}</td>
              <td>{{ item.sales }}</td>
              <td>{{ item.diff }}</td>
            </tr>
            <tr v-if="total_discount > 0">
              <td />
              <td />
              <td><b>Total Before Discount = </b></td>
              <td> {{ commaFormate(total_profit_loss) }}</td>
            </tr>
            <tr v-if="total_discount > 0">
              <td />
              <td />
              <td><b>Discount = </b></td>
              <td> {{ commaFormate(total_discount) }}</td>
            </tr>
            <tr v-if="total_profit_loss > 0">
              <td />
              <td />
              <td><b>Total = </b></td>
              <td> {{ commaFormate(total_profit_loss - total_discount) }}</td>
            </tr>
          </tbody>
        </VTable>
        <!--
          <v-data-table-server
          :headers="headers"
          :items="lstProfitLoss"
          :items-length="total_items"
          v-model:page="form.page"
          v-model:items-per-page="form.item_per_page"
          item-key="id"
          @update:options ="doFetchProfitLoss"
          :loading="loading"
          class="elevation-1"
          >

          <template v-slot:item.invoice_id="{item}">
          <a :href="item.type == 'invoice' ? '/print/'+item.id+'/?type=invoice' : '/print/'+item.id+'/?type=voucher'"
          target="_blank">
          inv#{{ item.invoice_id }}
          </a>
          </template>
          <template v-slot:item.amount="{item}">
          {{ commaFormate(item.amount ) }}
          </template>
          <template v-slot:item.total="{item}">
          {{ commaFormate(item.total ) }}
          </template>
          </v-data-table-server>
        -->
      </VCard>
    </VCol>
  </VRow>
</template>
