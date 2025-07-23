<template>
  <div
    class="bg-white rounded-xl shadow-lg p-4 draggable-task min-h-[140px] flex flex-col gap-2 border-2 w-full"
    :class="[borderColorClass, { dragging: isDragging }]"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <div class="flex items-center gap-2 mb-1">
      <span :class="['inline-block text-white text-xs font-bold px-2 py-1 rounded-full', badgeColorClass]">{{
        task.type
      }}</span>
      <span class="ml-auto text-xs text-gray-400">#{{ task.id }}</span>
    </div>
    <div class="font-bold text-lg text-blue-900 mb-1">{{ task.title }}</div>
    <div v-if="task.description" class="text-gray-700 text-sm mb-1">{{ task.description }}</div>
    <div v-if="task.summary" class="text-gray-500 text-xs mb-2">{{ task.summary }}</div>
    <div class="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
      <span class="text-xs text-gray-500">
        {{ formattedDate }}
      </span>
      <span class="flex items-center gap-2">
        <svg class="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12H9v-2h2v2zm0-4H9V6h2v4z" />
        </svg>
        <CollaboratorAvatar v-if="task.collaborator" :collaborator="task.collaborator" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{ task: Task }>();
const isDragging = ref(false);

function onDragStart(event: DragEvent) {
  event.dataTransfer?.setData("type", "task");
  event.dataTransfer?.setData("taskId", props.task.id.toString());
  isDragging.value = true;
  event.dataTransfer!.effectAllowed = "move";
}

function onDragEnd() {
  isDragging.value = false;
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
  return typeColorMap[type]?.border || "border-blue-200";
});

const badgeColorClass = computed(() => {
  const type = props.task.type?.toLowerCase();
  return typeColorMap[type]?.badge || "bg-blue-500";
});
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
