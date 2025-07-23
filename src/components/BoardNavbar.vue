<template>
  <div class="bg-gray-100 border-b border-gray-200">
    <div class="px-8 py-2 flex justify-between items-center">
      <h1 class="text-xl font-bold">{{ title }}</h1>
      <div class="flex items-center space-x-2">
        <label for="board-select" class="text-sm font-medium text-gray-700 mr-2">Board:</label>
        <div class="relative">
          <select
            id="board-select"
            :value="selectedBoardId"
            @change="onBoardChange"
            class="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-800 text-sm transition-all duration-150"
          >
            <option v-for="board in boards" :key="board.id" :value="board.id">
              {{ board.name }}
            </option>
          </select>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
            <svg
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-600">Collaborators:</span>
        <div class="flex -space-x-1">
          <UserAvatar v-for="user in limitedShowAvatars" :key="user.id" :user="user" />
          <p
            v-if="(collaborators?.length ?? 0) > AVATAR_LIMIT"
            class="inline-flex items-center justify-center text-gray-700 text-sm font-bold px-2"
            :title="remainingCollaboratorNames"
          >
            +{{ (collaborators?.length ?? 0) - AVATAR_LIMIT }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { KanbanBoard, User } from "@/types";
import { computed } from "vue";
import UserAvatar from "./UserAvatar.vue";

const AVATAR_LIMIT = 4; // Limit the number of avatars shown

// props for title and collaborators can be added if needed
const props = defineProps<{
  title?: string;
  collaborators?: User[];
  boards?: KanbanBoard[];
  selectedBoardId?: number | null;
}>();

const emit = defineEmits(["update:selectedBoardId"]);

function onBoardChange(event: Event) {
  const target = event.target as HTMLSelectElement | null;
  if (target) {
    emit("update:selectedBoardId", Number(target.value));
  }
}

const limitedShowAvatars = computed(() => {
  return props.collaborators?.slice(0, AVATAR_LIMIT) || [];
});

const remainingCollaboratorNames = computed(() => {
  if (!props.collaborators || props.collaborators.length <= AVATAR_LIMIT) return "";
  return props.collaborators
    .slice(AVATAR_LIMIT)
    .map((user) => user.name)
    .join(", ");
});
</script>
