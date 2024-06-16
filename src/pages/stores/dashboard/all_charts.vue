<script setup lang="ts">
    import MonthlyDeliverables from '@/pages/stores/dashboard/monthly_deliverables.vue';
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
    <v-col cols="6">
    <YearlySales  :server_data="dashboard.yearly_sales"/>
    </v-col>
    <v-col cols="6">
      <MonthlySales :server_data="dashboard.monthly_sales"/>
    </v-col>
    <v-col cols="6">
      <YearlyDeliverables :server_data="dashboard.yearly_deliverables"/>
    </v-col>
    <v-col cols="6">
      <MonthlyDeliverables :server_data="dashboard.monthly_deliverables"/>
    </v-col>
  </v-row>
  </div>
 
</template>
