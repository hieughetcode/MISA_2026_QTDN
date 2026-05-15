<template>
  <div class="search-wrap">
    <div class="icon-search-sm"></div>
    <input
      class="search-wrap__input"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Tìm kiếm' },
})
defineEmits(['update:modelValue'])
</script>
