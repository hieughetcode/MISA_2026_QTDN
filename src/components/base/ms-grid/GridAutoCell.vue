<template>
    <StatusBadge v-if="col.badge" v-bind="col.badge(value)" />
    <span v-else :class="col.cellClass?.(value) ?? 'cell-text'">
        {{ col.format?.(value) ?? value }}
    </span>
</template>

<script setup>
import StatusBadge from '@/components/shared/StatusBadge.vue'

defineProps({
    col: { type: Object, required: true },
    value: { default: null }
})
</script>

<style scoped>
.cell-text { color: var(--text-primary-color, #212121); }
.cell-yes { color: var(--status-active, #34b057); font-weight: 500; }
.cell-muted { color: var(--text-disable-color, #9e9e9e); }
</style>
