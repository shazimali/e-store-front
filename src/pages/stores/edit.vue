<script setup lang="ts">
import { IStore } from '@/interfaces/IStore';
import { fetchCities, fetchStoreByID, updateStore } from '@/services/StoreService';
import { onMounted, ref } from 'vue';
import { toast } from 'vue3-toastify';

const route = useRoute()
const errorMessages = ref<IStore>({});
const router = useRouter();
const lstCities = ref<[]>([]);
const form = ref<IStore>({
    name:'',code:'',email:'',
    ntn:'',sale_tax_number:'',
    address:'',status:'',
    city_id: '',phone: '',
    is_sr:'',discount:0
})
const discount_value = Array.from(Array(100+1).keys()).slice(1) ;
const is_sr = ref([
    {'name':'Yes',id: 1},
    {'name':'No',id: 0},
]);

onMounted(() => {
    fetchCities().then((res:any) => {
        lstCities.value = res.data
    }).catch((err:any) => {
        toast.error(err.message);
    })
    const id :number = route.params.id
    fetchStoreByID(id).then((res:any) => {
                form.value = res.data;
            }).catch((err:any) => {
                toast.error(err.message)
            })
})
const handleSubmit = () => {
    const id :number = route.params.id
    updateStore(id,form.value).then((res:any)=>{
        toast(res.data)
        router.push('/stores')
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
    <VCard title="Edit Store">
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
                            <label for="sku">email</label>
                        </VCol>
                
                        <VCol
                            cols="12"
                        >
                            <VTextField
                            id="sku"
                            type="email"
                            v-model="form.email"
                            :error-messages="errorMessages.email"
                            placeholder="Please enter email"
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
                            <label for="sku">Phone</label>
                        </VCol>
                
                        <VCol
                            cols="12"
                        >
                            <VTextField
                            id="phone"
                            v-model="form.phone"
                            :error-messages="errorMessages.phone"
                            placeholder="Please enter phone"
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
                            <label for="sku">NTN</label>
                        </VCol>
                
                        <VCol
                            cols="12"
                        >
                            <VTextField
                            id="ntn"
                            v-model="form.ntn"
                            :error-messages="errorMessages.ntn"
                            placeholder="Please enter NTN"
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
                            <label for="sku">Sale Tax Number</label>
                        </VCol>
                
                        <VCol
                            cols="12"
                        >
                            <VTextField
                            id="sale_tax_number"
                            v-model="form.sale_tax_number"
                            :error-messages="errorMessages.sale_tax_number"
                            placeholder="Please enter sale tax number"
                            persistent-placeholder
                            />
                        </VCol>
                        </VRow>
                    </VCol>
                    <VCol cols="4">
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
                    <VCol cols="4">
                        <VRow no-gutters>
                        <VCol
                            cols="12"
                        >
                            <label for="status">Head Office</label>
                        </VCol>
                
                        <VCol
                            cols="12"
                        >
                            <v-select
                                v-model="form.city_id"
                                :items="lstCities"
                                item-title="title"
                                item-value="id"
                                :error-messages="errorMessages.city_id"
                                variant="outlined"
                                >
                                </v-select>
                            </VCol>

                        </VRow>
                    </VCol>
                    <VCol cols="4">
                        <VRow no-gutters>
                        <VCol
                            cols="12"
                        >
                            <label for="status">Discount %</label>
                        </VCol>
                
                        <VCol
                            cols="12"
                        >
                            <v-select
                                v-model="form.discount"
                                :items="discount_value"
                                variant="outlined"
                                >
                                </v-select>
                            </VCol>

                        </VRow>
                    </VCol>
                    <VCol
                            cols="8"
                        >
                        <VRow no-gutters>
                            <VCol
                            cols="12"
                        >
                            <label for="address">Address</label>
                        </VCol>
                
                        <VCol
                            cols="12"
                        >
                        <VTextField
                            id="sale_tax_number"
                            v-model="form.address"
                            :error-messages="errorMessages.address"
                            placeholder="Please enter address"
                            persistent-placeholder
                            />
                        </VCol>
                            </VRow>

                    </VCol>
                    <VCol cols="4">
                        <VRow no-gutters>
                            <VCol
                            cols="12"
                        >
                            <label for="status">Is SR</label>
                        </VCol>
                
                        <VCol
                            cols="12"
                        >
                            <v-select
                                v-model="form.is_sr"         
                                :items="is_sr"
                                item-value="id"
                                item-title="name"
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
                        Update
                        </VBtn>
                    </VCol>
                </VRow>
            </VForm>
        </VCardText>
    </VCard>
 </template>

 