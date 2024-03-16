<template>
    <VRow>
       <VCol cols="12">
        <v-subheader class="py-0 d-flex justify-space-between rounded-lg mb-3">
            <h3>Products</h3>
      <v-spacer></v-spacer>
            <v-btn v-if="canAccess('product_create')" color="primary" to="/products/create">
                Create Product
            </v-btn>
        </v-subheader>
        <v-subheader class="py-0 d-flex justify-space-between rounded-lg mb-3">
            <h5>Filters</h5>
            <v-spacer></v-spacer>
      <v-autocomplete
        v-model="store_id"
        clearable
        label="Select Store"
        :items="lstStores"
        :item-title="item => item? `${item.code}-${item.name}`: ''"
        item-value="id"
        variant="outlined"
        @update:menu="doFetchProducts"
        >
    </v-autocomplete>
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

            <template class="row-pointer" v-slot:item.sale_price="{ item }">
        <div @click="doEditSalePrice(item.id,item.sale_price)">{{ item.sale_price }}</div>
      </template>
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
        <v-dialog max-width="500" v-model="editSalePrice">
                <v-card title="Update Sale Price">
                <v-card-text>
                    <VForm @submit.prevent="handleSubmit">
                        <VTextField
                            id="code"
                            v-model="salePriceForm.sale_price"
                            placeholder="Please enter code"
                            :error-messages="errorMessages.sale_price"
                            persistent-placeholder
                            aria-required="true"
                        />
                        <VCol
                        cols="12"
                        class="d-flex gap-4"
                    >
                        <VBtn type="submit">
                        Update
                        </VBtn>
                    </VCol>
                    </VForm>
                </v-card-text>
                </v-card>
        </v-dialog>
       </VCol>
    </VRow>
</template>
<script setup lang="ts">

import { IProductList } from '@/interfaces/IProduct';
import { fetchProducts, fetchStores, updateSalePrice } from '@/services/ProductService';
import { canAccess } from '@core/utils/helpers';
import { onMounted } from 'vue';
import { toast } from 'vue3-toastify';
       const lstProducts = ref<IProductList>([])
       const loading = ref<boolean>(false)
        const errorMessages = ref<any>({});
       const editSalePrice = ref<boolean>(false)
       const item_per_page = ref<number>(5)
       const search = ref<string>('')
        const lstStores = ref<[]>([])
        const store_id = ref<number>(0)
       const total_items = ref<number>()
       const current_page = ref<number>(1)
       const router = useRouter();
       const headers:any = [
               { title: "Name", align: "start",value: "name" },
               { title: "Code", value: "code"},
               { title: "Store", value: "store"},
               { title: "SKU", value: "sku"},
               { title: "Sale Price", value: "sale_price"},
               { title: "Status", value: "status"},
               { title: "Created At", value: "created_at"},
               { title: "Actions", value: "actions" }
           ]
        const salePriceForm = ref<{id:number, sale_price: number}>({
            id : "",
            sale_price:""
        })

        const handleSubmit = () => {
            updateSalePrice(salePriceForm.value).then((res:any)=>{
                editSalePrice.value = !editSalePrice.value 
                doFetchProducts()
                toast.success(res.data);
            }).catch((err:any)=>{
            if(err.response.status == "422"){
            errorMessages.value =  err.response.data.errors
            }else if(err.response.status == "401"){  
                toast.error(err.response.data.message);
            }else{
                toast.error(err.message)
            }
        })
        }
       onMounted(() => {
        doFetchProducts()
        fetchStores().then((res:any) => {
            lstStores.value= res.data;
        }).catch((err:any) => {
            toast.error(err.message)
        })
       })

       const doEditSalePrice = (id:number, sale_price:number) => {
            
            editSalePrice.value = !editSalePrice.value 
            salePriceForm.value.id  = id
            salePriceForm.value.sale_price = sale_price
       }

       const handleEdit = (id:number) => {
            router.push('products/'+id)
        } 

        const doFetchProducts = () => {
            loading.value = true;
            fetchProducts(current_page.value,item_per_page.value,search.value,store_id.value).then((res:any) => {
                lstProducts.value = res.data.data
                total_items.value= res.data.meta.total
                loading.value = false;
                }).catch((err:any) => {
                toast.error(err.message)
                loading.value = false;
            })
        }
       
  
</script>
