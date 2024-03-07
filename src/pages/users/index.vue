<template>
    <VRow>
       <VCol cols="12">
        <v-subheader class="py-0 d-flex justify-space-between rounded-lg mb-3">
            <h3>Users</h3>
            <v-btn v-if="canAccess('user_create')" color="primary" to="/users/create">
                Create User
            </v-btn>
        </v-subheader>
       <VCard>
           <v-data-table 
           :headers="headers"
           :items="lstUsers"
           :loading="loading"
           :items-per-page=10
           item-key="id"
           class="elevation-1"
       >
                <template 
                    v-slot:item.actions="{ item }">
                    <v-icon v-if="canAccess('user_edit')"  @click="handleEdit(item.id)" class="mr-2 ri-pencil-line"/>
                    <v-icon v-if="canAccess('user_delete')" size="small" @click="handleDelete(item.id)" class="ri-close-circle-fill" />
                </template>
            </v-data-table>
       </VCard>
       </VCol>
    </VRow>
</template>
<script setup lang="ts">

import { IUserList } from '@/interfaces/IUser';
import { deleteUser, fetchUsers } from '@/services/UserService';
import { canAccess } from '@core/utils/helpers';
import { onMounted } from 'vue';
import { toast } from 'vue3-toastify';
       const lstUsers = ref<IUserList>([])
       const loading = ref<boolean>(false)
       const router = useRouter();
       const headers = [
               { title: "Name", align: "start",value: "name" },
               { title: "Email", value: "email"},
               { title: "Assigned Roles", value: "assigned_roles"},
               { title: "Created At", value: "created_at"},
               { title: "Actions", value: "actions" }
           ]
       onMounted(() => {
           doFetchUsers()
       })

       const handleEdit = (id:number) => {
            router.push('users/'+id)
        } 

        const  handleDelete = (id:number)=>{
        
            if(confirm("Do you really want to delete?")){
                deleteUser(id).then((res) => {
                    toast.success(res.data)
                    doFetchUsers()
                }).catch((err) => {
                    toast.error(err.response?.data || err.message);
                })
            }

        }

        const doFetchUsers = () => {
            
            loading.value = true;
            fetchUsers().then((res) => {
                lstUsers.value = res.data.data
                loading.value = false;
                }).catch((err) => {
                toast.error(err.message)
                loading.value = false;
            })
        }
       
  
</script>
