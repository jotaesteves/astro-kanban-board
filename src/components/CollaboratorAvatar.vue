<template>
  <img
    v-if="collaborator"
    :src="collaborator.avatar"
    :alt="initials"
    class="w-6 h-6 rounded-full border border-gray-300"
  />
</template>
<script setup lang="ts">
import { computed } from "vue";
const props = defineProps<{ collaborator: { name: string; avatar: string } }>();
const initials = computed(() =>
  props.collaborator?.name
    ? props.collaborator.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
    : ""
);
</script>
