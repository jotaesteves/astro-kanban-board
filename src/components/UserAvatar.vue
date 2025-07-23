<template>
  <span
    class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-bold border-2 border-white shadow"
    :title="user.name"
  >
    {{ user.name.charAt(0).toUpperCase() }}
  </span>
</template>
<script setup lang="ts">
import type { User } from "@/types";
const props = defineProps<{ user: User }>();
</script>
