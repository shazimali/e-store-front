<script setup lang="ts">

import { commaFormate } from '@/@core/utils/helpers';
import { toast } from 'vue3-toastify';
import { IBranchList } from '../../interfaces/IBranch';
import { IProfitLossForm, IProfitLossList } from '../../interfaces/ILedger';
import { IStoreList } from '../../interfaces/IStore';
import { fetchBranchesByStoreID, fetchProfitLoss, fetchStores } from '../../services/LedgerService';
        const lstStores = ref<IStoreList>([])
        const lstBranches = ref<IBranchList>([])
        const lstProfitLoss = ref<IProfitLossList>([])
        const loading = ref<boolean>(false)
        const total_items = ref<number>()
        const total_discount = ref<number>(0)
        const total_profit_loss = ref<number>(0)
        const router = useRouter();
const form = ref<IProfitLossForm>({
    store_id:'',
    branch_id:''
});

const headers = [
               { title: "name", value: "name" },
               { title: "Purchase", value: "purchases" },
               { title: "Sale", value: "sales" },
               { title: "Profit/Loss", value: "diff"},
           ]

onMounted(() => {
    doFetchStores()
})
 
const doFetchStores = () => {
    fetchStores().then((res:any) => {
        lstStores.value = res.data
        }).catch((err:any) => {
        toast.error(err.message)
    })
}
const getBranches = (id:number) => {
    lstBranches.value= [];
    form.value.branch_id= '';
        if(id){
            fetchBranchesByStoreID(id).then((res:any) => {
                lstBranches.value = res.data
            }).catch((err:any) => {
                toast.error(err.message);
            })
        }
        
}
const fetchMeanPrice = (data:Array) => {
    //fetch all prices from invoices regarding  this product
  let prices = data.length > 0 ?data.map((current:any) => {return current.price}):0;
    //sum all prices from invoices regarding  this product
  let prices_sum = prices.length > 0 ? prices.reduce((accumulator:any, currentValue:any) => {
    return parseFloat(accumulator)  + parseFloat(currentValue) 
  },0):0;
  //return  mean price value of the array
    return prices_sum/prices.length;
}
const doFetchProfitLoss = () => {
  loading.value = true;
    const paramString = router.replace({ query:form.value });
    const searchParams = new URLSearchParams(form.value);
    fetchProfitLoss(searchParams.toString()).then((res: any)=>{
        // total_items.value= res.data.total
        total_discount.value = res.data.discount;
        total_profit_loss.value = 0;
        let  dataSet = [] as Array<IProfitLossList> ;
      
        res.data.products.forEach((item, index) => {
                
                let sales = 0;
                let return_sales = 0;
                // let purchases = 0;
                let invoice_qty = 0
                let return_invoice_qty = 0
                let mean_sale_price = fetchMeanPrice(item.invoices);
                
                //calculate qty sold by multiplying quantity with price per unit
                item.invoices.length > 0 ?  item.invoices.map((inv,index) => {
                  invoice_qty = parseFloat(invoice_qty)  + parseFloat(inv.qty)
                  sales =  (parseFloat(sales)  + parseFloat(mean_sale_price * inv.qty))
                //   total_discount.value += parseFloat(inv.discount.amount)
                })
                :
                []

                //calculate qty sold by multiplying quantity with price per unit
                item.return_invoices.length > 0 ?  item.return_invoices.map((r_inv,index) => {
                    return_invoice_qty = parseFloat(return_invoice_qty)  + parseFloat(r_inv.qty)
                  return_sales =  parseFloat(return_sales)  + parseFloat(mean_sale_price * r_inv.qty)
                })
                :
                []
                // set total purchase as per mean price
                let mean_purchase_price = item.purchases && item.purchases.length > 0 ? fetchMeanPrice(item.purchases):0 ;
                
                let purchases = mean_purchase_price * invoice_qty;
                // let purchases = [];

                // item.purchases.length > 0 ?  item.purchases.map((pr,index) => {
                //   purchases = parseFloat(purchases) + parseFloat(mean_purchase_price * invoice_qty)
                // })
                // :
                // []
                let obj = {
                  name:item.name,
                  sales: parseFloat(sales) - parseFloat(return_sales),
                  purchases:purchases,
                  diff:parseFloat(Math.abs((sales - return_sales) - purchases)).toFixed(2),
                  }
                  dataSet.push(obj);
                  total_profit_loss.value += parseFloat(obj.diff);
                //   dataSet.forEach((el) => total_profit_loss.value += parseFloat(el.diff) )
            });
        lstProfitLoss.value = dataSet;
        loading.value = false;
    }).catch((err:any) => {
        toast.error(err.message)
    })
}
const handleSubmit  =  () => {
    doFetchProfitLoss()
}
  
