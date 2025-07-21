<template>
  <Sidebar>
    <SidebarHeader>
      <!-- Logo Section - Improved spacing and layout -->
      <div class="flex items-center gap-3 px-4 py-3 border-b border-sidebar-border/50">
        <div class="flex-shrink-0">
          <img 
            src="assets/image/cibingbin-citenjo.png" 
            alt="Logo Desa Citenjo" 
            class="h-8 w-8 rounded-lg shadow-sm"
          />
        </div>
        <div class="flex flex-col min-w-0">
          <span class="text-sm font-bold text-sidebar-foreground leading-tight">
            K-means Clustering
          </span>
          <span class="text-xs text-sidebar-foreground/70 leading-tight">
            Desa Citenjo
          </span>
        </div>
      </div>
      
      <!-- Search Form with better spacing -->
      <div class="px-2 py-3">
        <SearchForm />
      </div>
    </SidebarHeader>

    <SidebarContent class="px-2">
      <!-- Main Navigation -->
      <SidebarGroup>
        <SidebarGroupLabel class="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider px-2 mb-2">
          Navigasi Utama
        </SidebarGroupLabel>
        <SidebarMenu class="space-y-1">
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              :is-active="currentPath === '/dashboard/enhanced'"
              class="transition-all duration-200 hover:bg-sidebar-accent/80"
            >
              <NuxtLink to="/dashboard/enhanced" class="flex items-center gap-3 px-3 py-2.5 rounded-lg">
                <Home class="h-4 w-4 flex-shrink-0" />
                <span class="font-medium">Dashboard</span>
              </NuxtLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              :is-active="currentPath === '/inputData'"
              class="transition-all duration-200 hover:bg-sidebar-accent/80"
            >
              <NuxtLink to="/inputData" class="flex items-center gap-3 px-3 py-2.5 rounded-lg">
                <Upload class="h-4 w-4 flex-shrink-0" />
                <span class="font-medium">Input Data Warga</span>
              </NuxtLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              :is-active="currentPath === '/outputData'"
              class="transition-all duration-200 hover:bg-sidebar-accent/80"
            >
              <NuxtLink to="/outputData" class="flex items-center gap-3 px-3 py-2.5 rounded-lg">
                <Download class="h-4 w-4 flex-shrink-0" />
                <span class="font-medium">Output Data Warga</span>
              </NuxtLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <SidebarSeparator class="my-4" />

      <!-- System Settings -->
      <SidebarGroup>
        <SidebarGroupLabel class="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider px-2 mb-2">
          Sistem
        </SidebarGroupLabel>
        <SidebarMenu class="space-y-1">
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              :is-active="currentPath === '/settings'"
              class="transition-all duration-200 hover:bg-sidebar-accent/80"
            >
              <NuxtLink to="/settings" class="flex items-center gap-3 px-3 py-2.5 rounded-lg">
                <Settings class="h-4 w-4 flex-shrink-0" />
                <span class="font-medium">Pengaturan & Info</span>
              </NuxtLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <SidebarSeparator class="my-4" />

      <!-- Account Section -->
      <SidebarGroup>
        <SidebarGroupLabel class="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider px-2 mb-2">
          Akun
        </SidebarGroupLabel>
        <SidebarMenu class="space-y-1">
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild
              class="transition-all duration-200 hover:bg-red-500/10 hover:text-red-600 group"
            >
              <button 
                @click="handleLogout" 
                class="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left"
              >
                <LogOut class="h-4 w-4 flex-shrink-0 group-hover:text-red-600" />
                <span class="font-medium group-hover:text-red-600">Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
    
    <SidebarRail />
  </Sidebar>
</template>

<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { Home, Upload, Download, Settings, LogOut } from 'lucide-vue-next'
import SearchForm from './SearchForm.vue'
import { useRouter } from 'vue-router'
import { signOut } from 'firebase/auth'
import { useFirebase } from '~/composables/useFirebase'

const router = useRouter()
const { auth } = useFirebase()

const props = defineProps<{
  currentPath: string
}>()

const handleLogout = async () => {
  try {
    console.log('Mencoba logout...')
    await signOut(auth)
    console.log('Logout berhasil, mengarahkan ke /login')
    router.push('/login')
  } catch (error) {
    console.error('Gagal logout:', error)
    // TODO: Nanti kita akan ganti dengan toast notification
    alert('Gagal logout. Silakan coba lagi. Cek konsol untuk detail error.')
  }
}
</script>