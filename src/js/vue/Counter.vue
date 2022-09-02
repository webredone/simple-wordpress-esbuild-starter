<script setup>
import { ref } from 'vue';

const count = ref(0);
</script>

<template>
  <div>
    <h2>Vue Counter: {{ count }}</h2>
    <button @click="count++">
      Increment
    </button>
  </div>
</template>
