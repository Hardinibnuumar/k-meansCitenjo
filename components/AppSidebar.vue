<template>
  <Sidebar>
    <SidebarHeader>
      <div class="flex items-center gap-2 px-2 py-1">
        <img src="https://via.placeholder.com/24x24" alt="Logo DSS" class="h-6 w-6" />
        <span class="text-lg font-semibold text-sidebar-foreground">DSS SMART</span>
      </div>
      <SearchForm />
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild :is-active="currentPath === '/dashboard/enhanced'">
              <NuxtLink to="/dashboard/enhanced">
                <Home />
                <span>Dashboard</span>
              </NuxtLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild :is-active="currentPath === '/inputData'">
              <NuxtLink to="/inputData">
                <Upload />
                <span>Input Data Warga</span>
              </NuxtLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild :is-active="currentPath === '/outputData'">
              <NuxtLink to="/outputData">
                <Download />
                <span>Output Data Warga</span>
              </NuxtLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
      
      <SidebarSeparator />

      <SidebarGroup>
        <SidebarGroupLabel>Referensi</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild :is-active="currentPath === '/api-reference'">
              <NuxtLink to="/api-reference">
                <Code />
                <span>API Reference</span>
              </NuxtLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild :is-active="currentPath === '/components'">
              <NuxtLink to="/components">
                <Component />
                <span>Components</span>
              </NuxtLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <SidebarSeparator />

      <SidebarGroup>
        <SidebarGroupLabel>Akun</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild :is-active="currentPath === '/settings'">
              <NuxtLink to="/settings">
                <Settings />
                <span>Settings</span>
              </NuxtLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button @click="handleLogout">
                <LogOut />
                <span>Logout</span>
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
import { Home, Upload, Download, Code, Component, Settings, LogOut } from 'lucide-vue-next'
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
    router.push('/login') // Pastikan ini mengarah ke halaman login
    // Tambahkan baris ini untuk memastikan refresh penuh setelah logout
    window.location.reload(); 
  } catch (error) {
    console.error('Gagal logout:', error)
    alert('Gagal logout. Silakan coba lagi. Cek konsol untuk detail error.')
  }
}
</script>
