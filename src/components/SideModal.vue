<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex justify-end">
    <transition name="fade">
      <div v-if="visible" class="absolute inset-0 bg-black bg-opacity-30" />
    </transition>
    <transition name="side-modal">
      <div v-if="visible" class="bg-white w-full max-w-md h-full shadow-xl p-8 flex flex-col relative z-10">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold">Add Task</h2>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 flex-1">
          <input v-model="title" type="text" placeholder="Title" class="border rounded px-3 py-2" required />
          <select v-model="type" class="border rounded px-3 py-2" required>
            <option disabled value="">Select Type</option>
            <option value="task">Task</option>
            <option value="bug">Bug</option>
            <option value="feature">Feature</option>
            <option value="improvement">Improvement</option>
            <option value="epic">Epic</option>
          </select>
          <textarea v-model="description" placeholder="Description" class="border rounded px-3 py-2" rows="3" />
          <input v-model="summary" type="text" placeholder="Summary" class="border rounded px-3 py-2" />
          <input
            v-model="collaboratorName"
            type="text"
            placeholder="Collaborator Name"
            class="border rounded px-3 py-2"
          />
          <input
            v-model="collaboratorAvatar"
            type="url"
            placeholder="Collaborator Avatar URL"
            class="border rounded px-3 py-2"
          />
          <button type="submit" class="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4">Add Task</button>
        </form>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const props = defineProps<{ visible: boolean; columnStatus: string }>();
const emit = defineEmits(["close", "addTask"]);

const title = ref("");
const type = ref("");
const description = ref("");
const summary = ref("");
const collaboratorName = ref("");
const collaboratorAvatar = ref("");

function handleSubmit() {
  emit("addTask", {
    title: title.value,
    type: type.value,
    description: description.value,
    summary: summary.value,
    collaborator: collaboratorName.value
      ? { name: collaboratorName.value, avatar: collaboratorAvatar.value }
      : undefined,
    status: props.columnStatus,
    createdAt: new Date().toISOString(),
  });
  // Reset form fields
  title.value = "";
  type.value = "";
  description.value = "";
  summary.value = "";
  collaboratorName.value = "";
  collaboratorAvatar.value = "";
  emit("close");
}
</script>

<style scoped>
/* Fade for overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

/* Slide for modal: right to left */
.side-modal-enter-active,
.side-modal-leave-active {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease;
}
.side-modal-enter-from,
.side-modal-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
.side-modal-enter-to,
.side-modal-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>
