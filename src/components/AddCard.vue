<template>
  <button class="text-dark rounded-full p-2 flex items-center gap-2" @click="handleAddTask">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
    Add a card
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{ onAddTask: () => void }>();

function handleAddTask() {
  if (typeof props.onAddTask === "function") {
    props.onAddTask();
  }
}
</script>
