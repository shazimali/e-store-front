<template>
   <VCard title="Create User">
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
            <label for="email">Email</label>
          </VCol>

          <VCol
            cols="12"
          >
            <VTextField
              id="email"
              v-model="form.email"
              :error-messages="errorMessages.email"
              type="email"
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
            <label for="password">Password</label>
          </VCol>

          <VCol
            cols="12"
          >
            <VTextField
              id="password"
              v-model="form.password"
              :error-messages="errorMessages.password"
              placeholder="Please enter password"
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
            <label for="password_confirmation">Confirm Password</label>
          </VCol>

          <VCol
            cols="12"
          >
            <VTextField
              id="password_confirmation"
              v-model="form.password_confirmation"
              :error-messages="errorMessages.password_confirmation"
              placeholder="Please enter confirm password"
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
          >
            <label for="email">Roles</label>
          </VCol>

          <VCol
            cols="12"
          >
          <v-select
            clearable   
            chips
            v-model="form.roles"
            :items="allRoles"
            :error-messages="errorMessages.roles"
            label="Select"
            item-title="name"
            item-value="id"
            multiple
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
<script setup lang="ts">
import { IUserForm } from '@/interfaces/IUser';
import { fetchRoles, saveUser } from '@/services/UserService';
import { onMounted, ref } from 'vue';
import { toast } from 'vue3-toastify';

const allRoles = ref<[]>([]);
const errorMessages = ref<IUserForm>({});
const router = useRouter();
const form = ref<IUserForm>({
    name:'',
    email:'',
    password:'',
    password_confirmation:'',
    roles:[]
})
onMounted(() => {
    fetchRoles().then((res) => {
        allRoles.value = res.data.data
    }).catch((err) => {
        toast.error(err.message)
    })
})

const handleSubmit = () => {
    saveUser(form.value).then((res)=>{
        toast(res.data)
        router.push('/users')
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
