<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'
import { canAccess } from '@core/utils/helpers'
import { fetchProducts, fetchStores, updateSalePrice } from '@/services/ProductService'
import type { IProduct } from '@/interfaces/IProduct'

const lstProducts = ref<IProduct[]>([])
const loading = ref<boolean>(false)
const errorMessages = ref<any>({})
const editSalePrice = ref<boolean>(false)
const item_per_page = ref<number>(5)
const search = ref<string>('')
const lstStores = ref<any[]>([])
const store_id = ref<number>(0)
const total_items = ref<number>(0)
const current_page = ref<number>(1)
const router = useRouter()

const headers: any = [
  { title: 'Name', align: 'start' as const, value: 'name' },
  { title: 'Code', value: 'code' },
  { title: 'Store', value: 'store' },
  { title: 'SKU', value: 'sku' },
  { title: 'Sale Price', value: 'sale_price' },
  { title: 'Status', value: 'status' },
  { title: 'Created At', value: 'created_at' },
  { title: 'Actions', value: 'actions' },
]

const salePriceForm = ref<any>({
  id: '',
  sale_price: '',
})

const handleSubmit = () => {
  updateSalePrice(salePriceForm.value).then((res: any) => {
    editSalePrice.value = !editSalePrice.value
    doFetchProducts()
    toast.success(res.data)
  }).catch((err: any) => {
    if (err.response.status == '422')
      errorMessages.value = err.response.data.errors

    else if (err.response.status == '401')
      toast.error(err.response.data.message)
    else
      toast.error(err.message)
  })
}

onMounted(() => {
  doFetchProducts()
  fetchStores().then((res: any) => {
    lstStores.value = res.data
  }).catch((err: any) => {
    toast.error(err.message)
  })
})

const doEditSalePrice = (id: number, sale_price: number) => {
  editSalePrice.value = !editSalePrice.value
  salePriceForm.value.id = id
  salePriceForm.value.sale_price = sale_price
}

const handleEdit = (id?: number) => {
  if (id !== undefined)
    router.push(`products/${id}`)
}

const doFetchProducts = () => {
  loading.value = true
  fetchProducts(current_page.value, item_per_page.value, search.value, store_id.value).then((res: any) => {
    lstProducts.value = res.data.data
    total_items.value = res.data.meta.total
    loading.value = false
  }).catch((err: any) => {
    toast.error(err.message)
    loading.value = false
  })
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <div class="py-0 d-flex justify-space-between rounded-lg mb-3">
        <h3>Products</h3>
        <VSpacer />
        <VBtn
          v-if="canAccess('product_create')"
          color="primary"
          to="/products/create"
        >
          Create Product
        </VBtn>
      </div>
      <div class="py-0 d-flex justify-space-between rounded-lg mb-3">
        <h5>Filters</h5>
        <VSpacer />
        <VAutocomplete
          v-model="store_id"
          clearable
          label="Select Store"
          :items="lstStores"
          :item-title="item => item ? `${item.code}-${item.name}` : ''"
          item-value="id"
          variant="outlined"
          @update:menu="doFetchProducts"
        />
        <VSpacer />
        <VTextField
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          density="compact"
          label="Search"
          single-line
          flat
          hide-details
          variant="solo-filled"
        />
      </div>
      <VCard>
        <VDataTableServer
          v-model:search="search"
          v-model:page="current_page"
          v-model:items-per-page="item_per_page"
          :headers="headers"
          :items="lstProducts"
          :items-length="total_items"
          :loading="loading"
          item-key="id"
          class="elevation-1"
          @update:options="doFetchProducts"
        >
          <template #item.sale_price="{ item }">
            <div
              class="row-pointer"
              @click="doEditSalePrice(item.id || 0, Number(item.sale_price))"
            >
              {{ item.sale_price }}
            </div>
          </template>
          <template #item.status="{ item }">
            <div>
              <VChip
                :color="item.status == 'INACTIVE' ? 'green' : 'red'"
                :text="item.status"
              />
            </div>
          </template>
          <template #item.actions="{ item }">
            <VIcon
              v-if="canAccess('product_edit')"
              class="mr-2 ri-pencil-line"
              @click="handleEdit(item.id)"
            />
          </template>
        </VDataTableServer>
      </VCard>
      <VDialog
        v-model="editSalePrice"
        max-width="500"
      >
        <VCard title="Update Sale Price">
          <VCardText>
            <VForm @submit.prevent="handleSubmit">
              <VTextField
                id="code"
                v-model="salePriceForm.sale_price"
                placeholder="Please enter code"
                :error-messages="errorMessages.sale_price"
                persistent-placeholder
                aria-required="true"
              />
              <VCol
                cols="12"
                class="d-flex gap-4"
              >
                <VBtn type="submit">
                  Update
                </VBtn>
              </VCol>
            </VForm>
          </VCardText>
        </VCard>
      </VDialog>
    </VCol>
  </VRow>
</template>
