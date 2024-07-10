<template>
    <Bar
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
    />
  
  </template>
  <script>
  import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { Bar } from 'vue-chartjs';
  
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
  
  export default {
    name: 'BarChart',
    components: { Bar },
    props: ['server_data'],
    data() {
      return {
        chartData: {
          labels:this.server_data.map((a) => a.month),
          datasets: [ 
              {
                  label: 'Monthly Sales',
                  backgroundColor: '#A170FE',
                  data:this.server_data.map((a) => a.total),
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
  