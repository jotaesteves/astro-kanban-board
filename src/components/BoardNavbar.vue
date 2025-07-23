<template>
  <div class="bg-gray-100 border-b border-gray-200">
    <div class="px-8 py-2 flex justify-between items-center">
      <h1 class="text-xl font-bold">{{ title }}</h1>
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
import type { User } from "@/types";
import { computed } from "vue";
import UserAvatar from "./UserAvatar.vue";

const AVATAR_LIMIT = 4; // Limit the number of avatars shown

// props for title and collaborators can be added if needed
const props = defineProps<{
  title?: string;
  collaborators?: User[];
}>();

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
