<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { useRouter } from 'vue-router'
import LineChart from '@/components/LineChart.vue' // Tetap diimpor, tapi tidak digunakan di template ini
import RTRWBreakdownChart from '@/components/RTRWBreakdownChart.vue' // Dikembalikan
import PieChart from '~/components/PieChart.vue'
import SmartCriteriaWeights from '@/components/SmartCriteriaWeights.vue'
import { Users, CheckCircle, Clock, XCircle } from 'lucide-vue-next'
import { useFirebase } from '~/composables/useFirebase'
import DashboardEnhancements from '@/components/DashboardEnhancements.vue'
import ClusterCharacteristicsTable from '@/components/ClusterCharacteristicsTable.vue'
import ScatterPlot from '@/components/ScatterPlot.vue'
import { definePageMeta } from '#imports'
import { getClusterDefinition, clusterDefinitions } from '~/utils/clusterDefinitions'

// Call the hook at the top level
const useFirebaseHook = useFirebase();
const dbHook = useFirebaseHook.db;

const allWarga = ref<any[]>([])
const totalWarga = ref(0)
const clusterCounts = ref<Record<number, number>>({ 0: 0, 1: 0, 2: 0 });
const loading = ref(true)

// State untuk pemilihan kriteria scatter plot
const availableCriteria = [
  { key: 'penghasilan', label: 'Penghasilan' },
  { key: 'jumlah_tanggungan', label: 'Jumlah Tanggungan' },
  { key: 'kondisi_tempat_tinggal_score', label: 'Kondisi Tempat Tinggal (Skor)' },
  { key: 'status_pekerjaan_score', label: 'Status Pekerjaan (Skor)' },
  { key: 'kesehatan_score', label: 'Kesehatan (Skor)' },
  { key: 'usia', label: 'Usia' },
];

const selectedXCriterion = ref('penghasilan');
const selectedYCriterion = ref('jumlah_tanggungan');

// Helper maps for categorical data to numerical scores
const kondisiMap: Record<string, number> = {
  'Sangat Baik': 5, 'Baik': 4, 'Cukup': 3, 'Kurang Baik': 2, 'Sangat Kurang Baik': 1
}
const pekerjaanMap: Record<string, number> = {
  'Pekerja Tetap': 5, 'Pekerja Kontrak': 4, 'Wiraswasta': 3, 'Tidak Bekerja': 1, 'Pensiunan': 2
}
const kesehatanMap: Record<string, number> = {
  'Sangat Baik': 5, 'Baik': 4, 'Cukup': 3, 'Kurang Baik': 2, 'Sangat Kurang Baik': 1
}

// Computed property untuk data Scatter Plot
const scatterPlotData = computed(() => {
  return allWarga.value.map(warga => {
    let xValue: number = 0;
    let yValue: number = 0;
    
    // Get X value
    if (selectedXCriterion.value === 'penghasilan') xValue = warga.penghasilan || 0;
    else if (selectedXCriterion.value === 'jumlah_tanggungan') xValue = warga.jumlah_tanggungan || 0;
    else if (selectedXCriterion.value === 'kondisi_tempat_tinggal_score') xValue = kondisiMap[warga.kondisi_tempat_tinggal] || 0;
    else if (selectedXCriterion.value === 'status_pekerjaan_score') xValue = pekerjaanMap[warga.status_pekerjaan] || 0;
    else if (selectedXCriterion.value === 'kesehatan_score') xValue = kesehatanMap[warga.kesehatan] || 0;
    else if (selectedXCriterion.value === 'usia') xValue = warga.usia || 0;
    
    // Get Y value
    if (selectedYCriterion.value === 'penghasilan') yValue = warga.penghasilan || 0;
    else if (selectedYCriterion.value === 'jumlah_tanggungan') yValue = warga.jumlah_tanggungan || 0;
    else if (selectedYCriterion.value === 'kondisi_tempat_tinggal_score') yValue = kondisiMap[warga.kondisi_tempat_tinggal] || 0;
    else if (selectedYCriterion.value === 'status_pekerjaan_score') yValue = pekerjaanMap[warga.status_pekerjaan] || 0;
    else if (selectedYCriterion.value === 'kesehatan_score') yValue = kesehatanMap[warga.kesehatan] || 0;
    else if (selectedYCriterion.value === 'usia') yValue = warga.usia || 0;
    
    return {
      x: xValue,
      y: yValue,
      clusterId: warga.clusterId ?? -1,
      label: warga.nama,
    };
  });
});

