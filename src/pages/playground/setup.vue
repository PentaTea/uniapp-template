<template>
  <BasePage>
    <div>{{ b }}</div>
  </BasePage>
</template>

<script setup>
import { ref } from '@vue/composition-api'
const b = ref(5)
</script>

<style></style>
