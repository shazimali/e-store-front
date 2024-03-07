<template>
    <VRow>
        <VCol cols="12">
        <v-subheader class="py-0 d-flex justify-space-between rounded-lg mb-3">
            <h3>Roles</h3>
            <v-btn color="primary" to="/roles/create">
                Create Role
            </v-btn>
        </v-subheader>
        <VCard>
            <v-data-table 
            :headers="headers"
            :items="lstRoles"
            :loading="loading"
            :items-per-page=10
            class="elevation-1"
            >   
            <template v-slot:item.actions="{ item }">
                <v-icon  @click="handleEdit(item.id)" class="mr-2 ri-pencil-line"/>
                <v-icon size="small" @click="handleDelete(item.id)" class="ri-close-circle-fill" />
            </template>
            </v-data-table>
        </VCard>
        </VCol>
    </VRow>
</template>


<script setup lang="ts">
import { IRoleList } from '@/interfaces/IRole';
import { fetchRoles, deleteRole } from '@/services/RoleService';
import { onMounted } from 'vue';
import { toast } from 'vue3-toastify';
       
       const lstRoles = ref<IRoleList>([])
       const loading = ref<boolean>(false)
        const router = useRouter();
       const headers = [
               { title: "Name", align: "start",value: "name" },
               { title: "Permissions", value: "permissions"},
               { title: "Created At", value: "created_at"},
               { title: "Actions", value: "actions" }
           ]
       onMounted(() => {
            doFetchRoles();
       })

       const handleEdit = (id: number) => {
            router.push('/roles/'+id)
       }

       const  handleDelete = (id:number)=>{
        
            if(confirm("Do you really want to delete?")){
               deleteRole(id).then((res) => {
                if(res.data.status == 200){
                    toast.success(res.data.message);
                    doFetchRoles();
                }if(res.data.status == 201){
                    toast.error(res.data.message);
                }
               }).catch((err) => {
                toast.error(err.response?.data || err.message);
               })
            }
       }

       const doFetchRoles = () => {
            loading.value = true;
            fetchRoles().then((res) => {
                    lstRoles.value = res.data.data
                loading.value = false;
                }).catch((err) => {
                toast.error(err.message)
                loading.value = false;
            })
       }
       
  
</script>
