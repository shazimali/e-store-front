<script setup lang="ts">
import { IProduct } from '@/interfaces/IProduct';
import { fetchProductByID, fetchStores, updateProduct } from '@/services/ProductService';
import { onMounted, ref } from 'vue';
import { toast } from 'vue3-toastify';

const route = useRoute()
const errorMessages = ref<IProduct>({});
const lstStores = ref<[]>([])
const router = useRouter();
const form = ref<IProduct>({
    name:'',
    code:'',
    sku:'',
    sale_price:0,
    status:'',
    store_id:''
})
onMounted(() => {
    fetchStores().then((res:any) => {
        lstStores.value = res.data;
    }).catch((err:any) => {
        toast.error('err.message');
    })
    const id :number = route.params.id
    fetchProductByID(id).then((res:any) => {
                form.value = res.data;
            }).catch((err:any) => {
                toast.error(err.message)
            })
})
const handleSubmit = () => {
    const id :number = route.params.id
    updateProduct(id,form.value).then((res:any)=>{
        toast(res.data)
        router.push('/products')
    }).catch((err:any)=>{
        if(err.response.status == "422"){
        errorMessages.value =  err.response.data.errors
        }else if(err.response.status == "401"){  
            toast.error(err.response.data.message);
        }else{
            toast.error(err.message)
        }
    });
}
</script>
<template>
    <VCard title="Edit Product">
        <VCardText>
            <VForm @submit.prevent="handleSubmit">
                <VRow>
                    <VCol cols="6">
                        <VRow no-gutters>
                        <VCol
                            cols="12"
                        >
                            <label for="status">Main Store</label>
                        </VCol>
                
                        <VCol
                            cols="12"
                        >
                        <v-autocomplete
                            v-model="form.store_id"
                            :items="lstStores"
                            :item-title="item => item? `${item.code}-${item.name}`: ''"
                            item-value="id"
                            :error-messages="errorMessages.store_id"
                            variant="outlined"
                            >
                        </v-autocomplete>
                            </VCol>

                        </VRow>
                    </VCol>
                    <VCol cols="6">
                        <VRow no-gutters>
                        <VCol
                            cols="12"
                        >
                            <label for="name">Name</label>
                        </VCol>
                
                        <VCol
                            cols="12"
                        >
                            <VTextField
                            id="name"
                            :error-messages="errorMessages.name"
                            v-model="form.name"
                            placeholder="Please enter name"
                            persistent-placeholder
                            />
                        </VCol>
                        </VRow>
                    </VCol>
                    <VCol cols="6">
                        <VRow no-gutters>
                        <VCol
                            cols="12"
                        >
                            <label for="code">Code</label>
                        </VCol>
                
                        <VCol
                            cols="12"
                        >
                            <VTextField
                            id="code"
                            v-model="form.code"
                            :error-messages="errorMessages.code"
                            placeholder="Please enter code"
                            persistent-placeholder
                            />
                        </VCol>
                        </VRow>
                    </VCol>
                    <VCol cols="6">
                        <VRow no-gutters>
                        <VCol
                            cols="12"
                        >
                            <label for="sku">SKU</label>
                        </VCol>
                
                        <VCol
                            cols="12"
                        >
                            <VTextField
                            id="sku"
                            v-model="form.sku"
                            :error-messages="errorMessages.sku"
                            placeholder="Please enter sku"
                            persistent-placeholder
                            />
                        </VCol>
                        </VRow>
                    </VCol>
                    <VCol cols="6">
                        <VRow no-gutters>
                        <VCol
                            cols="12"
                        >
                            <label for="status">Status</label>
                        </VCol>
                
                        <VCol
                            cols="12"
                        >
                            <v-select
                                v-model="form.status"         
                                :items="['ACTIVE','INACTIVE']"
                                :error-messages="errorMessages.status"
                                selected="ACTIVE"
                                variant="outlined"
                                >
                                </v-select>
                            </VCol>

                        </VRow>
                    </VCol>
                    <VCol cols="6">
                        <VRow no-gutters>
                        <VCol
                            cols="12"
                        >
                            <label for="sku">Sale Price</label>
                        </VCol>
                
                        <VCol
                            cols="12"
                        >
                            <VTextField
                            id="sku"
                            type="number"
                            v-model="form.sale_price"
                            :error-messages="errorMessages.sale_price"
                            placeholder="Please enter sale price"
                            persistent-placeholder
                            />
                        </VCol>
                        </VRow>
                    </VCol>
                    <VCol
                        cols="12"
                        class="d-flex gap-4"
                    >
                        <VBtn type="submit">
                        Update
                        </VBtn>
                    </VCol>
                </VRow>
            </VForm>
        </VCardText>
    </VCard>
 </template>

 