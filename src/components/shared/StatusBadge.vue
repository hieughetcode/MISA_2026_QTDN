<template>
  <span class="badge" :class="`badge--${variant}`">{{ text }}</span>
</template>

<script setup>
defineProps({
  variant: { type: String, required: true }, // active|inactive|green|red|blue|gray
  text: { type: String, required: true },
})
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}
.badge--active  { background: #e8f5e9; color: #2e7d32; }
.badge--inactive { background: #f5f5f5; color: #757575; }
.badge--green   { background: #e8f5e9; color: #2e7d32; }
.badge--red     { background: #ffebee; color: #c62828; }
.badge--blue    { background: #e3f2fd; color: #1565c0; }
.badge--gray    { background: #f5f5f5; color: #616161; }
</style>
