<template>
  <BoardNavbar client:only="vue" :title="title" :collaborators="collaborators" />
  <div
    class="flex gap-4 p-8 bg-gray-100 min-h-screen overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
  >
    <ColumnComponent
      v-for="(column, idx) in columns"
      :key="column.id"
      :column="column"
      :onAddTask="() => openSideModal({ boardId: column.boardId || 1, columnId: column.id, status: column.status })"
      @moveTask="moveTask"
      @deleteColumn="deleteColumn"
      @reorderColumn="reorderColumn"
      class="flex-shrink-0"
      @dragover="onColumnDragOver(idx)"
      @drop="onColumnDrop(idx)"
      @updateTitle="onColumnTitleUpdate"
    />
    <AddColumnButton class="flex-shrink-0" @addColumn="addColumn" />

    <SideModal
      :visible="isSideModalVisible"
      :columnStatus="sideModalColumnStatus.columnStatus"
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

import type { Column as ColumnType, User } from "@/types";
import { TaskStatus } from "@/types";
import { ref } from "vue";

const title: string = "Kanban Board";

// Props for server-fetched data
const props = defineProps<{ collaborators: User[]; columns: ColumnType[] }>();

const collaborators = ref([...props.collaborators]);
const columns = ref([...props.columns]);

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
  const column = columns.value.find((c: ColumnType) => c.status === status);
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
  const fromColumn = columns.value.find((col: ColumnType) => col.tasks.some((task: any) => task.id === taskId));
  const toColumn = columns.value.find((col: ColumnType) => col.status === newStatus);
  if (!fromColumn || !toColumn) return;
  const taskIdx = fromColumn.tasks.findIndex((task: any) => task.id === taskId);
  if (taskIdx === -1) return;
  const [task] = fromColumn.tasks.splice(taskIdx, 1);
  task.status = newStatus;
  toColumn.tasks.push(task);
}

function deleteColumn(columnId: number) {
  const index = columns.value.findIndex((col: ColumnType) => col.id === columnId);
  if (index !== -1) {
    columns.value.splice(index, 1);
  }
}

function reorderColumn({ fromId, toId }: { fromId: number; toId: number }) {
  const fromIdx = columns.value.findIndex((col: ColumnType) => col.id === fromId);
  const toIdx = columns.value.findIndex((col: ColumnType) => col.id === toId);
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
    const fromIdx = columns.value.findIndex((col: ColumnType) => col.id === Number(columnId));
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
const sideModalColumnStatus = ref({ columnStatus: "", boardId: 0, columnId: 0 });

function openSideModal({ boardId, columnId, status }: { boardId: number; columnId: number; status: string }) {
  sideModalColumnStatus.value = { columnStatus: status, boardId, columnId };
  isSideModalVisible.value = true;
}
function closeSideModal() {
  isSideModalVisible.value = false;
}
async function handleAddTask(task: any) {
  const newTask = {
    columnId: sideModalColumnStatus.value.columnId,
    boardId: sideModalColumnStatus.value.boardId,
    title: task.title,
    type: task.type,
    description: task.description,
    summary: task.summary,
    status: task.status,
    assignee: task.collaborator?.name || "",
    assigneeId: 1, // TODO: Map collaborator to actual ID
    dueDate: "",
    priority: "medium",
    createdAt: task.createdAt,
    updatedAt: task.createdAt,
  };

  try {
    const res = await fetch("/api/add-task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });

    if (res.ok) {
      const result = await res.json();
      // Find the target column and add the task
      const targetColumn = columns.value.find((col: ColumnType) => col.id === sideModalColumnStatus.value.columnId);
      if (targetColumn) {
        // Create a task object that matches our frontend Task interface
        const createdTask = {
          id: Date.now(),
          title: newTask.title,
          status: newTask.status as TaskStatus,
          type: newTask.type,
          description: newTask.description,
          summary: newTask.summary,
          assignee: newTask.assignee,
          dueDate: newTask.dueDate,
          priority: newTask.priority as any,
          createdAt: newTask.createdAt,
          updatedAt: newTask.updatedAt,
          collaborator: task.collaborator,
        };
        targetColumn.tasks.push(createdTask);
      }
    } else {
      console.error("Failed to add task:", await res.text());
    }
  } catch (error) {
    console.error("Error adding task:", error);
  }
}

function onColumnTitleUpdate({ id, title }: { id: number; title: string }) {
  console.warn("Updating column title:", title);
  const column = columns.value.find((col: ColumnType) => col.id === id);
  if (column) {
    column.title = title;
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
