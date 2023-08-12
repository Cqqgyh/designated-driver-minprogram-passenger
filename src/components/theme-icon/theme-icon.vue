<template>
  <uni-icons v-bind="$attrs" :color="color || themeColor"></uni-icons>
</template>
<script setup lang="ts">
import { useTheme } from '@/hooks/useTheme'
const { tmPiniaStore, getThemeColor } = useTheme()
const props = defineProps({
  color: {
    type: String,
    default: ''
  }
})
const themeColor = computed(() => {
  let themeColorName = tmPiniaStore.tmStore.color
  if (themeColorName) {
    return getThemeColor()
  }
  return getThemeColor()
})
</script>

<style scoped></style>
