<script setup lang="ts">
import Deliverable from '@/pages/invoice_templates/deliverable.vue';
import Invoice from '@/pages/invoice_templates/invoice.vue';
import ReturnDeliverable from '@/pages/invoice_templates/return_deliverable.vue';
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
    </div>
 
</template>
