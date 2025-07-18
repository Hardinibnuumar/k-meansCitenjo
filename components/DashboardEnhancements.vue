<template>
  <div class="space-y-6">
    <!-- Real-time Notifications -->
    <Card class="p-4">
      <CardHeader>
        <CardTitle class="text-lg flex items-center gap-2">
          <Bell class="w-5 h-5" />
          Notifikasi Real-time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-3">
          <div v-for="notification in notifications" :key="notification.id" 
               :class="[
                 'flex items-center p-3 rounded-lg border-l-4',
                 notification.type === 'success' ? 'bg-green-50 border-green-400' :
                 notification.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                 notification.type === 'info' ? 'bg-blue-50 border-blue-400' :
                 'bg-red-50 border-red-400'
               ]">
            <div :class="[
              'w-2 h-2 rounded-full mr-3',
              notification.type === 'success' ? 'bg-green-500' :
              notification.type === 'warning' ? 'bg-yellow-500' :
              notification.type === 'info' ? 'bg-blue-500' :
              'bg-red-500'
            ]"></div>
            <div class="flex-1">
              <p class="text-sm font-medium">{{ notification.title }}</p>
              <p class="text-xs text-gray-600">{{ notification.message }}</p>
            </div>
            <span class="text-xs text-gray-500">{{ notification.time }}</span>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Quick Actions -->
    <Card class="p-4">
      <CardHeader>
        <CardTitle class="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button @click="addNewData" class="flex flex-col items-center p-4 h-auto">
            <Plus class="w-6 h-6 mb-2" />
            <span class="text-sm">Tambah Data</span>
          </Button>
          <Button @click="generateReport" variant="outline" class="flex flex-col items-center p-4 h-auto">
            <FileText class="w-6 h-6 mb-2" />
            <span class="text-sm">Generate Report</span>
          </Button>
          <Button @click="exportData" variant="outline" class="flex flex-col items-center p-4 h-auto">
            <Download class="w-6 h-6 mb-2" />
            <span class="text-sm">Export Data</span>
          </Button>
          <Button @click="viewAnalytics" variant="outline" class="flex flex-col items-center p-4 h-auto">
            <BarChart3 class="w-6 h-6 mb-2" />
            <span class="text-sm">Analytics</span>
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Recent Activities -->
    <Card class="p-4">
      <CardHeader>
        <CardTitle class="text-lg">Aktivitas Terbaru</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-3">
          <div v-for="activity in recentActivities" :key="activity.id" 
               class="flex items-center p-3 hover:bg-gray-50 rounded-lg">
            <div :class="[
              'w-8 h-8 rounded-full flex items-center justify-center mr-3',
              activity.type === 'add' ? 'bg-green-100 text-green-600' :
              activity.type === 'edit' ? 'bg-blue-100 text-blue-600' :
              activity.type === 'delete' ? 'bg-red-100 text-red-600' :
              'bg-gray-100 text-gray-600'
            ]">
              <component :is="getActivityIcon(activity.type)" class="w-4 h-4" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium">{{ activity.title }}</p>
              <p class="text-xs text-gray-600">{{ activity.description }}</p>
            </div>
            <span class="text-xs text-gray-500">{{ activity.time }}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Bell, Plus, FileText, Download, BarChart3, 
  UserPlus, Edit, Trash2, Eye 
} from 'lucide-vue-next'

const notifications = ref([
  {
    id: 1,
    type: 'success',
    title: 'Data Berhasil Ditambahkan',
    message: 'Data warga RT 001/RW 02 telah berhasil ditambahkan',
    time: '5 menit lalu'
  },
  {
    id: 2,
    type: 'warning',
    title: 'Skor Rendah Terdeteksi',
    message: 'RT 003/RW 01 memiliki skor rata-rata di bawah 0.4',
    time: '15 menit lalu'
  },
  {
    id: 3,
    type: 'info',
    title: 'Laporan Bulanan Siap',
    message: 'Laporan analisis bulan ini telah selesai diproses',
    time: '1 jam lalu'
  }
])

const recentActivities = ref([
  {
    id: 1,
    type: 'add',
    title: 'Data Warga Ditambahkan',
    description: 'Budi Santoso - RT 001/RW 02',
    time: '10 menit lalu'
  },
  {
    id: 2,
    type: 'edit',
    title: 'Data Warga Diperbarui',
    description: 'Siti Aminah - RT 002/RW 01',
    time: '25 menit lalu'
  },
  {
    id: 3,
    type: 'view',
    title: 'Laporan Dilihat',
    description: 'Laporan RT 001/RW 01',
    time: '1 jam lalu'
  }
])

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'add': return UserPlus
    case 'edit': return Edit
    case 'delete': return Trash2
    case 'view': return Eye
    default: return Eye
  }
}

const addNewData = () => {
  console.log('Add new data')
}

const generateReport = () => {
  console.log('Generate report')
}

const exportData = () => {
  console.log('Export data')
}

const viewAnalytics = () => {
  console.log('View analytics')
}
</script>
