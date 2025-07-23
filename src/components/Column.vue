<template>
  <div
    class="bg-white rounded-lg shadow w-64 flex flex-col h-full min-w-[200px]"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
    :data-column-id="column.id"
  >
    <div class="relative flex items-center justify-between w-full">
      <ColumnTitle
        :title="column.title"
        :isEditing="isEditing"
        :editableTitle="editableTitle"
        @edit="editColumn"
        @save="saveEdit"
        @update:title="
          {
            (val: string) => (editableTitle = val);
          }
        "
        @dragstart="onColumnDragStart"
        @dragend="onColumnDragEnd"
      />
      <button class="text-gray-400 hover:text-gray-600 mr-4" aria-label="Options" @click="handleToggleDropdown">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" stroke="">
          <circle cx="4" cy="10" r="1.5" />
          <circle cx="10" cy="10" r="1.5" />
          <circle cx="16" cy="10" r="1.5" />
        </svg>
      </button>
      <ColumnDropdown :visible="isDropdownVisible" @edit="editColumn" @delete="deleteColumn" @close="closeDropdown" />
    </div>
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
import ColumnDropdown from "./ColumnDropdown.vue";
import ColumnTitle from "./ColumnTitle.vue";
import { ref } from "vue";
const props = defineProps<{ column: Column; onAddTask: () => void }>();
const emit = defineEmits(["moveTask", "deleteColumn", "reorderColumn"]);
const isDragOver = ref(false);
const movingTask = ref<Column["tasks"][number] | null>(null);
const isDropdownVisible = ref(false);
const isEditing = ref(false);
const editableTitle = ref(props.column.title);
const isColumnDrag = ref(false);

declare global {
  interface Window {
    __columns: Column[];
  }
}

function startColumnDrag(event: DragEvent) {
  isColumnDrag.value = true;
  event.dataTransfer?.setData("columnId", String(props.column.id));
  event.dataTransfer!.effectAllowed = "move";
}
function onColumnDragStart(event: DragEvent) {
  event.stopPropagation();
  event.dataTransfer?.setData("type", "column");
  event.dataTransfer?.setData("columnId", String(props.column.id));
  event.dataTransfer!.effectAllowed = "move";
}
function onColumnDragEnd(event: DragEvent) {
  event.stopPropagation();
}

function onDragOver(event: DragEvent) {
  event.preventDefault();
  const type = event.dataTransfer?.getData("type");
  if (type === "column") {
    event.dataTransfer!.dropEffect = "move";
    return;
  }
  if (type === "task") {
    event.dataTransfer!.dropEffect = "move";
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
}
function onDragLeave() {
  isDragOver.value = false;
  movingTask.value = null;
}
function onDrop(event: DragEvent) {
  const type = event.dataTransfer?.getData("type");
  if (type === "column") {
    event.preventDefault();
    const columnId = event.dataTransfer?.getData("columnId");
    if (!columnId || Number(columnId) === props.column.id) return;
    emit("reorderColumn", { fromId: Number(columnId), toId: props.column.id });
    return;
  }
  if (type === "task") {
    isDragOver.value = false;
    movingTask.value = null;
    const taskId = event.dataTransfer?.getData("taskId");
    if (taskId) {
      emit("moveTask", { taskId: Number(taskId), newStatus: props.column.status });
    }
    return;
  }
}
// Expose columns globally for preview lookup
if (typeof window !== "undefined") {
  window.__columns = window.__columns || [];
  window.__columns = window.__columns.length ? window.__columns : [props.column];
}
function handleToggleDropdown() {
  isDropdownVisible.value = !isDropdownVisible.value;
}

// Add these stub methods to handle dropdown actions
function editColumn() {
  isDropdownVisible.value = false;
  isEditing.value = true;
  editableTitle.value = props.column.title;
}

function saveEdit() {
  if (editableTitle.value.trim()) {
    props.column.title = editableTitle.value.trim();
  }
  isEditing.value = false;
}

function deleteColumn() {
  // Implement column delete logic here
  emit("deleteColumn", props.column.id);

  isDropdownVisible.value = false;
}

function closeDropdown() {
  isDropdownVisible.value = false;
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
