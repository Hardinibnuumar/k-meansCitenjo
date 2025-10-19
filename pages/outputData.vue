<template>
<div class="p-6">
  <h1 class="text-3xl font-bold text-gray-900 mb-6">Output Data Warga (K-means Clustering)</h1>

  <div class="bg-white shadow-md rounded-lg p-6">
    <!-- Search and Action Buttons -->
    <div class="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
      <div class="flex gap-2 items-center w-full md:w-auto">
        <Input v-model="searchQuery" placeholder="Cari nama..." class="w-full md:w-[250px]" />
        <div class="flex items-center gap-2">
          <label for="numClusters" class="text-sm font-medium text-gray-700">Jumlah Klaster (K):</label>
          <Input id="numClusters" v-model.number="numClusters" type="number" min="2" max="10" class="w-20" />
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <Button @click="sortBy = 'cluster'" :variant="sortBy === 'cluster' ? 'default' : 'outline'">Urutkan Klaster</Button>
        <Button @click="sortBy = 'nama'" :variant="sortBy === 'nama' ? 'default' : 'outline'">Urutkan Nama</Button>
        <Button @click="runKMeansClustering" :disabled="isLoading">
          {{ isLoading ? 'Memuat...' : 'Jalankan Clustering' }}
        </Button>
        <Button variant="outline" @click="exportToExcel">Export ke Excel</Button>
        <Button variant="outline" @click="exportToPDF">Export ke PDF</Button>
      </div>
    </div>

    <!-- Data Table -->
    <div class="overflow-x-auto">
      <Table class="min-w-full divide-y divide-gray-200">
        <TableHeader class="bg-gray-50">
          <TableRow>
            <TableHead class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</TableHead>
            <TableHead class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIK</TableHead>
            <TableHead class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penghasilan</TableHead>
            <TableHead class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggungan</TableHead>
            <TableHead class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RT</TableHead>
            <TableHead class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RW</TableHead>
            <TableHead class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kondisi</TableHead>
            <TableHead class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pekerjaan</TableHead>
            <TableHead class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kesehatan</TableHead>
            <TableHead class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usia</TableHead>
            <TableHead class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Klaster</TableHead>
            <TableHead class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody class="bg-white divide-y divide-gray-200">
          <TableRow v-for="warga in filteredWarga" :key="warga.id">
            <TableCell class="px-3 py-2 text-sm font-medium text-gray-900">{{ warga.nama }}</TableCell>
            <TableCell class="px-3 py-2 text-sm text-gray-500">{{ warga.nik }}</TableCell>
            <TableCell class="px-3 py-2 text-sm text-gray-500">{{ formatCurrency(warga.penghasilan) }}</TableCell>
            <TableCell class="px-3 py-2 text-sm text-gray-500">{{ warga.jumlah_tanggungan }}</TableCell>
            <TableCell class="px-3 py-2 text-sm text-gray-500">{{ warga.rt }}</TableCell>
            <TableCell class="px-3 py-2 text-sm text-gray-500">{{ warga.rw }}</TableCell>
            <TableCell class="px-3 py-2 text-sm text-gray-500">{{ warga.kondisi_tempat_tinggal }}</TableCell>
            <TableCell class="px-3 py-2 text-sm text-gray-500">{{ warga.status_pekerjaan }}</TableCell>
            <TableCell class="px-3 py-2 text-sm text-gray-500">{{ warga.kesehatan }}</TableCell>
            <TableCell class="px-3 py-2 text-sm text-gray-500">{{ warga.usia }}</TableCell>
            <TableCell class="px-3 py-2 text-sm text-center">
              <span
                v-if="warga.clusterId !== undefined"
                :class="getClusterDefinition(warga.clusterId).bgColorClass"
                class="px-2 py-1 rounded-md text-xs font-medium"
                :style="{ color: getClusterDefinition(warga.clusterId).colorClass }"
              >
                {{ getClusterDefinition(warga.clusterId).name }}
              </span>
              <span v-else class="text-muted-foreground">-</span>
            </TableCell>
            <TableCell class="px-3 py-2 text-right text-sm font-medium whitespace-nowrap">
              <Button variant="ghost" size="sm" class="text-blue-600 hover:text-blue-900" @click="editWarga(warga)">Edit</Button>
              <Button variant="ghost" size="sm" class="text-red-600 hover:text-red-900" @click="deleteWarga(warga)">Hapus</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>

  <!-- Edit Modal -->
  <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-xl shadow-md w-full max-w-xl space-y-4">
      <h2 class="text-lg font-semibold mb-4">Edit Data Warga</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium">Nama</label>
          <Input v-model="selectedWarga.nama" />
        </div>
        <div>
          <label class="block text-sm font-medium">NIK</label>
          <Input v-model="selectedWarga.nik" />
        </div>
        <div>
          <label class="block text-sm font-medium">Penghasilan</label>
          <Input v-model.number="selectedWarga.penghasilan" type="number" />
        </div>
        <div>
          <label class="block text-sm font-medium">Tanggungan</label>
          <Input v-model.number="selectedWarga.jumlah_tanggungan" type="number" />
        </div>
        <div>
          <label class="block text-sm font-medium">RT</label>
          <Input v-model="selectedWarga.rt" />
        </div>
        <div>
          <label class="block text-sm font-medium">RW</label>
          <Input v-model="selectedWarga.rw" />
        </div>
        <div>
          <label class="block text-sm font-medium">Kondisi Tempat Tinggal</label>
          <Input v-model="selectedWarga.kondisi_tempat_tinggal" />
        </div>
        <div>
          <label class="block text-sm font-medium">Status Pekerjaan</label>
          <Input v-model="selectedWarga.status_pekerjaan" />
        </div>
        <div>
          <label class="block text-sm font-medium">Kesehatan</label>
          <Input v-model="selectedWarga.kesehatan" />
        </div>
        <div>
          <label class="block text-sm font-medium">Usia</label>
          <Input v-model.number="selectedWarga.usia" type="number" />
        </div>
      </div>
      <div class="flex justify-end gap-2 pt-4">
        <Button variant="outline" size="sm" @click="showEditModal = false">
          Batal
        </Button>
        <Button variant="default" @click="simpanPerubahan">Simpan</Button>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, reactive } from 'vue'
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { useRouter } from 'vue-router'
import * as XLSX from 'xlsx'
import { definePageMeta } from '#imports'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { useFirebase } from '~/composables/useFirebase'
import { kmeans } from 'ml-kmeans'
import { getClusterDefinition } from '~/utils/clusterDefinitions' // Import the new utility
import { useActivityLogger } from '~/composables/useActivityLogger'

