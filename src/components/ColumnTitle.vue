<template>
  <h2
    class="text-lg font-bold px-4 py-3 border-gray-200 cursor-move select-none"
    draggable="true"
    @dragstart="$emit('dragstart', $event)"
    @dragend="$emit('dragend', $event)"
  >
    <template v-if="isEditing">
      <input
        :value="editableTitleLocal"
        @input="onInput"
        @keydown.enter="saveEdit"
        @blur="saveEdit"
        class="text-lg font-bold px-4 py-3 border-gray-200 outline-none rounded bg-gray-100"
        :placeholder="title"
        autofocus
      />
    </template>
    <template v-else>
      {{ title }}
    </template>
  </h2>
</template>
<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from "vue";
const props = defineProps<{ title: string; isEditing: boolean; editableTitle: string }>();
const emit = defineEmits(["edit", "save", "update:title", "dragstart", "dragend"]);

const editableTitleLocal = ref(props.editableTitle);
watch(
  () => props.editableTitle,
  (val) => {
    editableTitleLocal.value = val;
  }
);

function onInput(e: Event) {
  const val = (e.target as HTMLInputElement).value;
  editableTitleLocal.value = val;
  emit("update:title", val);
}

function saveEdit() {
  emit("save");
}
</script>
