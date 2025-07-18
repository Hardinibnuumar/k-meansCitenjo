<script setup lang="ts">
definePageMeta({
  middleware: 'guest'
})
</script>

<template>
  <div class="bg-muted flex min-h-screen items-center justify-center p-6">
    <LoginForm />
  </div>
</template>
