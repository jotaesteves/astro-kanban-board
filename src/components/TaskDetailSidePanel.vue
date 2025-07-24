<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex justify-end">
    <transition name="fade">
      <div v-if="visible" class="absolute inset-0 bg-black bg-opacity-30" @click="$emit('close')" />
    </transition>
    <transition name="side-panel">
      <div v-if="visible" class="bg-white w-full max-w-lg h-full shadow-xl flex flex-col relative z-10 overflow-hidden">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div class="flex items-center gap-3">
            <span :class="['inline-block text-white text-xs font-bold px-2 py-1 rounded-full', badgeColorClass]">
              {{ task?.type }}
            </span>
            <span
              v-if="task?.priority"
              :class="[
                'inline-flex text-white text-xs font-bold px-2 py-1 rounded-full items-center gap-1',
                priorityColorClass,
              ]"
            >
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path v-if="task?.priority?.toLowerCase() === 'high'" d="M10 12l-6-6h12l-6 6z" />
                <path v-else-if="task?.priority?.toLowerCase() === 'medium'" d="M6 10l6-6 6 6H6z" />
                <path v-else d="M14 10l-6 6-6-6h12z" />
              </svg>
              {{ task?.priority?.toUpperCase() }}
            </span>
            <span class="text-sm text-gray-500">#{{ task?.id }}</span>
          </div>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 text-2xl p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            &times;
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto">
          <div class="p-6 space-y-6">
            <!-- Title -->
            <div>
              <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ task?.title }}</h1>
              <div class="flex items-center gap-4 text-sm text-gray-500">
                <span>Created {{ formattedCreatedDate }}</span>
                <span v-if="task?.updatedAt && task.updatedAt !== task.createdAt">
                  Updated {{ formattedUpdatedDate }}
                </span>
              </div>
            </div>

            <!-- Description -->
            <div v-if="task?.description">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <div class="prose prose-sm max-w-none text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded-lg">
                {{ task.description }}
              </div>
            </div>

            <!-- Summary -->
            <div v-if="task?.summary">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Summary</h3>
              <div class="text-gray-700 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                {{ task.summary }}
              </div>
            </div>

            <!-- Task Details -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Assignee -->
              <div>
                <h4 class="text-sm font-semibold text-gray-900 mb-2">Assignee</h4>
                <div class="flex items-center gap-3">
                  <CollaboratorAvatar
                    v-if="task?.collaborator"
                    :collaborator="task.collaborator"
                    class="w-10 h-10 ring-2 ring-white shadow-md"
                  />
                  <div>
                    <div class="font-medium text-gray-900">
                      {{ task?.assignee || task?.collaborator?.name || "Unassigned" }}
                    </div>
                    <div
                      v-if="task?.collaborator?.name && task?.assignee && task.collaborator.name !== task.assignee"
                      class="text-sm text-gray-500"
                    >
                      Also: {{ task.collaborator.name }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Status -->
              <div>
                <h4 class="text-sm font-semibold text-gray-900 mb-2">Status</h4>
                <span :class="['inline-block px-3 py-1 rounded-full text-sm font-medium', statusColorClass]">
                  {{ formatStatus(task?.status) }}
                </span>
              </div>

              <!-- Due Date -->
              <div v-if="task?.dueDate">
                <h4 class="text-sm font-semibold text-gray-900 mb-2">Due Date</h4>
                <div class="text-gray-700">{{ formatDueDate(task.dueDate) }}</div>
              </div>

              <!-- Priority -->
              <div>
                <h4 class="text-sm font-semibold text-gray-900 mb-2">Priority</h4>
                <span
                  :class="[
                    'inline-flex text-white text-sm font-bold px-3 py-1 rounded-full items-center gap-1',
                    priorityColorClass,
                  ]"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path v-if="task?.priority?.toLowerCase() === 'high'" d="M10 12l-6-6h12l-6 6z" />
                    <path v-else-if="task?.priority?.toLowerCase() === 'medium'" d="M6 10l6-6 6 6H6z" />
                    <path v-else d="M14 10l-6 6-6-6h12z" />
                  </svg>
                  {{ task?.priority?.toUpperCase() || "MEDIUM" }}
                </span>
              </div>
            </div>

            <!-- Labels/Tags (if they exist) -->
            <div v-if="task?.labels && task.labels.length > 0">
              <h4 class="text-sm font-semibold text-gray-900 mb-2">Labels</h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="label in task.labels"
                  :key="label"
                  class="inline-block bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full"
                >
                  {{ label }}
                </span>
              </div>
            </div>

            <!-- Comments Section (placeholder for future implementation) -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Comments</h3>
              <div
                v-if="taskComments.length === 0"
                class="text-gray-500 text-sm italic bg-gray-50 p-4 rounded-lg text-center"
              >
                No comments yet.
              </div>
              <ul v-else class="space-y-4">
                <li v-for="comment in taskComments" :key="comment.id" class="bg-gray-50 rounded-lg p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="font-semibold text-blue-700">{{ comment.author }}</span>
                    <span class="text-xs text-gray-400">{{ new Date(comment.createdAt).toLocaleString() }}</span>
                  </div>
                  <div class="text-gray-800 whitespace-pre-line">{{ comment.content }}</div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="border-t border-gray-200 p-6 bg-gray-50">
          <div class="flex justify-between items-center">
            <button class="text-red-600 hover:text-red-800 font-medium text-sm">Delete Task</button>
            <div class="flex gap-3">
              <button
                class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Edit
              </button>
              <button
                @click="$emit('close')"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Task, Comment } from "@/types";
