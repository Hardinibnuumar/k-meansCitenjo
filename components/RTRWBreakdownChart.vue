<template>
  <div class="space-y-6">
    <!-- Header dengan Filter -->
    <div class="flex justify-between items-center">
      <h3 class="text-xl font-semibold">Breakdown Klaster per RT/RW</h3>
      <div class="flex gap-3">
        <select 
          v-model="selectedRW" 
          @change="updateData"
          class="border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Semua RW</option>
          <option v-for="rw in availableRW" :key="rw" :value="rw">RW {{ rw }}</option>
        </select>
        <select 
          v-model="viewMode" 
          class="border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="chart">Chart View</option>
          <option value="table">Table View</option>
          <option value="both">Both</option>
        </select>
      </div>
    </div>
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white border rounded-lg p-4 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 font-medium">Total RT</p>
            <p class="text-2xl font-bold text-blue-600">{{ totalRT }}</p>
          </div>
          <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
        </div>
      </div>
      <div class="bg-white border rounded-lg p-4 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 font-medium">Klaster Dominan</p>
            <p class="text-1xl font-bold" :class="getClusterDefinition(dominantClusterId).colorClass">
              {{ getClusterDefinition(dominantClusterId).name }}
            </p>
          </div>
          <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="getClusterDefinition(dominantClusterId).bgColorClass">
            <svg class="w-5 h-5" :class="getClusterDefinition(dominantClusterId).colorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
          </div>
        </div>
      </div>
      <div class="bg-white border rounded-lg p-4 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 font-medium">RT Prioritas Tinggi Terbanyak</p>
            <p class="text-1xl font-bold text-red-600">{{ rtWithMostCluster1 }}</p>
            <p class="text-xs text-gray-500">{{ maxCluster1Count }} warga</p>
          </div>
          <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
        </div>
      </div>
      <div class="bg-white border rounded-lg p-4 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 font-medium">RT Prioritas Rendah Terbanyak</p>
            <p class="text-1xl font-bold text-green-600">{{ rtWithMostCluster0 }}</p>
            <p class="text-xs text-gray-500">{{ maxCluster0Count }} warga</p>
          </div>
          <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
    <!-- Chart Section -->
    <div v-if="viewMode === 'chart' || viewMode === 'both'" class="bg-white border rounded-lg p-6 shadow-sm">
      <div class="flex justify-between items-center mb-4">
        <h4 class="text-lg font-semibold">Distribusi Klaster per RT/RW</h4>
        <div class="flex gap-2">
          <button 
            @click="chartType = 'line'" 
            :class="[
              'px-3 py-1 text-sm rounded-md transition-colors',
              chartType === 'line' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            Line
          </button>
          <button 
            @click="chartType = 'bar'" 
            :class="[
              'px-3 py-1 text-sm rounded-md transition-colors',
              chartType === 'bar' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            Bar
          </button>
        </div>
      </div>
      <div class="h-80">
        <LineChart 
          v-if="chartType === 'line'"
          :labels="chartLabels" 
          :data="chartData" 
        />
        <BarChart 
          v-else
          :labels="chartLabels" 
          :data="chartData" 
        />
      </div>
    </div>
    <!-- Table Section -->
    <div v-if="viewMode === 'table' || viewMode === 'both'" class="bg-white border rounded-lg shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h4 class="text-lg font-semibold">Detail Data RT/RW</h4>
          <div class="flex gap-2">
            <button 
              @click="exportToExcel" 
              class="px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Export Excel
            </button>
            <button 
              @click="refreshData" 
              class="px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RT/RW</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Warga</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioritas Rendah</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioritas Tinggi</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Klaster Dominan</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(item, index) in limitedRTRWData" :key="`${item.rt}-${item.rw}`" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                  index === 0 ? 'bg-yellow-100 text-yellow-800' :
                  index === 1 ? 'bg-gray-100 text-gray-800' :
                  index === 2 ? 'bg-orange-100 text-orange-800' :
                  'bg-blue-100 text-blue-800'
                ]">
                  {{ index + 1 }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                RT {{ item.rt }}/RW {{ item.rw }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.totalWarga }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">{{ item.clusterCounts[0] || 0 }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">{{ item.clusterCounts[1] || 0 }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getClusterDefinition(item.dominantClusterId).bgColorClass" class="px-2 py-1 rounded-full text-xs font-medium" :style="{ color: getClusterDefinition(item.dominantClusterId).colorClass }">
                  {{ getClusterDefinition(item.dominantClusterId).name }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- Comparison Section (Removed as requested) -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits } from 'vue'
import LineChart from '@/components/LineChart.vue'
import BarChart from '@/components/BarChart.vue'
import * as XLSX from 'xlsx'
import { getClusterDefinition } from '~/utils/clusterDefinitions' // Import the new utility

// Props - menggunakan data dari parent dashboard
const props = defineProps<{ 
  allWarga: any[]
}>()

// Define emits untuk komunikasi dengan parent
const emit = defineEmits(['refresh-dashboard'])

// Reactive state
const selectedRW = ref('')
const viewMode = ref<'chart' | 'table' | 'both'>('both')
const chartType = ref<'line' | 'bar'>('line')

// Computed data untuk breakdown RT/RW
const rtRwBreakdown = computed(() => {
  const breakdown: Record<string, {
    rt: number
    rw: number
    warga: any[]
    totalWarga: number
    clusterCounts: Record<number, number>
    dominantClusterId?: number
  }> = {}

  props.allWarga.forEach(warga => {
    if (!warga.rt || !warga.rw || typeof warga.clusterId !== 'number') return

    const key = `${warga.rt}-${warga.rw}`
    if (!breakdown[key]) {
      breakdown[key] = {
        rt: warga.rt,
        rw: warga.rw,
        warga: [],
        totalWarga: 0,
        clusterCounts: { 0: 0, 1: 0 } as Record<number, number>
      }
    }

    breakdown[key].warga.push(warga)
    breakdown[key].totalWarga++

    if (breakdown[key].clusterCounts[warga.clusterId] !== undefined) {
      breakdown[key].clusterCounts[warga.clusterId]++
    } else {
      breakdown[key].clusterCounts[warga.clusterId] = 1;
    }
  })

  Object.values(breakdown).forEach(item => {
    let maxCount = -1;
    let dominantId: number | undefined;
    for (const clusterIdStr in item.clusterCounts) {
      const clusterId = parseInt(clusterIdStr);
      const count = item.clusterCounts[clusterId];
      if (count > maxCount) {
        maxCount = count;
        dominantId = clusterId;
      }
    }
    item.dominantClusterId = dominantId;
  })

  return Object.values(breakdown)
})

// Filter berdasarkan RW yang dipilih
const filteredRTRWData = computed(() => {
  if (!selectedRW.value) return rtRwBreakdown.value
  return rtRwBreakdown.value.filter(item => item.rw.toString() === selectedRW.value)
})

// Data yang sudah diurutkan berdasarkan klaster dominan (misal: Klaster 1 paling atas)
const sortedRTRWData = computed(() => {
  return [...filteredRTRWData.value].sort((a, b) => {
    // Urutkan berdasarkan klaster dominan (Klaster 1 > Klaster 0)
    const clusterOrder = { 1: 0, 0: 1 }; // Prioritas: 1 (tertinggi), 0 (terendah)
    const orderA = clusterOrder[a.dominantClusterId as keyof typeof clusterOrder] ?? 99;
    const orderB = clusterOrder[b.dominantClusterId as keyof typeof clusterOrder] ?? 99;

    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return b.totalWarga - a.totalWarga;
  })
})

// Batasi jumlah baris yang ditampilkan di tabel
const limitedRTRWData = computed(() => {
  return sortedRTRWData.value.slice(0, 16); // Menampilkan maksimal 16 baris
})

// Available RW options
const availableRW = computed(() => {
  const rwSet = new Set(rtRwBreakdown.value.map(item => item.rw.toString()))
  return Array.from(rwSet).sort()
})

// Chart data (contoh: menampilkan jumlah warga di Klaster 1 - Prioritas Tinggi)
const chartLabels = computed(() => {
  return sortedRTRWData.value.map(item => `RT ${item.rt}/RW ${item.rw}`)
})

const chartData = computed(() => {
  return sortedRTRWData.value.map(item => item.clusterCounts[1] || 0) // Jumlah warga di Klaster 1 (Prioritas Tinggi)
})

// Summary statistics
const totalRT = computed(() => filteredRTRWData.value.length)

const dominantClusterId = computed(() => {
  if (filteredRTRWData.value.length === 0) return undefined;
  const allClusterCounts: Record<number, number> = { 0: 0, 1: 0 };
  filteredRTRWData.value.forEach(item => {
    for (const clusterIdStr in item.clusterCounts) {
      const clusterId = parseInt(clusterIdStr);
      allClusterCounts[clusterId] = (allClusterCounts[clusterId] || 0) + item.clusterCounts[clusterId];
    }
  });

  let maxCount = -1;
  let dominantId: number | undefined;
  for (const clusterIdStr in allClusterCounts) {
    const clusterId = parseInt(clusterIdStr);
    const count = allClusterCounts[clusterId];
    if (count > maxCount) {
      maxCount = count;
      dominantId = clusterId;
    }
    // Jika jumlah sama, pilih klaster dengan ID lebih tinggi (prioritas lebih tinggi)
    else if (count === maxCount && dominantId !== undefined && clusterId > dominantId) {
      dominantId = clusterId;
    }
  }
  return dominantId;
})

const rtWithMostCluster1 = computed(() => {
  if (filteredRTRWData.value.length === 0) return '-';
  let maxCount = -1;
  let bestRtRw = '-';
  filteredRTRWData.value.forEach(item => {
    const count = item.clusterCounts[1] || 0;
    if (count > maxCount) {
      maxCount = count;
      bestRtRw = `RT ${item.rt}/RW ${item.rw}`;
    }
  });
  return bestRtRw;
})

const maxCluster1Count = computed(() => {
  if (filteredRTRWData.value.length === 0) return 0;
  return Math.max(...filteredRTRWData.value.map(item => item.clusterCounts[1] || 0));
})

const rtWithMostCluster0 = computed(() => {
  if (filteredRTRWData.value.length === 0) return '-';
  let maxCount = -1;
  let bestRtRw = '-';
  filteredRTRWData.value.forEach(item => {
    const count = item.clusterCounts[0] || 0;
    if (count > maxCount) {
      maxCount = count;
      bestRtRw = `RT ${item.rt}/RW ${item.rw}`;
    }
  });
  return bestRtRw;
})

const maxCluster0Count = computed(() => {
  if (filteredRTRWData.value.length === 0) return 0;
  return Math.max(...filteredRTRWData.value.map(item => item.clusterCounts[0] || 0));
})

// RW Comparison (This section is no longer used in the template after removal)
const rwComparison = computed(() => {
  const rwGroups: Record<number, any[]> = {}
  rtRwBreakdown.value.forEach(item => {
    if (!rwGroups[item.rw]) rwGroups[item.rw] = []
    rwGroups[item.rw].push(item)
  })

  return Object.entries(rwGroups).map(([rw, items]) => {
    const totalWargaRW = items.reduce((sum, item) => sum + item.totalWarga, 0);
    const allClusterCountsRW: Record<number, number> = { 0: 0, 1: 0 };
    items.forEach(item => {
      for (const clusterIdStr in item.clusterCounts) {
        const clusterId = parseInt(clusterIdStr);
        allClusterCountsRW[clusterId] = (allClusterCountsRW[clusterId] || 0) + item.clusterCounts[clusterId];
      }
    });

    let maxCount = -1;
    let dominantId: number | undefined;
    for (const clusterIdStr in allClusterCountsRW) {
      const clusterId = parseInt(clusterIdStr);
      const count = allClusterCountsRW[clusterId];
      if (count > maxCount) {
        maxCount = count;
        dominantId = clusterId;
      }
      else if (count === maxCount && dominantId !== undefined && clusterId > dominantId) {
        dominantId = clusterId;
      }
    }

    let rtWithMostCluster1 = '-';
    let maxCluster1Count = -1;
    items.forEach(item => {
      const count = item.clusterCounts[1] || 0;
      if (count > maxCluster1Count) {
        maxCluster1Count = count;
        rtWithMostCluster1 = `RT ${item.rt}`;
      }
    });

    return {
      rw: parseInt(rw),
      totalRT: items.length,
      totalWarga: totalWargaRW,
      clusterCounts: allClusterCountsRW,
      dominantClusterId: dominantId,
      rtWithMostCluster1: rtWithMostCluster1
    }
  }).sort((a, b) => {
    const clusterOrder = { 1: 0, 0: 1 };
    const orderA = clusterOrder[a.dominantClusterId as keyof typeof clusterOrder] ?? 99;
    const orderB = clusterOrder[b.dominantClusterId as keyof typeof clusterOrder] ?? 99;
    return orderA - orderB;
  })
})

const updateData = () => {
  // Data akan otomatis update karena computed properties
}

const exportToExcel = () => {
  const dataToExport = sortedRTRWData.value.map(item => ({
    'Rank': sortedRTRWData.value.indexOf(item) + 1,
    'RT/RW': `RT ${item.rt}/RW ${item.rw}`,
    'Total Warga': item.totalWarga,
    'Prioritas Rendah': item.clusterCounts[0] || 0,
    'Prioritas Tinggi': item.clusterCounts[1] || 0,
    'Klaster Dominan': getClusterDefinition(item.dominantClusterId).name
  }))

  const ws = XLSX.utils.json_to_sheet(dataToExport)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Data RT-RW Breakdown Klaster')
  XLSX.writeFile(wb, 'data_rt_rw_breakdown_klaster.xlsx')
  console.log('Exporting to Excel...')
}

const refreshData = () => {
  console.log('Refreshing data...')
  emit('refresh-dashboard') // Emit event ke parent untuk refresh data
}
</script>
