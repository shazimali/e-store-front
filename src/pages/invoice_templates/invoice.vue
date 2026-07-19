<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { toast } from 'vue3-toastify'
import { commaFormate } from '@/@core/utils/helpers'
import { fetchInvoiceByIDForPrint } from '@/services/InvoiceService'

// import { numberToWords } from '@core/utils/numberToWords';

const route = useRoute()
const id: number = Number(route.params.id)
const dispatched_name = localStorage.getItem('user_name')
const invoice = ref<any>({})
const total_qty = ref<number>(0)
const total_sale_tax = ref<number>(0)
const total_price = ref<number>(0)
const total_price_sx_sale_tax = ref<number>(0)
const return_total_price_sx_sale_tax = ref<number>(0)
const margin_adjustment = ref<any>('')

const styleForRight: CSSProperties = reactive({
  textAlign: 'right',
  paddingRight: '10px',
})

const styleForLeft: CSSProperties = reactive({
  textAlign: 'left',
})

const styleForOnlyRight: CSSProperties = reactive({
  textAlign: 'right',
})

const styleReturnHeading: CSSProperties = reactive({
  padding: '10px',
})

const styleTableObject: CSSProperties = reactive({
  color: 'black',
  fontSize: '13px',
  marginTop: '-20px',
})

const styleReturnTableObject: CSSProperties = reactive({
  color: 'black',
  fontSize: '13px',
})

const styleRow: CSSProperties = reactive({
  textTransform: 'none',
  height: '5px',
})

onMounted(() => {
  fetchInvoiceByIDForPrint(id).then((res: any) => {
    const data = res.data.data

    invoice.value = res.data.data
    margin_adjustment.value = res.data.data.company.inv_adjust
    total_qty.value = data.products.reduce((n: number, { qty }: any) => n + Number(qty), 0)
    data.products.forEach((pr: any) => {
      const price = Number(pr.qty) * Number(pr.price)
      const tax = (Number(pr.price) * Number(pr.qty)) / 100 * Number(pr.sale_tax)

      total_price_sx_sale_tax.value += price
      total_price.value = Number(total_price.value) + price + tax
      total_sale_tax.value += tax
    })
    data.return_products.forEach((r_pr: any) => {
      total_sale_tax.value -= (Number(r_pr.price) * Number(r_pr.qty)) / 100 * Number(r_pr.sale_tax)
      return_total_price_sx_sale_tax.value += Number(r_pr.price) * Number(r_pr.qty)
    })
  }).catch((err: any) => {
    toast.error(err.message)
  })
})
</script>

