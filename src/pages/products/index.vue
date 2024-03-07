<template>
    <VRow>
       <VCol cols="12">
        <v-subheader class="py-0 d-flex justify-space-between rounded-lg mb-3">
            <h3>Products</h3>
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

            <v-btn v-if="canAccess('product_create')" color="primary" to="/products/create">
                Create Product
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

      <template v-slot:item.status="{ item }">
        <div>
          <v-chip
            :color="item.status == 'INACTIVE' ? 'green' : 'red'"
            :text="item.status"
          ></v-chip>
        </div>
      </template>
                <template 
                    v-slot:item.actions="{ item }">
                    <v-icon v-if="canAccess('product_edit')"  @click="handleEdit(item.id)" class="mr-2 ri-pencil-line"/>
                </template>
            </v-data-table-server>
       </VCard>
       </VCol>
    </VRow>
</template>
<script setup lang="ts">

import { IProductList } from '@/interfaces/IProduct';
import { fetchProducts } from '@/services/ProductService';
import { canAccess } from '@core/utils/helpers';
import { onMounted } from 'vue';
import { toast } from 'vue3-toastify';
       const lstProducts = ref<IProductList>([])
       const loading = ref<boolean>(false)
       const item_per_page = ref<number>(5)
       const search = ref<string>('')
       const total_items = ref<number>()
       const current_page = ref<number>(1)
       const router = useRouter();
       const headers:any = [
               { title: "Name", align: "start",value: "name" },
               { title: "Code", value: "code"},
               { title: "SKU", value: "sku"},
               { title: "Sale Price", value: "sale_price"},
               { title: "Status", value: "status"},
               { title: "Created At", value: "created_at"},
               { title: "Actions", value: "actions" }
           ]
       onMounted(() => {
        doFetchProducts()
       })

       const handleEdit = (id:number) => {
            router.push('products/'+id)
        } 

        const doFetchProducts = () => {
            loading.value = true;
            fetchProducts(current_page.value,item_per_page.value,search.value).then((res) => {
                lstProducts.value = res.data.data
                total_items.value= res.data.meta.total
                loading.value = false;
                }).catch((err) => {
                toast.error(err.message)
                loading.value = false;
            })
        }
       
  
</script>
