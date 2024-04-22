<script setup lang="ts">
import Deliverable from '@/pages/invoice_templates/deliverable.vue';
import Invoice from '@/pages/invoice_templates/invoice.vue';
import ReturnDeliverable from '@/pages/invoice_templates/return_deliverable.vue';
import Purchase from './invoice_templates/purchase.vue';
import Voucher from './invoice_templates/voucher.vue';
const route = useRoute();
</script>
<template>
    <div>
        <Deliverable
  v-if="route.query.type === 'deliverable'"
  />
  <ReturnDeliverable
  v-if="route.query.type === 'return-deliverable'"
  />
  <Invoice
  v-if="route.query.type === 'invoice'"
  />
  <Purchase
  v-if="route.query.type === 'purchase'"
  />
  <Voucher 
  v-if="route.query.type === 'voucher'"
  />
    </div>
 
</template>
