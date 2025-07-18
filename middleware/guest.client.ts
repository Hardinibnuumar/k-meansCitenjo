import { defineNuxtRouteMiddleware, navigateTo } from "#app"
import { onAuthStateChanged } from "firebase/auth"
import { useFirebase } from "~/composables/useFirebase"

export default defineNuxtRouteMiddleware((to, from) => {
  const { auth } = useFirebase() // Dapatkan instance auth dari composable

  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Pengguna sudah login, arahkan ke dashboard
        return resolve(navigateTo("/dashboard"))
      }
      resolve(true) // Pengguna belum login, lanjutkan
    })
  })
})
