<script setup lang="ts">
import { commaFormate } from '@/@core/utils/helpers';
import trophy from '@images/misc/trophy.png';
const props = defineProps(['server_data'])
</script>

<template>
  <VCard class="position-relative">
    <VCardText>
      <div class="mb-2">
        <h5 class="text-h5">
          Congratulations {{props.server_data.name}}! <span class="text-high-emphasis">🎉</span>
        </h5>
        <div class="text-body-1">
          Best seller of the month
        </div>
      </div>
      <h4 class="text-h4 text-primary">
        {{ commaFormate(props.server_data.total) }}
      </h4>
      <div class="text-body-1 mb-2">
        Achieved highest target <span class="text-high-emphasis">🚀</span>
      </div>
      <VBtn size="small">
        View Sales
      </VBtn>
    </VCardText>

    <!-- Trophy -->
    <VImg
      :src="trophy"
      class="trophy"
    />
  </VCard>
</template>

<style lang="scss">
.v-card .trophy {
  position: absolute;
  inline-size: 5.188rem;
  inset-block-end: 1.25rem;
  inset-inline-end: 1.25rem;
}
</style>