</script>
<template>
    <VRow>
       <VCol cols="12">
        <v-subheader class="py-0 d-flex justify-space-between rounded-lg mb-3">
            <h3>Profit Loss</h3>
        </v-subheader>
       <VCard>
        <VForm @submit.prevent="handleSubmit">
                <VRow>
                    <VCol cols="6">
                        <VRow no-gutters>
                        <VCol
                            cols="12"
                        >
                            <label for="name">Stores</label>
                        </VCol>
                
                        <VCol
                            cols="12"
                        >
                        <v-autocomplete
                            v-model="form.store_id"
                            :items="lstStores"
                            @update:menu="getBranches(form.store_id)"
                            :item-title="item => item? `${item.code}-${item.name}`: ''"
                            item-value="id"
                            variant="outlined"
                        />
                        </VCol>
                        </VRow>
                    </VCol>
                    <VCol cols="6">
                        <VRow no-gutters>
                        <VCol
                            cols="12"
                        >
                            <label for="code">Branches</label>
                        </VCol>
                
                        <VCol
                            cols="12"
                        >
                        <v-autocomplete
            
            v-model="form.branch_id"
            :items="lstBranches"
            :item-title="item => item? `${item.code}-${item.name}`: ''"
            item-value="id"
            variant="outlined"
            >
            </v-autocomplete>
                        </VCol>
                        </VRow>
                    </VCol>
                    <VCol
                        cols="12"
                        class="d-flex gap-4"
                    >
                        <VBtn type="submit">
                        Search
                        </VBtn>
                    </VCol>
                </VRow>
            </VForm>
            <v-table>
                <thead>
                    <tr>
                        <th class="text-left">Name</th>
                        <th class="text-left">Purchase</th>
                        <th class="text-left">Sale</th>
                        <th class="text-left">Profit/Loss</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in lstProfitLoss">
                        <td>{{ item.name }}</td>
                        <td>{{ item.purchases }}</td>
                        <td>{{ item.sales }}</td>
                        <td>{{ item.diff }}</td>
                    </tr>
                    <tr v-if="total_discount > 0">
                        <td></td>
                        <td></td>
                        <td><b>Total Before Discount = </b></td>
                        <td> {{ commaFormate(total_profit_loss) }}</td>
                    </tr>
                    <tr v-if="total_discount > 0">
                        <td></td>
                        <td></td>
                        <td><b>Discount = </b></td>
                        <td> {{ commaFormate(total_discount) }}</td>
                    </tr>
                    <tr v-if="total_profit_loss > 0">
                        <td></td>
                        <td></td>
                        <td><b>Total = </b></td>
                        <td> {{ commaFormate(total_profit_loss - total_discount) }}</td>
                    </tr>

                </tbody>
            </v-table>
            <!-- <v-data-table-server
           :headers="headers"
           :items="lstProfitLoss"
           :items-length="total_items"
           v-model:page="form.page"
           v-model:items-per-page="form.item_per_page"
           item-key="id"
           @update:options ="doFetchProfitLoss"
           :loading="loading"
           class="elevation-1"
       >

       <template v-slot:item.invoice_id="{item}">
            <a :href="item.type == 'invoice' ? '/print/'+item.id+'/?type=invoice' : '/print/'+item.id+'/?type=voucher'"
            target="_blank">
          inv#{{ item.invoice_id }}
            </a>
        </template>
        <template v-slot:item.amount="{item}">
          {{ commaFormate(item.amount ) }}
        </template>
        <template v-slot:item.total="{item}">
          {{ commaFormate(item.total ) }}
        </template>
            </v-data-table-server> -->
       </VCard>
       </VCol>
    </VRow>
</template>

