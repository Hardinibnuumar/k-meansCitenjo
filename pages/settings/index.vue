<template>
  <div class="p-6 space-y-6">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Pengaturan & Informasi Sistem</h1>

    <!-- Bagian Informasi K-means Clustering -->
    <Card class="p-6">
      <CardHeader>
        <CardTitle class="text-xl flex items-center gap-2">
          <Info class="w-5 h-5" />
          Tentang K-means Clustering
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-4 text-gray-700">
        <p>
          Sistem ini menggunakan algoritma **K-means Clustering** untuk mengelompokkan data warga berdasarkan karakteristik yang serupa. Tujuannya adalah untuk mengidentifikasi kelompok-kelompok warga yang memiliki profil kebutuhan atau kondisi yang mirip, sehingga memudahkan dalam pengambilan keputusan terkait alokasi bantuan atau program.
        </p>
        <h3 class="font-semibold text-lg">Bagaimana K-means Bekerja?</h3>
        <ul class="list-disc list-inside space-y-1 ml-4">
          <li>**Inisialisasi Centroid**: Algoritma memulai dengan memilih sejumlah titik acak (disebut centroid) sebagai pusat klaster awal. Jumlah klaster ini ditentukan oleh nilai 'K' yang Anda masukkan.</li>
          <li>**Penugasan Klaster**: Setiap data warga kemudian ditugaskan ke klaster yang centroidnya paling dekat (berdasarkan jarak).</li>
          <li>**Pembaruan Centroid**: Setelah semua data ditugaskan, posisi centroid dihitung ulang sebagai rata-rata dari semua data yang ada di klaster tersebut.</li>
          <li>**Iterasi**: Langkah penugasan dan pembaruan ini diulang berkali-kali hingga posisi centroid tidak lagi banyak berubah, atau hingga jumlah iterasi maksimum tercapai.</li>
        </ul>
        <h3 class="font-semibold text-lg">Interpretasi Klaster</h3>
        <p>
          Setelah proses clustering selesai, setiap warga akan memiliki 'ID Klaster'. Anda dapat melihat karakteristik rata-rata dari setiap klaster di bagian **'Karakteristik Klaster'** pada Dashboard. Ini akan membantu Anda memahami profil unik dari setiap kelompok.
        </p>
        <ul class="list-disc list-inside space-y-1 ml-4">
          <li>**Klaster 0 (Prioritas Rendah)**: Warga dengan kondisi relatif baik, mandiri, dan mungkin tidak memerlukan bantuan mendesak.</li>
          <li>**Klaster 1 (Prioritas Menengah)**: Warga dengan kondisi cukup baik, mungkin memerlukan dukungan sesekali atau informasi terkait program tertentu.</li>
          <li>**Klaster 2 (Prioritas Tinggi)**: Warga dengan kondisi yang memerlukan perhatian dan bantuan segera, seperti penghasilan rendah, tanggungan banyak, atau kondisi kesehatan kurang baik.</li>
        </ul>
        <p class="text-sm text-gray-600 italic">
          Catatan: Definisi klaster di atas adalah contoh. Anda dapat menyesuaikannya setelah menganalisis data Anda sendiri.
        </p>
      </CardContent>
    </Card>

    <!-- Bagian Penggunaan Aplikasi (Opsional, bisa ditambahkan nanti) -->
    <!-- <Card class="p-6">
      <CardHeader>
        <CardTitle class="text-xl flex items-center gap-2">
          <HelpCircle class="w-5 h-5" />
          Panduan Penggunaan Aplikasi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Bagian ini akan berisi panduan langkah demi langkah tentang cara menggunakan fitur-fitur utama aplikasi, seperti input data, menjalankan clustering, dan mengekspor laporan.
        </p>
      </CardContent>
    </Card> -->

    <!-- Bagian Notifikasi Penggunaan (Opsional, bisa ditambahkan nanti) -->
    <!-- <Card class="p-6">
      <CardHeader>
        <CardTitle class="text-xl flex items-center gap-2">
          <Bell class="w-5 h-5" />
          Preferensi Notifikasi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Kelola preferensi notifikasi Anda di sini.
        </p>
      </CardContent>
    </Card> -->

  </div>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Info, HelpCircle, Bell } from 'lucide-vue-next'

definePageMeta({
  title: 'Pengaturan & Informasi',
})
</script>
