
import { getRandomValues } from 'crypto';

import { fetchProducts } from '@/services/ProductService';
<script setup lang="ts">
import { IBranchList } from '@/interfaces/IBranch';
import { IStore, IStoreList } from '@/interfaces/IStore';
import { InfInvoice } from '@/interfaces/InfInvoice.ts';
import { InvoiceProductList } from '@/interfaces/InvoiceProduct.ts';
import { fetchBranchesAndProductsByStoreID, fetchStoresAndCompany, saveInvoice } from '@/services/InvoiceService.ts';
import { toast } from 'vue3-toastify';
import { ICompany } from '../../interfaces/ICompany';
import SelectedProducts from './selectedProducts.vue';
const errorMessages = ref<IDeliverableErrors>({})
const lstProducts = ref<InvoiceProductList>([])
const lstStores = ref<IStoreList>()
const selectedStore = ref<IStore>()
const companyInfo = ref<ICompany>()
const lstBranches = ref<IBranchList>()
const loading = ref<boolean>(false)
const searchInput = ref<string>('')
const form = ref<InfInvoice>({
    date:new Date().toISOString().slice(0,10),
    sr_number:'',
    total_qty:'',
    is_ex_tax:false,
    total_price:'',
    store_id: '',
    remarks: '',
    products:[],
    product_id:'',
    discount:0,
    branch_id: ''
})
onMounted(() => {
    doFetchStores()
})

const doFetchStores = () => {
    fetchStoresAndCompany().then((res:any) => {
        lstStores.value = res.data.stores
        companyInfo.value = res.data.company
    }).catch((err:any) => {
        toast.error(err.message)
    })
}
const handleSelectedProducts = () => {
    const  selectedIdx = lstProducts.value.findIndex((item)=>{return item.id == form.value.product_id});
     if (selectedIdx != -1){ 
        const isProductAlreadyExistsIndex = form.value.products.findIndex((item)=>{return item.id == lstProducts.value[selectedIdx].id});

        if(isProductAlreadyExistsIndex != -1){
            form.value.products[isProductAlreadyExistsIndex].qty = parseInt(form.value.products[isProductAlreadyExistsIndex].qty) + parseInt(1)  

        }else{
            form.value.products.push({
                id :lstProducts.value[selectedIdx].id,
                name:lstProducts.value[selectedIdx].name,
                code:lstProducts.value[selectedIdx].code,
                sku:lstProducts.value[selectedIdx].sku,
                sale_tax:lstProducts.value[selectedIdx].sale_tax,
                ext_tax:lstProducts.value[selectedIdx].ext_tax,
                price:lstProducts.value[selectedIdx].sale_price,
                qty:1
             })
        }
     }
    searchInput.value = "";
    form.value.product_id = "";
}
const handleProductDelete = (id:number) => {
    form.value.products =  form.value.products.filter((item:any) => item.id !== id )
}
const handleProductQty = (payload:{id:number,val:number}) => {
    const  qtyIdx = form.value.products.findIndex((item:any)=> item.id == payload.id);
    form.value.products[qtyIdx].qty=payload.val
}
const handleProductPrice = (payload:{id:number,val:number}) => {
    const  qtyIdx = form.value.products.findIndex((item:any)=> item.id == payload.id);
    form.value.products[qtyIdx].price=payload.val
}


const handleTotalQty = (qty:number) => {
    form.value.total_qty = qty;
}

const handleTotalPrice = (price:number) => {
    form.value.total_price = price;
}


const handleSubmit = () => {
    loading.value = true;
    console.log(form.value);
    saveInvoice(form.value).then((res:any) => {
        reset();
        doFetchStores();
        const id = res.data;
        toast.success('Invoice created successfully');
        loading.value = false
        let url = '/print/'+id+"?type="+"invoice";
        window.open(url, '_blank');
    }).catch((err:any) => {
        loading.value = false
        if(err.response.status == "422"){
            errorMessages.value =  err.response.data.errors
        }else if(err.response.status == "401"){  
            toast.error(err.response.data.message);
        }else{
            toast.error(err.message)
        }
    })
}

