<template>
    <VRow>
       <VCol cols="12">
        <v-subheader class="py-0 d-flex justify-space-between rounded-lg mb-3">
            <h3>Branches</h3>
      <v-spacer></v-spacer>
            <v-btn v-if="canAccess('branch_create')" color="primary" to="/branches/create">
                Create Branch
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
        @update:menu="doFetchStores"
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
           :search="search"
           :items="lstBranches"
           :items-length="total_items"
           :loading="loading"
           :page="current_page"
           :items-per-page="item_per_page"
           item-key="id"
           @update:options ="doFetchStores"
           class="elevation-1"
       >

      <template v-slot:item.status="{ item }">
        <div class="text-end">
          <v-chip
            :color="item.status == 'ACTIVE' ? 'green' : 'red'"
            :text="item.status"
          ></v-chip>
        </div>
      </template>
                <template 
                    v-slot:item.actions="{ item }">
                    <v-icon v-if="canAccess('store_edit')"  @click="handleEdit(item.id)" class="mr-2 ri-pencil-line"/>
                </template>
            </v-data-table-server>
       </VCard>
       </VCol>
    </VRow>
</template>
<script setup lang="ts">

import { canAccess } from '@/@core/utils/helpers';
import { IStoreList } from '@/interfaces/IStore';
import { fetchBranches } from '@/services/BranchService';
import { fetchStores } from '@/services/ProductService';
import { onMounted } from 'vue';
import { toast } from 'vue3-toastify';
       const lstBranches = ref<IStoreList>([])
       const loading = ref<boolean>(false)
       const item_per_page = ref<number>(5)
       const lstStores = ref<[]>([])
       const store_id = ref<number>(0)
       const search = ref<string>('')
       const total_items = ref<number>()
       const current_page = ref<number>(1)
       const router = useRouter();
       const headers = [
                { title: "Code",align: "start", value: "code"},
               { title: "Name", value: "name" },
               { title: "Store", value: "store" },
               { title: "NTN", value: "ntn" },
               { title: "Sale Tax ", value: "sale_tax_number" },
               { title: "Phone", value: "phone"},
               { title: "City", value: "city"},
               { title: "Status", value: "status"},
               { title: "Created At", value: "created_at"},
               { title: "Actions", value: "actions" }
           ]
       onMounted(() => {
        doFetchStores()
        fetchStores().then((res:any) => {
            lstStores.value= res.data;
        }).catch((err:any) => {
            toast.error(err.message)
        })
       })

        const handleEdit = (id:number) => {
            router.push('branches/'+id)
        } 

        const doFetchStores = () => {
            loading.value = true;
            fetchBranches(current_page.value,item_per_page.value,search.value,store_id.value).then((res:any) => {
                lstBranches.value = res.data.data
                total_items.value= res.data.meta.total
                loading.value = false;
                }).catch((err:any) => {
                toast.error(err.message)
                loading.value = false;
            })
        }
       
  
</script>
