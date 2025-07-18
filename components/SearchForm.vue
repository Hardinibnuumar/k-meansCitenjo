<template>
  <form class="relative w-full">
    <input
      type="text"
      placeholder="Cari..."
      class="w-full px-3 py-2 pl-8 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <Search class="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
  </form>
</template>

<script setup lang="ts">
import { Search } from 'lucide-vue-next'
// Tidak ada logika kompleks di sini, hanya input pencarian
</script>
