<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import AppSidebar from '@/components/AppSidebar.vue'
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'

const route = useRoute()
const hideLayoutOn = ['/login', '/register']

// 🧠 Gunakan computed agar tetap reaktif
const isHidden = computed(() => hideLayoutOn.includes(route.path))
</script>

<template>
  <!-- Jika halaman termasuk dalam hideLayoutOn (login, register), tampilkan tanpa layout -->
  <div v-if="isHidden">
    <slot />
  </div>

  <!-- Selain itu, tampilkan layout lengkap -->
  <SidebarProvider v-else>
    <AppSidebar />
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 border-b">
        <div class="flex items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <template v-if="route.path === '/dashboard'">
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </template>
              <template v-else>
                <BreadcrumbLink as-child>
                  <NuxtLink to="/dashboard">Dashboard</NuxtLink>
                </BreadcrumbLink>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{{ route.meta.title || route.name }}</BreadcrumbPage>
                </BreadcrumbItem>
              </template>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <slot />
    </SidebarInset>
  </SidebarProvider>
</template>
