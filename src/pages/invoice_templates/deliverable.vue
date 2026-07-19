<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { toast } from 'vue3-toastify'
import logo from '@images/avatars/e-logo.png'
import { commaFormate } from '@/@core/utils/helpers'
import { fetchDeliverableByIDForPrint } from '@/services/Deliverable'

const route = useRoute()
const id: number = Number(route.params.id)
const dispatched_name = localStorage.getItem('user_name')

const styleForRight: CSSProperties = reactive({
  textAlign: 'right',
})

const styleForCenter: CSSProperties = reactive({
  textAlign: 'center',
})

const styleForLeft: CSSProperties = reactive({
  textAlign: 'left',
})

const styleTableObject: CSSProperties = reactive({
  color: 'black',
  fontSize: '13px',
  marginTop: '-20px',
  width: '100%',
})

const styleRow: CSSProperties = reactive({
  textTransform: 'none',
  height: '5px',
})

const styleDV: CSSProperties = reactive({
  color: 'black',
  fontSize: '13px',
})

const deliverable = ref<any>({})
const margin_adjustment = ref<any>('')

onMounted(() => {
  fetchDeliverableByIDForPrint(id).then((res: any) => {
    deliverable.value = res.data.data
    margin_adjustment.value = res.data.data.company.del_adjust
  }).catch((err: any) => {
    toast.error(err.message)
  })
})
</script>

<template>
  <div
    v-if="deliverable && deliverable.customer && deliverable.products"
    :style="styleDV"
  >
    <VContainer>
      <VRow no-gutters>
        <VCol cols="12">
          <VRow>
            <VCol cols="3">
              <VImg :src="logo" />
            </VCol>
            <VCol
              cols="9"
              class="mt-5"
            >
              <h1 :style="{ color: 'black' }">
                Every Day Plastic Industry
              </h1>
              <h3 :style="{ 'margin-left': '85px', 'color': 'black' }">
                Delivery Challan
              </h3>
            </VCol>
          </VRow>
        </VCol>
      </VRow>
      <VRow
        no-gutters
        class="mt-5"
      >
        <VCol cols="12">
          D/C#: <b class="ml-7">{{ deliverable.invoice_sr_number }}</b>
        </VCol>
        <VCol cols="12">
          D/C Date: <span class="ml-1">{{ deliverable.date }}</span>
        </VCol>
      </VRow>
      <VRow
        no-gutters
        class="mt-3"
      >
        <VCol cols="5">
          <table>
            <tr>
              <td>Customer:</td>
              <td>
                <strong>
                  {{ `${deliverable.customer.code} ${deliverable.customer.name}` }}
                </strong>
              </td>
            </tr>
            <tr>
              <td style="vertical-align: top;">
                Address:
              </td>
              <td>{{ deliverable.customer.address }},</td>
            </tr>
            <tr>
              <td style="vertical-align: top;" />
              <td> {{ deliverable.city.title }}</td>
            </tr>
            <tr>
              <td>N.T.N:</td>
              <td>{{ deliverable.customer.ntn }}</td>
            </tr>
            <tr>
              <td>STRN:</td>
              <td>{{ deliverable.customer.sale_tax_number }}</td>
            </tr>
            <tr>
              <td>Phone:</td>
              <td>{{ deliverable.customer.phone }}</td>
            </tr>
            <tr />
            <tr />
            <tr />
            <tr>
              <td colspan="2">
                <strong>Remarks: </strong>{{ deliverable.remarks }}
              </td>
            </tr>
          </table>
        </VCol>
        <VCol cols="2" />
        <VCol cols="5">
          <table>
            <tr>
              <td>{{ deliverable.store.is_sr ? 'SR#:' : 'RV#:' }}</td>
              <td>
                <strong>
                  {{ deliverable.sr_number }}
                </strong>
              </td>
            </tr>
            <tr>
              <td>Order Date:</td>
              <td>{{ deliverable.order_date }}</td>
            </tr>
            <tr>
              <td>Our N.T.N:</td>
              <td>{{ deliverable.company.ntn }}</td>
            </tr>
            <tr>
              <td>Our STRN:</td>
              <td>{{ deliverable.company.strn }}</td>
            </tr>
            <tr>
              <td>Tel:</td>
              <td>{{ deliverable.company.phone }}</td>
            </tr>
          </table>
        </VCol>
      </VRow>
    </VContainer>
    <VContainer>
      <VRow>
        <VCol cols="12">
          <table :style="styleTableObject">
            <thead>
              <tr>
                <th>
                  Sr
                </th>
                <th>
                  {{ deliverable.store.sku_name }}
                </th>
                <th>
                  MPN
                </th>
                <th>
                  Description
                </th>
                <th>
                  Quantity
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in deliverable.products">
                <td :style="styleForCenter">
                  {{ index + 1 }}
                </td>
                <td :style="styleForCenter">
                  {{ product.sku }}
                </td>
                <td :style="styleForCenter">
                  {{ product.code }}
                </td>
                <td>{{ product.name }}</td>
                <td :style="styleForRight">
                  {{ commaFormate(product.qty) }}
                </td>
              </tr>
              <tr>
                <td />
                <td />
                <td />
                <td />
                <td :style="styleForRight">
                  <strong>Total:{{ commaFormate(deliverable.total_qty) }}</strong>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- <span> <strong>Remarks: </strong>{{ deliverable.remarks }}</span> -->
        </VCol>
      </VRow>
      <VRow>
        <VCol col="10" />
        <VCol col="2" />
        <table style="position: absolute; bottom:20px; right: 10px;">
          <tr>
            <td>
              <b>Courier/Driver/Adda: </b>
            </td>
            <td>
              ___________________________________
            </td>
          </tr>
          <tr>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>
              <b>Checked: </b>
            </td>
            <td>
              ___________________________________
            </td>
          </tr>
        </table>
      </VRow>
    </VContainer>
  </div>
</template>
