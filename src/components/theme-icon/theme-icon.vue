<template>
  <uni-icons v-bind="$attrs" :color="color || themeColor"></uni-icons>
</template>
<script setup lang="ts">
import { useTheme } from '@/hooks/useTheme'
const { getThemeColor } = useTheme()
const props = defineProps({
  color: {
    type: String,
    default: ''
  }
})
const themeColor = getThemeColor()
</script>

<style scoped></style>
