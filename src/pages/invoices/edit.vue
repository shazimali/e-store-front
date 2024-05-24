
import { getRandomValues } from 'crypto';

import { fetchProducts } from '@/services/ProductService';
<script setup lang="ts">
import { IBranchList } from '@/interfaces/IBranch';
import { IStore, IStoreList } from '@/interfaces/IStore';
import { InfInvoice } from '@/interfaces/InfInvoice.ts';
import { InvoiceProductList } from '@/interfaces/InvoiceProduct.ts';
import { fetchBranchesByStoreID, fetchStoresAndCompany } from '@/services/InvoiceService.ts';
import { toast } from 'vue3-toastify';
import { ICompany } from '../../interfaces/ICompany';
import { fetchEditProductsByBranchID, fetchInvoiceByID, updateInvoice } from '../../services/InvoiceService';
import ReturnSelectedProducts from './returnSelectedProducts.vue';
import SelectedProducts from './selectedProducts.vue';

const errorMessages = ref<IDeliverableErrors>({})
const lstProducts = ref<InvoiceProductList>([])
const lstStores = ref<IStoreList>()
const selectedStore = ref<IStore>()
const companyInfo = ref<ICompany>()
const lstBranches = ref<IBranchList>()
const loading = ref<boolean>(false)
const returnSearchInput = ref<string>('')
const searchInput = ref<string>('')
const form = ref<InfInvoice>({
    date:new Date().toISOString().slice(0,10),
    sr_number:'',
    total_qty:0,
    return_total_qty:0,
    inv_total_qty:0,
    is_ex_tax:false,
    is_return:false,
    total_price:0,
    return_total_price:0,
    inv_total_price:0,
    store_id: '',
    remarks: '',
    products:[],
    return_products:[],
    product_id:'',
    discount:0,
    branch_id: ''
})
const route = useRoute();
const router = useRouter();
onMounted(() => {
    doFetchStores()
    const id :number = route.params.id
    fetchInvoiceByID(id).then((res:any) => {
                getBranches(res.data.store_id);
                getProducts(res.data.branch_id);
                form.value = res.data;
            }).catch((err:any) => {
                toast.error(err.message)
            })
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
    const available_qty = lstProducts.value[selectedIdx].available_qty;
    if (selectedIdx != -1){ 
        const isProductAlreadyExistsIndex = form.value.products.findIndex((item)=>{return item.id == lstProducts.value[selectedIdx].id});

        if(isProductAlreadyExistsIndex != -1){
            if(available_qty <= form.value.products[isProductAlreadyExistsIndex].qty){
                alert('Available Quantity Exceeded');
            }else{
            form.value.products[isProductAlreadyExistsIndex].qty = parseInt(form.value.products[isProductAlreadyExistsIndex].qty) + parseInt(1)  
            }
        }
         //  push new product into the list
        else{
            if(available_qty < 1){
                alert("No Available Product");
                return false
            }
            form.value.products.push({
                id :lstProducts.value[selectedIdx].id,
                name:lstProducts.value[selectedIdx].name,
                code:lstProducts.value[selectedIdx].code,
                sku:lstProducts.value[selectedIdx].sku,
                sale_tax:lstProducts.value[selectedIdx].sale_tax,
                ext_tax:lstProducts.value[selectedIdx].ext_tax,
                price:lstProducts.value[selectedIdx].sale_price,
                available_qty:lstProducts.value[selectedIdx].available_qty,
                qty:1
             })
        }
     }
    searchInput.value = "";
    form.value.product_id = "";
}
const handleReturnSelectedProducts = () => {
    const  selectedIdx = lstProducts.value.findIndex((item)=>{return item.id == form.value.product_id});
    const available_qty = lstProducts.value[selectedIdx].available_qty;
    if (selectedIdx != -1){ 
        const isProductAlreadyExistsIndex = form.value.return_products.findIndex((item)=>{return item.id == lstProducts.value[selectedIdx].id});

        if(isProductAlreadyExistsIndex != -1){
            if(available_qty <= form.value.return_products[isProductAlreadyExistsIndex].qty){
                alert('Available Quantity Exceeded');
            }else{
            form.value.return_products[isProductAlreadyExistsIndex].qty = parseInt(form.value.return_products[isProductAlreadyExistsIndex].qty) + parseInt(1)  
            }
        }
         //  push new product into the list
        else{
            if(available_qty < 1){
                alert("No Available Product");
                return false
            }
            form.value.return_products.push({
                id :lstProducts.value[selectedIdx].id,
                name:lstProducts.value[selectedIdx].name,
                code:lstProducts.value[selectedIdx].code,
                sku:lstProducts.value[selectedIdx].sku,
                sale_tax:lstProducts.value[selectedIdx].sale_tax,
                ext_tax:lstProducts.value[selectedIdx].ext_tax,
                price:lstProducts.value[selectedIdx].sale_price,
                available_qty:lstProducts.value[selectedIdx].available_qty,
                qty:1
             })
        }
     }
     returnSearchInput.value = "";
    form.value.product_id = "";
}
const handleProductDelete = (id:number) => {
    form.value.products =  form.value.products.filter((item:any) => item.id !== id )
}
const handleReturnProductDelete = (id:number) => {
    form.value.return_products =  form.value.return_products.filter((item:any) => item.id !== id )
}
const handleProductQty = (payload:{id:number,val:number}) => {
    const  qtyIdx = form.value.products.findIndex((item:any)=> item.id == payload.id);
    form.value.products[qtyIdx].qty=payload.val
}
const handleReturnProductQty = (payload:{id:number,val:number}) => {
    const  qtyIdx = form.value.return_products.findIndex((item:any)=> item.id == payload.id);
    form.value.return_products[qtyIdx].qty=payload.val
}
const handleProductPrice = (payload:{id:number,val:number}) => {
    const  qtyIdx = form.value.products.findIndex((item:any)=> item.id == payload.id);
    form.value.products[qtyIdx].price=payload.val
}
const handleReturnProductPrice = (payload:{id:number,val:number}) => {
    const  qtyIdx = form.value.return_products.findIndex((item:any)=> item.id == payload.id);
    form.value.return_products[qtyIdx].price=payload.val
}


const handleTotalQty = (qty:number) => {
    form.value.inv_total_qty = qty;
}

const handleTotalPrice = (price:number) => {
    form.value.inv_total_price = price;
}

const handleReturnTotalQty = (qty:number) => {
    form.value.return_total_qty = qty;
}

const handleReturnTotalPrice = (price:number) => {
    form.value.return_total_price = price;
}

const handleReturnInvoiceOption = (val:boolean) => {
    if(!val){
        form.value.return_products = [];
        form.value.return_total_qty = 0;
        form.value.return_total_price = 0;
    }
}


const handleSubmit = () => {
    loading.value = true;
    const id :number = route.params.id
    form.value.total_qty = parseFloat(form.value.inv_total_qty)  +  parseFloat(form.value.return_total_qty) 
    form.value.total_price = parseFloat(form.value.inv_total_price)  - parseFloat(form.value.return_total_price) 
    updateInvoice(id,form.value).then((res:any) => {
        const invoice_id = res.data;
        toast.success('Invoice updated successfully');
        loading.value = false
        let url = '/print/'+invoice_id+"?type="+"invoice";
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

const getBranches = (id:number) => {
    if(id){
        lstProducts.value = []
        lstBranches.value = []
        form.value.products = []
        fetchBranchesByStoreID(id).then((res:any) => {
        lstBranches.value = res.data
        selectedStore.value = lstStores.value.filter((item:any) => item.id === id);
        form.value.discount = selectedStore.value[0].discount
        }).catch((err:any) => {
            toast.error(err.message)
        })
    } 
    
}

const getProducts = (branch_id:number) => {
    const invoice_id :number = route.params.id
    if(branch_id){
        lstProducts.value = []
        form.value.products = []
        fetchEditProductsByBranchID(branch_id,invoice_id).then((res:any) => {
        lstProducts.value = res.data
        }).catch((err:any) => {
            toast.error(err.message)
        })
    }
        
}

const reset = () => {
    form.value.store_id = ''
    form.value.branch_id = ''
    form.value.is_ex_tax = false
    form.value.sr_number = ''
    form.value.date = new Date().toISOString().slice(0,10)
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
        <VCol cols="5">
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
       <VCol cols="5">
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
       <vCol cols="2">
        <v-switch
    v-model="form.is_return"
    :label="`Return Invoice`"
    class="mt-5"
    @change="handleReturnInvoiceOption(form.is_return)"
    hide-details
    inset
  ></v-switch>
      </vCol>
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
            @update:menu="getBranches(form.store_id)"
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
            @update:menu="getProducts(form.branch_id)"
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

       <VCol v-if="lstProducts && lstProducts.length > 0 && form.is_return" cols="12">
            
            <label for="products">Return Products</label>
            <v-autocomplete
                v-model="form.product_id"
                v-model:search="returnSearchInput"
                :items="lstProducts"
                tabindex="6"
                :item-title="item => item? `${item.code}-${item.sku}-${item.name}`: ''"
                item-value="id"
                :error-messages="errorMessages.return_products"
                variant="outlined"
                @keyup.enter="handleReturnSelectedProducts"
                >
            </v-autocomplete>
        </VCol>
        
        <VCol v-if="lstProducts && lstProducts.length > 0 && form.is_return" cols="12">
            <ReturnSelectedProducts 
            v-bind="form"
            :companyInfo="companyInfo"
            :selectedStore="selectedStore"
            @r-delete-product="handleReturnProductDelete"
            @r-update-qty="handleReturnProductQty"
            @r-update-price="handleReturnProductPrice"
            :error-messages="errorMessages.return_products"
            @r-total-qty="handleReturnTotalQty"
            @r-total-price="handleReturnTotalPrice"
            />
        </VCol>
       
       <VCol v-if="lstProducts && lstProducts.length > 0" cols="12">
            
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
        
        <VCol v-if="lstProducts && lstProducts.length > 0" cols="12">
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
           Update
         </VBtn>
       </VCol>
     </VRow>
   </VForm>
           </VCardText>
         </VCard>
 </template>
