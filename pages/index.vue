<template>
<div>
<Card class="p-6">
  <!-- Konten halaman utama Anda bisa diletakkan di sini -->
  <!-- Misalnya, sambutan, atau tautan ke dashboard jika sudah login -->
  <h1 class="text-2xl font-bold text-gray-800 mb-4">Selamat Datang di DSS SMART Dashboard</h1>
  <p class="text-gray-600">Gunakan navigasi di samping untuk mengakses fitur-fitur.</p>
  <p class="text-gray-600 mt-2">Anda akan diarahkan secara otomatis jika sudah login.</p>
</Card>
</div>
</template>

<script setup lang="ts">
import { onAuthStateChanged } from 'firebase/auth'
import { useFirebase } from '~/composables/useFirebase'
import { onMounted } from 'vue' // Import onMounted
import { Card } from '@/components/ui/card' // Import Card component

// Terapkan middleware 'auth' ke halaman ini
definePageMeta({
title: 'Selamat Datang' // Tambahkan judul halaman
})

// Tambahkan logika pengalihan eksplisit di sisi klien
// Ini akan memastikan bahwa jika pengguna sudah login dan mendarat di root,
// mereka akan langsung diarahkan ke dashboard.
onMounted(() => {
const { auth } = useFirebase()
onAuthStateChanged(auth, (user) => {
if (user) {
  navigateTo('/dashboard/enhanced')
}
})
})
</script>
