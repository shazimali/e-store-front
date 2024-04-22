<script setup lang="ts">

import { commaFormate } from '@/@core/utils/helpers';
import { toast } from 'vue3-toastify';
import { IBranchList } from '../../interfaces/IBranch';
import { ILedgerForm, ILedgerList } from '../../interfaces/ILedger';
import { IStoreList } from '../../interfaces/IStore';
import { fetchBranchesByStoreID, fetchLedger, fetchStores } from '../../services/LedgerService';
        const lstStores = ref<IStoreList>([])
        const lstBranches = ref<IBranchList>([])
        const lstLedgers = ref<ILedgerList>([])
        const loading = ref<boolean>(false)
        const router = useRouter();
const form = ref<ILedgerForm>({
    store_id:'',
    branch_id:'',
    from_date:'',
    to_date:''
})

const headers = [
               { title: "Invoice#", value: "invoice_id" },
               { title: "Description", value: "type" },
               { title: "Date", value: "date" },
               { title: "Amount", value: "amount"},
               { title: "Total", value: "total"},
           ]

onMounted(() => {
    doFetchStores()
})
 
const doFetchStores = () => {
    fetchStores().then((res:any) => {
        lstStores.value = res.data
        }).catch((err:any) => {
        toast.error(err.message)
    })
}
const getBranches = (id:number) => {
    lstBranches.value= [];
    form.value.branch_id= '';
        if(id){
            fetchBranchesByStoreID(id).then((res:any) => {
                lstBranches.value = res.data
            }).catch((err:any) => {
                toast.error(err.message);
            })
        }
        
}


const handleSubmit  =  () => {
    loading.value = true;
    const paramString = router.replace({ query:form.value });
    const searchParams = new URLSearchParams(form.value);
    fetchLedger(searchParams.toString()).then((res: any)=>{
        let ledgersArr =  res.data.sort((a, b) => new Date(a.date) - new Date(b.date));
            ledgersArr.forEach((item, index) => {
                index == 0 ?
                item['total'] = item.amount 
                :
                    item['type'] == 'invoice' ?
                        item['total'] =  parseFloat(ledgersArr[index-1].total) + parseFloat(item.amount)
                        :
                        item['total'] =  parseFloat(ledgersArr[index-1].total) - parseFloat(item.amount)

            });
            lstLedgers.value = ledgersArr;
            loading.value = false;
    }).catch((err:any) => {
        toast.error(err.message)
    })
}
  
</script>
<template>
    <VRow>
       <VCol cols="12">
        <v-subheader class="py-0 d-flex justify-space-between rounded-lg mb-3">
            <h3>Ledger</h3>
        </v-subheader>
       <VCard>
        <VForm @submit.prevent="handleSubmit">
                <VRow>
                    <VCol cols="6">
                        <VRow no-gutters>
                        <VCol
                            cols="12"
                        >
                            <label for="name">Stores</label>
                        </VCol>
                
                        <VCol
                            cols="12"
                        >
                        <v-autocomplete
                            v-model="form.store_id"
                            :items="lstStores"
                            @update:menu="getBranches(form.store_id)"
                            :item-title="item => item? `${item.code}-${item.name}`: ''"
                            item-value="id"
                            variant="outlined"
                        />
                        </VCol>
                        </VRow>
                    </VCol>
                    <VCol cols="6">
                        <VRow no-gutters>
                        <VCol
                            cols="12"
                        >
                            <label for="code">Branches</label>
                        </VCol>
                
                        <VCol
                            cols="12"
                        >
                        <v-autocomplete
            
            v-model="form.branch_id"
            :items="lstBranches"
            :item-title="item => item? `${item.code}-${item.name}`: ''"
            item-value="id"
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
                            <label for="code">From Date</label>
                        </VCol>
                
                        <VCol
                            cols="12"
                        >
                        <VTextField
               id="date"
               type="date"
               tabindex="1"
               v-model="form.from_date"
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
                            <label for="sku">To Date</label>
                        </VCol>
                
                        <VCol
                            cols="12"
                        >
                        <VTextField
               id="date"
               type="date"
               v-model="form.to_date"
               tabindex="1"
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
                        Search
                        </VBtn>
                    </VCol>
                </VRow>
            </VForm>
            <v-data-table-server
           :headers="headers"
           :items-per-page="-1"
           :items="lstLedgers"
           :loading="loading"
           item-key="id"
           class="elevation-1"
       >

       <template v-slot:item.invoice_id="{item}">
            <a :href="item.type == 'invoice' ? '/print/'+item.id+'/?type=invoice' : '/print/'+item.id+'/?type=voucher'"
            target="_blank">
          inv#{{ item.invoice_id }}
            </a>
        </template>
        <template v-slot:item.amount="{item}">
          {{ commaFormate(item.amount ) }}
        </template>
        <template v-slot:item.total="{item}">
          {{ commaFormate(item.total ) }}
        </template>
            </v-data-table-server>
       </VCard>
       </VCol>
    </VRow>
</template>

