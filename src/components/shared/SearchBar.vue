<template>
  <div class="search-wrap">
    <div class="icon-search-sm"></div>
    <input class="search-wrap__input" :value="modelValue" :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)" />
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Tìm kiếm' },
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.search-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 290px;
  flex-shrink: 0;
  height: 29px;
  padding: 0 10px;
  border: 1px solid var(--input-normal-border-color, #e0e0e0);
  border-radius: 8px;
  background: #fff;
  transition: border-color 0.2s;
}

.search-wrap:focus-within,
.search-wrap:hover {
  border-color: var(--input-hover-border-color, #34b057);
}

.icon-search-sm {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  background-color: #666 !important;
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'><circle cx='11' cy='11' r='8'/><line x1='21' y1='21' x2='16.65' y2='16.65'/></svg>");
  mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'><circle cx='11' cy='11' r='8'/><line x1='21' y1='21' x2='16.65' y2='16.65'/></svg>");
  -webkit-mask-size: cover;
  mask-size: cover;
}

.search-wrap__input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 13px;
  background: transparent;
  font-family: inherit;
}

.search-wrap__input::placeholder {
  color: var(--text-placeholder-color, #999);
}
</style>