const router = useRouter()
const { db } = useFirebase()
const { logActivity } = useActivityLogger()

const showEditModal = ref(false)
const selectedWarga = reactive<any>({
  id: '',
  nama: '',
  nik: '',
  penghasilan: 0,
  jumlah_tanggungan: 0,
  kondisi_tempat_tinggal: '',
  status_pekerjaan: '',
  kesehatan: '',
  usia: 0,
  rt: '',
  rw: ''
})

const editWarga = (warga: any) => {
  Object.assign(selectedWarga, warga)
  showEditModal.value = true
}

const simpanPerubahan = async () => {
  if (!selectedWarga.id) return
  try {
    const wargaRef = doc(db, 'data_warga', selectedWarga.id)
    await updateDoc(wargaRef, {
      nama: selectedWarga.nama,
      nik: selectedWarga.nik,
      penghasilan: selectedWarga.penghasilan,
      jumlah_tanggungan: selectedWarga.jumlah_tanggungan,
      kondisi_tempat_tinggal: selectedWarga.kondisi_tempat_tinggal,
      status_pekerjaan: selectedWarga.status_pekerjaan,
      kesehatan: selectedWarga.kesehatan,
      usia: selectedWarga.usia,
      rt: selectedWarga.rt,
      rw: selectedWarga.rw
    })
    showEditModal.value = false
    await fetchData()
    alert('✅ Data berhasil diperbarui!')

    // Log aktivitas
    await logActivity(
      'data_updated',
      'Data Warga Diperbarui',
      `Data warga ${selectedWarga.nama} (NIK: ${selectedWarga.nik}) berhasil diperbarui.`,
      'activity'
    )
  } catch (error) {
    alert('❌ Gagal memperbarui data: ' + error)
  }
}

