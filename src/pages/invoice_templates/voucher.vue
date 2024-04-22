<script setup lang="ts">
import { commaFormate } from '@/@core/utils/helpers';
import { fetchVoucherByID } from '@/services/VoucherService';
// import { numberToWords } from '@core/utils/numberToWords';
import { numberToWords } from "amount-to-words";
import { toast } from 'vue3-toastify';

const route = useRoute();
const id :number = route.params.id
const dispatched_name = localStorage.getItem('user_name');
const  voucher = ref<any>({});
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
    fetchVoucherByID(id).then((res:any) => {
        voucher.value = res.data
    }).catch((err:any) => {
        toast.error(err.message)
    })
})
</script>
<template>
  <div v-if="voucher && voucher.customer">
    <v-container>
      <v-row no-gutters>
        <v-col cols="6">
          <h3>Sale Tax Voucher</h3>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="6">voucher#{{ voucher.voucher_id }}</v-col>
        <v-col cols="6">Date: {{ voucher.date }}</v-col>
        <v-col cols="12">{{ voucher.store.is_sr ? 'SR#:' : 'RV#:' }}: {{ voucher.sr_number }}</v-col>
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
              <td>{{ voucher.company.address}}</td>
            </tr>
            <tr>
              <td>N.T.N:</td>
              <td>{{ voucher.company.ntn }}</td>
            </tr>
            <tr>
              <td>STRN:</td>
              <td>{{ voucher.company.strn }}</td>
            </tr>
            <tr>
              <td>Tel:</td>
              <td>{{ voucher.company.phone }}</td>
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
                  {{ voucher.customer.code +' '+ voucher.customer.name }}
                </strong>
              </td>
            </tr>
            <tr>
              <td style="vertical-align: top;">Address:</td>
              <td>{{ voucher.customer.address}}</td>
            </tr>
            <tr>
              <td>N.T.N:</td>
              <td>{{ voucher.customer.ntn }}</td>
            </tr>
            <tr>
              <td>STRN:</td>
              <td>{{ voucher.customer.sale_tax_number }}</td>
            </tr>
            <tr>
              <td>Phone:</td>
              <td>{{ voucher.customer.phone }}</td>
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
                  Store
                </th>
                <th  :style="styleObject">
                  Branch
                </th>
                <th  :style="styleObject">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              <tr :style="styleObject">
                <td>{{ voucher.customer.name }}</td>
                <td>{{ voucher.store.name }}</td>
                <td>{{ commaFormate(voucher.amount)  }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
  <div> <strong>Value in words: </strong> {{  numberToWords(voucher.amount) }}</div>
     
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
