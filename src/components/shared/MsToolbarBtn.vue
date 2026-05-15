<template>
    <MsTooltip :content="tooltip" :position="position">
        <div class="icon-action-btn" :class="{ 'icon-action-btn--has-filter': active }">
            <div :class="icon"></div>
        </div>
    </MsTooltip>
</template>

<script setup>
import MsTooltip from '@/components/base/ms-tooltip/MsTooltip.vue'

defineProps({
    icon:     { type: String, required: true },
    tooltip:  { type: String, required: true },
    active:   { type: Boolean, default: false },
    position: { type: String, default: 'bottom' },
})
</script>
