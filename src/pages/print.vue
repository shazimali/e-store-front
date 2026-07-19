<script setup lang="ts">
import Ledger from './invoice_templates/ledger.vue'
import Purchase from './invoice_templates/purchase.vue'
import Stock from './invoice_templates/stock.vue'
import Voucher from './invoice_templates/voucher.vue'
import ReturnDeliverable from '@/pages/invoice_templates/return_deliverable.vue'
import Invoice from '@/pages/invoice_templates/invoice.vue'
import Deliverable from '@/pages/invoice_templates/deliverable.vue'

const route = useRoute()
</script>

<template>
  <div>
    <Deliverable v-if="route.query.type === 'deliverable'" />
    <ReturnDeliverable v-if="route.query.type === 'return-deliverable'" />
    <Invoice v-if="route.query.type === 'invoice'" />
    <Purchase v-if="route.query.type === 'purchase'" />
    <Voucher v-if="route.query.type === 'voucher'" />
    <Ledger v-if="route.query.type === 'ledger'" />
    <Stock v-if="route.query.type === 'stock'" />
  </div>
</template>
