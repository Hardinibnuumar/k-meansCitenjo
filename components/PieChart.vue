<template>
  <div class="relative h-full w-full">
    <Doughnut :data="chartData" :options="options" />
    
    <!-- Center Text -->
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="text-center">
        <div class="text-2xl font-bold text-gray-800">{{ totalData }}</div>
        <div class="text-sm text-gray-600">Total Warga</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { clusterDefinitions } from '~/utils/clusterDefinitions' // Import the new utility

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{
  labels: string[]
  data: number[]
}>()

// Warna yang konsisten dengan tema, diambil dari definisi klaster
const colors = computed(() => clusterDefinitions.map(def => {
  // Mengambil warna dari Tailwind class, ini perlu parsing atau mapping manual
  // Untuk demo, kita bisa hardcode sesuai urutan klaster 0, 1, 2
  if (def.id === 0) return '#10B981'; // Green
  if (def.id === 1) return '#F59E0B'; // Yellow
  if (def.id === 2) return '#EF4444'; // Red
  return '#9CA3AF'; // Default gray
}));


const totalData = computed(() => {
  return props.data.reduce((sum, value) => sum + value, 0)
})

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      data: props.data,
      backgroundColor: colors.value,
      borderColor: colors.value.map(color => color),
      borderWidth: 2,
      hoverBorderWidth: 3,
      cutout: '65%', // Membuat donut hole
      spacing: 2
    }
  ]
}))

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false // Kita pakai custom legend di parent
    },
    tooltip: {
      callbacks: {
        label: function(context: any) {
          const label = context.label || ''
          const value = context.parsed
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
          const percentage = Math.round((value / total) * 100)
          return `${label}: ${value} (${percentage}%)`
        }
      }
    }
  },
  elements: {
    arc: {
      borderRadius: 8
    }
  },
  animation: {
    animateRotate: true,
    animateScale: true
  }
}
</script>
