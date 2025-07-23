<template>
  <div
    class="bg-blue-100 rounded p-2 draggable-task"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    :class="{ dragging: isDragging }"
  >
    <div class="font-semibold">{{ task.title }}</div>
    <div class="text-xs text-gray-600">Status: {{ task.status }}</div>
    <div v-if="task.description" class="mt-1 text-sm text-gray-700">{{ task.description }}</div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from "@/types";
import { ref } from "vue";
const props = defineProps<{ task: Task }>();
const isDragging = ref(false);

function onDragStart(event: DragEvent) {
  event.dataTransfer?.setData("taskId", props.task.id.toString());
  isDragging.value = true;
  event.dataTransfer!.effectAllowed = "move";
}

function onDragEnd() {
  isDragging.value = false;
}
</script>

<style scoped>
.draggable-task {
  cursor: grab;
  transition: box-shadow 0.2s, opacity 0.2s;
}
.draggable-task.dragging {
  cursor: grabbing;
  opacity: 0.6;
  box-shadow: 0 0 10px 2px #3b82f6;
}
</style>
