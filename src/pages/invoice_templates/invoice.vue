<script setup lang="ts">
import { commaFormate } from '@/@core/utils/helpers';
import { fetchInvoiceByIDForPrint } from '@/services/InvoiceService';
// import { numberToWords } from '@core/utils/numberToWords';
import { numberToWords } from "amount-to-words";
import { toast } from 'vue3-toastify';

const route = useRoute();
const id :number = route.params.id
const dispatched_name = localStorage.getItem('user_name');
const  invoice = ref<any>({});
const styleForCode = reactive({
  padding: '4px',
})
const styleForDesc = reactive({
  padding: '1px',
})

const styleObject = reactive({
  textTransform:'none'
})

onMounted(() => {
    fetchInvoiceByIDForPrint(id).then((res:any) => {
        invoice.value = res.data.data
    }).catch((err:any) => {
        toast.error(err.message)
    })
})
</script>
<template>
  <div v-if="invoice && invoice.customer && invoice.products">
    <v-container>
      <v-row no-gutters>
        <v-col cols="6">
          <h3>Sale Tax Invoice</h3>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="6">Invoice: {{ invoice.invoice_id }}</v-col>
        <v-col cols="6">Date: {{ invoice.date }}</v-col>
        <v-col cols="12">{{ invoice.store.is_sr ? 'SR:' : 'RV:' }} {{ invoice.sr_number }}</v-col>
      </v-row>
      <v-row no-gutters class="mt-3">
        <v-col cols="5">
          <table>
            <tr>
              <td>Seller:</td>
              <td><b>Every Day Plastic Industry</b></td>
            </tr>
            <tr>
              <td style="vertical-align: top;">Address:</td>
              <td>{{ invoice.company.address}}</td>
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
        </v-col>
      
        <v-col cols="2"></v-col>
        <v-col cols="5">
          <table>
            <tr>
              <td>Buyer:</td>
              <td>
                <strong>
                  {{ invoice.customer.code +' '+ invoice.customer.name }}
                </strong>
              </td>
            </tr>
            <tr>
              <td style="vertical-align: top;">Address:</td>
              <td>{{ invoice.customer.address}}</td>
            </tr>
            <tr>
              <td>STRN:</td>
              <td>{{ invoice.customer.sale_tax_number }}</td>
            </tr>
            <tr>
              <td>Phone:</td>
              <td>{{ invoice.customer.phone }}</td>
            </tr>
          </table>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-table>
            <thead>
              <tr>
                <th  :style="styleObject">
                  Sr
                </th>
                <th  :style="styleObject">
                  Cat
                </th>
                <th  :style="styleObject">
                  MPN
                </th>
                <th  :style="styleObject">
                  Description
                </th>
                <th  :style="styleObject">
                  Quantity
                </th>
                <th  :style="styleObject">
                  Rate
                </th>
                <th  :style="styleObject">
                  SaleTax
                </th>
                <th v-if="invoice.is_ex_tax"  :style="styleObject">
                  Ex.Sale Tax<sup><small>({{ invoice.company.ext_tax }}%)</small></sup>
                </th>
                <th>
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in invoice.products" :style="styleObject">
                <td>{{ index+1 }}</td>
                <td>{{ item.sku }}</td>
                <td :style="styleForCode">{{ item.code }}</td>
                <td :style="styleForDesc">{{ item.name }}</td>
                <td>{{ commaFormate( item.qty) }}</td>
                <td>{{ commaFormate( item.price) }}</td>
                <td>
                  {{ commaFormate(((item.price * item.qty)/100*item.sale_tax).toFixed(2)) }}
                </td>
                <td>
                  {{ invoice.is_ex_tax ? 
                    commaFormate((((item.price * item.qty)/100*item.sale_tax + parseFloat(item.price * item.qty)) + parseFloat(((item.price * item.qty)/100*item.sale_tax + parseFloat(item.price * item.qty))/100*item.ext_tax)).toFixed(2))
                  :
                  commaFormate(((item.price * item.qty)/100*item.sale_tax + parseFloat(item.price * item.qty)).toFixed(2))

                  }}
                </td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <strong>{{ commaFormate( invoice.total_qty) }}</strong>
                </td>
                <td></td>
                <td></td>
                <td>
                  <strong>{{ commaFormate( invoice.total_price) }}</strong>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
  <div> <strong>Value in words: </strong> {{  numberToWords(invoice.total_price) }}</div>
  <span v-if="invoice.remarks"> <strong>Remarks: </strong>{{ invoice.remarks }}</span>
     
            <VRow cols="12" class="text-center" 
            style="    position: absolute;
    bottom: 50px; left:80px">
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
    </v-container>
  </div>
</template>
