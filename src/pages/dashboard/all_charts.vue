<script setup lang="ts">
import MonthlySales from '@/pages/dashboard/monthly_sales.vue';
import SalesPieChart from '@/pages/dashboard/sales_pie_chart.vue';
import States from '@/pages/dashboard/states.vue';
import Stores from '@/pages/dashboard/stores.vue';
import TopStore from '@/pages/dashboard/top_store.vue';
import YearlySales from '@/pages/dashboard/yearly_sales.vue';
import { getDashboard } from '@/services/DashboardService';
import { toast } from 'vue3-toastify';
    const dashboard = ref<any>({});
    const getDashboardData = async() => {
       await getDashboard().then((res:any) => {
            dashboard.value = res.data;
    }).catch((err:any)=>{
            toast.error(err);
    })
    }

    await getDashboardData();
</script>
<template>
  <div>
    <h1>Dashboard</h1>
    <v-row>
      <VCol
      cols="12"
    >
      <TopStore :server_data ="dashboard.top_store[0]"/>
    </VCol>
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
          :credit="dashboard.total_states.credit"
          :debit="dashboard.total_states.debit"
          />
        </v-col>
        <v-col cols="4">
          <SalesPieChart 
          :title="'Yearly Sales'"
          :credit="dashboard.yearly_states.credit"
          :debit="dashboard.yearly_states.debit"
          />
        </v-col>
        <v-col cols="4">
          <SalesPieChart 
          :title="'Monthly Sales'"
          :credit="dashboard.monthly_states.credit"
          :debit="dashboard.monthly_states.debit"
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
      <Stores :server_data="dashboard.stores"/>
    </v-col>
    <!-- <v-col cols="6">
      <MonthlyDeliverables :server_data="dashboard.monthly_deliverables"/>
    </v-col> -->
  </v-row>
  </div>
 
</template>
