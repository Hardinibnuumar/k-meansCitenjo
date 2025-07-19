import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// ====================================================================
// PENTING: GANTI DENGAN KONFIGURASI FIREBASE ANDA YANG SEBENARNYA
// Anda bisa mendapatkan ini dari nuxt.config.ts atau konsol Firebase Anda
// ====================================================================
const firebaseConfig = {
  apiKey: "AIzaSyBB6g8FDhqzNhO9itBS7FCx08G78sPSp14", // Ganti dengan NUXT_PUBLIC_FIREBASE_API_KEY Anda
  authDomain: "k-means-24d6f.firebaseapp.com", // Ganti dengan NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN Anda
  projectId: "k-means-24d6f", // Ganti dengan NUXT_PUBLIC_FIREBASE_PROJECT_ID Anda
  storageBucket: "k-means-24d6f.firebasestorage.app",
  messagingSenderId: "1017558069835",
  appId: "1:1017558069835:web:f7a9d0ce58946107b4d3ce",
  measurementId: "G-MD099RJ6K9",
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const generateRandomData = (index) => {
  const namaDepan = [
    "Budi",
    "Siti",
    "Joko",
    "Dewi",
    "Agus",
    "Rina",
    "Fajar",
    "Kartika",
    "Bayu",
    "Citra",
    "Eko",
    "Ani",
    "Rio",
    "Maya",
    "Dedi",
    "Lina",
    "Andi",
    "Putri",
    "Yoga",
    "Sari",
  ]
  const namaBelakang = [
    "Santoso",
    "Aminah",
    "Susilo",
    "Lestari",
    "Salim",
    "Wati",
    "Nugraha",
    "Sari",
    "Pratama",
    "Kirana",
    "Wijaya",
    "Rahayu",
    "Saputra",
    "Dewi",
    "Kurniawan",
    "Handayani",
    "Setiawan",
    "Utami",
    "Aditya",
    "Permata",
  ]

  const randomNama = `${namaDepan[Math.floor(Math.random() * namaDepan.length)]} ${namaBelakang[Math.floor(Math.random() * namaBelakang.length)]}`
  const randomNik = `3201${String(Math.floor(Math.random() * 900000000000) + 100000000000).padStart(12, "0")}`

  const penghasilanOptions = [1000000, 1500000, 2000000, 2500000, 3000000, 3500000, 4000000, 5000000, 6000000, 7000000]
  const jumlahTanggunganOptions = [0, 1, 2, 3, 4, 5, 6]
  const kondisiTempatTinggalOptions = ["Sangat Baik", "Baik", "Cukup", "Kurang Baik", "Sangat Kurang Baik"]
  const statusPekerjaanOptions = ["Pekerja Tetap", "Pekerja Kontrak", "Wiraswasta", "Tidak Bekerja", "Pensiunan"]
  const kesehatanOptions = ["Sangat Baik", "Baik", "Cukup", "Kurang Baik", "Sangat Kurang Baik"]
  const usiaOptions = Array.from({ length: 60 }, (_, i) => 17 + i) // Usia 17 hingga 76

  const randomRT = String(Math.floor(Math.random() * 5) + 1).padStart(3, "0") // RT 001-005
  const randomRW = String(Math.floor(Math.random() * 3) + 1).padStart(3, "0") // RW 001-003

  return {
    nama: randomNama,
    nik: randomNik,
    penghasilan: penghasilanOptions[Math.floor(Math.random() * penghasilanOptions.length)],
    jumlah_tanggungan: jumlahTanggunganOptions[Math.floor(Math.random() * jumlahTanggunganOptions.length)],
    kondisi_tempat_tinggal: kondisiTempatTinggalOptions[Math.floor(Math.random() * kondisiTempatTinggalOptions.length)],
    status_pekerjaan: statusPekerjaanOptions[Math.floor(Math.random() * statusPekerjaanOptions.length)],
    kesehatan: kesehatanOptions[Math.floor(Math.random() * kesehatanOptions.length)],
    usia: usiaOptions[Math.floor(Math.random() * usiaOptions.length)],
    rt: randomRT,
    rw: randomRW,
    timestamp: new Date(),
    clusterId: null, // Akan diisi oleh clustering
  }
}

const sampleWargaData = []
const numberOfEntries = 100 // Ubah jumlah ini sesuai kebutuhan Anda (misal: 50, 100, 200)

for (let i = 0; i < numberOfEntries; i++) {
  sampleWargaData.push(generateRandomData(i))
}

async function seedData() {
  console.log(`Memulai penambahan ${numberOfEntries} data contoh ke Firestore...`)
  try {
    for (const data of sampleWargaData) {
      await addDoc(collection(db, "data_warga"), data)
      // console.log(`Data untuk ${data.nama} berhasil ditambahkan.`); // Opsional: terlalu banyak log
    }
    console.log(`Semua ${numberOfEntries} data contoh berhasil ditambahkan!`)
  } catch (error) {
    console.error("Gagal menambahkan data contoh:", error)
  }
}

seedData()