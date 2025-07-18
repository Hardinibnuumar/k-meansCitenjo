import { defineNuxtRouteMiddleware, navigateTo } from "#app"
import { onAuthStateChanged } from "firebase/auth"
import { useFirebase } from "~/composables/useFirebase"

export default defineNuxtRouteMiddleware((to, from) => {
  const { auth } = useFirebase() // Dapatkan instance auth dari composable

  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Pengguna tidak login, arahkan ke halaman login
        return resolve(navigateTo("/login"))
      }
      resolve(true) // Pengguna login, lanjutkan
    })
  })
})
