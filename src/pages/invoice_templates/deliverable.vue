<script setup lang="ts">
import { commaFormate } from '@/@core/utils/helpers';
import { fetchDeliverableByIDForPrint } from '@/services/Deliverable';
import logo from '@images/avatars/e-logo.png';
import { toast } from 'vue3-toastify';
const route = useRoute();
console.log(route.query.type)
const id :number = route.params.id
const dispatched_name = localStorage.getItem('user_name');
const  deliverable = ref<any>({});
onMounted(() => {
    fetchDeliverableByIDForPrint(id).then((res:any) => {
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
            <v-col cols="2">
              <v-img :src="logo"></v-img>
            </v-col>
            <v-col cols="8">
          <h1>Everyday Plastic Industry</h1>
          <h3 class="mx-4">Delivery Challan</h3>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12">D/C#{{ deliverable.invoice_sr_number }}</v-col>
        <v-col cols="12">D/C Date: {{ deliverable.date }}</v-col>
      </v-row>
      <v-row no-gutters class="mt-3">
        <v-col class="px-2 py-2" cols="5" style="border: 2px solid; border-radius: 10px;">
          <div class="d-flex justify-start align-center">
            <span>Customer:</span>
            <strong>{{ deliverable.customer.code +' '+ deliverable.customer.name }}</strong>
          </div>
          <div class="d-flex justify-start align-center">
            <span>Address:</span>
            <span>{{ deliverable.customer.address}}</span>
          </div>
          <div class="d-flex justify-start align-center">
            <span>N.T.N:</span>
            <span>{{ deliverable.customer.ntn}}</span>
          </div>
          <div class="d-flex justify-start align-center">
            <span>STRN:</span>
            <span>{{ deliverable.customer.sale_tax_number}}</span>
          </div>
          <div class="d-flex justify-start align-center">
            <span>Phone:</span>
            <span>{{ deliverable.customer.phone}}</span>
          </div>
        </v-col>
        <v-col cols="2"></v-col>
        <v-col class="px-2 py-2" cols="5" style="border: 2px solid; border-radius: 10px;">
          <div class="d-flex justify-start align-center">
            <span>Order Date:</span>
            <span>{{ deliverable.order_date }}</span>
          </div>
          <div class="d-flex justify-start align-center">
            <span>Out N.T.N:</span>
            <span>XYZ</span>
          </div>
          <div class="d-flex justify-start align-center">
            <span>Out STRN:</span>
            <span>XYZ</span>
          </div>
          <div class="d-flex justify-start align-center">
            <span>Tel:</span>
            <span>XYZ</span>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <v-col cols="12">
  <v-table>
    <thead>
      <tr>
        <th class="text-left">
          Sr#
        </th>
        <th class="text-left">
          Item Cat
        </th>
        <th class="text-left">
          MPN
        </th>
        <th class="text-left">
          Item Description
        </th>
        <th class="text-left">
          Quantity
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(product, index) in deliverable.products">
        <td>{{ index+1 }}</td>
        <td>{{ product.code }}</td>
        <td>{{ product.sku }}</td>
        <td>{{ product.name }}</td>
        <td>{{ commaFormate( product.qty) }}</td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>
          <strong>{{ commaFormate( deliverable.total_qty) }}</strong>
        </td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>
          <div class="mb-2">
            Driver ___________
          </div>
          <div class="mb-2">
            Checked ___________
          </div>
          <div class="mb-2">
            Dispatched By {{ dispatched_name }}
          </div>
        </td>
      </tr>
    </tbody>
  </v-table>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
