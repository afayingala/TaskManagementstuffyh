<template>
  <router-view />
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useAuthStore } from './stores/auth.store'


const authStore = useAuthStore();

// This ensures the session is loaded from localStorage
// before any components are rendered.
onBeforeMount(() => {
  authStore.loadFromStorage();
});
</script>
