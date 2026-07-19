<script setup lang="ts">
import { toast } from 'vue3-toastify'
import CurrentLastMonthStoresSale from '@/pages/dashboard/current_last_month_store_sales.vue'
import LastMonthTopStore from '@/pages/dashboard/last_month_top_store.vue'
import MonthlySales from '@/pages/dashboard/monthly_sales.vue'
import SalesPieChart from '@/pages/dashboard/sales_pie_chart.vue'
import States from '@/pages/dashboard/states.vue'
import Stores from '@/pages/dashboard/stores.vue'
import TopStore from '@/pages/dashboard/top_store.vue'
import YearlySales from '@/pages/dashboard/yearly_sales.vue'
import { getDashboard } from '@/services/DashboardService'

const dashboard = ref<any>({})

const getDashboardData = async () => {
  await getDashboard().then((res: any) => {
    dashboard.value = res.data
  }).catch((err: any) => {
    toast.error(err)
  })
}

await getDashboardData()
</script>

<template>
  <div>
    <h1>Dashboard</h1>
    <VRow>
      <VCol
        v-if="dashboard.top_store && dashboard.top_store.length > 0"
        cols="6"
      >
        <TopStore :server_data="dashboard.top_store[0]" />
      </VCol>
      <VCol
        v-if="dashboard.top_last_month_store.length > 0"
        cols="6"
      >
        <LastMonthTopStore :server_data="dashboard.top_last_month_store[0]" />
      </VCol>
      <VCol cols="12">
        <States
          title="Total States"
          :server_data="dashboard.total_states"
        />
      </VCol>
      <VCol cols="12">
        <States
          :title="`Yearly States ${new Date().getFullYear()}`"
          :server_data="dashboard.yearly_states"
        />
      </VCol>
      <VCol cols="12">
        <States
          title="Current Month States"
          :server_data="dashboard.monthly_states"
        />
      </VCol>
      <VCol cols="12">
        <States
          title="Last Month States"
          :server_data="dashboard.last_month_states"
        />
      </VCol>
      <VCol cols="12">
        <VRow>
          <VCol cols="4">
            <SalesPieChart
              title="Total Sales"
              :sales="dashboard.total_states.sale_without_tax"
              :profits="dashboard.total_states.profit"
              :discounts="dashboard.total_states.discounts[0].total"
              :purchases="dashboard.total_states.purchases"
            />
          </VCol>
          <VCol cols="4">
            <SalesPieChart
              title="Yearly Sales"
              :sales="dashboard.yearly_states.sale_without_tax"
              :profits="dashboard.yearly_states.profit"
              :discounts="dashboard.yearly_states.discounts[0].total"
              :purchases="dashboard.yearly_states.purchases"
            />
          </VCol>
          <VCol cols="4">
            <SalesPieChart
              title="Monthly Sales"
              :sales="dashboard.monthly_states.sale_without_tax"
              :profits="dashboard.monthly_states.profit"
              :discounts="dashboard.monthly_states.discounts[0].total"
              :purchases="dashboard.monthly_states.purchases"
            />
          </VCol>
        </VRow>
      </VCol>
      <!--
        <v-col cols="6">
        <DeliverablesPieChart/>
        </v-col>
      -->
      <VCol cols="12">
        <YearlySales :server_data="dashboard.yearly_sales" />
      </VCol>
      <VCol cols="12">
        <MonthlySales :server_data="dashboard.monthly_sales" />
      </VCol>
      <VCol cols="12">
        <Stores :server_data="dashboard.stores" />
      </VCol>
      <VCol cols="12">
        <CurrentLastMonthStoresSale :server_data="dashboard.current_last_month_stores_sale" />
      </VCol>
    <!--
      <v-col cols="6">
      <MonthlyDeliverables :server_data="dashboard.monthly_deliverables"/>
      </v-col>
    -->
    </VRow>
  </div>
</template>
