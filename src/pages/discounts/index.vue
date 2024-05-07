<template>
    <VRow>
       <VCol cols="12">
        <v-subheader class="py-0 d-flex justify-space-between rounded-lg mb-3">
            <h3>Discounts</h3>
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

            <v-btn v-if="canAccess('store_create')" color="primary" to="/discounts/create">
                Create Discount
            </v-btn>
        </v-subheader>
       <VCard>
           <v-data-table-server
           :headers="headers"
           v-model:search="search"
           :items="lstVouchers"
           :items-length="total_items"
           :loading="loading"
           v-model:page="current_page"
           v-model:items-per-page="item_per_page"
           item-key="id"
           @update:options ="doFetchVouchers"
           class="elevation-1"
       >

       <!-- <template v-slot:item.invoice_id="{item}">
            <a :href="`/print/${item.id}/?type=voucher`" target="_blank">
          vc#{{ item.invoice_id }}
            </a>
        </template> -->
                <template 
                    v-slot:item.actions="{ item }">
                    <v-icon v-if="canAccess('store_edit')"  @click="handleEdit(item.id)" class="mr-2 ri-pencil-line"/>
                </template>
            </v-data-table-server>
       </VCard>
       </VCol>
    </VRow>
</template>
<script setup lang="ts">

import { IVoucherList } from '@/interfaces/IVoucher';
import { fetchDiscounts } from '@/services/DiscountService';
import { canAccess } from '@core/utils/helpers';
import { onMounted } from 'vue';
import { toast } from 'vue3-toastify';
       const lstVouchers = ref<IVoucherList>([])
       const loading = ref<boolean>(false)
       const item_per_page = ref<number>(5)
       const search = ref<string>('')
       const total_items = ref<number>()
       const current_page = ref<number>(1)
       const router = useRouter();
       const headers = [
               { title: "Store", align: "start", value: "store" },
               { title: "Branch", value: "branch"},
               { title: "Amount", value: "amount"},
               { title: "Invoice ID", value: "invoice_id"},
               { title: "Date", value: "date"},
               { title: "Actions", value: "actions" }
           ]
       onMounted(() => {
        doFetchVouchers()
       })

       const handleEdit = (id:number) => {
            router.push('discounts/'+id)
        } 

        const doFetchVouchers = () => {
            loading.value = true;
            fetchDiscounts(current_page.value,item_per_page.value,search.value).then((res:any) => {
                lstVouchers.value = res.data.data
                total_items.value= res.data.meta.total
                loading.value = false;
                }).catch((err:any) => {
                toast.error(err.message)
                loading.value = false;
            })
        }
       
  
</script>
