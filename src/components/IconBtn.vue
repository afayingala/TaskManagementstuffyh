<template>
    <q-btn
      flat
      round
      :icon="icon"
      :color="color"
      :size="size"
      :disable="disable"
      @click="$emit('click', $event)"
    >
      <q-tooltip v-if="tip" anchor="top middle" self="bottom middle">
        {{ tip }}
      </q-tooltip>
    </q-btn>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    icon: string
    color?: string
    size?: 'xs'|'sm'|'md'|'lg'|'xl'
    tip?: string
    disable?: boolean
  }>()
  defineEmits<{ click: [e: Event] }>()
  </script>