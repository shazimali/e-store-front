<template>
    <h5>{{ this.title }}</h5>
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
    props:['title','credit','debit'],
    data() {
      return {
        chartData: {
          labels: [ 'Credit', 'Debit', 'Difference' ],
          datasets: [ 
              {
                  label: this.title,
                  backgroundColor: ['#E46651', '#41B883', '#A99D35'],
                  data: [this.credit, this.debit, this.credit - this.debit] 
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
  