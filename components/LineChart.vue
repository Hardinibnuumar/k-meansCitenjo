<template>
  <canvas ref="chartCanvas"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const props = defineProps<{
  labels: string[]; // Mengubah ini
  data: number[];   // Mengubah ini
}>();

// Computed property untuk mengonversi props menjadi format yang diharapkan Chart.js
const chartDataComputed = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: 'Jumlah Warga Klaster 2', // Label dataset untuk LineChart
      data: props.data,
      borderColor: '#3b82f6', // Warna garis
      backgroundColor: 'rgba(59, 130, 246, 0.2)', // Warna area di bawah garis
      fill: true, // Mengisi area di bawah garis
      tension: 0.4 // Membuat garis sedikit melengkung
    }
  ]
}));

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

onMounted(() => {
  if (chartCanvas.value) {
    chartInstance = new Chart(chartCanvas.value, {
      type: 'line',
      data: chartDataComputed.value, // Menggunakan computed property
      options: options
    });
  }
});

watch(
  () => chartDataComputed.value, // Mengamati computed property
  (newChartData) => {
    if (chartInstance) {
      chartInstance.data = newChartData;
      chartInstance.update();
    }
  },
  { deep: true }
);
</script>
