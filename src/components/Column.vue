<template>
  <div
    class="bg-white rounded-lg shadow w-64 flex flex-col h-full"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <h2 class="text-lg font-bold px-4 py-3 border-gray-200">{{ column.title }}</h2>
    <ul class="flex-1 px-4 py-2 space-y-2">
      <li v-if="column.tasks.length === 0 && !isDragOver" class="text-gray-400 italic py-4 px-1">No tasks</li>
      <li v-else v-for="task in column.tasks" :key="task.id">
        <TaskCard :task="task" />
      </li>
      <li v-if="isDragOver && movingTask" class="preview-task animate-pulse">
        <TaskCard :task="movingTask" />
      </li>
    </ul>
    <AddCard :onAddTask="onAddTask" />
  </div>
</template>

<script setup lang="ts">
import type { Column } from "@/types";
import TaskCard from "./TaskCard.vue";
import AddCard from "./AddCard.vue";
import { ref } from "vue";
const props = defineProps<{ column: Column; onAddTask: () => void }>();
const emit = defineEmits(["moveTask"]);
const isDragOver = ref(false);
const movingTask = ref<Column["tasks"][number] | null>(null);

declare global {
  interface Window {
    __columns: Column[];
  }
}

function onDragOver(event: DragEvent) {
  isDragOver.value = true;
  const taskId = event.dataTransfer?.getData("taskId");
  if (taskId && window.__columns) {
    let foundTask = null;
    for (const col of window.__columns) {
      foundTask = col.tasks.find((t) => t.id === Number(taskId));
      if (foundTask) break;
    }
    movingTask.value = foundTask ? { ...foundTask } : null;
  }
}
function onDragLeave() {
  isDragOver.value = false;
  movingTask.value = null;
}
function onDrop(event: DragEvent) {
  isDragOver.value = false;
  movingTask.value = null;
  const taskId = event.dataTransfer?.getData("taskId");
  if (taskId) {
    emit("moveTask", { taskId: Number(taskId), newStatus: props.column.status });
  }
}
// Expose columns globally for preview lookup
if (typeof window !== "undefined") {
  window.__columns = window.__columns || [];
  window.__columns = window.__columns.length ? window.__columns : [props.column];
}
</script>

<style scoped>
.preview-task {
  opacity: 0.7;
  pointer-events: none;
}
.animate-pulse {
  animation: pulse 1s infinite;
}
@keyframes pulse {
  0% {
    opacity: 0.7;
    box-shadow: 0 0 0 0 #3b82f6;
  }
  50% {
    opacity: 0.4;
    box-shadow: 0 0 10px 2px #3b82f6;
  }
  100% {
    opacity: 0.7;
    box-shadow: 0 0 0 0 #3b82f6;
  }
}
</style>
