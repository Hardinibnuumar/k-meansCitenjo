<script setup lang="ts">
import { ref, onMounted, computed } from 'vue' // Tambahkan 'computed'
import { db } from '~/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import RTRWBreakdownChart from '@/components/RTRWBreakdownChart.vue'
import DashboardEnhancements from '@/components/DashboardEnhancements.vue' // Path diperbaiki
import PieChart from '@/components/PieChart.vue'
import LineChart from '@/components/LineChart.vue'
import { Users, CheckCircle, Clock, XCircle } from 'lucide-vue-next' // Import icons

const allWarga = ref<any[]>([])
const totalWarga = ref(0)
const cluster0Count = ref(0) // Klaster 0 (misal: Prioritas Rendah)
const cluster1Count = ref(0) // Klaster 1 (misal: Prioritas Menengah)
const cluster2Count = ref(0) // Klaster 2 (misal: Prioritas Tinggi)
const loading = ref(true)

// Fungsi untuk mendapatkan kelas CSS berdasarkan ID Klaster
const getClusterClass = (clusterId?: number) => {
  if (clusterId === undefined) return 'bg-gray-100 text-gray-800';
  switch (clusterId) {
    case 2: return 'bg-red-100 text-red-800'; // Klaster prioritas tinggi (misal: butuh perhatian)
    case 1: return 'bg-yellow-100 text-yellow-800'; // Klaster prioritas menengah
    case 0: return 'bg-green-100 text-green-800'; // Klaster prioritas rendah (misal: layak)
    default: return 'bg-gray-100 text-gray-800';
  }
}

// Fungsi untuk mendapatkan teks berdasarkan ID Klaster
const getClusterText = (clusterId?: number) => {
  if (clusterId === undefined) return '-';
  switch (clusterId) {
    case 2: return 'Klaster 2 (Prioritas Tinggi)';
    case 1: return 'Klaster 1 (Prioritas Menengah)';
    case 0: return 'Klaster 0 (Prioritas Rendah)';
    default: return `Klaster ${clusterId}`;
  }
}

// Fetch data dari Firebase
const fetchDashboardData = async () => {
  try {
    loading.value = true
    const snapshot = await getDocs(collection(db, 'data_warga'))
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[]

    allWarga.value = data
    totalWarga.value = data.length

    // Reset counts
    cluster0Count.value = 0
    cluster1Count.value = 0
    cluster2Count.value = 0

    // Hitung jumlah warga per klaster
    data.forEach(w => {
      if (w.clusterId === 0) {
        cluster0Count.value++
      } else if (w.clusterId === 1) {
        cluster1Count.value++
      } else if (w.clusterId === 2) {
        cluster2Count.value++
      }
    })

  } catch (err) {
    console.error('Gagal mengambil data dashboard:', err)
  } finally {
    loading.value = false
  }
}

// Computed untuk data PieChart
const pieChartLabels = computed(() => [
  getClusterText(0),
  getClusterText(1),
  getClusterText(2)
])

const pieChartData = computed(() => [
  cluster0Count.value,
  cluster1Count.value,
  cluster2Count.value
])

onMounted(fetchDashboardData)
</script>

<template>
  <div class="space-y-6 p-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Dashboard K-means Clustering</h1>
        <p class="text-gray-600">Sistem Pendukung Keputusan - Analisis Klaster Bantuan</p>
      </div>
      <div class="text-right">
        <p class="text-sm text-gray-500">Last updated</p>
        <p class="text-sm font-medium">{{ new Date().toLocaleString('id-ID') }}</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <template v-else>
      <!-- Summary Stats (berdasarkan Klaster) -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card class="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100">Total Warga</p>
              <h3 class="text-3xl font-bold">{{ totalWarga }}</h3>
            </div>
            <div class="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center">
              <Users class="w-6 h-6" />
            </div>
          </div>
        </Card>
        
        <Card class="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100">{{ getClusterText(0) }}</p>
              <h3 class="text-3xl font-bold">{{ cluster0Count }}</h3>
              <p class="text-sm text-green-100">{{ ((cluster0Count / totalWarga) * 100).toFixed(1) }}%</p>
            </div>
            <div class="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
              <CheckCircle class="w-6 h-6" />
            </div>
          </div>
        </Card>
        
        <Card class="p-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-yellow-100">{{ getClusterText(1) }}</p>
              <h3 class="text-3xl font-bold">{{ cluster1Count }}</h3>
              <p class="text-sm text-yellow-100">{{ ((cluster1Count / totalWarga) * 100).toFixed(1) }}%</p>
            </div>
            <div class="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
              <Clock class="w-6 h-6" />
            </div>
          </div>
        </Card>
        
        <Card class="p-6 bg-gradient-to-r from-red-500 to-red-600 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-red-100">{{ getClusterText(2) }}</p>
              <h3 class="text-3xl font-bold">{{ cluster2Count }}</h3>
              <p class="text-sm text-red-100">{{ ((cluster2Count / totalWarga) * 100).toFixed(1) }}%</p>
            </div>
            <div class="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center">
              <XCircle class="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Charts -->
        <div class="lg:col-span-2 space-y-6">
          <!-- RT/RW Breakdown Chart -->
          <RTRWBreakdownChart :allWarga="allWarga" />
          
          <!-- Distribution Chart -->
          <Card class="p-6">
            <CardHeader>
              <CardTitle>Distribusi Klaster</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="h-64">
                <PieChart
                  :labels="pieChartLabels"
                  :data="pieChartData"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Right Column - Enhancements -->
        <div class="space-y-6">
          <DashboardEnhancements />
        </div>
      </div>
    </template>
  </div>
</template>
