
import { getRandomValues } from 'crypto';

import { fetchProducts } from '@/services/ProductService';
<script setup lang="ts">
import { IBranchList } from '@/interfaces/IBranch';
import { IDeliverableErrors } from '@/interfaces/IDeliverable';
import { IProductList } from '@/interfaces/IProduct';
import { IReturnDeliverableEdit } from '@/interfaces/IReturnDeliverable';
import { IStoreList } from '@/interfaces/IStore';
import { fetchStores } from '@/services/Deliverable';
import { fetchReturnDeliverableByID, updateReturnDeliverable } from '@/services/ReturnDeliverable';
import { toast } from 'vue3-toastify';
import { fetchBranchesByStoreID, fetchProductsByBranchID } from '../../services/ReturnDeliverable';
import SelectedProducts from './selectedProducts.vue';
const errorMessages = ref<IDeliverableErrors>({})
const lstProducts = ref<IProductList>([])
const lstStores = ref<IStoreList>()
const lstBranches = ref<IBranchList>()
const loading = ref<boolean>(false)
const searchInput = ref<string>('')
const route = useRoute()
const router = useRouter();
const form = ref<IReturnDeliverableEdit>({
    date:'',
    order_date:'',
    sr_number:'',
    total_qty:'',
    return_type:'',
    store_id: '',
    remarks: '',
    products:[],
    branch_id: '',
    invoice_sr_number:''
})
onMounted(() => {
    doFetchStores()

    const id :number = route.params.id
    fetchReturnDeliverableByID(id).then((res:any) => {
                form.value = res.data;
                initBranchesAndProducts(res.data.store_id, res.data.branch_id)
            }).catch((err:any) => {
                toast.error(err.message)
            })
           
})

const doFetchStores = () => {
    fetchStores().then((res:any) => {
        lstStores.value = res.data
    }).catch((err:any) => {
        toast.error(err.message)
    })


}
const handleSelectedProducts = () => {
    const  selectedIdx = lstProducts.value.findIndex((item)=>{return item.id == form.value.product_id});
    const available_qty = lstProducts.value[selectedIdx].available_qty;
     if (selectedIdx != -1){ 
        const isProductAlreadyExistsIndex = form.value.products.findIndex((item)=>{return item.id == lstProducts.value[selectedIdx].id});
        // check product already  exist in the list
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
                    available_qty:lstProducts.value[selectedIdx].available_qty,
                    price:0,
                    qty:1
                 })
            
        }
     }
    searchInput.value = "";
    form.value.product_id = "";
}
const handleProductDelete = (id:number) => {
    form.value.products =  form.value.products.filter((item) => item.id !== id )
}
const handleProductQty = (payload:{id:number,val:number}) => {
    const  qtyIdx = form.value.products.findIndex((item)=> item.id == payload.id);
    form.value.products[qtyIdx].qty=payload.val
}


const handleTotalQty = (qty:number) => {
    form.value.total_qty = qty;
}


const handleSubmit = () => {
    loading.value = true;
    const id :number = route.params.id
    updateReturnDeliverable(id,form.value).then((res:any) => {
        toast.success('Return Deliverable updated successfully');
        loading.value = false
        window.open('/print/'+id+'?type=return-deliverable','_blank')
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
        form.value.branch_id='';
        lstProducts.value = [];
        fetchBranchesByStoreID(id).then((res:any) => {
        lstBranches.value = res.data.data
        }).catch((err:any) => {
            toast.error(err.message)
        })
    }else{
        lstBranches.value = []
    }
    
}

const getProducts = (id:number) => {
    if(id){
        lstProducts.value = [];
        fetchProductsByBranchID(id).then((res:any) => {
        lstProducts.value = res.data
        }).catch((err:any) => {
            toast.error(err.message)
        })
    }else{
        lstProducts.value = []
    }
    
}

const initBranchesAndProducts = (store_id:number, branch_id:number) => {

        //fetch stores

        fetchBranchesByStoreID(store_id).then((res:any) => {
        lstBranches.value = res.data.data
        }).catch((err:any) => {
            toast.error(err.message)
        })

        //fetch Products as per selected branch

        fetchProductsByBranchID(branch_id).then((res:any) => {
        lstProducts.value = res.data
        }).catch((err:any) => {
            toast.error(err.message)
        })

    
}

</script>
<template v-if="form.value">
    <VCard :title="'Edit Return Deliverable#'+form.invoice_sr_number">
           <VCardText>
             <VForm @submit.prevent="handleSubmit">
     <VRow>
        <VCol cols="3">
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
       <VCol cols="3">
             <label for="order_date">Return Date</label>
             <VTextField
               id="order_date"
               type="date"
               tabindex="2"
               :error-messages="errorMessages.order_date"
               v-model="form.order_date"
               persistent-placeholder
             />

       </VCol>
       <VCol cols="3">
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
       <VCol cols="3">
             <label for="sr_number">Return Type</label>
             <v-select
                v-model="form.return_type"         
                :items="['RETURN','DAMAGE']"
                :error-messages="errorMessages.return_type"
                variant="outlined"
                >
            </v-select>

       </VCol>
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

       <VCol v-if="lstProducts && lstProducts.length > 0" cols="12">
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
            @delete-product="handleProductDelete"
            @update-qty="handleProductQty"
            :error-messages="errorMessages.products"
            @total-qty="handleTotalQty"
            />
        </VCol>
        
       <VCol
        v-if="lstProducts && lstProducts.length > 0"
         cols="12"
         class="d-flex gap-4 justify-end align-center flex-wrap"
       >
         <VBtn 
         type="submit" 
         color="primary"
         :loading="loading"
         >
           update
         </VBtn>
       </VCol>
     </VRow>
   </VForm>
           </VCardText>
         </VCard>
 </template>
