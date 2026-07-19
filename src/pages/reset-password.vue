<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import logo from '@images/logo.svg?raw'
import { doResetPassword } from '@/services/AuthService'

const route = useRoute()
const router = useRouter()

const form = ref({
  token: (route.query.token as string) || '',
  email: (route.query.email as string) || '',
  password: '',
  password_confirmation: '',
})

const loading = ref(false)
const errorMessages = ref<any>({})
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)

const handleSubmit = async () => {
  loading.value = true
  errorMessages.value = {}

  if (!form.value.token || !form.value.email) {
    toast.error('Invalid or expired password reset link.')
    loading.value = false

    return
  }

  try {
    const res = await doResetPassword(form.value)

    toast.success(res.data.message || 'Your password has been reset successfully.')

    // Redirect to login after 3 seconds
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  }
  catch (err: any) {
    if (err.response?.status === 422) {
      errorMessages.value = err.response.data.errors
      toast.error('Validation error')
    }
    else if (err.response?.status === 400) {
      toast.error(err.response.data.message)
    }
    else {
      toast.error(err.message || 'An error occurred')
    }
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
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
          Everyday Store
        </VCardTitle>
      </VCardItem>

      <VCardText class="pt-2">
        <h5 class="text-h5 font-weight-semibold mb-1">
          Reset Password 🔑
        </h5>
        <p class="mb-0">
          Please enter your new password below.
        </p>
      </VCardText>

      <VCardText>
        <VForm @submit.prevent="handleSubmit">
          <VRow>
            <!-- email (read-only for security) -->
            <VCol cols="12">
              <VTextField
                v-model="form.email"
                label="Email"
                type="email"
                disabled
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="form.password"
                label="New Password"
                :error-messages="errorMessages.password"
                placeholder="············"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                required
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />
            </VCol>

            <!-- password confirmation -->
            <VCol cols="12">
              <VTextField
                v-model="form.password_confirmation"
                label="Confirm Password"
                :error-messages="errorMessages.password_confirmation"
                placeholder="············"
                :type="isConfirmPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isConfirmPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                required
                @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
              />
            </VCol>

            <VCol cols="12">
              <!-- submit button -->
              <VBtn
                block
                type="submit"
                :loading="loading"
              >
                Reset Password
              </VBtn>
            </VCol>

            <VCol
              cols="12"
              class="text-center"
            >
              <RouterLink
                class="text-primary text-sm text-decoration-none"
                to="/login"
              >
                Back to login
              </RouterLink>
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