// Computed properties untuk legend dan summary cards
const totalDataDonut = computed(() => {
  return Object.values(clusterCounts.value).reduce((sum, count) => sum + count, 0);
})

const legendDataDonut = computed(() => {
  return clusterDefinitions.map(def => ({
    label: def.name,
    value: clusterCounts.value[def.id] || 0,
    color: def.id === 0 ? '#10B981' : def.id === 1 ? '#F59E0B' : def.id === 2 ? '#EF4444' : '#9CA3AF',
    percentage: totalDataDonut.value > 0 
      ? Math.round(((clusterCounts.value[def.id] || 0) / totalDataDonut.value) * 100)
      : 0
  }))
})

const cluster0Percentage = computed(() => {
  if (totalDataDonut.value === 0) return 0
  return Math.round(((clusterCounts.value[0] || 0) / totalDataDonut.value) * 100)
})

const effectiveness = computed(() => {
  if (totalDataDonut.value === 0) return 'N/A'
  const score = ((clusterCounts.value[0] || 0) * 1 + (clusterCounts.value[1] || 0) * 0.5) / totalDataDonut.value
  if (score >= 0.8) return 'Tinggi'
  if (score >= 0.6) return 'Sedang'
  return 'Rendah'
})

const fetchDashboardData = async () => {
  try {
    loading.value = true
    const snapshot = await getDocs(collection(useFirebaseHook.db, 'data_warga'))
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as {
      id: string
      nama: string
      nik: string
      penghasilan: number
      jumlah_tanggungan: number
      kondisi_tempat_tinggal: string
      status_pekerjaan: string
      kesehatan: string
      usia: number
      clusterId?: number
      rt?: number
      rw?: number
    }[]

    allWarga.value = data
    totalWarga.value = data.length
    
    clusterDefinitions.forEach(def => {
      clusterCounts.value[def.id] = 0;
    });
    
    data.forEach(w => {
      if (typeof w.clusterId === 'number' && clusterCounts.value[w.clusterId] !== undefined) {
        clusterCounts.value[w.clusterId]++;
      }
    })
  } catch (err) {
    console.error('Gagal mengambil data dashboard:', err)
  } finally {
    loading.value = false
  }
}

const pieChartLabels = computed(() => clusterDefinitions.map(def => def.name))
const pieChartData = computed(() => clusterDefinitions.map(def => clusterCounts.value[def.id] || 0))

// Enhanced Donut Chart Options dengan Tooltip
const donutChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      enabled: true,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: '#ffffff',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      callbacks: {
        title: function(context: any) {
          const index = context[0].dataIndex;
          return clusterDefinitions[index]?.name || `Klaster ${index}`;
        },
        label: function(context: any) {
          const value = context.parsed;
          const total = pieChartData.value.reduce((sum: number, val: number) => sum + val, 0);
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
          return [
            `Jumlah Warga: ${value.toLocaleString('id-ID')}`,
            `Persentase: ${percentage}%`,
            `Klaster: ${context.dataIndex}`
          ];
        }
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index'
  },
  elements: {
    arc: {
      borderWidth: 2,
      borderColor: '#ffffff',
      hoverBorderWidth: 3,
      hoverBorderColor: '#ffffff'
    }
  }
}));

const router = useRouter()

// Helper functions untuk enhanced styling
const getEnhancedCardClass = (clusterId: number) => {
  switch (clusterId) {
    case 0: return 'bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white'
    case 1: return 'bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700 text-white'
    case 2: return 'bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white'
    default: return 'bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700 text-white'
  }
}

const getTextColorClass = (clusterId: number) => {
  switch (clusterId) {
    case 0: return 'text-green-100'
    case 1: return 'text-yellow-100'
    case 2: return 'text-red-100'
    default: return 'text-gray-100'
  }
}

const getBadgeClass = (clusterId: number) => {
  switch (clusterId) {
    case 0: return 'bg-green-400/30 text-green-100 border border-green-400/50'
    case 1: return 'bg-yellow-400/30 text-yellow-100 border border-yellow-400/50'
    case 2: return 'bg-red-400/30 text-red-100 border border-red-400/50'
    default: return 'bg-gray-400/30 text-gray-100 border border-gray-400/50'
  }
}

