<template>
  <h5>{{ this.title }}</h5>
  <Doughnut
    id="my-chart-id"
    :options="chartOptions"
    :data="chartData"
  />

</template>
<script>
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Doughnut } from 'vue-chartjs';

ChartJS.register(ArcElement, Tooltip, Legend)

export default {
  name: 'DoughnutChart',
  components: { Doughnut },
  props:['title','sales','purchases','profits','discounts'],
  data() {
    return {
      chartData: {
        labels: [ 'Sales', 'Purchases', 'Profits', 'Discounts' ],
        datasets: [ 
            {
                label: this.title,
                backgroundColor: ['#41B883','#FFA500', '#A99D35','#E46651'],
                data: [this.sales, this.purchases, this.profits, this.discounts] 
            }
         ]
      },
      chartOptions: {
        responsive: true
      }
    }
  }
}
</script>
