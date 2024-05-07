<script setup lang="ts">
import { commaFormate } from '@/@core/utils/helpers';
import { fetchReturnDeliverableByIDForPrint } from '@/services/ReturnDeliverable';
import logo from '@images/avatars/e-logo.png';
import { toast } from 'vue3-toastify';
const route = useRoute();
const id :number = route.params.id
const dispatched_name = localStorage.getItem('user_name');
const  deliverable = ref<any>({});
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
    fetchReturnDeliverableByIDForPrint(id).then((res:any) => {
        deliverable.value = res.data.data
    }).catch((err:any) => {
        toast.error(err.message)
    })
})
</script>
<template>
  <div v-if="deliverable && deliverable.customer && deliverable.products">
    <v-container>
      <v-row no-gutters>
        <v-col cols="6" offset="3">
          <v-row>
            <v-col cols="4">
              <v-img :src="logo"></v-img>
            </v-col>
            <v-col cols="8"  class="mt-5">
          <h5>Every Day Plastic Industry</h5>
          <h6 style="margin-left: 45px;">Return Challan</h6>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12">Return#{{ deliverable.invoice_sr_number }}</v-col>
        <v-col cols="12">Return Date: {{ deliverable.date }}</v-col>
      </v-row>
      <v-row no-gutters class="mt-3">
        <v-col cols="5">
          <table>
            <tr>
              <td>Customer:</td>
              <td>
                <strong>
                  {{ deliverable.customer.code +' '+ deliverable.customer.name }}
                </strong>
              </td>
            </tr>
            <tr>
              <td style="vertical-align: top;">Address:</td>
              <td>{{ deliverable.customer.address}},</td>
            </tr>
            <tr>
              <td  style="vertical-align: top;"></td>
              <td> {{deliverable.city.title  }}</td>
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
            <tr></tr>
            <tr>
              <td><strong>Remarks: </strong>{{ deliverable.remarks }}</td>
            </tr>
          </table>
        </v-col>
        <v-col cols="2"></v-col>
        <v-col cols="5">
          <table>
            <tr>
              <td>Type:</td>
              <td>
                <strong>
                  {{ deliverable.return_type}}
                </strong>
                
              </td>
            </tr>
            <tr>
              <td>{{ deliverable.store.is_sr ? 'SR#:' : 'RV#:' }}</td>
              <td>
                <strong>
                  {{ deliverable.sr_number}}
                </strong>
                
              </td>
            </tr>
            <tr>
              <td>Return Date:</td>
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
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <v-col cols="12">
  <v-table>
    <thead>
      <tr>
        <th :style="styleObject">
          Sr
        </th>
        <th :style="styleObject">
          Cat
        </th>
        <th :style="styleObject">
          MPN
        </th>
        <th :style="styleObject">
          Description
        </th>
        <th :style="styleObject">
          Quantity
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(product, index) in deliverable.products">
        <td>{{ index+1 }}</td>
        <td>{{ product.sku }}</td>
        <td>{{ product.code }}</td>
        <td>{{ product.name }}</td>
        <td>{{ commaFormate( product.qty) }}</td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td>
          <strong>Total:</strong>
        </td>
        <td>
          <strong>{{ commaFormate( deliverable.total_qty) }}</strong>
        </td>
      </tr>
    </tbody>
  </v-table>
  <!-- <span> <strong>Remarks: </strong>{{ deliverable.remarks }}</span> -->
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
