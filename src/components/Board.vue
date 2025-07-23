<template>
  <BoardNavbar client:only="vue" :title="title" :collaborators="collaborators" />
  <div class="flex gap-6 p-8 bg-gray-100 min-h-screen">
    <ColumnComponent
      v-for="column in columns"
      :key="column.id"
      :column="column"
      :onAddTask="() => addTask(column.status)"
      @moveTask="moveTask"
    />
  </div>
</template>

<script setup lang="ts">
import ColumnComponent from "../components/Column.vue";
import BoardNavbar from "../components/BoardNavbar.vue";
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
</script>
