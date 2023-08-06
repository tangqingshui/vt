<script setup>
import { useCounter } from "@/stores/useCount.js"

const { count, doubleCount} = useCounter();
</script>

<template>
  {{  count }} {{ doubleCount }}
  <RouterView />
</template>

<style scoped>

</style>
  