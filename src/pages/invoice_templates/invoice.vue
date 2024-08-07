<script setup lang="ts">
import { commaFormate } from '@/@core/utils/helpers';
import { fetchInvoiceByIDForPrint } from '@/services/InvoiceService';
// import { numberToWords } from '@core/utils/numberToWords';
import { toast } from 'vue3-toastify';

const route = useRoute();
const id :number = route.params.id
const dispatched_name = localStorage.getItem('user_name');
const  invoice = ref<any>({});
const  total_qty = ref<number>(0);
const  total_sale_tax = ref<number>(0);
const  total_price = ref<number>(0);
const  margin_adjustment = ref<any>('');

const styleForRight = reactive({
  textAlign: 'right'
})
const styleForLeft = reactive({
  textAlign: 'left',
})

const styleTableObject = reactive({
  color:'black',
  fontSize:'13px',
  marginTop:'-20px'
})

const styleRow = reactive({
  textTransform:'none',
  height:'5px',
})

onMounted(() => {
    fetchInvoiceByIDForPrint(id).then((res:any) => {
        let data = res.data.data;
        let ind_price = 0
        invoice.value = res.data.data;
        margin_adjustment.value = res.data.data.company.inv_adjust
        total_qty.value =data.products.reduce((n, {qty}) => n + qty, 0);
        data.products.forEach((pr, index) => {
          let price = pr.qty * pr.price;
          let tax = (pr.price * pr.qty)/100*pr.sale_tax;
          total_price.value =  parseFloat(total_price.value) + parseFloat(price) + parseFloat(tax);
          total_sale_tax.value +=  parseFloat((pr.price * pr.qty)/100*pr.sale_tax); 
        });
        data.return_products.forEach((r_pr, index) => {
          total_sale_tax.value -= parseFloat((r_pr.price * r_pr.qty)/100*r_pr.sale_tax)
        })
    }).catch((err:any) => {
        toast.error(err.message)
    })
})
</script>
<template>
  <div :style="{'margin-top':'120px','color':'black','font-size':'13px'}"  v-if="invoice && invoice.customer && invoice.products">
    <v-container>
      <v-row no-gutters>
        <v-col cols="6">
          <h2 :style="{'color':'black'}">Sale Tax Invoice</h2>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="5">Invoice: <b class="ml-2">{{ invoice.invoice_id }}</b></v-col>
        <v-col cols="7">Date: {{ invoice.date }}</v-col>
        <v-col cols="12"><span class="">{{ invoice.store.is_sr ? 'SR:' : 'RV:' }}</span> <b class="ml-9">{{ invoice.sr_number }}</b></v-col>
      </v-row>
      <v-row no-gutters class="mt-3">
        <v-col cols="5">
          <table>
            <tr>
              <td>Seller:</td>
              <td><b>Every Day Plastic Industry</b></td>
            </tr>
            <tr>
              <td style="vertical-align: top;">Address:</td>
              <td>{{ invoice.company.address}}</td>
            </tr>
            <tr>
              <td>N.T.N:</td>
              <td>{{ invoice.company.ntn }}</td>
            </tr>
            <tr>
              <td>STRN:</td>
              <td>{{ invoice.company.strn }}</td>
            </tr>
            <tr>
              <td>Tel:</td>
              <td>{{ invoice.company.phone }}</td>
            </tr>
          </table>
        </v-col>
      
        <v-col cols="2"></v-col>
        <v-col cols="5">
          <table>
            <tr>
              <td>Buyer:</td>
              <td>
                <strong>
                  {{ invoice.customer.code +' '+ invoice.customer.name }}
                </strong>
              </td>
            </tr>
            <tr>
              <td style="vertical-align: top;">Address:</td>
              <td>{{ invoice.customer.address}}</td>
            </tr>
            <tr>
              <td>STRN:</td>
              <td>{{ invoice.customer.sale_tax_number }}</td>
            </tr>
            <tr>
              <td>Phone:</td>
              <td>{{ invoice.customer.phone }}</td>
            </tr>
          </table>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
        <v-col cols="12">
          <table :style="styleTableObject" width="100%">
            <thead>
              <tr>
                <th >
                  Sr
                </th>
                <th >
                  Cat
                </th>
                <th >
                  MPN
                </th>
                <th >
                  Description
                </th>
                <th >
                  Quantity
                </th>
                <th >
                  Rate
                </th>
                <th >
                  Sale Tax
                </th>
                <th v-if="invoice.is_ex_tax" >
                  Ex.Sale Tax<sup><small>({{ invoice.company.ext_tax }}%)</small></sup>
                </th>
                <th>
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in invoice.products" :style="{'text-transform':'none','text-align':'center'}">
                <td>{{ index+1 }}</td>
                <td >{{ item.sku }}</td>
                <td >{{ item.code }}</td>
                <td :style="styleForLeft">{{ item.name }}</td>
                <td :style="styleForRight">{{ commaFormate( item.qty) }}</td>
                <td :style="styleForRight">{{ commaFormate( item.price) }}</td>
                <td :style="styleForRight">
                  {{ commaFormate(((item.price * item.qty)/100*item.sale_tax).toFixed(2)) }}
                </td>
                <td :style="styleForRight">
                  {{ invoice.is_ex_tax ? 
                    commaFormate((((item.price * item.qty)/100*item.sale_tax + parseFloat(item.price * item.qty)) + parseFloat(((item.price * item.qty)/100*item.sale_tax + parseFloat(item.price * item.qty))/100*item.ext_tax)).toFixed(2))
                  :
                    commaFormate(((item.price * item.qty)/100*item.sale_tax + parseFloat(item.price * item.qty)).toFixed(2))
                  }}
                </td>
              </tr>
              <tr v-if="invoice.return_products.length == 0">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td :style="styleForRight">
                  <strong>{{ commaFormate( total_qty) }}</strong>
                </td>
                <td></td>
                <td :style="styleForRight">
                  <strong>{{ commaFormate(total_sale_tax.toFixed(2)) }}</strong>
                </td>
                <td :style="styleForRight">
                  <strong>{{ commaFormate( total_price.toFixed(2)) }}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </v-col>
        <v-col cols="12"  v-if="invoice.return_products.length > 0">
          <h5>Return Items</h5>
        </v-col>
        <v-col cols="12">
          <table :style="styleTableObject">
            <thead   v-if="invoice.return_products.length > 0">
              <tr>
                <th >
                  Sr
                </th>
                <th >
                  Cat
                </th>
                <th >
                  MPN
                </th>
                <th >
                  Description
                </th>
                <th >
                  Quantity
                </th>
                <th >
                  Rate
                </th>
                <th >
                  SaleTax
                </th>
                <th v-if="invoice.is_ex_tax" >
                  Ex.Sale Tax<sup><small>({{ invoice.company.ext_tax }}%)</small></sup>
                </th>
                <th>
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
             
              <tr   v-if="invoice.return_products.length > 0"  v-for="(item, index) in invoice.return_products">
                <td>{{ index+1 }}</td>
                <td  >{{ item.sku }}</td>
                <td >{{ item.code }}</td>
                <td :style="styleForLeft">{{ item.name }}</td>
                <td :style="styleForRight">{{ commaFormate( item.qty) }}</td>
                <td  :style="styleForRight">{{ commaFormate( item.price) }}</td>
                <td  :style="styleForRight">
                  {{ commaFormate(((item.price * item.qty)/100*item.sale_tax).toFixed(2)) }}
                </td>
                <td :style="styleForRight">
                  {{ invoice.is_ex_tax ? 
                    commaFormate((((item.price * item.qty)/100*item.sale_tax + parseFloat(item.price * item.qty)) + parseFloat(((item.price * item.qty)/100*item.sale_tax + parseFloat(item.price * item.qty))/100*item.ext_tax)).toFixed(2))
                  :
                  commaFormate(((item.price * item.qty)/100*item.sale_tax + parseFloat(item.price * item.qty)).toFixed(2))

                  }}
                </td>
              </tr>
              <tr  v-if="invoice.return_products.length > 0">
                <td></td>
                <td></td>
                <td></td>
                <td>
                </td>
                <td  :style="styleForRight">
                  <strong>{{ commaFormate( invoice.total_qty) }}</strong>
                </td>
                <td></td>
                <td  :style="styleForRight">
                  <strong>{{ commaFormate(total_sale_tax.toFixed(2)) }}</strong>
                </td>
                <td  :style="styleForRight">
                  <strong>{{ commaFormate( invoice.total_price) }}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </v-col>
  <!-- <div> <strong>Value in words: </strong> {{  numberToWords(invoice.total_price) }}</div> -->
  <span v-if="invoice.remarks"> <strong>Remarks: </strong>{{ invoice.remarks }}</span>
     <v-row class="text-center">
      <table :style="{'border-spacing':'30px','text-align':'center','margin-left':'5%'}">
      <tr>
        <td>
          <strong>_________________________</strong>
          <br/>
          <strong>
                    <small>
                      Checked By
                    </small>
                    </strong>
          </td>
        <td>
          <strong>_________________________________</strong>
          <br/>
          <strong>
                    <small>
                      Every Day Plastic Industry
                    </small>
                    </strong>
          </td>
        <td><strong>_________________________</strong>
          <br/>
          <strong>
                    <small>
                      Prepared By
                    </small>
                    </strong>
          </td>
      </tr>
      <!-- <tr>
        <td>
          <strong>
                    <small>
                      Checked By
                    </small>
                    </strong>
        </td>
        <td>
          <strong>
                    <small>
                      Every Day Plastic Industry
                    </small>
                   </strong>
        </td>
        <td>
          <strong>
                    <small>
                      Prepared By
                    </small>
                  </strong>
        </td>
      </tr> -->
     </table>
     </v-row>
    
            <!-- <VRow 
              absolute
              cols="12" class="my-10 text-center"
              :style="{'position':'absolute','bottom':'60px', 'left':'10%'}"
              >
              <VCol >
                <div>
                  <strong>_________________________</strong>
                </div>
                <div>
                  <strong>
                    <small>
                      Checked By
                    </small>
                    </strong>
                </div>
              </VCol>
              <VCol >
                <div>
                  <strong>_________________________</strong>
                </div>
                <div>
                  <strong>
                    <small>
                      Every Day Plastic Industry
                    </small>
                   </strong>
                </div>
              </VCol>
              <VCol>
                <div>
                  <strong>_________________________</strong>
                </div>
                <div>
                  <strong>
                    <small>
                      Prepared By
                    </small>
                  </strong>
                </div>
              </VCol>
            </VRow> -->
    </v-container>
  </div>
</template>
