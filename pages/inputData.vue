<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Input Data Warga</h1>

    <div class="bg-white shadow-md rounded-lg p-6">
      <form @submit.prevent="submitData" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="nama" class="block text-sm font-medium text-gray-700">Nama Lengkap</label>
            <Input id="nama" v-model="formData.nama" type="text" placeholder="Masukkan nama lengkap" required />
          </div>
          <div>
            <label for="nik" class="block text-sm font-medium text-gray-700">NIK</label>
            <Input id="nik" v-model="formData.nik" type="text" placeholder="Masukkan NIK" required />
          </div>
          <div>
            <label for="penghasilan" class="block text-sm font-medium text-gray-700">Penghasilan (Rp)</label>
            <Input id="penghasilan" v-model.number="formData.penghasilan" type="number" placeholder="Contoh: 3000000" required />
          </div>
          <div>
            <label for="tanggungan" class="block text-sm font-medium text-gray-700">Jumlah Tanggungan</label>
            <Input id="tanggungan" v-model.number="formData.jumlah_tanggungan" type="number" placeholder="Contoh: 2" required />
          </div>
          <div>
            <label for="rt" class="block text-sm font-medium text-gray-700">RT</label>
            <Input id="rt" v-model="formData.rt" type="text" placeholder="Contoh: 001" required />
          </div>
          <div>
            <label for="rw" class="block text-sm font-medium text-gray-700">RW</label>
            <Input id="rw" v-model="formData.rw" type="text" placeholder="Contoh: 002" required />
          </div>
          <div>
            <label for="kondisi_tempat_tinggal" class="block text-sm font-medium text-gray-700">Kondisi Tempat Tinggal</label>
            <select id="kondisi_tempat_tinggal" v-model="formData.kondisi_tempat_tinggal" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required>
              <option value="">Pilih Kondisi</option>
              <option value="Sangat Baik">Sangat Baik</option>
              <option value="Baik">Baik</option>
              <option value="Cukup">Cukup</option>
              <option value="Kurang Baik">Kurang Baik</option>
              <option value="Sangat Kurang Baik">Sangat Kurang Baik</option>
            </select>
          </div>
          <div>
            <label for="status_pekerjaan" class="block text-sm font-medium text-gray-700">Status Pekerjaan</label>
            <select id="status_pekerjaan" v-model="formData.status_pekerjaan" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required>
              <option value="">Pilih Status</option>
              <option value="Pekerja Tetap">Pekerja Tetap</option>
              <option value="Pekerja Kontrak">Pekerja Kontrak</option>
              <option value="Wiraswasta">Wiraswasta</option>
              <option value="Tidak Bekerja">Tidak Bekerja</option>
              <option value="Pensiunan">Pensiunan</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <Button type="button" variant="outline" @click="resetForm">Reset</Button>
          <Button type="submit" :disabled="isLoading">
            {{ isLoading ? 'Menyimpan...' : 'Simpan Data' }}
          </Button>
        </div>

        <div v-if="message" :class="['mt-4 p-3 rounded-md text-center', messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
          {{ message }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { collection, addDoc } from 'firebase/firestore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useFirebase } from '~/composables/useFirebase' // Import composable
import { definePageMeta } from '#imports' // Pastikan ini diimpor

const { db } = useFirebase() // Gunakan composable untuk mendapatkan instance db

definePageMeta({
  title: 'Input Data Warga',
})

const formData = reactive({
  nama: '',
  nik: '',
  penghasilan: 0,
  jumlah_tanggungan: 0,
  kondisi_tempat_tinggal: '',
  status_pekerjaan: '',
  rt: '',
  rw: '',
  clusterId: null // Tambahkan field clusterId, default null
})

const isLoading = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

const submitData = async () => {
  isLoading.value = true
  message.value = ''
  try {
    // Data yang akan disimpan ke Firestore
    const dataToSave = {
      ...formData,
      timestamp: new Date() // Tambahkan timestamp
    }
    
    await addDoc(collection(db, 'data_warga'), dataToSave)
    message.value = 'Data warga berhasil disimpan!'
    messageType.value = 'success'
    resetForm()
  } catch (e) {
    console.error('Error adding document: ', e)
    message.value = 'Gagal menyimpan data warga. Silakan coba lagi.'
    messageType.value = 'error'
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  formData.nama = ''
  formData.nik = ''
  formData.penghasilan = 0
  formData.jumlah_tanggungan = 0
  formData.kondisi_tempat_tinggal = ''
  formData.status_pekerjaan = ''
  formData.rt = ''
  formData.rw = ''
  formData.clusterId = null
  message.value = '' // Hapus pesan setelah reset
}
</script>
