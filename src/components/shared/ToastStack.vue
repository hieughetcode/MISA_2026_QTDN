<template>
    <div class="toast-stack">
        <MsToast v-for="t in toasts" :key="t.id" :type="t.type" :text="t.text" @close="$emit('close', t.id)" />
    </div>
</template>

<script setup>
import MsToast from '@/components/base/ms-popup/MsToast.vue'

defineProps({
    toasts: { type: Array, required: true }
})

defineEmits(['close'])
</script>
