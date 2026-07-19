<script setup lang="ts">
import { toast } from 'vue3-toastify'
import type { IProductPurchase } from '../../interfaces/IProduct'
import SelectedProducts from './selectedProducts.vue'
import { fetchProducts, fetchPurchaseByID, updatePurchase } from '@/services/PurchaseService'

const errorMessages = ref<Record<string, any>>({})
const lstProducts = ref<IProductPurchase[]>([])
const loading = ref<boolean>(false)
const searchInput = ref<string>('')
const router = useRouter()
const route = useRoute()

const form = ref<any>({
  date: '',
  total_qty: '',
  total_price: '',
  products: [],
  product_id: '',
})

onMounted(() => {
  const id = Number(route.params.id)

  fetchProducts().then(res => {
    lstProducts.value = res.data.data
  }).catch(err => {
    toast.error(err.message)
  })

  fetchPurchaseByID(id).then(res => {
    form.value = res.data.data
  }).catch(err => {
    toast.error(err.message)
  })
})

const handleSelectedProducts = () => {
  const selectedIdx = lstProducts.value.findIndex((item: any) => { return item.id == form.value.product_id })
  if (selectedIdx != -1) {
    const isProductAlreadyExistsIndex = form.value.products.findIndex((item: any) => { return item.id == lstProducts.value[selectedIdx].id })

    if (isProductAlreadyExistsIndex != -1) {
      form.value.products[isProductAlreadyExistsIndex].qty += 1
    }
    else {
      form.value.products.push({
        id: lstProducts.value[selectedIdx].id,
        name: lstProducts.value[selectedIdx].name,
        store_name: lstProducts.value[selectedIdx].store,
        code: lstProducts.value[selectedIdx].code,
        sku: lstProducts.value[selectedIdx].sku,
        price: 0,
        qty: 1,
      })
    }
  }
  searchInput.value = ''
  form.value.product_id = ''
}

const handleProductDelete = (id: number) => {
  form.value.products = form.value.products.filter((item: any) => item.id !== id)
}

const handleProductQty = (payload: { id: number;val: number }) => {
  const qtyIdx = form.value.products.findIndex((item: any) => item.id == payload.id)

  form.value.products[qtyIdx].qty = payload.val
}

const handleProductPrice = (payload: { id: number;val: number }) => {
  const qtyIdx = form.value.products.findIndex((item: any) => item.id == payload.id)

  form.value.products[qtyIdx].price = payload.val
}

const handleTotalQty = (qty: number) => {
  form.value.total_qty = qty
}

const handleTotalAmount = (amount: number) => {
  form.value.total_price = amount
}

const handleSubmit = () => {
  const id: number = Number(route.params.id)

  loading.value = true
  updatePurchase(id, form.value).then(res => {
    toast.success(res.data)
    loading.value = false
    router.push('/purchases')
  }).catch(err => {
    loading.value = false
    if (err.response.status == '422')
      errorMessages.value = err.response.data.errors

    else if (err.response.status == '401')
      toast.error(err.response.data.message)
    else
      toast.error(err.message)
  })
}

const reset = () => {
  form.value.total_price = 0
  form.value.total_qty = 0
  form.value.products = []
}
</script>

<template>
  <VCard title="Edit Purchase Invoice">
    <VCardText>
      <VForm @submit.prevent="handleSubmit">
        <VRow>
          <VCol cols="12">
            <label for="name">Date</label>
            <VTextField
              id="date"
              v-model="form.date"
              type="date"
              :error-messages="errorMessages.date"
              persistent-placeholder
            />
          </VCol>
          <VCol cols="12">
            <label for="products">Products</label>
            <VAutocomplete
              v-model="form.product_id"
              v-model:search="searchInput"
              :items="lstProducts"
              :item-title="item => item ? `${item.code}-${item.name}-${item.store}` : ''"
              item-value="id"
              :error-messages="errorMessages.products"
              variant="outlined"
              @keyup.enter="handleSelectedProducts"
            />
          </VCol>

          <VCol cols="12">
            <SelectedProducts
              v-bind="form"
              :error-messages="errorMessages.products"
              @delete-product="handleProductDelete"
              @update-qty="handleProductQty"
              @update-price="handleProductPrice"
              @total-qty="handleTotalQty"
              @total-amount="handleTotalAmount"
            />
          </VCol>

          <VCol
            cols="12"
            class="d-flex gap-4 justify-end align-center flex-wrap"
          >
            <VBtn
              type="submit"
              color="primary"
              :loading="loading"
            >
              Update
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
</template>
