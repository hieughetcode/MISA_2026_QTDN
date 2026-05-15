<template>
  <MsDropdownList :modelValue="modelValue" :options="options" :isActionMenu="true" :showCheckmark="true"
    @update:modelValue="$emit('update:modelValue', $event)">
    <template #trigger="{ isOpen }">
      <div class="filter-chip" :class="{ 'is-open': isOpen }">
        <span v-if="label">
          {{ label }}: <b>{{ selectedLabel }}</b>
        </span>

        <b v-else>{{ selectedLabel }}</b>

        <div class="icon-chevron-xs" :class="{ 'is-open': isOpen }"></div>
      </div>
    </template>
  </MsDropdownList>
</template>

<script setup>
import { computed } from 'vue'
import MsDropdownList from '@/components/base/ms-dropdown/MsDropdownList.vue'

const props = defineProps({
  label: { type: String, default: '' },
  modelValue: { default: '' },
  options: { type: Array, required: true },
  wide: { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])

const selectedLabel = computed(() => {
  const opt = props.options.find(o => o.value === props.modelValue)
  return opt ? opt.label : (props.options[0]?.label ?? '')
})
</script>

<style scoped>
.filter-chip {
  display: flex;
  width: 100%;

  align-items: center;
  justify-content: space-between;
  gap: 6px;

  height: 30px;
  padding: 0 12px;

  border: 1px solid var(--input-normal-border-color, #e0e0e0);
  border-radius: 8px;

  background: var(--text-white-primary-color, #ffffff);

  cursor: pointer;

  font-size: 14px;
  color: var(--text-primary-color, #212121);

  white-space: nowrap;

  transition: border-color 0.2s;
  box-sizing: border-box;
}

.filter-chip:hover {
  background-color: var(--ms-color-bg-hover, #f5f5f5);
}
</style>