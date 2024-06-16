<script setup lang="ts">
import logo from '@images/avatars/e-logo.png';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';
import { ILedgerList } from '../../interfaces/ILedger';
import { fetchStockByBranchID } from '../../services/StockService';

const lstStocks = ref<ILedgerList>([])
const store_name = ref<string>('')
const branch_name = ref<string>('')
const router = useRouter();
const route = useRoute();
const queryParams =  route.query;
onMounted(() => {
    
    const queryStringParams = new URLSearchParams(queryParams).toString();
    fetchStockByBranchID(queryParams.branch_id).then((res:any) => {
        lstStocks.value = res.data.data
        store_name.value = res.data.branch.store.name
        branch_name.value = res.data.branch.name
        }).catch((err:any) => {
            toast.error(err.message);
        })
})
</script>
<template>
  <div>
    <v-container>
      <v-row no-gutters>
        <v-col cols="6" offset="3">
          <v-row>
            <v-col cols="4">
              <v-img :src="logo"></v-img>
            </v-col>
            <v-col cols="8" class="mt-5">
          <h5>Every Day Plastic Industry</h5>
          <h6 style="margin-left: 0px;">{{ store_name }} {{ branch_name ? '/'+branch_name : '' }}  Stock</h6>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row no-gutters>
        <v-col cols="12">
            <v-table>
                <thead>
                    <tr>
                    <th>Product Title</th>
                    <th>In Stock</th>
                    <th>Out Stock</th>
                    <th>Total</th>
                    </tr>
                  
                </thead>
                <tbody>
                    <tr v-for="item in lstStocks">
                        <td>{{ item.title }}</td>
                        <td>{{ item.in_stock }}</td>
                        <td>{{item.out_stock }}</td>
                        <td>{{ item.total  }}</td>
                    </tr>
                </tbody>
            </v-table>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
