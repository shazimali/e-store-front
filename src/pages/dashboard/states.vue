<script setup lang="ts">
import { commaFormate } from '@/@core/utils/helpers';
const props = defineProps(['title','server_data'])
</script>
<template>
    <VCard :title="props.title">

<VCardText class="pt-10">
  <VRow>
    <VCol
      cols="12"
      sm="6"
      md="3"
    >
      <div class="d-flex align-center gap-x-3">
        <VAvatar
          color="success"
          rounded
          size="40"
          class="elevation-2"
        >
          <VIcon
            size="24"
            icon="ri-receipt-line"
          />
        </VAvatar>

        <div class="d-flex flex-column">
          <div class="text-body-1">
            Sales
          </div>
          <h5 class="text-h5">
            {{ commaFormate(props.server_data.sales[0].total) }}
          </h5>
        </div>
      </div>
      
    </VCol>
    <VCol
      cols="12"
      sm="6"
      md="3"
    >
      <div class="d-flex align-center gap-x-3">
        <VAvatar
          color="default"
          rounded
          size="40"
          class="elevation-2"
        >
          <VIcon
            size="24"
            icon="ri-arrow-up-down-fill"
          />
        </VAvatar>

        <div class="d-flex flex-column">
          <div class="text-body-1">
            Profit/Loss
          </div>
          <h5 class="text-h5 text-danger">
            {{ (props.server_data.profit).toFixed(2) }}
          </h5>
        </div>
      </div>
      
    </VCol>
    <VCol
      cols="12"
      sm="6"
      md="3"
    >
      <div class="d-flex align-center gap-x-3">
        <VAvatar
          color="primary"
          rounded
          size="40"
          class="elevation-2"
        >
          <VIcon
            size="24"
            icon="ri-pie-chart-2-line"
          />
        </VAvatar>

        <div class="d-flex flex-column">
          <div class="text-body-1">
            Purchase
          </div>
          <h5 class="text-h5">
            {{ commaFormate(props.server_data.purchases) }}
          </h5>
        </div>
      </div>
      
    </VCol>
    <VCol
      cols="12"
      sm="6"
      md="3"
    >
      <div class="d-flex align-center gap-x-3">
        <VAvatar
          color="warning"
          rounded
          size="40"
          class="elevation-2"
        >
          <VIcon
            size="24"
            icon="ri-bank-card-line"
          />
        </VAvatar>

        <div class="d-flex flex-column">
          <div class="text-body-1">
            Active stores
          </div>
          <h5 class="text-h5">
            {{ commaFormate(props.server_data.stores) }}
          </h5>
        </div>
      </div>
      
    </VCol>

    <!-- <VCol
      cols="12"
      sm="6"
      md="3"
    >
      <div class="d-flex align-center gap-x-3">
        <VAvatar
          color="success"
          rounded
          size="40"
          class="elevation-2"
        >
          <VIcon
            size="24"
            icon="ri-money-dollar-circle-line"
          />
        </VAvatar>

        <div class="d-flex flex-column">
          <div class="text-body-1">
            Debit
          </div>
          <h5 class="text-h5">
            {{ commaFormate(props.server_data.debit) }}
          </h5>
        </div>
      </div>
      
    </VCol>
    <VCol
      cols="12"
      sm="6"
      md="3"
    >
      <div class="d-flex align-center gap-x-3">
        <VAvatar
          color="error"
          rounded
          size="40"
          class="elevation-2"
        >
          <VIcon
            size="24"
            icon="ri-refund-2-fill"
          />
        </VAvatar>

        <div class="d-flex flex-column">
          <div class="text-body-1">
            Credit
          </div>
          <h5 class="text-h5">
            {{ commaFormate(props.server_data.credit) }}
          </h5>
        </div>
      </div>
      
    </VCol> -->
    <VCol
      cols="12"
      sm="6"
      md="3"
    >
      <div class="d-flex align-center gap-x-3">
        <VAvatar
          color="info"
          rounded
          size="40"
          class="elevation-2"
        >
          <VIcon
            size="24"
            icon="ri-git-merge-line"
          />
        </VAvatar>

        <div class="d-flex flex-column">
          <div class="text-body-1">
            Active Branches
          </div>
          <h5 class="text-h5">
            {{ commaFormate(props.server_data.branches) }}
          </h5>
        </div>
      </div>
      
    </VCol>
    <VCol
      cols="12"
      sm="6"
      md="3"
    >
      <div class="d-flex align-center gap-x-3">
        <VAvatar
          color="error"
          rounded
          size="40"
          class="elevation-2"
        >
        <VIcon
            size="24"
            icon="ri-text-wrap"
          />
        </VAvatar>

        <div class="d-flex flex-column">
          <div class="text-body-1">
           Discounts
          </div>
          <h5 class="text-h5">
            {{ commaFormate(props.server_data.discounts[0].total) }}
          </h5>
        </div>
      </div>
      
    </VCol>
  </VRow>
</VCardText>
</VCard>
</template>
