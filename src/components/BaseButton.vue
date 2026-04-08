<template>
    <q-btn
      :label="label"
      :icon="icon"
      :color="color"
      :outline="outline"
      :unelevated="flat"
      :round="round"
      :loading="loading"
      :disable="disable"
      :size="size"
      :type="htmlType"
      :class="[$attrs.class, customClass]"   
      v-bind="$attrs"                       
      @click="$emit('click', $event)"
    />
  </template>
  
  <script setup lang="ts">
  interface Props {
    label?: string
    icon?: string
    color?: string        // Quasar colour name
    outline?: boolean
    flat?: boolean
    round?: boolean
    loading?: boolean
    disable?: boolean
    size?: 'xs'|'sm'|'md'|'lg'|'xl'
    htmlType?: 'button'|'submit'|'reset'
    customClass?: string
  }
  withDefaults(defineProps<Props>(), {
    color: 'primary',
    size: 'md',
    htmlType: 'button'
  })
  defineEmits<{
    click: [e: Event]
  }>()
  </script>