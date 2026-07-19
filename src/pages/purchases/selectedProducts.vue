<script setup lang="ts">
import { commaFormate } from '@/@core/utils/helpers'
import type { IProductObj } from '@/interfaces/IPurchase'

const props = defineProps({
  products: {
    type: Array as () => IProductObj[],
    required: true,
  },
})

const emit = defineEmits([
  'delete-product',
  'update-qty',
  'update-price',
  'total-qty',
  'total-amount',
])

const handleDelete = (id: number) => {
  if (confirm('Do you really want to delete?'))
    emit('delete-product', id)
}

interface InputFileEvent extends Event {
  target: HTMLInputElement
}

const handleChangeQty = (e: InputFileEvent, id: number) => {
  emit('update-qty', {
    id,
    val: e.target.value,
  })
}

const handleChangePrice = (e: InputFileEvent, id: number) => {
  emit('update-price', {
    id,
    val: e.target.value,
  })
}

const totalAmount = computed(() => {
  let sum = 0
  for (const i of props.products)
    sum += Number(i.qty) * Number(i.price) || 0

  emit('total-amount', sum)

  return sum
})

const totalQty = computed(() => {
  let sum = 0
  for (const i of props.products)
    sum += Number(i.qty) || 0

  emit('total-qty', sum)

  return sum
})
</script>

<template>
  <VTable>
    <thead>
      <tr>
        <th class="text-uppercase">
          Name
        </th>
        <th class="text-uppercase">
          Store
        </th>
        <th class="text-uppercase">
          Code
        </th>
        <th class="text-uppercase">
          Sku
        </th>
        <th class="text-uppercase">
          Qty
        </th>
        <th class="text-uppercase">
          Price
        </th>
        <th class="text-uppercase">
          Total
        </th>
        <th class="text-uppercase" />
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="item in props.products"
        :key="item.id"
      >
        <td>
          {{ item.name }}
        </td>
        <td>
          {{ item.store_name }}
        </td>
        <td>
          {{ item.code }}
        </td>
        <td>
          {{ item.sku }}
        </td>
        <td>
          <VTextField
            v-model="item.qty"
            type="number"
            persistent-placeholder
            oninput="if(this.value < 0 || this.value == '') this.value = 1;"
            @keyup="(event: any) => handleChangeQty(event, item.id)"
          />
        </td>
        <td>
          <VTextField
            v-model="item.price"
            type="number"
            persistent-placeholder
            oninput="if(this.value < 0 || this.value == '') this.value = 0;"
            @keyup="(event: any) => handleChangePrice(event, item.id)"
          />
        </td>
        <td>
          {{ commaFormate(Number(item.qty) * Number(item.price)) }}
        </td>
        <td>
          <VIcon
            color="error"
            class="ri-delete-bin-line"
            @click="handleDelete(item.id)"
          />
        </td>
      </tr>
      <tr>
        <td />
        <td />
        <td />
        <td />
        <td />
        <td>
          <b>Total Qty: {{ commaFormate(totalQty) }}</b>
          <br>
          <b>Total Amount: {{ commaFormate(totalAmount) }}</b>
        </td>
      </tr>
    </tbody>
  </VTable>
</template>
