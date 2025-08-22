<script setup lang="ts">
import ExerciseLibrary from '@/components/exercise/ExerciseLibrary.vue'
</script>

<template>
  <div class="exercise-page">
    <ExerciseLibrary />
  </div>
</template>

<style scoped>
.exercise-page {
  min-height: 100vh;
  background-color: var(--color-gray-50);
}
</style>
