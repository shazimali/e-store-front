<script setup lang="ts">
import AllCharts from '@/pages/stores/dashboard/all_charts.vue';

const route = useRoute();
const id = route.params.id;

</script>
<template>
  <div>
    <Suspense>
      <template #default>
        <AllCharts :id="id"/>
      </template>
      <template #fallback>
        <h3>Loading...</h3>
      </template>
    </Suspense>
  </div>
 
</template>