const getIconBgClass = (clusterId: number) => {
  switch (clusterId) {
    case 0: return 'bg-green-400/30'
    case 1: return 'bg-yellow-400/30'
    case 2: return 'bg-red-400/30'
    default: return 'bg-gray-400/30'
  }
}

const getPriorityDotClass = (clusterId: number) => {
  switch (clusterId) {
    case 0: return 'bg-green-300 animate-pulse'
    case 1: return 'bg-yellow-300 animate-pulse'
    case 2: return 'bg-red-300 animate-pulse'
    default: return 'bg-gray-300'
  }
}

onMounted(fetchDashboardData)

definePageMeta({
  title: 'Dashboard K-means Clustering'
})
</script>

<template>
  <ClientOnly>
    <!-- Background Warm Neutral -->
    <div class="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-neutral-100">
      <!-- Main content wrapper with max-width and centering -->
      <div class="space-y-6 p-6 max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Dashboard K-means Clustering</h1>
            <p class="text-gray-600 mt-1">Sistem Pendukung Keputusan - Analisis Klaster Bantuan</p>
          </div>
          <div class="text-right bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-amber-200/50 shadow-sm">
            <p class="text-xs text-gray-500 uppercase tracking-wide">Last updated</p>
            <p class="text-sm font-semibold text-gray-700">{{ new Date().toLocaleString('id-ID') }}</p>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center h-64">
          <div class="flex flex-col items-center gap-4">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-amber-200 border-t-amber-600"></div>
            <p class="text-gray-500 text-sm">Memuat data dashboard...</p>
          </div>
        </div>

        <template v-else>
          <!-- Enhanced Statistics Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Total Warga Card -->
            <Card class="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0">
              <CardContent class="p-6">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <p class="text-blue-100 text-sm font-medium mb-1">Total Warga</p>
                    <h3 class="text-3xl font-bold mb-2">{{ totalWarga.toLocaleString('id-ID') }}</h3>
                    <div class="flex items-center text-blue-100 text-xs">
                      <div class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                      <span>Data terkini</span>
                    </div>
                  </div>
                  <div class="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                    <Users class="w-7 h-7" />
                  </div>
                </div>
                <div class="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
                <div class="absolute -bottom-2 -left-2 w-16 h-16 bg-white/5 rounded-full"></div>
              </CardContent>
            </Card>

            <!-- Cluster Cards -->
            <Card 
              v-for="def in clusterDefinitions"
              :key="def.id"
              class="relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0"
              :class="getEnhancedCardClass(def.id)"
            >
              <CardContent class="p-6">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <p :class="getTextColorClass(def.id)" class="text-sm font-medium">
                        {{ def.name }}
                      </p>
                      <div
                        :class="getBadgeClass(def.id)"
                        class="px-2 py-0.5 rounded-full text-xs font-medium"
                      >
                        Klaster {{ def.id }}
                      </div>
                    </div>
                    <h3 class="text-3xl font-bold mb-2 text-white">
                      {{ (clusterCounts[def.id] || 0).toLocaleString('id-ID') }}
                    </h3>
                    <div class="flex items-center justify-between">
                      <p :class="getTextColorClass(def.id)" class="text-sm font-medium">
                        {{ totalWarga > 0 ? ((clusterCounts[def.id] || 0) / totalWarga * 100).toFixed(1) + '%' : '0.0%' }}
                      </p>
                      <div class="w-16 bg-white/20 rounded-full h-1.5 ml-2">
                        <div
                          class="bg-white rounded-full h-1.5 transition-all duration-500"
                          :style="{ width: totalWarga > 0 ? ((clusterCounts[def.id] || 0) / totalWarga * 100) + '%' : '0%' }"
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div :class="getIconBgClass(def.id)" class="p-3 rounded-xl backdrop-blur-sm">
                    <component
                      :is="def.id === 0 ? CheckCircle : def.id === 1 ? Clock : XCircle"
                      class="w-7 h-7 text-white"
                    />
                  </div>
                </div>
                <div class="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full"></div>
                <div class="absolute -bottom-2 -left-2 w-12 h-12 bg-white/5 rounded-full"></div>
                <div class="absolute top-2 right-2">
                  <div
                    :class="getPriorityDotClass(def.id)"
                    class="w-3 h-3 rounded-full"
                  ></div>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Main Content Grid: RTRW Breakdown Chart (left) and Stacked Components (right) -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Left Column: RTRW Breakdown Chart -->
            <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200/50">
              <RTRWBreakdownChart :allWarga="allWarga" @refresh-dashboard="fetchDashboardData" />
            </div>
            
            <!-- Right Column: Stacked components -->
            <div class="flex flex-col gap-6">
              <!-- Dashboard Enhancements (Quick Action) -->
              <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200/50">
                <DashboardEnhancements />
              </div>
              
              <!-- Cluster Characteristics Table -->
              <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200/50">
                <ClusterCharacteristicsTable :allWarga="allWarga" />
              </div>
              
              <!-- Modern Donut Chart Card -->
              <Card class="bg-white/90 backdrop-blur-sm shadow-lg border border-amber-200/50">
                <CardHeader>
                  <CardTitle class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <div class="w-2 h-2 bg-amber-500 rounded-full"></div>
                    Distribusi Klaster
                  </CardTitle>
                  <p class="text-sm text-gray-600">Persentase distribusi warga per klaster</p>
                </CardHeader>
                <CardContent class="p-6">
                  <!-- Modern Donut Chart Container -->
                  <div class="relative">
                    <div class="h-64 flex items-center justify-center">
                      <PieChart
                        :labels="pieChartLabels"
                        :data="pieChartData"
                        :options="donutChartOptions"
                      />
                    </div>
                    
                    <!-- Center Text -->
                    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div class="text-center">
                        <div class="text-2xl font-bold text-gray-800">{{ totalWarga }}</div>
                        <div class="text-sm text-gray-500">Total Warga</div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Modern Legend -->
                  <div class="mt-6 space-y-3">
                    <div
                      v-for="(legend, index) in legendDataDonut"
                      :key="index"
                      class="flex items-center justify-between p-3 rounded-lg bg-gray-50/80 hover:bg-gray-100/80 transition-colors"
                    >
                      <div class="flex items-center gap-3">
                        <div
                          class="w-4 h-4 rounded-full flex-shrink-0"
                          :style="{ backgroundColor: legend.color }"
                        ></div>
                        <span class="text-sm font-medium text-gray-700">{{ legend.label }}</span>
                      </div>
                      <div class="text-right">
                        <div class="text-sm font-semibold text-gray-800">{{ legend.value }}</div>
                        <div class="text-xs text-gray-500">{{ legend.percentage }}%</div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Summary Stats -->
                  <div class="mt-6 pt-4 border-t border-gray-200">
                    <div class="grid grid-cols-2 gap-4 text-center">
                      <div class="p-3 bg-green-50 rounded-lg">
                        <div class="text-lg font-bold text-green-600">{{ cluster0Percentage }}%</div>
                        <div class="text-xs text-green-600">Prioritas Rendah</div>
                      </div>
                      <div class="p-3 bg-blue-50 rounded-lg">
                        <div class="text-lg font-bold text-blue-600">{{ effectiveness }}</div>
                        <div class="text-xs text-blue-600">Efektivitas</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <!-- Scatter Plot - Full Width (tetap di luar grid utama untuk full width) -->
          <Card class="bg-white/90 backdrop-blur-sm shadow-lg border border-amber-200/50 w-full">
            <CardHeader>
              <CardTitle class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <span class="text-lg font-semibold text-gray-800">Visualisasi Klaster (Scatter Plot)</span>
                <div class="flex flex-col sm:flex-row gap-2">
                  <select
                    v-model="selectedXCriterion"
                    class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-white"
                  >
                    <option v-for="criterion in availableCriteria" :key="criterion.key" :value="criterion.key">
                      {{ criterion.label }}
                    </option>
                  </select>
                  <select
                    v-model="selectedYCriterion"
                    class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-white"
                  >
                    <option v-for="criterion in availableCriteria" :key="criterion.key" :value="criterion.key">
                      {{ criterion.label }}
                    </option>
                  </select>
                </div>
              </CardTitle>
              <p class="text-sm text-gray-600 mt-2">Visualisasi data warga berdasarkan dua kriteria yang dipilih, diwarnai sesuai klaster.</p>
            </CardHeader>
            <CardContent>
              <div class="h-96">
                <ScatterPlot
                  :dataPoints="scatterPlotData"
                  :x-label="availableCriteria.find((c: any) => c.key === selectedXCriterion)?.label || ''"
                  :y-label="availableCriteria.find((c: any) => c.key === selectedYCriterion)?.label || ''"
                />
              </div>
            </CardContent>
          </Card>
        </template>
      </div>
    </div>
  </ClientOnly>
</template>
