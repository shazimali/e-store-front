<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import logo from '@images/logo.svg?raw'
import { doLogin } from '@/services/AuthService'
import type { ILogin } from '@/interfaces/ILogin'

declare global {
  interface Window {
    grecaptcha?: any
  }
}

const router = useRouter()

const form = ref<ILogin>({
  email: '',
  password: '',
  recaptcha_token: '',
})

const loading = ref(false)
const errorMessages = ref<any>({})
const recaptchaContainer = ref<HTMLElement | null>(null)
let recaptchaWidgetId: any = null

const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''
const isPasswordVisible = ref(false)

// ✅ Load and wait for reCAPTCHA
function loadRecaptcha() {
  return new Promise(resolve => {
    if (window.grecaptcha)
      return resolve(window.grecaptcha)

    const script = document.createElement('script')

    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.onload = () => {
      const check = setInterval(() => {
        if (window.grecaptcha && window.grecaptcha.render) {
          clearInterval(check)
          resolve(window.grecaptcha)
        }
      }, 100)
    }
    document.head.appendChild(script)
  })
}

// ✅ Render reCAPTCHA after mount
onMounted(async () => {
  const grecaptcha: any = await loadRecaptcha()
  if (recaptchaContainer.value) {
    recaptchaWidgetId = grecaptcha.render(recaptchaContainer.value, {
      sitekey: recaptchaSiteKey,
    })
  }
  else {
    console.error('reCAPTCHA container not found!')
  }
})

function resetRecaptcha() {
  if (window.grecaptcha && recaptchaWidgetId !== null)
    window.grecaptcha.reset(recaptchaWidgetId)
}

const handleSubmit = async () => {
  loading.value = true

  if (!window.grecaptcha) {
    toast.error('reCAPTCHA failed to load. Please check your connection.')
    loading.value = false

    return
  }

  const recaptchaResponse = window.grecaptcha.getResponse(recaptchaWidgetId)

  if (!recaptchaResponse) {
    toast.error('Please complete the reCAPTCHA')
    loading.value = false

    return
  }

  form.value.recaptcha_token = recaptchaResponse

  try {
    const res = await doLogin(form.value)

    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user_id', res.data.user.id)
    localStorage.setItem('user_name', res.data.user.name)
    localStorage.setItem('user_email', res.data.user.email)
    localStorage.setItem('permissions', res.data.permissions)

    axios.defaults.headers.common.Authorization = `Bearer ${res.data.token}`

    toast.success('Logged in successfully')
    router.push('/dashboard')
  }
  catch (err: any) {
    if (err.response?.status === 422) {
      errorMessages.value = err.response.data.errors
      toast.error('Validation error')
    }
    else if (err.response?.status === 401) {
      toast.error(err.response.data.message)
    }
    else {
      toast.error(err.message)
    }

    resetRecaptcha() // 🔁 Reset CAPTCHA after any error
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
          Welcome to Everyday Store! 👋🏻
        </h5>
        <p class="mb-0">
          Please sign in to your account and start the adventure
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

              <!-- ✅ Correct reCAPTCHA placeholder -->
              <div
                ref="recaptchaContainer"
                class="my-4"
              />

              <!-- forgot password link -->
              <div class="d-flex align-center justify-end mt-1 mb-4">
                <RouterLink
                  class="text-primary text-sm text-decoration-none"
                  to="/forgot-password"
                >
                  Forgot Password?
                </RouterLink>
              </div>

              <!-- login button -->
              <VBtn
                block
                type="submit"
                :loading="loading"
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
