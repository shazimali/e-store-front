<template>
    <VRow>
       <VCol cols="12">
        <v-subheader class="py-0 d-flex justify-space-between rounded-lg mb-3">
            <h3>Purchases</h3>
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

            <v-btn v-if="canAccess('purchase_create')" color="primary" to="/purchases/create">
                New Purchase
            </v-btn>
        </v-subheader>
       <VCard>
           <v-data-table-server
           :headers="headers"
           v-model:search="search"
           :items="lstProducts"
           :items-length="total_items"
           :loading="loading"
           v-model:page="current_page"
           v-model:items-per-page="item_per_page"
           item-key="id"
           @update:options ="doFetchProducts"
           class="elevation-1"
       >

                <template 
                    v-slot:item.actions="{ item }">
                    <v-icon v-if="canAccess('purchase_edit')"  @click="handleEdit(item.id)" class="mr-2 ri-pencil-line"/>
                </template>
            </v-data-table-server>
       </VCard>
       </VCol>
    </VRow>
</template>
<script setup lang="ts">

import { IPurchaseList } from '@/interfaces/IPurchase';
import { fetchPurchases } from '@/services/PurchaseService';
import { canAccess } from '@core/utils/helpers';
import { onMounted } from 'vue';
import { toast } from 'vue3-toastify';
       const lstProducts = ref<IPurchaseList>([])
       const loading = ref<boolean>(false)
       const item_per_page = ref<number>(5)
       const search = ref<string>('')
       const total_items = ref<number>()
       const current_page = ref<number>(1)
       const router = useRouter();
       const headers = [
               { title: "Invoice#", align: "start",value: "invoice_id" },
               { title: "Total Quantity", value: "total_qty"},
               { title: "Total Amount", value: "total_price"},
               { title: "Date", value: "date"},
               { title: "Created At", value: "created_at"},
               { title: "Actions", value: "actions" }
           ]
       onMounted(() => {
        doFetchProducts()
       })

       const handleEdit = (id:number) => {
            router.push('purchases/'+id)
        } 

        const doFetchProducts = () => {
            loading.value = true;
            fetchPurchases(current_page.value,item_per_page.value,search.value).then((res) => {
                lstProducts.value = res.data.data
                total_items.value= res.data.meta.total
                loading.value = false;
                }).catch((err) => {
                toast.error(err.message)
                loading.value = false;
            })
        }
       
  
</script>

