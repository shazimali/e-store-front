<script setup lang="ts">
import { commaFormate } from '@/@core/utils/helpers';
import { fetchDeliverableByIDForPrint } from '@/services/Deliverable';
import logo from '@images/avatars/e-logo.png';
import { toast } from 'vue3-toastify';
const route = useRoute();
const id :number = route.params.id
const dispatched_name = localStorage.getItem('user_name');
const styleForRight = reactive({
  textAlign: 'right'
})
const styleForCenter = reactive({
  textAlign: 'center'
})
const styleForLeft = reactive({
  textAlign: 'left',
})

const styleTableObject = reactive({
  color:'black',
  fontSize:'13px',
  marginTop:'-20px',
  width:'100%'
})

const styleRow = reactive({
  textTransform:'none',
  height:'5px',
})

const styleDV = reactive({
  color:'black',
  fontSize:'13px'
})
const  deliverable = ref<any>({});
const  margin_adjustment = ref<any>('');
onMounted(() => {
    fetchDeliverableByIDForPrint(id).then((res:any) => {
        deliverable.value = res.data.data
        margin_adjustment.value = res.data.data.company.del_adjust;
    }).catch((err:any) => {
        toast.error(err.message)
    })
})

</script>
<template>
  <div :style="styleDV" v-if="deliverable && deliverable.customer && deliverable.products">
    <v-container>
      <v-row no-gutters>
        <v-col cols="12">
          <v-row>
            <v-col cols="3">
              <v-img :src="logo"></v-img>
            </v-col>
            <v-col cols="9" class="mt-5">
          <h1 :style="{'color': 'black'}">Every Day Plastic Industry</h1>
          <h3 :style="{'margin-left': '85px','color': 'black'}">Delivery Challan</h3>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row no-gutters class="mt-5">
        <v-col cols="12">D/C#: <b class="ml-7">{{ deliverable.invoice_sr_number }}</b></v-col>
        <v-col cols="12">D/C Date: <span class="ml-1">{{ deliverable.date }}</span></v-col>
      </v-row>
      <v-row no-gutters class="mt-3">
        <v-col cols="5">
          <table>
            <tr>
              <td>Customer:</td>
              <td>
                <strong>
                  {{ deliverable.customer.code +' '+ deliverable.customer.name }}
                </strong>
              </td>
            </tr>
            <tr>
              <td style="vertical-align: top;">Address:</td>
              <td>{{ deliverable.customer.address}},</td>
            </tr>
            <tr>
              <td  style="vertical-align: top;"></td>
              <td> {{deliverable.city.title  }}</td>
            </tr>
            <tr>
              <td>N.T.N:</td>
              <td>{{ deliverable.customer.ntn }}</td>
            </tr>
            <tr>
              <td>STRN:</td>
              <td>{{ deliverable.customer.sale_tax_number }}</td>
            </tr>
            <tr>
              <td>Phone:</td>
              <td>{{ deliverable.customer.phone }}</td>
            </tr>
            <tr></tr>
            <tr></tr>
            <tr></tr>
            <tr>
              <td colspan="2"><strong>Remarks: </strong>{{ deliverable.remarks }}</td>
            </tr>
            
          </table>
        </v-col>
        <v-col cols="2"></v-col>
        <v-col cols="5">
          <table>
            <tr>
              <td>{{ deliverable.store.is_sr ? 'SR#:' : 'RV#:' }}</td>
              <td>
                <strong>
                  {{ deliverable.sr_number}}
                </strong>
                
              </td>
            </tr>
            <tr>
              <td>Order Date:</td>
              <td>{{ deliverable.order_date }}</td>
            </tr>
            <tr>
              <td>Our N.T.N:</td>
              <td>{{ deliverable.company.ntn }}</td>
            </tr>
            <tr>
              <td>Our STRN:</td>
              <td>{{ deliverable.company.strn }}</td>
            </tr>
            <tr>
              <td>Tel:</td>
              <td>{{ deliverable.company.phone }}</td>
            </tr>
          </table>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <v-col cols="12">
  <table  :style="styleTableObject">
    <thead>
      <tr>
        <th  >
          Sr
        </th>
        <th  >
          {{ deliverable.store.sku_name }}
        </th>
        <th  >
          MPN
        </th>
        <th  >
          Description
        </th>
        <th  >
          Quantity
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(product, index) in deliverable.products" >
        <td :style="styleForCenter">{{ index+1 }}</td>
        <td :style="styleForCenter">{{ product.sku }}</td>
        <td :style="styleForCenter">{{ product.code }}</td>
        <td>{{ product.name }}</td>
        <td :style="styleForRight">{{ commaFormate( product.qty) }}</td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td :style="styleForRight">
          <strong>Total:{{ commaFormate( deliverable.total_qty) }}</strong>
        </td>
      </tr>
    </tbody>
  </table>
  <!-- <span> <strong>Remarks: </strong>{{ deliverable.remarks }}</span> -->
        </v-col>
      </v-row>
      <v-row>
        <v-col col="10"></v-col>
        <v-col col="2">
          
        </v-col>
        <table style="position: absolute; bottom:20px; right: 10px;">
          <tr>
        <td>
          <b>Courier/Driver/Adda: </b>
        </td>
        <td>
          ___________________________________
        </td>
      </tr>
      <tr>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>
          <b>Checked: </b>
        </td>
        <td>
          ___________________________________
        </td>
      </tr>
        </table>
      </v-row>
    </v-container>
  </div>
</template>
