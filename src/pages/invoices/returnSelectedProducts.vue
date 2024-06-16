<script setup lang="ts">
import { commaFormate } from '@/@core/utils/helpers';
import { InvoiceProduct } from '@/interfaces/InvoiceProduct';
import { ICompany } from '../../interfaces/ICompany';
import { IStore } from '../../interfaces/IStore';
const props = defineProps({
  return_products : {
    type:  Array as () => InvoiceProduct[],
    required: true
  },
  is_ex_tax : {
    type: Boolean,
    required: true
  },
  selectedStore : {
    type: Object as ()=> IStore,
    required: true
  },
  companyInfo: {
    type: Object as ()=>ICompany,
    required: true
  }
})
const emit  = defineEmits([
  'r-delete-product',
  'r-update-qty',
  'r-update-price',
  'r-total-qty',
  'r-total-price',
]);

const handleDelete = (id :number) => {
  if(confirm("Do you really want to delete?")){
      emit('r-delete-product', id);
  }
}
interface InputFileEvent extends Event {
    target: HTMLInputElement;
}

const handleChangeQty = (e :InputFileEvent, id:number) => {
  emit('r-update-qty',{
    id:id,
    val: e.target.value
  });
}

const handleChangePrice = (e :InputFileEvent, id:number) => {
  emit('r-update-price',{
    id:id,
    val: e.target.value
  });
}

const totalQty = computed(()=>{
  let sum=0;
  for(let i of props.return_products){
    sum+= parseInt(i.qty) || 0 ;
  }
  emit('r-total-qty',sum);
  return sum;
});
const total = computed(()=>{
  let sum=0;
  for(let i of props.return_products){
    props.is_ex_tax ? 
    sum += parseFloat((i.price * i.qty)/100*i.sale_tax) + parseFloat(i.price * i.qty) + parseFloat(((i.price * i.qty)/100*i.sale_tax + parseFloat(i.price * i.qty))/100*i.ext_tax)
    :
     // sum+= (parseInt(i.price*i.qty) + parseFloat((i.price * i.qty)/100*i.sale_tax)) || 0 ;
     sum+= ((i.price * i.qty)/100*i.sale_tax + parseFloat(i.price * i.qty)) || 0 ;
  }
  emit('r-total-price',sum);
  return sum.toFixed(2);
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
          Rate
        </th>
        <th class="text-uppercase">
          Sale Tax<sup><small>({{props.companyInfo.sale_tax}})%</small></sup>
        </th>
        <th v-if="props.is_ex_tax" class="text-uppercase">
          Extra Tax<sup><small>({{props.companyInfo.ext_tax }}%)</small></sup>
        </th>
        <th class="text-uppercase">
          Total
        </th>
        <th class="text-uppercase">
        </th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="item in props.return_products"
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
          <VTextField
            type="number"
            v-model="item.price"
            persistent-placeholder
            oninput="if(this.value < 0 || this.value == '') this.value = 1;" 
            @keyup=" (event) =>  handleChangePrice(event, item.id)" />
        </td>
        <td>
          {{ commaFormate(((item.price * item.qty)/100*item.sale_tax).toFixed(2)) }}
        </td>
        <td v-if="is_ex_tax">
          {{ commaFormate((((item.price * item.qty)/100*item.sale_tax) + parseFloat(((item.price * item.qty)/100*item.sale_tax)/100*item.ext_tax)).toFixed(2)) }}
        </td>
        <td>
          {{ is_ex_tax ? 
            commaFormate((((item.price * item.qty)/100*item.sale_tax + parseFloat(item.price * item.qty)) + parseFloat(((item.price * item.qty)/100*item.sale_tax + parseFloat(item.price * item.qty))/100*item.ext_tax)).toFixed(2))
          :
          commaFormate(((item.price * item.qty)/100*item.sale_tax + parseFloat(item.price * item.qty)).toFixed(2))

           }}
        </td>
        <td>
          <v-icon color="error" @click="handleDelete(item.id)" class="ri-delete-bin-line"></v-icon>
        </td>
      </tr>
      <tr>
        <td v-if="is_ex_tax"></td>
        <td></td>
        <td>
          <b>Total Qty: {{ commaFormate(totalQty) }}</b>
        </td>
        <td></td>
        <td></td>
        <td></td>
        <td>
          <!-- <div v-if="props.selectedStore[0].discount">
            <b>
              Discount
            </b>
          </div> -->
          <div>
            <b>Sub Total :</b>
          </div>
        </td>
        <td>
            <!-- <div v-if="props.selectedStore[0].discount">
              <b>{{ props.selectedStore[0].discount }}%</b>
            </div> -->
            <div>
              <!-- <b>{{ commaFormate(total - parseFloat(total*props.selectedStore[0].discount/100)) }}</b> -->
              <b>{{ commaFormate(total) }}</b>
            </div>
        </td>
      </tr>
    </tbody>
  </VTable>
</template>