const deleteWarga = async (warga: any) => {
  if (confirm(`Apakah Anda yakin ingin menghapus data ${warga.nama} (NIK: ${warga.nik})?`)) {
    try {
      await deleteDoc(doc(db, 'data_warga', warga.id))
      await fetchData()
      alert('✅ Data berhasil dihapus!')

      // Log aktivitas
      await logActivity(
        'data_deleted',
        'Data Warga Dihapus',
        `Data warga ${warga.nama} (NIK: ${warga.nik}) telah dihapus.`,
        'activity'
      )
    } catch (error) {
      alert('❌ Gagal menghapus data: ' + error)
    }
  }
}

const dataWarga = ref<any[]>([])
const isLoading = ref(false)
const searchQuery = ref('')
const sortBy = ref<'nama' | 'cluster'>('cluster')
const numClusters = ref(2)

const fetchData = async () => {
  isLoading.value = true
  const querySnapshot = await getDocs(collection(db, 'data_warga'))
  dataWarga.value = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
  isLoading.value = false
}

// Fungsi untuk pra-pemrosesan data
const preprocessData = (data: any[]) => {
  const kondisiMap: Record<string, number> = {
    'Sangat Baik': 5, 'Baik': 4, 'Cukup': 3, 'Kurang Baik': 2, 'Sangat Kurang Baik': 1
  }
  const pekerjaanMap: Record<string, number> = {
    'Pekerja Tetap': 5, 'Pekerja Kontrak': 4, 'Wiraswasta': 3, 'Tidak Bekerja': 1, 'Pensiunan': 2
  }
  const kesehatanMap: Record<string, number> = {
    'Sangat Baik': 5, 'Baik': 4, 'Cukup': 3, 'Kurang Baik': 2, 'Sangat Kurang Baik': 1
  }

  const penghasilanValues = data.map(w => w.penghasilan || 0);
  const tanggunganValues = data.map(w => w.jumlah_tanggungan || 0);
  const usiaValues = data.map(w => w.usia || 0);

  const minPenghasilan = penghasilanValues.length > 0 ? Math.min(...penghasilanValues) : 0;
  const maxPenghasilan = penghasilanValues.length > 0 ? Math.max(...penghasilanValues) : 1;
  const minTanggungan = tanggunganValues.length > 0 ? Math.min(...tanggunganValues) : 0;
  const maxTanggungan = tanggunganValues.length > 0 ? Math.max(...tanggunganValues) : 1;
  const minUsia = usiaValues.length > 0 ? Math.min(...usiaValues) : 0;
  const maxUsia = usiaValues.length > 0 ? Math.max(...usiaValues) : 1;

  const processedData = data.map(w => {
    const penghasilan = w.penghasilan || 0;
    const tanggungan = w.jumlah_tanggungan || 0;
    const kondisi = kondisiMap[w.kondisi_tempat_tinggal] || 0;
    const pekerjaan = pekerjaanMap[w.status_pekerjaan] || 0;
    const kesehatan = kesehatanMap[w.kesehatan] || 0;
    const usia = w.usia || 0;

    const normalizedPenghasilan = (maxPenghasilan - minPenghasilan) > 0 ? (penghasilan - minPenghasilan) / (maxPenghasilan - minPenghasilan) : 0;
    const normalizedTanggungan = (maxTanggungan - minTanggungan) > 0 ? (tanggungan - minTanggungan) / (maxTanggungan - minTanggungan) : 0;
    const normalizedKondisi = kondisi / 5;
    const normalizedPekerjaan = pekerjaan / 5;
    const normalizedKesehatan = kesehatan / 5;
    const normalizedUsia = (maxUsia - minUsia) > 0 ? (usia - minUsia) / (maxUsia - minUsia) : 0;

    return [
      normalizedPenghasilan,
      normalizedTanggungan,
      normalizedKondisi,
      normalizedPekerjaan,
      normalizedKesehatan,
      normalizedUsia
    ];
  });
  return processedData;
};