import CollaboratorAvatar from "./CollaboratorAvatar.vue";

const props = defineProps<{
  visible: boolean;
  task: Task | null;
  comments: Comment[];
}>();

const emit = defineEmits(["close"]);

const formattedCreatedDate = computed(() => {
  if (!props.task?.createdAt) return "";
  const date = new Date(props.task.createdAt);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});

const formattedUpdatedDate = computed(() => {
  if (!props.task?.updatedAt) return "";
  const date = new Date(props.task.updatedAt);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});

const formatDueDate = (dueDate: string) => {
  if (!dueDate) return "No due date";
  const date = new Date(dueDate);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatStatus = (status: string | undefined) => {
  if (!status) return "Unknown";
  return status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const taskComments = computed(() => {
  if (!props.task) return [];
  return props.comments?.filter((c) => c.taskId === props.task.id) || [];
});

const typeColorMap: Record<string, { border: string; badge: string }> = {
  bug: { border: "border-red-400", badge: "bg-red-500" },
  feature: { border: "border-green-400", badge: "bg-green-500" },
  task: { border: "border-blue-200", badge: "bg-blue-500" },
  improvement: { border: "border-yellow-400", badge: "bg-yellow-500" },
  epic: { border: "border-purple-400", badge: "bg-purple-500" },
};

const badgeColorClass = computed(() => {
  const type = props.task?.type?.toLowerCase();
  return type ? typeColorMap[type]?.badge || "bg-blue-500" : "bg-blue-500";
});

const priorityColorClass = computed(() => {
  const priority = props.task?.priority?.toLowerCase();
  const priorityColors: Record<string, string> = {
    high: "bg-red-600",
    medium: "bg-yellow-600",
    low: "bg-green-600",
  };
  return priority ? priorityColors[priority] || "bg-gray-600" : "bg-yellow-600";
});

const statusColorClass = computed(() => {
  const status = props.task?.status?.toLowerCase();
  const statusColors: Record<string, string> = {
    backlog: "bg-gray-100 text-gray-800",
    "in-progress": "bg-blue-100 text-blue-800",
    review: "bg-yellow-100 text-yellow-800",
    done: "bg-green-100 text-green-800",
  };
  return status ? statusColors[status] || "bg-gray-100 text-gray-800" : "bg-gray-100 text-gray-800";
});
</script>

<style scoped>
/* Fade for overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

/* Slide for panel: right to left */
.side-panel-enter-active,
.side-panel-leave-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease;
}
.side-panel-enter-from,
.side-panel-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
.side-panel-enter-to,
.side-panel-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.prose {
  line-height: 1.6;
}
</style>
