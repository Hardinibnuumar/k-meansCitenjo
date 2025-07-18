<script setup lang="ts">
import { getAuth, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'

const router = useRouter()

const auth = getAuth()
signOut(auth).then(() => {
  router.push('/login')
})
</script>
