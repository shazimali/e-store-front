<script setup lang="ts">
import { toast } from 'vue3-toastify'
import LastMonthTopStore from '@/pages/dashboard/last_month_top_store.vue'
import Top_store from '@/pages/dashboard/top_store.vue'
import CurrentLastMonthBranchSales from '@/pages/stores/dashboard/current_last_month_branch_sales.vue'
import MonthlySales from '@/pages/stores/dashboard/monthly_sales.vue'
import SalesPieChart from '@/pages/stores/dashboard/sales_pie_chart.vue'
import States from '@/pages/stores/dashboard/states.vue'
import YearlyDeliverables from '@/pages/stores/dashboard/yearly_deliverables.vue'
import YearlySales from '@/pages/stores/dashboard/yearly_sales.vue'
import { getDashboard } from '@/services/StoreService'

const props = defineProps(['id'])
const dashboard = ref<any>({})

const getDashboardData = async () => {
  await getDashboard(props.id).then((res: any) => {
    dashboard.value = res.data
  }).catch((err: any) => {
    toast.error(err)
  })
}

await getDashboardData()
</script>

<template>
  <div>
    <h1>{{ dashboard.store_name }} Dashboard</h1>
    <VRow>
      <VCol
        v-if="dashboard.top_branch && dashboard.top_branch.length > 0"
        cols="6"
      >
        <TopStore :server_data="dashboard.top_branch[0]" />
      </VCol>
      <VCol
        v-if="dashboard.last_month_top_branch && dashboard.last_month_top_branch.length > 0"
        cols="6"
      >
        <LastMonthTopStore :server_data="dashboard.last_month_top_branch[0]" />
      </VCol>
    </VRow>
    <VRow>
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
              :discounts="dashboard.total_states.discounts"
              :purchases="dashboard.total_states.purchases"
            />
          </VCol>
          <VCol cols="4">
            <SalesPieChart
              title="Yearly Sales"
              :sales="dashboard.yearly_states.sale_without_tax"
              :profits="dashboard.yearly_states.profit"
              :discounts="dashboard.yearly_states.discounts"
              :purchases="dashboard.yearly_states.purchases"
            />
          </VCol>
          <VCol cols="4">
            <SalesPieChart
              title="Monthly Sales"
              :sales="dashboard.monthly_states.sale_without_tax"
              :profits="dashboard.monthly_states.profit"
              :discounts="dashboard.monthly_states.discounts"
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
        <YearlyDeliverables :server_data="dashboard.lstBranches" />
      </VCol>
      <VCol cols="12">
        <CurrentLastMonthBranchSales :server_data="dashboard.current_last_month_branches_sale" />
      </VCol>
    <!--
      <v-col cols="6">
      <MonthlyDeliverables :server_data="dashboard.monthly_deliverables"/>
      </v-col>
    -->
    </VRow>
  </div>
</template>
