<template>
  <SidebarProvider>
    <ClientOnly>
      <AppSidebar :current-path="route.path" />
    </ClientOnly>
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 h-4" />
        <!-- Breadcrumb atau judul halaman bisa di sini -->
        <h1 class="text-lg font-semibold text-gray-800">
          {{ route.meta.title || 'Dashboard' }}
        </h1>
      </header>
      <div class="flex flex-1 flex-col gap-4 p-4">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import AppSidebar from '@/components/AppSidebar.vue'

const route = useRoute()
</script>

<style>
/* Anda bisa menambahkan gaya global di sini jika diperlukan */
</style>
