<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100 p-4">
    <ClientOnly> <!-- Tambahkan ClientOnly di sini -->
      <RegisterForm />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import RegisterForm from '@/components/RegisterForm.vue'
import { definePageMeta } from '#imports'

// Ini akan memastikan halaman ini tidak menggunakan layout default
definePageMeta({
  layout: false,
})
</script>
