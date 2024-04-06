<script setup lang="ts">

import { IStockForm, IStockList } from '@/interfaces/IStock';
import { fetchBranchesAndStock, fetchStockByBranchID, fetchStores } from '@/services/StockService';
import { canAccess } from '@core/utils/helpers';
import { onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import { IBranchList } from '../../interfaces/IBranch';
import { IStoreList } from '../../interfaces/IStore';
       const lstStores = ref<IStoreList>([])
       const lstBranches = ref<IBranchList>([])
       const loading = ref<boolean>(false)
       const item_per_page = ref<number>(5)
       const search = ref<string>('')
       const total_items = ref<number>()
       const current_page = ref<number>(1)
       const router = useRouter();
        const lstStocks = ref<IStockList>([])
const form = ref<IStockForm>({
    store_id:'',
    branch_id:''
})
       const headers = [
                { title: "Product Title",align: "start", value: "title"},
               { title: "In Stock", value: "in_stock" },
               { title: "Out Stock", value: "out_stock"},
               { title: "Total", value: "total"},
           ]
       onMounted(() => {
        doFetchStores()
       })

       const handleEdit = (id:number) => {
            router.push('stores/'+id)
        } 

        const doFetchStores = () => {
            loading.value = true;
            fetchStores().then((res:any) => {
                lstStores.value = res.data
                loading.value = false;
                }).catch((err:any) => {
                toast.error(err.message)
                loading.value = false;
            })
        }
const getBranchesAndStock = (id:number) => {
    lstBranches.value= [];
    form.value.branch_id= '';
        if(id){
            fetchBranchesAndStock(id).then((res:any) => {
                lstBranches.value = res.data.branches
                lstStocks.value = res.data.stocks
            }).catch((err:any) => {
                toast.error(err.message);
            })
        }
        
}

const getStockByBranchID = (id:number) => {
    if(id){
        fetchStockByBranchID(id).then((res:any) => {
            lstStocks.value = res.data
        }).catch((err:any) => {
            toast.error(err.message);
        })
    }
}
  
</script>
<template>
    <VRow>
       <VCol cols="12">
        <v-subheader class="py-0 d-flex justify-space-between rounded-lg mb-3">
            <h3>Stocks</h3>
            <v-spacer></v-spacer>
            <v-autocomplete
            v-model="form.store_id"
            :items="lstStores"
            label="stores"
            @update:menu="getBranchesAndStock(form.store_id)"
            :item-title="item => item? `${item.code}-${item.name}`: ''"
            item-value="id"
            variant="outlined"
            >
            </v-autocomplete>
            <v-spacer></v-spacer>
            <v-autocomplete
            v-if="lstBranches && lstBranches.length"
            v-model="form.branch_id"
            :items="lstBranches"
            label="Branches"
            @update:menu="getStockByBranchID(form.branch_id)"
            :item-title="item => item? `${item.code}-${item.name}`: ''"
            item-value="id"
            variant="outlined"
            >
            </v-autocomplete>
        </v-subheader>
       <VCard>
           <v-data-table-server
           :headers="headers"
           :items="lstStocks"
           :items-length="total_items"
           :loading="loading"
           v-model:page="current_page"
           v-model:items-per-page="item_per_page"
           item-key="id"
           @update:options ="doFetchStores"
           class="elevation-1"
       >

      <template v-slot:item.status="{ item }">
        <div>
          <v-chip
            :color="item.status == 'ACTIVE' ? 'green' : 'red'"
            :text="item.status"
          ></v-chip>
        </div>
      </template>
                <template 
                    v-slot:item.actions="{ item }">
                    <v-icon v-if="canAccess('store_edit')"  @click="handleEdit(item.id)" class="mr-2 ri-pencil-line"/>
                </template>
            </v-data-table-server>
       </VCard>
       </VCol>
    </VRow>
</template>

