<template>
    <q-chip
      :color="map[status]?.color"
      text-color="white"
      size="sm"
      class="text-weight-bold"
    >
      {{ map[status]?.label ?? status }}
    </q-chip>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{ status: string }>()
  const map: Record<string, { color: string; label: string }> = {
    Pending:   { color: 'orange', label: 'Pending' },
    'In Progress': { color: 'blue',  label: 'In Progress' },
    Completed: { color: 'green', label: 'Completed' },
    Overdue:   { color: 'red',   label: 'Overdue' },
  }
  </script>