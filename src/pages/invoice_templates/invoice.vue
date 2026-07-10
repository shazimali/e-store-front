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
  const  total_price_sx_sale_tax = ref<number>(0);
    const  return_total_price_sx_sale_tax = ref<number>(0);
const  margin_adjustment = ref<any>('');

const styleForRight = reactive({
  textAlign: 'right',
  paddingRight:'10px'
})
const styleForLeft = reactive({
  textAlign: 'left',
})

const styleForOnlyRight = reactive({
  textAlign: 'right',
})

const styleReturnHeading = reactive({
  padding: '10px',
})


const styleTableObject = reactive({
  color:'black',
  fontSize:'13px',
  marginTop:'-20px'
})

const styleReturnTableObject = reactive({
  color:'black',
  fontSize:'13px',
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
          total_price_sx_sale_tax.value += parseFloat(price);
          total_price.value =  parseFloat(total_price.value) + parseFloat(price) + parseFloat(tax);
          total_sale_tax.value +=  parseFloat((pr.price * pr.qty)/100*pr.sale_tax); 
        });
        data.return_products.forEach((r_pr, index) => {
          total_sale_tax.value -= parseFloat((r_pr.price * r_pr.qty)/100*r_pr.sale_tax)
          return_total_price_sx_sale_tax.value += parseFloat(r_pr.price * r_pr.qty);
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
              <td  style="vertical-align: top;"></td>
              <td> Gujranwala</td>
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
                  {{ invoice.store.name }}
                </strong>
              </td>
            </tr>
            <tr>
              <td style="vertical-align: top;">Address:</td>
              <td>{{ invoice.customer.address}}</td>
            </tr>
            <tr>
              <td  style="vertical-align: top;"></td>
              <td>{{ invoice.customer.city}}</td>
            </tr>
            <tr>
              <td>NTN:</td>
              <td>{{ invoice.customer.ntn }}</td>
            </tr>
            <tr>
              <td>STRN:</td>
              <td>{{ invoice.customer.sale_tax_number }}</td>
            </tr>
          </table>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
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
                  Qty
                </th>
                <th >
                  Rate
                </th>
                <th >
                  Total<sub>(Ex S.T)</sub>
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
                <td :style="styleForRight">{{ commaFormate( item.price * item.qty) }}</td>
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
                <td :style="styleForRight"> <strong>{{ commaFormate( total_price_sx_sale_tax) }}</strong></td>
                <td :style="styleForRight">
                  <strong>{{ commaFormate(total_sale_tax.toFixed(2)) }}</strong>
                </td>
                <td :style="styleForRight">
                  <strong>{{ commaFormate( total_price.toFixed(2)) }}</strong>
                </td>
              </tr>
            </tbody>
          </table>
          <h5 :style="styleReturnHeading"  v-if="invoice.return_products.length > 0">Return Items</h5>
          <table  :style="styleReturnTableObject" width="100%">
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
                  Qty
                </th>
                <th >
                  Rate
                </th>
                <th >
                  Total<sub>(Ex S.T)</sub>
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
             
              <tr   v-if="invoice.return_products.length > 0"  v-for="(item, index) in invoice.return_products" :style="{'text-transform':'none','text-align':'center'}">
                <td>{{ index+1 }}</td>
                <td  >{{ item.sku }}</td>
                <td >{{ item.code }}</td>
                <td :style="styleForLeft">{{ item.name }}</td>
                <td :style="styleForRight">{{ commaFormate( item.qty) }}</td>
                <td  :style="styleForRight">{{ commaFormate( item.price) }}</td>
                <td  :style="styleForRight">{{ commaFormate( item.price * item.qty) }}</td>
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
                  <strong>{{ commaFormate(total_price_sx_sale_tax -  return_total_price_sx_sale_tax) }}</strong>  
                </td>
                <td  :style="styleForRight">
                  <strong>{{ commaFormate(total_sale_tax.toFixed(2)) }}</strong>
                </td>
                <td  :style="styleForRight">
                  <strong>{{ commaFormate( invoice.total_price) }}</strong>
                </td>
              </tr>
            </tbody>
          </table>
  <!-- <div> <strong>Value in words: </strong> {{  numberToWords(invoice.total_price) }}</div> -->
  <span v-if="invoice.remarks"> <strong>Remarks: </strong>{{ invoice.remarks }}</span>
     <v-row class="text-center">
      <table :style="{'border-spacing':'30px','text-align':'center','margin-left':'5%','margin-top':'40px'}">
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
     
     <!-- FBR Verification Block -->
     <v-row v-if="invoice.fbr_irn" class="justify-center mt-10">
       <v-col cols="12" sm="8" md="6">
         <div class="pa-4 rounded-lg d-flex align-center justify-space-between" style="border: 2px dashed #004488; background-color: #f7f9fc; color: black; max-width: 500px; margin: 0 auto;">
           <div class="d-flex flex-column text-left">
             <div class="d-flex align-center mb-2">
               <span style="font-size: 24px; color: #004488; margin-right: 8px;">🏛️</span>
               <div>
                 <strong style="color: #004488; font-size: 14px;">FBR VERIFIED INVOICE</strong>
                 <div style="font-size: 10px; color: #666; line-height: 1;">Digital Invoicing System</div>
               </div>
             </div>
             <div style="font-size: 11px; margin-top: 5px;">
               <strong>FBR Invoice No (IRN):</strong>
               <div class="font-mono text-subtitle-2 font-weight-bold mt-1" style="letter-spacing: 0.5px; font-size: 11px;">{{ invoice.fbr_irn }}</div>
             </div>
             <div style="font-size: 11px; margin-top: 5px;" v-if="invoice.fbr_usin">
               <strong>USIN:</strong> {{ invoice.fbr_usin }}
             </div>
           </div>
           <div class="ml-4 d-flex flex-column align-center">
             <img :src="`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(invoice.fbr_qr_url)}`" alt="FBR QR Code" style="height: 90px; width: 90px; display: block; border: 1px solid #ccc; padding: 2px; background: white;" />
             <small class="text-caption mt-1" style="font-size: 9px; color: #555;">Scan to Verify</small>
           </div>
         </div>
       </v-col>
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
