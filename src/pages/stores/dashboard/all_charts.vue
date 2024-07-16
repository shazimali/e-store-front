<script setup lang="ts">
import Top_store from '@/pages/dashboard/top_store.vue';
import MonthlySales from '@/pages/stores/dashboard/monthly_sales.vue';
import SalesPieChart from '@/pages/stores/dashboard/sales_pie_chart.vue';
import States from '@/pages/stores/dashboard/states.vue';
import YearlyDeliverables from '@/pages/stores/dashboard/yearly_deliverables.vue';
import YearlySales from '@/pages/stores/dashboard/yearly_sales.vue';
import { getDashboard } from '@/services/StoreService';
import { toast } from 'vue3-toastify';
    const props = defineProps(['id']);
    const dashboard = ref<any>({});
    const getDashboardData = async() => {
       await getDashboard(props.id).then((res:any) => {
            dashboard.value = res.data;
    }).catch((err:any)=>{
            toast.error(err);
    })
    }

    await getDashboardData();
</script>
<template>
  <div>
    <h1>{{ dashboard.store_name }} Dashboard</h1>
    <v-row>
      <VCol
      cols="12"
    >
      <Top_store :server_data ="dashboard.top_branch[0]"/>
    </VCol>
    </v-row>
    <v-row>
    <v-col cols="12">
      <States :title="'Total States'" :server_data="dashboard.total_states"/>
    </v-col>
    <v-col cols="12">
      <States :title="'Yearly States ' + new Date().getFullYear()" :server_data="dashboard.yearly_states"/>
    </v-col>
    <v-col cols="12">
      <States :title="'Current Month States'" :server_data="dashboard.monthly_states"/>
    </v-col>
    <v-col cols="12">
      <v-row>
        <v-col cols="4">
          <SalesPieChart 
          :title="'Total Sales'" 
          :sales="dashboard.total_states.sales[0].total"
          :profits="dashboard.total_states.profit"
          :discounts="dashboard.total_states.discounts"
          :purchases="dashboard.total_states.purchases"
          />
        </v-col>
        <v-col cols="4">
          <SalesPieChart 
          :title="'Yearly Sales'"
          :sales="dashboard.yearly_states.sales[0].total"
          :profits="dashboard.total_states.profit"
          :discounts="dashboard.yearly_states.discounts"
          :purchases="dashboard.yearly_states.purchases"
          />
        </v-col>
        <v-col cols="4">
          <SalesPieChart 
          :title="'Monthly Sales'"
          :sales="dashboard.monthly_states.sales[0].total"
          :profits="dashboard.total_states.profit"
          :discounts="dashboard.monthly_states.discounts"
          :purchases="dashboard.monthly_states.purchases"
          />
        </v-col>
      </v-row>
    </v-col>
    <!-- <v-col cols="6">
    <DeliverablesPieChart/>
    </v-col> -->
    <v-col cols="12">
    <YearlySales  :server_data="dashboard.yearly_sales"/>
    </v-col>
    <v-col cols="12">
      <MonthlySales :server_data="dashboard.monthly_sales"/>
    </v-col>
    <v-col cols="12">
      <YearlyDeliverables :server_data="dashboard.lstBranches"/>
    </v-col>
    <!-- <v-col cols="6">
      <MonthlyDeliverables :server_data="dashboard.monthly_deliverables"/>
    </v-col> -->
  </v-row>
  </div>
 
</template>
