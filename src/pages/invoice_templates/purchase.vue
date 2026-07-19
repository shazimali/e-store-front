<script setup lang="ts">
import { toast } from 'vue3-toastify'
import { fetchPurchaseForPrintByID } from '../../services/PurchaseService'
import logo from '@images/avatars/e-logo.png'
import { commaFormate } from '@/@core/utils/helpers'

const route = useRoute()
const id: number = Number(route.params.id)
const purchase = ref<any>({})

onMounted(() => {
  fetchPurchaseForPrintByID(id).then((res: any) => {
    purchase.value = res.data.data
  }).catch((err: any) => {
    toast.error(err.message)
  })
})
</script>

<template>
  <VContainer>
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
          <h6 style="margin-left: 20px;">
            Purchase ({{ purchase.date }})
          </h6>
        </VCol>
      </VRow>
    </VCol>
  </VContainer>
  <div v-if="purchase && purchase.products">
    <VContainer>
      <VRow>
        <VCol cols="12">
          <VTable>
            <thead>
              <tr>
                <th class="text-left">
                  Sr#
                </th>
                <th class="text-left">
                  Cat
                </th>
                <th class="text-left">
                  MPN
                </th>
                <th class="text-left">
                  Store
                </th>
                <th class="text-left">
                  Description
                </th>
                <th class="text-left">
                  Rate
                </th>
                <th class="text-left">
                  Quantity
                </th>
                <th class="text-left">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in purchase.products">
                <td>{{ index + 1 }}</td>
                <td>{{ product.sku }}</td>
                <td>{{ product.code }}</td>
                <td>{{ product.store_name }}</td>
                <td>{{ product.name }}</td>
                <td>{{ commaFormate(product.price) }}</td>
                <td>{{ commaFormate(product.qty) }}</td>
                <td>{{ commaFormate(product.qty * product.price) }}</td>
              </tr>
              <tr>
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td>
                  <strong>{{ commaFormate(purchase.total_qty) }}</strong>
                </td>
                <td>
                  <strong>{{ commaFormate(purchase.total_price) }}</strong>
                </td>
              </tr>
            </tbody>
          </VTable>
        </VCol>
      </VRow>
    </VContainer>
  </div>
</template>
