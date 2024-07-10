<template>
    <VRow>
       <VCol cols="12">
        <v-subheader class="py-0 d-flex justify-space-between rounded-lg mb-3">
            <h3>Deliverables</h3>
            <v-spacer></v-spacer>
            <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        density="compact"
        label="Search"
        single-line
        flat
        hide-details
        variant="solo-filled"
      ></v-text-field>
      <v-spacer></v-spacer>
                <v-autocomplete
                v-model="form.store_id"
                :items="lstStores"
                label="stores"
                :item-title="item => item? `${item.code}-${item.name}`: ''"
                 @update:menu="getBranchesByStoreID(form.store_id)"
                item-value="id"
                variant="outlined"
                >
                </v-autocomplete>
            <v-spacer></v-spacer>
                <v-autocomplete
                v-model="form.branch_id"
                :items="lstBranches"
                label="Branches"
                :item-title="item => item? `${item.code}-${item.name}`: ''"
                 @update:menu="doFetchDeliverables()"
                item-value="id"
                variant="outlined"
                >
                </v-autocomplete>
            <v-spacer></v-spacer>

            <v-btn v-if="canAccess('deliverable_create')" color="primary" to="/deliverables/create">
                New Deliverable
            </v-btn>
        </v-subheader>
       <VCard>
           <v-data-table-server
           :headers="headers"
           v-model:search="search"
           :items="lstDeliverables"
           :items-length="total_items"
           :loading="loading"
           v-model:page="current_page"
           v-model:items-per-page="item_per_page"
           item-key="id"
           @update:options ="doFetchDeliverables"
           class="elevation-1"
       >
       <template v-slot:item.sr="{index}">
            {{index+1}}
        </template>
        <template v-slot:item.invoice_id="{item}">
            <a :href="`/print/${item.id}/?type=deliverable`" target="_blank">
          {{ item.invoice_id }}
            </a>
        </template>
        <template v-slot:item.total_qty="{item}">
            {{ commaFormate(item.total_qty ) }}
        </template>
                <template 
                    v-slot:item.actions="{ item }">
                    <v-icon v-if="canAccess('deliverable_edit')"  @click="handleEdit(item.id)" class="mr-2 ri-pencil-line"/>
                </template>
            </v-data-table-server>
       </VCard>
       </VCol>
    </VRow>
</template>
<script setup lang="ts">

import { IBranchList } from '@/interfaces/IBranch';
import { IDeliverableList } from '@/interfaces/IDeliverable';
import { IStoreList } from '@/interfaces/IStore';
import { fetchDeliverables, fetchStores } from '@/services/Deliverable';
import { fetchBranchesByStoreID } from '@/services/InvoiceService';
import { canAccess, commaFormate } from '@core/utils/helpers';
import { toast } from 'vue3-toastify';
import { IStockForm } from '../../interfaces/IStock';
       const lstDeliverables = ref<IDeliverableList>([])
       const loading = ref<boolean>(false)
       const item_per_page = ref<number>(5)
       const search = ref<string>('')
       const total_items = ref<number>()
       const current_page = ref<number>(1)
        const lstStores = ref<IStoreList>()
        const lstBranches = ref<IBranchList>([])
       const router = useRouter();
       const form = ref<IStockForm>({
            store_id:'',
            branch_id:''
        })
       const headers = [
               { title: "Sr#", align: "start",value: "sr" },
               { title: "Deliverable#",value: "invoice_id" },
               { title: "Store", value: "store"},
               { title: "Branch", value: "branch"},
               { title: "Total Quantity", value: "total_qty"},
               { title: "Date", value: "date"},
               { title: "Created At", value: "created_at"},
               { title: "Actions", value: "actions" }
           ]
       onMounted(() => {
        doFetchDeliverables()
        doFetchStores()
       })

       const doFetchStores = () => {
            fetchStores().then((res:any) => {
                lstStores.value = res.data
            }).catch((err:any) => {
                toast.error(err.message)
            })
        }

        const getBranchesByStoreID = (id:any) => {
            doFetchDeliverables();
            if(id){
                fetchBranchesByStoreID(id).then((res:any) => {
                lstBranches.value = res.data
            }).catch((err:any) => {
                toast.error(err.message)
            })
            }
        }

       const handleEdit = (id:number) => {
            router.push('deliverables/'+id)
        } 

        const doFetchDeliverables = () => {
            loading.value = true;
            fetchDeliverables(current_page.value,item_per_page.value,search.value,form.value.store_id,form.value.branch_id).then((res : any) => {
                lstDeliverables.value = res.data.data
                total_items.value= res.data.meta.total
                loading.value = false;
                }).catch((err :any) => {
                toast.error(err.message)
                loading.value = false;
            })
        }
       
  
</script>

