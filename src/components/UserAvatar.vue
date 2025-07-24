<template>
  <span
    class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-bold border-2 border-white shadow"
    :title="user.name"
  >
    <template v-if="user.avatarUrl">
      <img :src="user.avatarUrl" alt="User Avatar" class="w-8 h-8 rounded-full object-cover" />
    </template>
    <template v-else>
      {{ user.name.charAt(0).toUpperCase() }}
    </template>
  </span>
</template>
<script setup lang="ts">
import type { User } from "@/types";
const props = defineProps<{ user: User }>();
</script>
