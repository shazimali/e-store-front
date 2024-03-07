<script setup lang="ts">
import { IRole } from "@/interfaces/IRole";
import { fetchPermissions, fetchRoleByID, saveRole, updateRole } from "@/services/RoleService";
import { toast } from "vue3-toastify";

const route = useRoute()
const router = useRouter()

const form = ref<IRole>({
    name: '',
    permissions: [],
})
const allPermissions = ref<[]>([]);

onMounted(() => {
    const id :number = route.params.id

            fetchPermissions().then((res) => {
                allPermissions.value = res.data.data
            }).catch((err) => {
                toast.error(err.message)
            })

            fetchRoleByID(id).then((res) => {
                form.value.name = res.data.data.name;
                form.value.permissions = res.data.data.permissions.map((pr) => pr.id);
            }).catch((err) => {
                toast.error(err.message)
            })
    })

    
const errorMessages = ref<[name: string,permissions: []]>([])
const handleSubmit = () => {
    const id :number = route.params.id
    updateRole(id, form.value).then((res) => {
        router.push('/roles')
        toast.success(res.data)

    }).catch((err) => {
        if(err.response.status == "422"){
        errorMessages.value =  err.response.data.errors
        }else if(err.response.status == "401"){  
            toast.error(err.response.data.message);
        }else{
            toast.error(err.message)
        }
    })
}
</script>
<template>
  <VCard title="Role Edit">
          <VCardText>
            <VForm @submit.prevent="handleSubmit">
    <VRow>
      <VCol cols="12">
        <VRow no-gutters>
          <VCol
            cols="12"
            md="3"
          >
            <label for="firstName">Name</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <VTextField
              id="name"
              v-model="form.name"
              :error-messages="errorMessages.name"
              placeholder="Please enter role name"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <VCol cols="12">
        <VRow no-gutters>
          <!-- 👉 Email -->
          <VCol
            cols="12"
            md="3"
          >
            <label for="email">Permissions</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
          <v-select
            clearable   
            chips
            v-model="form.permissions"         
            :items="allPermissions"
            :error-messages="errorMessages.permissions"
            label="Select"
            :searchable="true"
            item-title="name"
            item-value="id"
            multiple
            variant="outlined"
            >
            </v-select>
          </VCol>
        </VRow>
      </VCol>

      <!-- 👉 submit and reset button -->
      <VCol
        offset-md="3"
        cols="12"
        md="9"
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

