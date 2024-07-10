<template>
    <h5>Deliverables</h5>
    <Pie
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
    />
  
  </template>
  <script>
  import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Pie } from 'vue-chartjs';
  
ChartJS.register(ArcElement, Tooltip, Legend)
  
  export default {
    name: 'PieChart',
    components: { Pie },
    data() {
      return {
        chartData: {
          labels: [ 'Return', 'Delivered', 'Difference' ],
          datasets: [ 
              {
                  label: 'Deliverables',
                  backgroundColor: ['#E46651', '#41B883', '#00D8FF'],
                  data: [30, 40, 30] 
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
  