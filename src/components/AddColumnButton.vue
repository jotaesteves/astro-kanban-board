<template>
  <button
    class="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg border border-blue-300 h-full min-w-[200px]"
    @click="addColumn"
  >
    <span class="font-bold text-blue-700 text-sm">+ Add Column</span>
  </button>
</template>
<script setup lang="ts">
const emit = defineEmits(["addColumn"]);
function addColumn() {
  emit("addColumn");
}
</script>
