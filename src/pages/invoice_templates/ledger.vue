<script setup lang="ts">
import { commaFormate } from '@/@core/utils/helpers';
import { fetchLedger } from '@/services/LedgerService';
import logo from '@images/avatars/e-logo.png';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';
import { ILedgerList } from '../../interfaces/ILedger';

const lstLedgers = ref<ILedgerList>([])
const store_name = ref<string>('')
const branch_name = ref<string>('')
const router = useRouter();
const route = useRoute();
const queryParams =  route.query;
onMounted(() => {
    
    const queryStringParams = new URLSearchParams(queryParams).toString();
    fetchLedger(queryStringParams).then((res: any)=>{
      store_name.value = res.data.store_name;
      branch_name.value = res.data.branch_name;
        // let ledgersArr  = Object.keys(res.data).map((key) => res.data[key]);
        let ledgersArr =  res.data.data.sort((a, b) => new Date(a.date) - new Date(b.date));
            ledgersArr.forEach((item, index) => {
                index == 0 ?
                item['total'] = item.amount 
                :
                    item['type'] == 'invoice' ?
                        item['total'] =  (parseFloat(ledgersArr[index-1].total) + parseFloat(item.amount)).toFixed(2)
                        :
                        item['total'] =  (parseFloat(ledgersArr[index-1].total) - parseFloat(item.amount)).toFixed(2)

            });
            lstLedgers.value = ledgersArr;
    }).catch((err:any) => {
        toast.error(err.message)
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
          <h6 style="margin-left: 0px;">{{ store_name }} {{ branch_name ? '/'+branch_name : '' }}  Ledger</h6>
          <h6 style="margin-left: 0px;">{{ queryParams.from_date ? 'From:'+queryParams.from_date : '' }} {{ queryParams.to_date ? '- To:'+queryParams.to_date : '' }}</h6>
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
                        <th>Invoice#</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Total</th>
                    </tr>
                  
                </thead>
                <tbody>
                    <tr v-for="item in lstLedgers">
                        <td>{{ item.data_id }}</td>
                        <td>{{ item.type }}</td>
                        <td>{{item.date }}</td>
                        <td>{{  commaFormate(item.amount ) }}</td>
                        <td>{{  commaFormate(item.total)  }}</td>
                    </tr>
                </tbody>
            </v-table>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
