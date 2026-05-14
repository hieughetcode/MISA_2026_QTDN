<template>
    <Teleport to="body">
        <Transition name="ms-modal">
            <div v-if="modelValue" class="ms-modal-backdrop" @mousedown.self="onBackdropClick">
                <div class="ms-modal-dialog" :style="{ width: width + 'px' }" @mousedown.stop>
                    <!-- Header -->
                    <div class="ms-modal-header">
                        <div class="ms-modal-title">{{ title }}</div>
                        <div class="ms-modal-close" @click="$emit('update:modelValue', false)">
                            <div class="icon-close"></div>
                        </div>
                    </div>

                    <!-- Body -->
                    <div class="ms-modal-body">
                        <slot name="body"></slot>
                        <slot></slot>
                    </div>

                    <!-- Footer -->
                    <div v-if="$slots.footer" class="ms-modal-footer">
                        <slot name="footer"></slot>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
    modelValue: { type: Boolean, default: false },
    title: { type: String, default: '' },
    width: { type: Number, default: 520 },
    closeOnBackdrop: { type: Boolean, default: true }
})

const emit = defineEmits(['update:modelValue'])

const onBackdropClick = () => {
    if (props.closeOnBackdrop) emit('update:modelValue', false)
}

const onKeydown = (e) => {
    if (e.key === 'Escape' && props.modelValue) emit('update:modelValue', false)
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
.ms-modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.ms-modal-dialog {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
    display: flex;
    flex-direction: column;
    max-height: 90vh;
    max-width: 96vw;
    overflow: hidden;
}

.ms-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    height: 52px;
    border-bottom: 1px solid var(--grid-border-color, #e0e0e0);
    flex-shrink: 0;
}

.ms-modal-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary-color, #212121);
}

.ms-modal-close {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s;
}

.ms-modal-close:hover {
    background: var(--icon-bg-hover, #f2f2f2);
}

.ms-modal-close:active {
    background: var(--icon-bg-press, #ebebeb);
}

.icon-close {
    width: 20px;
    height: 20px;
    background-color: var(--icon-border, #707070);
    mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'><line x1='18' y1='6' x2='6' y2='18'/><line x1='6' y1='6' x2='18' y2='18'/></svg>");
    mask-size: cover;
}

.ms-modal-body {
    padding: 20px;
    overflow-y: auto;
    flex: 1;
}

.ms-modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    padding: 12px 20px;
    border-top: 1px solid var(--grid-border-color, #e0e0e0);
    flex-shrink: 0;
}

/* Transition */
.ms-modal-enter-active,
.ms-modal-leave-active {
    transition: opacity 0.2s ease;
}

.ms-modal-enter-active .ms-modal-dialog,
.ms-modal-leave-active .ms-modal-dialog {
    transition: transform 0.2s ease, opacity 0.2s ease;
}

.ms-modal-enter-from,
.ms-modal-leave-to {
    opacity: 0;
}

.ms-modal-enter-from .ms-modal-dialog,
.ms-modal-leave-to .ms-modal-dialog {
    transform: translateY(-20px) scale(0.97);
    opacity: 0;
}
</style>