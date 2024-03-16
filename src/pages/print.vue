<script setup lang="ts">
import Deliverable from '@/pages/invoice_templates/deliverable.vue';
const route = useRoute();
</script>
<template>
  <Deliverable
  v-if="route.query.type === 'deliverable'"
  />
</template>