<template>
  <div
    v-if="invoice && invoice.customer && invoice.products"
    :style="{ 'margin-top': '120px', 'color': 'black', 'font-size': '13px' }"
  >
    <VContainer>
      <VRow no-gutters>
        <VCol cols="6">
          <h2 :style="{ color: 'black' }">
            Sale Tax Invoice
          </h2>
        </VCol>
      </VRow>
      <VRow no-gutters>
        <VCol cols="5">
          Invoice: <b class="ml-2">{{ invoice.invoice_id }}</b>
        </VCol>
        <VCol cols="7">
          Date: {{ invoice.date }}
        </VCol>
        <VCol cols="12">
          <span class="">{{ invoice.store.is_sr ? 'SR:' : 'RV:' }}</span> <b class="ml-9">{{ invoice.sr_number }}</b>
        </VCol>
      </VRow>
      <VRow
        no-gutters
        class="mt-3"
      >
        <VCol cols="5">
          <table>
            <tr>
              <td>Seller:</td>
              <td><b>Every Day Plastic Industry</b></td>
            </tr>
            <tr>
              <td style="vertical-align: top;">
                Address:
              </td>
              <td>{{ invoice.company.address }}</td>
            </tr>
            <tr>
              <td style="vertical-align: top;" />
              <td> Gujranwala</td>
            </tr>
            <tr>
              <td>N.T.N:</td>
              <td>{{ invoice.company.ntn }}</td>
            </tr>
            <tr>
              <td>STRN:</td>
              <td>{{ invoice.company.strn }}</td>
            </tr>
            <tr>
              <td>Tel:</td>
              <td>{{ invoice.company.phone }}</td>
            </tr>
          </table>
        </VCol>

        <VCol cols="2" />
        <VCol cols="5">
          <table>
            <tr>
              <td>Buyer:</td>
              <td>
                <strong>
                  {{ invoice.store.name }}
                </strong>
              </td>
            </tr>
            <tr>
              <td style="vertical-align: top;">
                Address:
              </td>
              <td>{{ invoice.customer.address }}</td>
            </tr>
            <tr>
              <td style="vertical-align: top;" />
              <td>{{ invoice.customer.city }}</td>
            </tr>
            <tr>
              <td>NTN:</td>
              <td>{{ invoice.customer.ntn }}</td>
            </tr>
            <tr>
              <td>STRN:</td>
              <td>{{ invoice.customer.sale_tax_number }}</td>
            </tr>
          </table>
        </VCol>
      </VRow>
    </VContainer>
    <VContainer>
      <table
        :style="styleTableObject"
        width="100%"
      >
        <thead>
          <tr>
            <th>
              Sr
            </th>
            <th>
              Cat
            </th>
            <th>
              MPN
            </th>
            <th>
              Description
            </th>
            <th>
              Qty
            </th>
            <th>
              Rate
            </th>
            <th>
              Total<sub>(Ex S.T)</sub>
            </th>
            <th>
              Sale Tax
            </th>
            <th v-if="invoice.is_ex_tax">
              Ex.Sale Tax<sup><small>({{ invoice.company.ext_tax }}%)</small></sup>
            </th>
            <th>
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in invoice.products"
            :style="{ 'text-transform': 'none', 'text-align': 'center' }"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ item.sku }}</td>
            <td>{{ item.code }}</td>
            <td :style="styleForLeft">
              {{ item.name }}
            </td>
            <td :style="styleForRight">
              {{ commaFormate(Number(item.qty)) }}
            </td>
            <td :style="styleForRight">
              {{ commaFormate(Number(item.price)) }}
            </td>
            <td :style="styleForRight">
              {{ commaFormate(Number(item.price) * Number(item.qty)) }}
            </td>
            <td :style="styleForRight">
              {{ commaFormate(Number(((Number(item.price) * Number(item.qty)) / 100 * Number(item.sale_tax)).toFixed(2))) }}
            </td>
            <td :style="styleForRight">
              {{ invoice.is_ex_tax
                ? commaFormate(Number((((Number(item.price) * Number(item.qty)) / 100 * Number(item.sale_tax) + Number(item.price) * Number(item.qty)) + ((Number(item.price) * Number(item.qty)) / 100 * Number(item.sale_tax) + Number(item.price) * Number(item.qty)) / 100 * Number(item.ext_tax)).toFixed(2)))
                : commaFormate(Number(((Number(item.price) * Number(item.qty)) / 100 * Number(item.sale_tax) + Number(item.price) * Number(item.qty)).toFixed(2)))
              }}
            </td>
          </tr>
          <tr v-if="invoice.return_products.length == 0">
            <td />
            <td />
            <td />
            <td />
            <td :style="styleForRight">
              <strong>{{ commaFormate(total_qty) }}</strong>
            </td>
            <td />
            <td :style="styleForRight">
              <strong>{{ commaFormate(total_price_sx_sale_tax) }}</strong>
            </td>
            <td :style="styleForRight">
              <strong>{{ commaFormate(Number(total_sale_tax.toFixed(2))) }}</strong>
            </td>
            <td :style="styleForRight">
              <strong>{{ commaFormate(Number(total_price.toFixed(2))) }}</strong>
            </td>
          </tr>
        </tbody>
      </table>
      <h5
        v-if="invoice.return_products.length > 0"
        :style="styleReturnHeading"
      >
        Return Items
      </h5>
      <table
        :style="styleReturnTableObject"
        width="100%"
      >
        <thead v-if="invoice.return_products.length > 0">
          <tr>
            <th>
              Sr
            </th>
            <th>
              Cat
            </th>
            <th>
              MPN
            </th>
            <th>
              Description
            </th>
            <th>
              Qty
            </th>
            <th>
              Rate
            </th>
            <th>
              Total<sub>(Ex S.T)</sub>
            </th>
            <th>
              Sale Tax
            </th>
            <th v-if="invoice.is_ex_tax">
              Ex.Sale Tax<sup><small>({{ invoice.company.ext_tax }}%)</small></sup>
            </th>
            <th>
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in invoice.return_products"
            v-if="invoice.return_products.length > 0"
            :style="{ 'text-transform': 'none', 'text-align': 'center' }"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ item.sku }}</td>
            <td>{{ item.code }}</td>
            <td :style="styleForLeft">
              {{ item.name }}
            </td>
            <td :style="styleForRight">
              {{ commaFormate(Number(item.qty)) }}
            </td>
            <td :style="styleForRight">
              {{ commaFormate(Number(item.price)) }}
            </td>
            <td :style="styleForRight">
              {{ commaFormate(Number(item.price) * Number(item.qty)) }}
            </td>
            <td :style="styleForRight">
              {{ commaFormate(Number(((Number(item.price) * Number(item.qty)) / 100 * Number(item.sale_tax)).toFixed(2))) }}
            </td>
            <td :style="styleForRight">
              {{ invoice.is_ex_tax
                ? commaFormate(Number((((Number(item.price) * Number(item.qty)) / 100 * Number(item.sale_tax) + Number(item.price) * Number(item.qty)) + ((Number(item.price) * Number(item.qty)) / 100 * Number(item.sale_tax) + Number(item.price) * Number(item.qty)) / 100 * Number(item.ext_tax)).toFixed(2)))
                : commaFormate(Number(((Number(item.price) * Number(item.qty)) / 100 * Number(item.sale_tax) + Number(item.price) * Number(item.qty)).toFixed(2)))
              }}
            </td>
          </tr>
          <tr v-if="invoice.return_products.length > 0">
            <td />
            <td />
            <td />
            <td />
            <td :style="styleForRight">
              <strong>{{ commaFormate(Number(invoice.total_qty || 0)) }}</strong>
            </td>
            <td />
            <td :style="styleForRight">
              <strong>{{ commaFormate(total_price_sx_sale_tax - return_total_price_sx_sale_tax) }}</strong>
            </td>
            <td :style="styleForRight">
              <strong>{{ commaFormate(Number(total_sale_tax.toFixed(2))) }}</strong>
            </td>
            <td :style="styleForRight">
              <strong>{{ commaFormate(Number(invoice.total_price || 0)) }}</strong>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- <div> <strong>Value in words: </strong> {{  numberToWords(invoice.total_price) }}</div> -->
      <span v-if="invoice.remarks"> <strong>Remarks: </strong>{{ invoice.remarks }}</span>
      <VRow class="text-center">
        <table :style="{ 'border-spacing': '30px', 'text-align': 'center', 'margin-left': '5%', 'margin-top': '40px' }">
          <tr>
            <td>
              <strong>_________________________</strong>
              <br>
              <strong>
                <small>
                  Checked By
                </small>
              </strong>
            </td>
            <td>
              <strong>_________________________________</strong>
              <br>
              <strong>
                <small>
                  Every Day Plastic Industry
                </small>
              </strong>
            </td>
            <td>
              <strong>_________________________</strong>
              <br>
              <strong>
                <small>
                  Prepared By
                </small>
              </strong>
            </td>
          </tr>
          <!--
            <tr>
            <td>
            <strong>
            <small>
            Checked By
            </small>
            </strong>
            </td>
            <td>
            <strong>
            <small>
            Every Day Plastic Industry
            </small>
            </strong>
            </td>
            <td>
            <strong>
            <small>
            Prepared By
            </small>
            </strong>
            </td>
            </tr>
          -->
        </table>
      </VRow>

      <!-- FBR Verification Block -->
      <VRow
        v-if="invoice.fbr_irn"
        class="justify-center mt-10"
      >
        <VCol
          cols="12"
          sm="8"
          md="6"
        >
          <div
            class="pa-4 rounded-lg d-flex align-center justify-space-between"
            style="border: 2px dashed #004488; background-color: #f7f9fc; color: black; max-width: 500px; margin: 0 auto;"
          >
            <div class="d-flex flex-column text-left">
              <div class="d-flex align-center mb-2">
                <span style="font-size: 24px; color: #004488; margin-right: 8px;">🏛️</span>
                <div>
                  <strong style="color: #004488; font-size: 14px;">FBR VERIFIED INVOICE</strong>
                  <div style="font-size: 10px; color: #666; line-height: 1;">
                    Digital Invoicing System
                  </div>
                </div>
              </div>
              <div style="font-size: 11px; margin-top: 5px;">
                <strong>FBR Invoice No (IRN):</strong>
                <div
                  class="font-mono text-subtitle-2 font-weight-bold mt-1"
                  style="letter-spacing: 0.5px; font-size: 11px;"
                >
                  {{ invoice.fbr_irn }}
                </div>
              </div>
              <div
                v-if="invoice.fbr_usin"
                style="font-size: 11px; margin-top: 5px;"
              >
                <strong>USIN:</strong> {{ invoice.fbr_usin }}
              </div>
            </div>
            <div class="ml-4 d-flex flex-column align-center">
              <img
                :src="`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(invoice.fbr_qr_url)}`"
                alt="FBR QR Code"
                style="height: 90px; width: 90px; display: block; border: 1px solid #ccc; padding: 2px; background: white;"
              >
              <small
                class="text-caption mt-1"
                style="font-size: 9px; color: #555;"
              >Scan to Verify</small>
            </div>
          </div>
        </VCol>
      </VRow>

      <!--
        <VRow
        absolute
        cols="12" class="my-10 text-center"
        :style="{'position':'absolute','bottom':'60px', 'left':'10%'}"
        >
        <VCol >
        <div>
        <strong>_________________________</strong>
        </div>
        <div>
        <strong>
        <small>
        Checked By
        </small>
        </strong>
        </div>
        </VCol>
        <VCol >
        <div>
        <strong>_________________________</strong>
        </div>
        <div>
        <strong>
        <small>
        Every Day Plastic Industry
        </small>
        </strong>
        </div>
        </VCol>
        <VCol>
        <div>
        <strong>_________________________</strong>
        </div>
        <div>
        <strong>
        <small>
        Prepared By
        </small>
        </strong>
        </div>
        </VCol>
        </VRow>
      -->
    </VContainer>
  </div>
</template>
