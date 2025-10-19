// utils/clusterDefinitions.ts

interface ClusterDefinition {
  id: number
  name: string
  description: string
  colorClass: string // Tailwind CSS class for text color
  bgColorClass: string // Tailwind CSS class for background color
}

// Definisi klaster dengan 2 cluster: Prioritas Rendah dan Prioritas Tinggi
export const clusterDefinitions: ClusterDefinition[] = [
  {
    id: 0,
    name: "Prioritas Rendah",
    description: "Warga dengan kondisi relatif baik, mandiri, dan mungkin tidak memerlukan bantuan mendesak.",
    colorClass: "text-green-800",
    bgColorClass: "bg-green-100",
  },
  {
    id: 1,
    name: "Prioritas Tinggi",
    description:
      "Warga dengan kondisi yang memerlukan perhatian dan bantuan segera, seperti penghasilan rendah, tanggungan banyak, atau kondisi kesehatan kurang baik.",
    colorClass: "text-red-800",
    bgColorClass: "bg-red-100",
  },
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
