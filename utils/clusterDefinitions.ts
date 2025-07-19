// utils/clusterDefinitions.ts

interface ClusterDefinition {
  id: number
  name: string
  description: string
  colorClass: string // Tailwind CSS class for text color
  bgColorClass: string // Tailwind CSS class for background color
}

// Anda bisa menyesuaikan definisi klaster ini setelah Anda menganalisis data Anda
// Contoh definisi awal:
export const clusterDefinitions: ClusterDefinition[] = [
  {
    id: 0,
    name: "Klaster 0 (Prioritas Rendah)",
    description: "Warga dengan kondisi relatif baik, mandiri, dan mungkin tidak memerlukan bantuan mendesak.",
    colorClass: "text-green-800",
    bgColorClass: "bg-green-100",
  },
  {
    id: 1,
    name: "Klaster 1 (Prioritas Menengah)",
    description:
      "Warga dengan kondisi cukup baik, mungkin memerlukan dukungan sesekali atau informasi terkait program tertentu.",
    colorClass: "text-yellow-800",
    bgColorClass: "bg-yellow-100",
  },
  {
    id: 2,
    name: "Klaster 2 (Prioritas Tinggi)",
    description:
      "Warga dengan kondisi yang memerlukan perhatian dan bantuan segera, seperti penghasilan rendah, tanggungan banyak, atau kondisi kesehatan kurang baik.",
    colorClass: "text-red-800",
    bgColorClass: "bg-red-100",
  },
  // Tambahkan definisi klaster lain jika Anda menggunakan K > 3
  // {
  //   id: 3,
  //   name: 'Klaster 3 (Contoh)',
  //   description: 'Deskripsi untuk klaster 3.',
  //   colorClass: 'text-purple-800',
  //   bgColorClass: 'bg-purple-100',
  // },
]

export function getClusterDefinition(clusterId?: number): ClusterDefinition {
  return (
    clusterDefinitions.find((def) => def.id === clusterId) || {
      id: -1,
      name: "Tidak Terdefinisi",
      description: "Klaster tidak dikenal atau belum dianalisis.",
      colorClass: "text-gray-800",
      bgColorClass: "bg-gray-100",
    }
  )
}
