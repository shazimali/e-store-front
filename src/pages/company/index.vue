<script setup lang="ts">
import { ICompany } from '@/interfaces/ICompany';
import { fetchCompanyDetail, updateCompanyDetail } from '@/services/CompanyService';
import { toast } from 'vue3-toastify';

const form = ref<ICompany>({
    ntn:'',
    strn:'',
    address:'',
    sale_tax:'',
    ext_tax:'',
    del_px:'',
    del_adjust:'',
    inv_adjust:'',
    phone:''
})
onMounted(() => {
    fetchCompanyDetail().then((res:any) =>{
        form.value = res.data
    }).catch((err:any)=>{
        console.log(err.message)
    })
});
const handleSubmit = () => {
    updateCompanyDetail(form.value).then((res: any) => {
      toast.success(res.data)
    }).catch((err:any) => {
        toast.error(err.message);
    })
}

</script>
<template>
   <VCard title="Company Details">
        <VCardText>
            <VForm @submit.prevent="handleSubmit">
                <VRow>
                    <VCol cols="6">
                        <VRow no-gutters>
                        <VCol
                            cols="12"
                        >
                            <label for="name">N.T.N</label>
                        </VCol>
                
                        <VCol
                            cols="12"
                        >
                            <VTextField
                            id="ntn"
                            v-model="form.ntn"
                            placeholder="Please enter N.T.N"
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
                            <label for="code">Sale Tax Number</label>
                        </VCol>
                
                        <VCol
                            cols="12"
                        >
                            <VTextField
                            id="code"
                            v-model="form.strn"
                            placeholder="Please enter sale tax number"
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
                            type="number"
                            v-model="form.phone"
                            placeholder="Please enter phone number"
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
                            <label for="sku">Deliverable Prefix</label>
                        </VCol>
                
                        <VCol
                            cols="12"
                        >
                            <VTextField
                            id="del_px"
                            type="text"
                            v-model="form.del_px"
                            placeholder="Please enter deliverable prefix"
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
                            <label for="sale_tax">Sale Tax</label>
                        </VCol>
                
                        <VCol
                            cols="12"
                        >
                            <VTextField
                            id="sale_tax"
                            type="number"
                            v-model="form.sale_tax"
                            placeholder="Please enter sale tax"
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
                            <label for="sale_tax">Extra Tax</label>
                        </VCol>
                
                        <VCol
                            cols="12"
                        >
                            <VTextField
                            id="sale_tax"
                            type="number"
                            v-model="form.ext_tax"
                            placeholder="Please enter extra tax"
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
                            <label for="del_adjust">Deliverable Adjustment (top_px space right_px space bottom_px space left_px)</label>
                        </VCol>
                
                        <VCol
                            cols="12"
                        >
                            <VTextField
                            id="del_adjust"
                            type="text"
                            v-model="form.del_adjust"
                            placeholder="Please enter deliverable margin adjustment"
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
                            <label for="inv_adjust">Invoice Adjustment  (top_px space right_px space bottom_px space left_px)</label>
                        </VCol>
                
                        <VCol
                            cols="12"
                        >
                            <VTextField
                            id="inv_adjust"
                            type="text"
                            v-model="form.inv_adjust"
                            placeholder="Please enter invoice margin adjustment"
                            persistent-placeholder
                            />
                        </VCol>
                        </VRow>
                    </VCol>
                    <VCol cols="12">
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
                            placeholder="Please enter address"
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
