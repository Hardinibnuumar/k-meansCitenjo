<template>
  <Card class="p-4">
    <CardHeader>
      <CardTitle class="text-lg flex items-center gap-2">
        <Grid3X3 class="w-5 h-5" />
        Karakteristik Klaster
      </CardTitle>
      <p class="text-sm text-gray-600">Rata-rata nilai kriteria per klaster.</p>
    </CardHeader>
    <CardContent>
      <div v-if="loading" class="flex justify-center items-center h-32">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
      <div v-else-if="clusterCharacteristics.length === 0" class="text-center text-gray-500 py-4">
        Tidak ada data klaster untuk ditampilkan. Jalankan clustering terlebih dahulu.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Klaster</th>
              <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penghasilan (Rata-rata)</th>
              <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggungan (Rata-rata)</th>
              <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kondisi Tempat Tinggal (Rata-rata Skor)</th>
              <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Pekerjaan (Rata-rata Skor)</th>
              <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kesehatan (Rata-rata Skor)</th>
              <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usia (Rata-rata)</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="cluster in clusterCharacteristics" :key="cluster.id">
              <td class="px-3 py-2 whitespace-nowrap">
                <span :class="getClusterDefinition(cluster.id).bgColorClass" class="px-2 py-1 rounded-full text-xs font-medium" :style="{ color: getClusterDefinition(cluster.id).colorClass }">
                  {{ getClusterDefinition(cluster.id).name }}
                </span>
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(cluster.avgPenghasilan) }}</td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{{ cluster.avgTanggungan.toFixed(1) }}</td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{{ cluster.avgKondisi.toFixed(2) }}</td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{{ cluster.avgPekerjaan.toFixed(2) }}</td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{{ cluster.avgKesehatan.toFixed(2) }}</td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{{ cluster.avgUsia.toFixed(1) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Grid3X3 } from 'lucide-vue-next'
import { getClusterDefinition, clusterDefinitions } from '~/utils/clusterDefinitions'

const props = defineProps<{
  allWarga: any[] // Menerima semua data warga dari parent
}>()

const loading = ref(true)
const clusterCharacteristics = ref<any[]>([])

const kondisiMap: Record<string, number> = {
  'Sangat Baik': 5, 'Baik': 4, 'Cukup': 3, 'Kurang Baik': 2, 'Sangat Kurang Baik': 1
}
const pekerjaanMap: Record<string, number> = {
  'Pekerja Tetap': 5, 'Pekerja Kontrak': 4, 'Wiraswasta': 3, 'Tidak Bekerja': 1, 'Pensiunan': 2
}
const kesehatanMap: Record<string, number> = {
  'Sangat Baik': 5, 'Baik': 4, 'Cukup': 3, 'Kurang Baik': 2, 'Sangat Kurang Baik': 1
}

const calculateClusterCharacteristics = () => {
  loading.value = true
  const clusterData: Record<number, {
    penghasilan: number[],
    jumlah_tanggungan: number[],
    kondisi_tempat_tinggal: number[],
    status_pekerjaan: number[],
    kesehatan: number[],
    usia: number[],
    count: number
  }> = {}

  // Inisialisasi untuk setiap klaster yang mungkin
  clusterDefinitions.forEach(def => {
    clusterData[def.id] = {
      penghasilan: [],
      jumlah_tanggungan: [],
      kondisi_tempat_tinggal: [],
      status_pekerjaan: [],
      kesehatan: [],
      usia: [],
      count: 0
    }
  })

  props.allWarga.forEach(warga => {
    if (typeof warga.clusterId === 'number' && clusterData[warga.clusterId]) {
      const cluster = clusterData[warga.clusterId]
      cluster.penghasilan.push(warga.penghasilan || 0)
      cluster.jumlah_tanggungan.push(warga.jumlah_tanggungan || 0)
      cluster.kondisi_tempat_tinggal.push(kondisiMap[warga.kondisi_tempat_tinggal] || 0)
      cluster.status_pekerjaan.push(pekerjaanMap[warga.status_pekerjaan] || 0)
      cluster.kesehatan.push(kesehatanMap[warga.kesehatan] || 0)
      cluster.usia.push(warga.usia || 0)
      cluster.count++
    }
  })

  clusterCharacteristics.value = clusterDefinitions.map(def => {
    const data = clusterData[def.id]
    const count = data.count || 1 // Hindari pembagian nol

    return {
      id: def.id,
      avgPenghasilan: data.penghasilan.reduce((sum, val) => sum + val, 0) / count,
      avgTanggungan: data.jumlah_tanggungan.reduce((sum, val) => sum + val, 0) / count,
      avgKondisi: data.kondisi_tempat_tinggal.reduce((sum, val) => sum + val, 0) / count,
      avgPekerjaan: data.status_pekerjaan.reduce((sum, val) => sum + val, 0) / count,
      avgKesehatan: data.kesehatan.reduce((sum, val) => sum + val, 0) / count,
      avgUsia: data.usia.reduce((sum, val) => sum + val, 0) / count,
    }
  }).filter(cluster => !isNaN(cluster.avgPenghasilan)); // Filter klaster yang tidak memiliki data

  loading.value = false
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

// Watch for changes in allWarga prop to recalculate characteristics
watch(() => props.allWarga, (newVal) => {
  if (newVal && newVal.length > 0) {
    calculateClusterCharacteristics()
  } else {
    clusterCharacteristics.value = []
    loading.value = false
  }
}, { immediate: true, deep: true })
</script>
