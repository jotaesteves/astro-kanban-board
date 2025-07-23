<template>
  <BoardNavbar client:only="vue" :title="title" :collaborators="collaborators" />
  <div
    class="flex gap-4 p-8 bg-gray-100 min-h-screen overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
  >
    <ColumnComponent
      v-for="(column, idx) in columns"
      :key="column.id"
      :column="column"
      :onAddTask="() => openSideModal(column.status)"
      @moveTask="moveTask"
      @deleteColumn="deleteColumn"
      @reorderColumn="reorderColumn"
      class="flex-shrink-0"
      @dragover="onColumnDragOver(idx)"
      @drop="onColumnDrop(idx)"
    />
    <AddColumnButton class="flex-shrink-0" @addColumn="addColumn" />

    <SideModal
      :visible="isSideModalVisible"
      :columnStatus="sideModalColumnStatus"
      @close="closeSideModal"
      @addTask="handleAddTask"
    />
  </div>
</template>

<script setup lang="ts">
import ColumnComponent from "../components/Column.vue";
import BoardNavbar from "../components/BoardNavbar.vue";
import AddColumnButton from "../components/AddColumnButton.vue";
import SideModal from "../components/SideModal.vue";

import type { Column, User } from "@/types";
import { TaskStatus } from "@/types";
import { ref } from "vue";

const title: string = "Kanban Board";
const collaborators: User[] = [
  {
    id: 1,
    name: "Alice",
    email: "",
  },
  {
    id: 2,
    name: "Bob",
    email: "",
  },
  {
    id: 3,
    name: "Charlie",
    email: "",
  },
  {
    id: 4,
    name: "David",
    email: "",
  },
  {
    id: 5,
    name: "Eve",
    email: "",
  },
  {
    id: 6,
    name: "Frank",
    email: "",
  },
  {
    id: 7,
    name: "Charlie",
    email: "",
  },
];

const columns = ref<Column[]>([
  { id: 1, title: "Backlog", status: TaskStatus.Backlog, tasks: [] },
  { id: 2, title: "In Progress", status: TaskStatus.InProgress, tasks: [] },
  { id: 3, title: "Review", status: TaskStatus.Review, tasks: [] },
  { id: 4, title: "Done", status: TaskStatus.Done, tasks: [] },
]);

function addColumn() {
  columns.value.push({
    id: Date.now(),
    title: "New Column",
    status: TaskStatus.Backlog,
    tasks: [],
  });
}

// Expose columns globally for drag preview
if (typeof window !== "undefined") {
  (window as any).__columns = columns.value;
}

function addTask(status: TaskStatus) {
  const validStatuses = [TaskStatus.Backlog, TaskStatus.InProgress, TaskStatus.Review, TaskStatus.Done];
  if (!validStatuses.includes(status)) {
    console.warn("Invalid status for new task:", status);
    return;
  }
  const column = columns.value.find((c) => c.status === status);
  if (column) {
    column.tasks.push({
      id: Date.now(),
      title: "New Task",
      status,
      description: "",
    });
  }
}

function moveTask({ taskId, newStatus }: { taskId: number; newStatus: TaskStatus }) {
  const fromColumn = columns.value.find((col) => col.tasks.some((task) => task.id === taskId));
  const toColumn = columns.value.find((col) => col.status === newStatus);
  if (!fromColumn || !toColumn) return;
  const taskIdx = fromColumn.tasks.findIndex((task) => task.id === taskId);
  if (taskIdx === -1) return;
  const [task] = fromColumn.tasks.splice(taskIdx, 1);
  task.status = newStatus;
  toColumn.tasks.push(task);
}

function deleteColumn(columnId: number) {
  const index = columns.value.findIndex((col) => col.id === columnId);
  if (index !== -1) {
    columns.value.splice(index, 1);
  }
}

function reorderColumn({ fromId, toId }: { fromId: number; toId: number }) {
  const fromIdx = columns.value.findIndex((col) => col.id === fromId);
  const toIdx = columns.value.findIndex((col) => col.id === toId);
  if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return;
  const [moved] = columns.value.splice(fromIdx, 1);
  columns.value.splice(toIdx, 0, moved);
  // Update global columns for preview
  if (typeof window !== "undefined") {
    (window as any).__columns = columns.value;
  }
}

let draggedColumnId: number | null = null;

function onColumnDragOver(targetIdx: number) {
  return (event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer!.dropEffect = "move";
  };
}

function onColumnDrop(targetIdx: number) {
  return (event: DragEvent) => {
    event.preventDefault();
    const columnId = event.dataTransfer?.getData("columnId");
    if (!columnId) return;
    const fromIdx = columns.value.findIndex((col) => col.id === Number(columnId));
    if (fromIdx === -1 || fromIdx === targetIdx) return;
    const [moved] = columns.value.splice(fromIdx, 1);
    columns.value.splice(targetIdx, 0, moved);
    // Update global columns for preview
    if (typeof window !== "undefined") {
      (window as any).__columns = columns.value;
    }
  };
}

const isSideModalVisible = ref(false);
const sideModalColumnStatus = ref("");

function openSideModal(status: string) {
  sideModalColumnStatus.value = status;
  isSideModalVisible.value = true;
}
function closeSideModal() {
  isSideModalVisible.value = false;
}
function handleAddTask(task: any) {
  const column = columns.value.find((c) => c.status === task.status);
  if (column) {
    column.tasks.push({
      id: Date.now(),
      ...task,
    });
  }
}
</script>

<style scoped>
.flex {
  display: flex;
}
.gap-6 {
  gap: 1.5rem;
}
.overflow-x-auto {
  overflow-x: auto;
}
.scrollbar-thin {
  scrollbar-width: thin;
}
.scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
  background: #d1d5db;
}
.scrollbar-track-gray-100::-webkit-scrollbar-track {
  background: #f3f4f6;
}
</style>
