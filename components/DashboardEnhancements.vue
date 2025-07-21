<template>
  <div class="space-y-6">
    <!-- Quick Actions -->
    <Card class="p-4">
      <CardHeader>
        <CardTitle class="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button @click="addNewData" class="flex flex-col items-center justify-center p-2 h-24 text-center">
            <Plus class="w-6 h-6 mb-2" />
            <span class="text-xs leading-none">Tambah Data</span>
          </Button>
          <Button @click="generateReport" variant="outline" class="flex flex-col items-center justify-center p-2 h-24 text-center">
            <FileText class="w-6 h-6 mb-2" />
            <span class="text-xs leading-none">Generate Report</span>
          </Button>
          <Button @click="exportData" variant="outline" class="flex flex-col items-center justify-center p-2 h-24 text-center">
            <Download class="w-6 h-6 mb-2" />
            <span class="text-xs leading-none">Export Data</span>
          </Button>
          <Button @click="viewAnalytics" variant="outline" class="flex flex-col items-center justify-center p-2 h-24 text-center">
            <BarChart3 class="w-6 h-6 mb-2" />
            <span class="text-xs leading-none">Analytics</span>
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Riwayat Aktivitas Sistem (sebelumnya Aktivitas Terbaru) -->
    <Card class="p-4">
      <CardHeader>
        <CardTitle class="text-lg">Riwayat Aktivitas Sistem</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-3">
          <div v-if="recentActivities.length === 0" class="text-center text-gray-500 py-4">
            Tidak ada aktivitas terbaru.
          </div>
          <div v-for="activity in recentActivities" :key="activity.id" 
               class="flex items-center p-3 hover:bg-gray-50 rounded-lg">
            <div :class="[
              'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-3',
              activity.type === 'data_added' ? 'bg-green-100 text-green-600' :
              activity.type === 'data_updated' ? 'bg-blue-100 text-blue-600' :
              activity.type === 'data_deleted' ? 'bg-red-100 text-red-600' :
              'bg-gray-100 text-gray-600'
            ]">
              <component :is="getActivityIcon(activity.type)" class="w-4 h-4" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium">{{ activity.title }}</p>
              <p class="text-xs text-gray-600">{{ activity.message }}</p>
            </div>
            <span class="text-xs text-gray-500 ml-2 flex-shrink-0">{{ timeAgo(activity.timestamp) }}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Bell, Plus, FileText, Download, BarChart3, 
  UserPlus, Edit, Trash2, Eye, Clock, CheckCircle, XCircle
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { collection, query, orderBy, limit, onSnapshot, Timestamp } from 'firebase/firestore'
import { useFirebase } from '~/composables/useFirebase'

const router = useRouter()
const { db } = useFirebase()

interface LogEntry {
  id: string;
  timestamp: Timestamp;
  type: string; // e.g., 'data_added', 'data_updated', 'clustering_run', 'report_generated', 'data_deleted'
  title: string;
  message: string;
  category: 'notification' | 'activity'; // 'notification' for alerts, 'activity' for logs
}

// Hapus `notifications` ref karena kita hanya akan menggunakan `recentActivities`
// const notifications = ref<LogEntry[]>([]) 
const recentActivities = ref<LogEntry[]>([])

// Fungsi untuk mendapatkan ikon berdasarkan tipe aktivitas
const getActivityIcon = (type: string) => {
  switch (type) {
    case 'data_added': return UserPlus
    case 'data_updated': return Edit
    case 'data_deleted': return Trash2
    case 'clustering_run': return Clock // Atau ikon lain yang relevan
    case 'report_generated': return FileText
    case 'data_exported': return Download
    case 'viewed': return Eye
    default: return Eye
  }
}

// Fungsi untuk format waktu "sekian waktu lalu"
const timeAgo = (timestamp: Timestamp) => {
  const seconds = Math.floor((new Date().getTime() - timestamp.toDate().getTime()) / 1000)

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " tahun lalu";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " bulan lalu";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " hari lalu";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " jam lalu";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " menit lalu";
  return Math.floor(seconds) + " detik lalu";
}

// Quick Actions handlers
const addNewData = () => {
  router.push('/inputData')
}

const generateReport = () => {
  alert('Fungsi Generate Report akan segera hadir!')
  // logActivity('report_generated', 'Laporan Dibuat', 'Laporan analisis bulanan telah dibuat.', 'activity');
}

const exportData = () => {
  router.push('/outputData')
}

const viewAnalytics = () => {
  router.push('/dashboard/enhanced') // Navigasi ke dashboard saat ini
}

onMounted(() => {
  // Listener untuk Aktivitas Terbaru (sebelumnya juga digunakan untuk notifikasi)
  const activitiesQuery = query(
    collection(db, 'dashboard_logs'),
    orderBy('timestamp', 'desc'),
    limit(10) // Ambil 10 aktivitas terbaru
  );

  onSnapshot(activitiesQuery, (snapshot) => {
    recentActivities.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<LogEntry, 'id'>,
      timestamp: doc.data().timestamp // Pastikan timestamp adalah objek Timestamp Firebase
    }));
  });
});
</script>
