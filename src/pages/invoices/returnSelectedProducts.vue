<script setup lang="ts">
import type { ICompany } from '../../interfaces/ICompany'
import type { IStore } from '../../interfaces/IStore'
import { commaFormate } from '@/@core/utils/helpers'
import type { InvoiceProduct } from '@/interfaces/InvoiceProduct'

const props = defineProps({
  return_products: {
    type: Array as () => InvoiceProduct[],
    required: true,
  },
  is_ex_tax: {
    type: Boolean,
    required: true,
  },
  selectedStore: {
    type: Object as () => IStore,
    required: true,
  },
  companyInfo: {
    type: Object as () => ICompany,
    required: true,
  },
})

const emit = defineEmits([
  'r-delete-product',
  'r-update-qty',
  'r-update-price',
  'r-total-qty',
  'r-total-price',
])

const handleDelete = (id?: number) => {
  if (id !== undefined && confirm('Do you really want to delete?'))
    emit('r-delete-product', id)
}

interface InputFileEvent extends Event {
  target: HTMLInputElement
}

const handleChangeQty = (e: any, id?: number) => {
  if (id !== undefined) {
    emit('r-update-qty', {
      id,
      val: e.target.value,
    })
  }
}

const handleChangePrice = (e: any, id?: number) => {
  if (id !== undefined) {
    emit('r-update-price', {
      id,
      val: e.target.value,
    })
  }
}

const totalQty = computed(() => {
  let sum = 0
  for (const i of props.return_products)
    sum += Number(i.qty) || 0

  emit('r-total-qty', sum)

  return sum
})

const total = computed(() => {
  let sum = 0
  for (const i of props.return_products) {
    if (props.is_ex_tax) {
      const val1 = (Number(i.price) * Number(i.qty)) / 100 * Number(i.sale_tax)
      const val2 = Number(i.price) * Number(i.qty)
      const val3 = (val1 + val2) / 100 * Number(i.ext_tax)

      sum += val1 + val2 + val3
    }
    else {
      sum += ((Number(i.price) * Number(i.qty)) / 100 * Number(i.sale_tax) + Number(i.price) * Number(i.qty)) || 0
    }
  }
  emit('r-total-price', sum)

  return sum.toFixed(2)
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
          Code
        </th>
        <th class="text-uppercase">
          Sku
        </th>
        <th class="text-uppercase">
          Qty
        </th>
        <th class="text-uppercase">
          Rate
        </th>
        <th class="text-uppercase">
          Sale Tax<sup><small>({{ props.companyInfo.sale_tax }})%</small></sup>
        </th>
        <th
          v-if="props.is_ex_tax"
          class="text-uppercase"
        >
          Extra Tax<sup><small>({{ props.companyInfo.ext_tax }}%)</small></sup>
        </th>
        <th class="text-uppercase">
          Total
        </th>
        <th class="text-uppercase" />
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="(item, index) in props.return_products"
        :key="item.id || index"
      >
        <td>
          {{ item.name }}
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
            oninput="if(this.value < 0 || this.value == '') this.value = 1;"
            @keyup="(event: any) => handleChangePrice(event, item.id)"
          />
        </td>
        <td>
          {{ commaFormate(Number(((item.price * item.qty) / 100 * item.sale_tax).toFixed(2))) }}
        </td>
        <td v-if="is_ex_tax">
          {{ commaFormate(Number((((item.price * item.qty) / 100 * item.sale_tax) + (((item.price * item.qty) / 100 * item.sale_tax) / 100 * item.ext_tax)).toFixed(2))) }}
        </td>
        <td>
          {{ is_ex_tax
            ? commaFormate(Number((((item.price * item.qty) / 100 * item.sale_tax + (item.price * item.qty)) + (((item.price * item.qty) / 100 * item.sale_tax + (item.price * item.qty)) / 100 * item.ext_tax)).toFixed(2)))
            : commaFormate(Number(((item.price * item.qty) / 100 * item.sale_tax + (item.price * item.qty)).toFixed(2)))
          }}
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
        <td v-if="is_ex_tax" />
        <td />
        <td>
          <b>Total Qty: {{ commaFormate(totalQty) }}</b>
        </td>
        <td />
        <td />
        <td />
        <td>
          <div>
            <b>Sub Total :</b>
          </div>
        </td>
        <td>
          <div>
            <b>{{ commaFormate(Number(total)) }}</b>
          </div>
        </td>
      </tr>
    </tbody>
  </VTable>
</template>
