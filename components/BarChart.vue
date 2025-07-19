<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
)

const props = defineProps<{
  labels: string[]
  data: number[]
}>()

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: 'Jumlah Warga Klaster 2', // Label dataset lebih spesifik
      data: props.data,
      backgroundColor: 'rgba(59, 130, 246, 0.6)',
      borderColor: '#3b82f6',
      borderWidth: 1
    }
  ]
}))

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const
    },
    title: {
      display: true,
      text: 'Jumlah Warga Klaster Prioritas Tinggi per RT/RW' // Judul lebih spesifik
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Jumlah Warga Klaster 2' // Label sumbu Y lebih generik
      }
    },
    x: {
      ticks: {
        autoSkip: false, // Jangan otomatis skip label
        maxRotation: 90, // Rotasi label 90 derajat
        minRotation: 90  // Rotasi label 90 derajat
      }
    }
  }
}
</script>

<template>
  <Bar :data="chartData" :options="options" />
</template>