const runKMeansClustering = async () => {
  isLoading.value = true;
  if (dataWarga.value.length === 0) {
    alert('Tidak ada data warga untuk di-cluster.');
    isLoading.value = false;
    return;
  }

  try {
    const dataset = preprocessData(dataWarga.value);
    
    const result = kmeans(dataset, numClusters.value, {
      maxIterations: 100,
    });

    for (let i = 0; i < dataWarga.value.length; i++) {
      const warga = dataWarga.value[i];
      const clusterId = result.clusters[i];
      
      const wargaRef = doc(db, 'data_warga', warga.id);
      await updateDoc(wargaRef, { clusterId: clusterId });
      warga.clusterId = clusterId;
    }
    alert(`✅ Clustering berhasil dengan ${numClusters.value} klaster & ID klaster tersimpan!`);

    // Log aktivitas
    await logActivity(
      'clustering_run',
      'Clustering Berhasil Dijalankan',
      `K-means clustering berhasil dijalankan dengan ${numClusters.value} klaster.`,
      'notification' // Ini bisa jadi notifikasi penting
    )
  } catch (error) {
    console.error('Gagal menjalankan clustering:', error);
    alert('❌ Gagal menjalankan clustering: ' + error);
  } finally {
    isLoading.value = false;
  }
};

const filteredWarga = computed(() => {
  const filtered = dataWarga.value.filter(w =>
    w.nama.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
  if (sortBy.value === 'cluster') {
    return [...filtered].sort((a, b) => (a.clusterId ?? 99) - (b.clusterId ?? 99))
  } else {
    return [...filtered].sort((a, b) => a.nama.localeCompare(b.nama))
  }
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

const exportToExcel = async () => {
  if (process.client) {
    const fileSaver = await import('file-saver')
    const saveAs = fileSaver.saveAs
    const wsData = dataWarga.value.map((w: any) => ({
      Nama: w.nama,
      NIK: w.nik,
      Penghasilan: w.penghasilan,
      Tanggungan: w.jumlah_tanggungan,
      'Kondisi Tempat Tinggal': w.kondisi_tempat_tinggal,
      'Status Pekerjaan': w.status_pekerjaan,
      'Kesehatan': w.kesehatan,
      'Usia': w.usia,
      'ID Klaster': w.clusterId !== undefined ? getClusterDefinition(w.clusterId).name : '-',
    }))
    const worksheet = XLSX.utils.json_to_sheet(wsData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Warga Klaster')
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(blob, 'data-warga-klaster.xlsx')
    console.log('Exporting to Excel...')

    // Log aktivitas
    await logActivity(
      'data_exported',
      'Data Diekspor ke Excel',
      'Data warga klaster berhasil diekspor ke file Excel.',
      'activity'
    )
  }
}

const exportToPDF = async () => {
  if (process.client) {
    const jspdfModule = await import('jspdf')
    const jsPDF = jspdfModule.default
    const autoTableModule = await import('jspdf-autotable')
    const autoTable = autoTableModule.default

    const doc = new jsPDF()
    doc.text('Data Warga & ID Klaster', 14, 15)
    autoTable(doc, {
      head: [['Nama', 'NIK', 'Penghasilan', 'Tanggungan', 'Kondisi', 'Pekerjaan', 'Kesehatan', 'Usia', 'ID Klaster']],
      body: dataWarga.value.map((w: any) => [
        w.nama,
        w.nik,
        `Rp${w.penghasilan.toLocaleString()}`,
        w.jumlah_tanggungan,
        w.kondisi_tempat_tinggal,
        w.status_pekerjaan,
        w.kesehatan,
        w.usia,
        w.clusterId !== undefined ? getClusterDefinition(w.clusterId).name : '-'
      ]),
      startY: 20,
    })
    doc.save('data-warga-klaster.pdf')

    // Log aktivitas
    await logActivity(
      'data_exported',
      'Data Diekspor ke PDF',
      'Data warga klaster berhasil diekspor ke file PDF.',
      'activity'
    )
  }
}

onMounted(() => {
  fetchData()
})

definePageMeta({
  title: 'Output Data Warga',
})
</script>
