<template>
  <div
    class="bg-white rounded-xl shadow-lg p-4 draggable-task min-h-[140px] flex flex-col gap-2 border-2 w-full cursor-pointer"
    :class="[borderColorClass, { dragging: isDragging }]"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @click="onCardClick"
  >
    <div class="flex items-center gap-2 mb-1">
      <span :class="['inline-block text-white text-xs font-bold px-2 py-1 rounded-full', badgeColorClass]">{{
        task.type
      }}</span>
      <span class="ml-auto text-xs text-gray-400">#{{ task.id }}</span>
    </div>
    <div class="font-bold text-lg text-blue-900 mb-1">{{ task.title }}</div>
    <div v-if="task.description" class="text-gray-700 text-sm mb-1 whitespace-pre-line">{{ task.description }}</div>
    <div v-if="task.summary" class="text-gray-500 text-xs mb-2">{{ task.summary }}</div>
    <div class="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
      <div class="flex flex-col">
        <span class="text-xs text-gray-500">
          {{ formattedDate }}
        </span>
        <span v-if="task.assignee" class="text-xs text-gray-700 font-medium">
          {{ task.assignee }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12H9v-2h2v2zm0-4H9V6h2v4z" />
        </svg>
        <CollaboratorAvatar
          v-if="task.collaborator"
          :collaborator="task.collaborator"
          class="w-8 h-8 ring-2 ring-white shadow-md"
        />
        <span
          v-if="task.priority"
          :class="[
            'inline-flex text-white text-xs font-bold px-2 py-1 rounded-full items-center gap-1',
            priorityColorClass,
          ]"
        >
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path v-if="task.priority?.toLowerCase() === 'high'" d="M10 12l-6-6h12l-6 6z" />
            <path v-else-if="task.priority?.toLowerCase() === 'medium'" d="M6 10l6-6 6 6H6z" />
            <path v-else d="M14 10l-6 6-6-6h12z" />
          </svg>
          {{ task.priority?.toUpperCase() }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Task } from "@/types";
import CollaboratorAvatar from "./CollaboratorAvatar.vue";

const props = defineProps<{ task: Task }>();
const emit = defineEmits<{
  openDetail: [task: Task];
}>();

const isDragging = ref(false);

function onDragStart(event: DragEvent) {
  event.dataTransfer?.setData("type", "task");
  event.dataTransfer?.setData("taskId", props.task.id.toString());
  isDragging.value = true;
  event.dataTransfer!.effectAllowed = "move";
  // Prevent click event from firing when dragging starts
  event.stopPropagation();
}

function onDragEnd() {
  isDragging.value = false;
}

function onCardClick(event: MouseEvent) {
  // Only emit if we're not currently dragging and it's a left click
  if (!isDragging.value && event.button === 0) {
    emit("openDetail", props.task);
  }
}

const formattedDate = computed(() => {
  if (!props.task.createdAt) return "";
  const date = new Date(props.task.createdAt);
  return date.toLocaleDateString("en-US", { day: "2-digit", month: "short" });
});

const typeColorMap: Record<string, { border: string; badge: string }> = {
  bug: { border: "border-red-400", badge: "bg-red-500" },
  feature: { border: "border-green-400", badge: "bg-green-500" },
  task: { border: "border-blue-200", badge: "bg-blue-500" },
  improvement: { border: "border-yellow-400", badge: "bg-yellow-500" },
  // Add more types as needed
};

const borderColorClass = computed(() => {
  const type = props.task.type?.toLowerCase();
  return type ? typeColorMap[type]?.border || "border-blue-200" : "border-blue-200";
});

const badgeColorClass = computed(() => {
  const type = props.task.type?.toLowerCase();
  return type ? typeColorMap[type]?.badge || "bg-blue-500" : "bg-blue-500";
});

const priorityColorClass = computed(() => {
  const priority = props.task.priority?.toLowerCase();
  const priorityColors: Record<string, string> = {
    high: "bg-red-600",
    medium: "bg-yellow-600",
    low: "bg-green-600",
  };
  return priority ? priorityColors[priority] || "bg-gray-600" : "bg-gray-600";
});
</script>

<style scoped>
.draggable-task {
  cursor: grab;
  transition: all 0.2s ease-in-out;
}
.draggable-task:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #3b82f6 !important;
}
.draggable-task:active {
  transform: translateY(0);
}
.draggable-task.dragging {
  cursor: grabbing;
  opacity: 0.6;
  box-shadow: 0 0 10px 2px #3b82f6;
  transform: rotate(3deg);
}
</style>
