<script setup lang="ts">
import { commaFormate } from '@/@core/utils/helpers';
import { IProductObj } from '@/interfaces/IPurchase';
const props = defineProps({
  products : {
    type:  Array as () => IProductObj[],
    required: true
  }
})
const emit  = defineEmits([
  'delete-product',
  'update-qty',
  'total-qty',
]);

const handleDelete = (id :number) => {
  if(confirm("Do you really want to delete?")){
      emit('delete-product', id);
  }
}
interface InputFileEvent extends Event {
    target: HTMLInputElement;
}

const handleChangeQty = (e :InputFileEvent, id:number) => {
  emit('update-qty',{
    id:id,
    val: e.target.value
  });
}

const totalQty = computed(()=>{
  let sum=0;
  for(let i of props.products){
    sum+= parseInt(i.qty) || 0 ;
  }
  emit('total-qty',sum);
  return sum;
});
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
        </th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="item in props.products"
        :key="item.id">
        
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
            type="number"
            v-model="item.qty"
            persistent-placeholder
            oninput="if(this.value < 0 || this.value == '') this.value = 1;" 
            @keyup=" (event) =>  handleChangeQty(event, item.id)" />
        </td>
        <td>
          <v-icon color="error" @click="handleDelete(item.id)" class="ri-delete-bin-line"></v-icon>
        </td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td>
          <b>Total Qty: {{ commaFormate(totalQty) }}</b>
        </td>
      </tr>
    </tbody>
  </VTable>
</template>
