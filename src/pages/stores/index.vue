<template>
    <VRow>
       <VCol cols="12">
        <v-subheader class="py-0 d-flex justify-space-between rounded-lg mb-3">
            <h3>Stores</h3>
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
      <v-spacer></v-spacer>

            <v-btn v-if="canAccess('store_create')" color="primary" to="/stores/create">
                Create Store
            </v-btn>
        </v-subheader>
       <VCard>
           <v-data-table-server
           :headers="headers"
           v-model:search="search"
           :items="lstStores"
           :items-length="total_items"
           :loading="loading"
           v-model:page="current_page"
           v-model:items-per-page="item_per_page"
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

import { IStoreList } from '@/interfaces/IStore';
import { fetchStores } from '@/services/StoreService';
import { canAccess } from '@core/utils/helpers';
import { onMounted } from 'vue';
import { toast } from 'vue3-toastify';
       const lstStores = ref<IStoreList>([])
       const loading = ref<boolean>(false)
       const item_per_page = ref<number>(5)
       const search = ref<string>('')
       const total_items = ref<number>()
       const current_page = ref<number>(1)
       const router = useRouter();
       const headers = [
               { title: "Name", align: "start",value: "name" },
               { title: "Code", value: "code"},
               { title: "Email", value: "email"},
               { title: "Phone", value: "phone"},
               { title: "City", value: "city"},
               { title: "Status", value: "status"},
               { title: "Created At", value: "created_at"},
               { title: "Actions", value: "actions" }
           ]
       onMounted(() => {
        doFetchStores()
       })

       const handleEdit = (id:number) => {
            router.push('stores/'+id)
        } 

        const doFetchStores = () => {
            loading.value = true;
            fetchStores(current_page.value,item_per_page.value,search.value).then((res) => {
                lstStores.value = res.data.data
                total_items.value= res.data.meta.total
                loading.value = false;
                }).catch((err) => {
                toast.error(err.message)
                loading.value = false;
            })
        }
       
  
</script>
