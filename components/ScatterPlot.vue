<template>
  <div class="relative h-full w-full">
    <Scatter :data="chartData" :options="options" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Scatter } from 'vue-chartjs'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js'
import { getClusterDefinition } from '~/utils/clusterDefinitions'

ChartJS.register(
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title
)

const props = defineProps<{
  dataPoints: {
    x: number;
    y: number;
    clusterId: number;
    label: string; // Nama warga
  }[];
  xLabel: string;
  yLabel: string;
}>()

const chartData = computed(() => {
  const datasets: {
    label: string;
    data: { x: number; y: number; }[];
    backgroundColor: string;
    borderColor: string;
    pointRadius: number;
    pointHoverRadius: number;
  }[] = []

  // Kelompokkan data berdasarkan clusterId
  const groupedData: Record<number, { x: number; y: number; }[]> = {}
  props.dataPoints.forEach(point => {
    if (!groupedData[point.clusterId]) {
      groupedData[point.clusterId] = []
    }
    groupedData[point.clusterId].push({ x: point.x, y: point.y })
  })

  // Buat dataset untuk setiap klaster
  for (const clusterId in groupedData) {
    const clusterDef = getClusterDefinition(parseInt(clusterId))
    datasets.push({
      label: clusterDef.name,
      data: groupedData[clusterId],
      backgroundColor: clusterDef.id === 0 ? '#10B981' : clusterDef.id === 1 ? '#EF4444' : '#9CA3AF', // Warna sesuai klaster
      borderColor: clusterDef.id === 0 ? '#059669' : clusterDef.id === 1 ? '#DC2626' : '#6B7280',
      pointRadius: 5,
      pointHoverRadius: 7,
    })
  }

  return {
    datasets: datasets
  }
})

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    tooltip: {
      callbacks: {
        label: function(context: any) {
          const index = context.dataIndex;
          const datasetIndex = context.datasetIndex;
          const clusterId = parseInt(Object.keys(chartData.value.datasets)[datasetIndex]); // Get cluster ID from dataset key
          const originalPoint = props.dataPoints.find(p => 
            p.x === context.parsed.x && 
            p.y === context.parsed.y && 
            p.clusterId === clusterId
          );
          
          if (originalPoint) {
            return `${originalPoint.label} (${props.xLabel}: ${originalPoint.x}, ${props.yLabel}: ${originalPoint.y})`;
          }
          return `(${props.xLabel}: ${context.parsed.x}, ${props.yLabel}: ${context.parsed.y})`;
        }
      }
    },
    title: {
      display: true,
      text: `Scatter Plot Klaster: ${props.xLabel} vs ${props.yLabel}`
    }
  },
  scales: {
    x: {
      type: 'linear' as const,
      title: {
        display: true,
        text: props.xLabel,
      },
    },
    y: {
      type: 'linear' as const,
      title: {
        display: true,
        text: props.yLabel,
      },
    },
  },
}
</script>
