<script setup lang="ts">
import { commaFormate } from '@/@core/utils/helpers';
import logo from '@images/avatars/e-logo.png';
import { toast } from 'vue3-toastify';
import { fetchPurchaseForPrintByID } from '../../services/PurchaseService';
const route = useRoute();
const id :number = route.params.id
const  purchase = ref<any>({});
onMounted(() => {
    fetchPurchaseForPrintByID(id).then((res:any) => {
        purchase.value = res.data.data
    }).catch((err:any) => {
        toast.error(err.message)
    })
})
</script>
<template>
    <v-container>
        <v-col cols="6" offset="3">
          <v-row>
            <v-col cols="4">
              <v-img :src="logo"></v-img>
            </v-col>
            <v-col cols="8" class="mt-5">
          <h5>Every Day Plastic Industry</h5>
          <h6 style="margin-left: 20px;">Purchase ({{purchase.date}})</h6>
            </v-col>
          </v-row>
        </v-col>
    </v-container>
  <div v-if="purchase && purchase.products">
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
        <td>{{ index+1 }}</td>
        <td>{{ product.sku }}</td>
        <td>{{ product.code }}</td>
        <td>{{ product.store_name }}</td>
        <td>{{ product.name }}</td>
        <td>{{ commaFormate( product.price) }}</td>
        <td>{{ commaFormate( product.qty) }}</td>
        <td>{{ commaFormate( product.qty * product.price) }}</td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td>
        </td>
        <td></td>
        <td>
          <strong>{{ commaFormate( purchase.total_qty) }}</strong>
        </td>
        <td>
          <strong>{{ commaFormate( purchase.total_price) }}</strong>
        </td>
      </tr>
    </tbody>
  </v-table>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
