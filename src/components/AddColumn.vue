<template>
  <button
    class="bg-gray-300 hover:bg-gray-400 text-white font-bold text-sm py-2 px-4 rounded shadow h-full"
    @click="$emit('addColumn')"
  >
    + Add Another List
  </button>
</template>

<script setup lang="ts">
defineEmits(["addColumn"]);
</script>
