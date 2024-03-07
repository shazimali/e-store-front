<script setup lang="ts">
import { IProduct } from '@/interfaces/IProduct';
import { fetchProductByID, updateProduct } from '@/services/ProductService';
import { onMounted, ref } from 'vue';
import { toast } from 'vue3-toastify';

const route = useRoute()
const errorMessages = ref<IProduct>({});
const item_per_page = ref<number>(10);
const router = useRouter();
const form = ref<IProduct>({
    name:'',
    code:'',
    sku:'',
    status:'',
})
onMounted(() => {
    const id :number = route.params.id
    fetchProductByID(id).then((res) => {
        console.log(res)
                form.value = res.data;
            }).catch((err) => {
                toast.error(err.message)
            })
})
const handleSubmit = () => {
    const id :number = route.params.id
    updateProduct(id,form.value).then((res)=>{
        toast(res.data)
        router.push('/products')
    }).catch((err)=>{
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
                    <VCol
                        cols="12"
                        class="d-flex gap-4"
                    >
                        <VBtn type="submit">
                        Create
                        </VBtn>
                    </VCol>
                </VRow>
            </VForm>
        </VCardText>
    </VCard>
 </template>

 