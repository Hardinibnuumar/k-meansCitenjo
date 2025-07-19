<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { useRouter } from 'vue-router'
import LineChart from '@/components/LineChart.vue'
import RTRWBreakdownChart from '@/components/RTRWBreakdownChart.vue'
import PieChart from '~/components/PieChart.vue'
import SmartCriteriaWeights from '@/components/SmartCriteriaWeights.vue'
import { Users, CheckCircle, Clock, XCircle } from 'lucide-vue-next'
import { useFirebase } from '~/composables/useFirebase'
import DashboardEnhancements from '@/components/DashboardEnhancements.vue'
import ClusterCharacteristicsTable from '@/components/ClusterCharacteristicsTable.vue' // Import komponen baru
import { definePageMeta } from '#imports'
import { getClusterDefinition, clusterDefinitions } from '~/utils/clusterDefinitions' // Import the new utility

// Dapatkan instance db dari composable di tingkat teratas script setup
const { db } = useFirebase()

// Terapkan middleware 'auth' ke halaman ini
definePageMeta({
  title: 'Dashboard K-means Clustering' // Tambahkan judul halaman
})

const allWarga = ref<any[]>([])
const totalWarga = ref(0)
const clusterCounts = ref<Record<number, number>>({ 0: 0, 1: 0, 2: 0 }); // Dynamic counts
const loading = ref(true)

// Computed properties untuk legend dan summary cards
const totalDataDonut = computed(() => {
  return Object.values(clusterCounts.value).reduce((sum, count) => sum + count, 0);
})

const legendDataDonut = computed(() => {
  return clusterDefinitions.map(def => ({
    label: def.name,
    value: clusterCounts.value[def.id] || 0,
    // Menggunakan warna yang lebih sederhana untuk chart, bisa disesuaikan
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
  // Contoh interpretasi efektivitas berdasarkan klaster:
  // Misal, semakin banyak di Klaster 0 (Prioritas Rendah), semakin 'efektif' bantuan sebelumnya
  const score = ((clusterCounts.value[0] || 0) * 1 + (clusterCounts.value[1] || 0) * 0.5) / totalDataDonut.value
  if (score >= 0.8) return 'Tinggi'
  if (score >= 0.6) return 'Sedang'
  return 'Rendah'
})

// Fetch data dari Firebase
const fetchDashboardData = async () => {
  try {
    loading.value = true
    const snapshot = await getDocs(collection(db, 'data_warga'))
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
      kesehatan: string // Added
      usia: number // Added
      clusterId?: number
      rt?: number
      rw?: number
    }[]

    allWarga.value = data
    totalWarga.value = data.length
    
    // Reset counts and re-calculate based on actual cluster definitions
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

// Computed untuk data PieChart
const pieChartLabels = computed(() => clusterDefinitions.map(def => def.name))

const pieChartData = computed(() => clusterDefinitions.map(def => clusterCounts.value[def.id] || 0))

onMounted(fetchDashboardData)
</script>

<template>
  <ClientOnly> <!-- Ini adalah ClientOnly yang penting -->
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
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card class="p-6 bg-blue-500 text-white"> <!-- Menggunakan warna solid untuk konsistensi -->
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
          
          <!-- Menggunakan kelas warna langsung dari clusterDefinitions -->
          <Card v-for="def in clusterDefinitions" :key="def.id" :class="[def.bgColorClass, 'p-6', def.colorClass.replace('-800', '-700')]">
            <div class="flex items-center justify-between">
              <div>
                <p :class="def.colorClass.replace('-800', '-600')">{{ def.name }}</p>
                <h3 class="text-3xl font-bold">{{ clusterCounts[def.id] || 0 }}</h3>
                <p :class="def.colorClass.replace('-800', '-600')">{{ totalWarga > 0 ? ((clusterCounts[def.id] || 0) / totalWarga * 100).toFixed(1) + '%' : '0.0%' }}</p>
              </div>
              <div :class="[def.bgColorClass.replace('-100', '-400'), 'w-12 h-12 rounded-full flex items-center justify-center']">
                <component :is="def.id === 0 ? CheckCircle : def.id === 1 ? Clock : XCircle" class="w-6 h-6" />
              </div>
            </div>
          </Card>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left Column - Charts -->
          <div class="lg:col-span-2 space-y-6">
            <!-- RT/RW Breakdown Chart -->
            <RTRWBreakdownChart :allWarga="allWarga" @refresh-dashboard="fetchDashboardData" />
            
            <!-- Distribution Chart -->
            <!-- <Card class="p-6">
              <CardHeader>
                <CardTitle>Distribusi Klaster</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="h-64">
                  <DonutChart
                    :labels="pieChartLabels"
                    :data="pieChartData"
                  />
                </div>
              </CardContent>
            </Card> -->
          </div>

          <!-- Right Column - Enhancements -->
          <div class="space-y-6">
            <DashboardEnhancements />
            <!-- Komponen baru untuk karakteristik klaster -->
            <ClusterCharacteristicsTable :allWarga="allWarga" />
          </div>
        </div>
      </template>
    </div>
  </ClientOnly>
</template>
