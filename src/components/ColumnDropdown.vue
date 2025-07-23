<template>
  <div
    v-if="visible"
    class="absolute right-2 top-10 z-10 bg-white border rounded shadow-lg min-w-[150px] column-dropdown"
  >
    <ul class="py-2">
      <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer" @click="$emit('edit')">Edit Column</li>
      <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer" @click="showModal = true">Delete Column</li>
    </ul>
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-20">
      <div class="bg-white rounded shadow-lg p-6 min-w-[260px]">
        <div class="mb-4 text-lg font-semibold">Delete this column?</div>
        <div class="mb-6 text-gray-600">Are you sure you want to delete this column? This action cannot be undone.</div>
        <div class="flex justify-end gap-2">
          <button class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" @click="showModal = false">Cancel</button>
          <button class="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600" @click="confirmDelete">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
const props = defineProps<{ visible: boolean }>();
const emit = defineEmits(["edit", "delete", "close"]);
const showModal = ref(false);

function handleClickOutside(event: MouseEvent) {
  const dropdown = document.querySelector(".column-dropdown");
  if (dropdown && !dropdown.contains(event.target as Node)) {
    emit("close");
  }
}

function confirmDelete() {
  showModal.value = false;
  emit("delete");
}

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});
</script>

<style scoped>
.column-dropdown {
  position: absolute;
  right: 0.5rem;
  top: 2.5rem;
  z-index: 10;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  min-width: 120px;
}
</style>
