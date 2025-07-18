<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Output Data Warga (K-means Clustering)</h1>

    <div class="bg-white shadow-md rounded-lg p-6">
      <!-- Search and Action Buttons -->
      <div class="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
        <div class="flex gap-2 items-center w-full md:w-auto">
          <Input v-model="searchQuery" placeholder="Cari nama..." class="w-full md:w-[250px]" />
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
              <TableCell class="px-3 py-2 text-sm text-center">
                <span
                  v-if="warga.clusterId !== undefined"
                  :class="getClusterClass(warga.clusterId)"
                  class="px-2 py-1 rounded-md text-xs font-medium"
                >
                  {{ getClusterText(warga.clusterId) }}
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { useFirebase } from '~/composables/useFirebase'

definePageMeta({
  title: 'Output Data Warga'
})

const { db } = useFirebase()

let jsPDF: any
let autoTable: any
let saveAs: any

const router = useRouter()

const showEditModal = ref(false)
const selectedWarga = reactive<any>({
  id: '',
  nama: '',
  nik: '',
  penghasilan: 0,
  jumlah_tanggungan: 0,
  kondisi_tempat_tinggal: '',
  status_pekerjaan: '',
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
      rt: selectedWarga.rt,
      rw: selectedWarga.rw
    })
    showEditModal.value = false
    await fetchData() // Refresh data di tabel
    alert('✅ Data berhasil diperbarui!')
  } catch (error) {
    alert('❌ Gagal memperbarui data: ' + error)
  }
}

const deleteWarga = async (warga: any) => {
  if (confirm(`Apakah Anda yakin ingin menghapus data ${warga.nama} (NIK: ${warga.nik})?`)) {
    try {
      await deleteDoc(doc(db, 'data_warga', warga.id))
      await fetchData() // Refresh data di tabel setelah penghapusan
      alert('✅ Data berhasil dihapus!')
    } catch (error) {
      alert('❌ Gagal menghapus data: ' + error)
    }
  }
}

const dataWarga = ref<any[]>([])
const isLoading = ref(false)
const searchQuery = ref('')
const sortBy = ref<'nama' | 'cluster'>('cluster') // Mengubah 'skor' menjadi 'cluster'

const fetchData = async () => {
  isLoading.value = true
  const querySnapshot = await getDocs(collection(db, 'data_warga'))
  dataWarga.value = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
  isLoading.value = false
}

const runKMeansClustering = async () => {
  isLoading.value = true;
  for (const w of dataWarga.value) {
    let clusterId = 0; // Default: Klaster 0 (misal: prioritas rendah)
    if (w.penghasilan < 2000000 && w.jumlah_tanggungan >= 3) {
      clusterId = 2; // Klaster 2 (misal: prioritas tinggi)
    } else if (w.penghasilan >= 2000000 && w.penghasilan < 5000000 && w.jumlah_tanggungan >= 1) {
      clusterId = 1; // Klaster 1 (misal: prioritas menengah)
    } else {
      clusterId = 0; // Klaster 0 (misal: prioritas rendah)
    }

    const wargaRef = doc(db, 'data_warga', w.id)
    await updateDoc(wargaRef, { clusterId: clusterId })
    w.clusterId = clusterId // Update data di frontend
  }
  isLoading.value = false;
  alert('✅ Clustering berhasil & ID klaster tersimpan!')
}

const filteredWarga = computed(() => {
  const filtered = dataWarga.value.filter(w =>
    w.nama.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
  if (sortBy.value === 'cluster') {
    return [...filtered].sort((a, b) => (a.clusterId ?? 99) - (b.clusterId ?? 99)) // Urutkan berdasarkan ID klaster
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

const getClusterClass = (clusterId?: number) => {
  if (clusterId === undefined) return 'bg-gray-100 text-gray-800';
  switch (clusterId) {
    case 2: return 'bg-red-100 text-red-800'; // Klaster prioritas tinggi (misal: butuh perhatian)
    case 1: return 'bg-yellow-100 text-yellow-800'; // Klaster prioritas menengah
    case 0: return 'bg-green-100 text-green-800'; // Klaster prioritas rendah (misal: layak)
    default: return 'bg-gray-100 text-gray-800';
  }
}

const getClusterText = (clusterId?: number) => {
  if (clusterId === undefined) return '-';
  switch (clusterId) {
    case 2: return 'Klaster 2 (Prioritas Tinggi)';
    case 1: return 'Klaster 1 (Prioritas Menengah)';
    case 0: return 'Klaster 0 (Prioritas Rendah)';
    default: return `Klaster ${clusterId}`;
  }
}

const exportToExcel = async () => {
  if (process.client) {
    const fileSaver = await import('file-saver')
    saveAs = fileSaver.saveAs
    const wsData = dataWarga.value.map((w: any) => ({
      Nama: w.nama,
      NIK: w.nik,
      Penghasilan: w.penghasilan,
      Tanggungan: w.jumlah_tanggungan,
      'Kondisi Tempat Tinggal': w.kondisi_tempat_tinggal,
      'Status Pekerjaan': w.status_pekerjaan,
      'ID Klaster': w.clusterId !== undefined ? getClusterText(w.clusterId) : '-',
    }))
    const worksheet = XLSX.utils.json_to_sheet(wsData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Warga Klaster')
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(blob, 'data-warga-klaster.xlsx')
  }
}

const exportToPDF = async () => {
  if (process.client) {
    const jspdfModule = await import('jspdf')
    jsPDF = jspdfModule.default
    const autoTableModule = await import('jspdf-autotable')
    autoTable = autoTableModule.default

    const doc = new jsPDF()
    doc.text('Data Warga & ID Klaster', 14, 15)
    autoTable(doc, {
      head: [['Nama', 'NIK', 'Penghasilan', 'Tanggungan', 'Kondisi', 'Pekerjaan', 'ID Klaster']],
      body: dataWarga.value.map((w: any) => [
        w.nama,
        w.nik,
        `Rp${w.penghasilan.toLocaleString()}`,
        w.jumlah_tanggungan,
        w.kondisi_tempat_tinggal,
        w.status_pekerjaan,
        w.clusterId !== undefined ? getClusterText(w.clusterId) : '-'
      ]),
      startY: 20,
    })
    doc.save('data-warga-klaster.pdf')
  }
}

onMounted(() => {
  fetchData()
})
</script>