const getBranchesAndProducts = (id:number) => {
    if(id){
        fetchBranchesAndProductsByStoreID(id).then((res:any) => {
        lstBranches.value = res.data.branches
        lstProducts.value = res.data.products
        selectedStore.value = lstStores.value.filter((item:any) => item.id === id);
        form.value.discount = selectedStore.value[0].discount
        }).catch((err:any) => {
            toast.error(err.message)
        })
    }else{
        lstBranches.value = []
    }
    
}

const reset = () => {
    form.value.store_id = ''
    form.value.branch_id = ''
    form.value.is_ex_tax = false
    form.value.sr_number = ''
    form.value.date = new Date().toISOString().slice(0,10)
    form.value.order_date = new Date().toISOString().slice(0,10)
    form.value.total_qty = 0
    form.value.products = []
    lstBranches.value = []
    lstStores.value = []
}
</script>
<template>
    <VCard title="New Invoice">
           <VCardText>
             <VForm @submit.prevent="handleSubmit">
     <VRow>
        <VCol cols="6">
             <label for="date">Date</label>
             <VTextField
               id="date"
               type="date"
               tabindex="1"
               :error-messages="errorMessages.date"
               v-model="form.date"
               persistent-placeholder
             />

       </VCol>
       <VCol cols="6">
             <label for="sr_number">Sr #</label>
             <VTextField
               id="sr_number"
               type="text"
               tabindex="3"
               :error-messages="errorMessages.sr_number"
               v-model="form.sr_number"
               persistent-placeholder
             />

       </VCol>
       <!-- <vCol cols="2">
        <VCheckbox
        class="mt-5"
            v-model="form.is_ex_tax"
              label="Extra Tax"
            />
      </vCol> -->
        <VCol cols="6">
             <label for="name">Main Store</label>
            <v-autocomplete
            v-model="form.store_id"
            :items="lstStores"
            :item-title="item => item? `${item.code}-${item.name}`: ''"
            item-value="id"
            tabindex="4 "
            :error-messages="errorMessages.store_id"
            variant="outlined"
            @update:menu="getBranchesAndProducts(form.store_id)"
            >
            </v-autocomplete>

       </VCol>

       <VCol v-if="lstBranches && lstBranches.length > 0" cols="6">
             <label for="branches">Branches</label>
            <v-autocomplete
            v-model="form.branch_id"
            :items="lstBranches"
            :item-title="item => item? `${item.code}-${item.name}`: ''"
            item-value="id"
            tabindex="5"
            :error-messages="errorMessages.branch_id"
            variant="outlined"
            >
            </v-autocomplete>

       </VCol>

       <VCol v-if="lstBranches && lstBranches.length > 0" cols="12">
             <label for="branches">Remarks</label>
             <VTextField
               id="remarks"
               type="text"
               tabindex="3"
               :error-messages="errorMessages.remarks"
               v-model="form.remarks"
               persistent-placeholder
             />

       </VCol>
       
       <VCol v-if="lstBranches && lstBranches.length > 0" cols="12">
            
            <label for="products">Products</label>
            <v-autocomplete
                v-model="form.product_id"
                v-model:search="searchInput"
                :items="lstProducts"
                tabindex="6"
                :item-title="item => item? `${item.code}-${item.sku}-${item.name}`: ''"
                item-value="id"
                :error-messages="errorMessages.products"
                variant="outlined"
                @keyup.enter="handleSelectedProducts"
                >
            </v-autocomplete>
        </VCol>
        
        <VCol v-if="lstBranches && lstBranches.length > 0" cols="12">
            <SelectedProducts 
            v-bind="form"
            :companyInfo="companyInfo"
            :selectedStore="selectedStore"
            @delete-product="handleProductDelete"
            @update-qty="handleProductQty"
            @update-price="handleProductPrice"
            :error-messages="errorMessages.products"
            @total-qty="handleTotalQty"
            @total-price="handleTotalPrice"
            />
        </VCol>
        
       <VCol
        v-if="lstBranches && lstBranches.length > 0"
         cols="12"
         class="d-flex gap-4 justify-end align-center flex-wrap"
       >
         <VBtn 
         type="submit" 
         color="primary"
         :loading="loading"
         >
           Save
         </VBtn>
       </VCol>
     </VRow>
   </VForm>
           </VCardText>
         </VCard>
 </template>
