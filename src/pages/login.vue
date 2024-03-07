<script setup lang="ts">
import ILogin from '@/interfaces/ILogin'
import { useTheme } from 'vuetify'

import { doLogin } from '@/services/AuthService'
import logo from '@images/logo.svg?raw'
import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png'
import axios from 'axios'
import { computed } from 'vue'
import { toast } from 'vue3-toastify'
const form = ref<ILogin>({
  email: '',
  password: ''
})

const router = useRouter();

const errorMessages = ref<[email: string,password: string|number]>([])

const vuetifyTheme = useTheme()

const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light'
    ? authV1MaskLight
    : authV1MaskDark
})

const isPasswordVisible = ref(false)

const handleSubmit = () => {
    doLogin(form.value).then((res) => {
      localStorage.setItem('token',res.data.token)
      localStorage.setItem('user_id',res.data.user.id)
      localStorage.setItem('user_name',res.data.user.name)
      localStorage.setItem('user_email',res.data.user.email)
      localStorage.setItem('permissions',res.data.permissions)
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
      router.push('/dashboard')
      toast.success('Logged in successfully')
      
    })
    .catch((err) => {
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
  <!-- eslint-disable vue/no-v-html -->

  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-4 pt-7"
      max-width="448"
    >
      <VCardItem class="justify-center">
        <template #prepend>
          <div class="d-flex">
            <div v-html="logo" />
          </div>
        </template>

        <VCardTitle class="font-weight-semibold text-2xl text-uppercase">
          Everyday store
        </VCardTitle>
      </VCardItem>

      <VCardText class="pt-2">
        <h5 class="text-h5 font-weight-semibold mb-1">
          Welcome to everyday Store! 👋🏻
        </h5>
        <p class="mb-0">
          Please sign-in to your account and start the adventure
        </p>
      </VCardText>

      <VCardText>
        <VForm @submit.prevent="handleSubmit">
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                v-model="form.email"
                label="Email"
                type="email"
                :error-messages="errorMessages.email"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="form.password"
                label="Password"
                :error-messages="errorMessages.password"
                placeholder="············"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />

              <!-- remember me checkbox -->
              <div class="d-flex align-center justify-space-between flex-wrap mt-1 mb-4">
                <VCheckbox
                  v-model="form.remember"
                  label="Remember me"
                />

                <a
                  class="ms-2 mb-1"
                  href="javascript:void(0)"
                >
                  Forgot Password?
                </a>
              </div>

              <!-- login button -->
              <VBtn
                block
                type="submit"
              >
                Login
              </VBtn>
            </VCol>

          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>

<style lang="scss">
@use "@core/scss/pages/page-auth.scss";
</style>
