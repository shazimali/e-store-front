<script setup lang="ts">
import AllCharts from '@/pages/dashboard/all_charts.vue';

</script>
<template>
  <div>
    <Suspense>
      <template #default>
        <AllCharts/>
      </template>
      <template #fallback>
        <h3>Loading...</h3>
      </template>
    </Suspense>
  </div>
 
</template>

