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
    props:['server_data'],
    data() {
      return {
        chartData: {
          labels: this.server_data.map((a) => a.store),
          datasets: [ 
                {
                    label: 'Current Month Sale',
                    backgroundColor: '#A99D35',
                    data:this.server_data.map((a) => a.current_month_total)
                },
                {
                    label: 'Last Month Sale',
                    backgroundColor: '#A170FE',
                    data:this.server_data.map((a) => a.last_month_total)
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
  