<template>
    <Transition name="ms-toast-slide">
        <div v-if="visible" class="ms-toast" :class="[`ms-toast--${type}`]">
            <div class="ms-toast__icon-block">
                <div :class="['icon-toast', `icon-toast-${type}`]"></div>
            </div>
            <div class="ms-toast__body">
                <span class="ms-toast__text">{{ text }}</span>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

defineOptions({
    name: "MsToast",
});

const props = defineProps({
    type: { type: String, default: "info" },
    text: { type: String, required: true },
    duration: { type: Number, default: 3000 },
});

const emit = defineEmits(["close"]);

const visible = ref(false);
let timer = null;

onMounted(() => {
    visible.value = true;
    timer = setTimeout(() => {
        visible.value = false;
        setTimeout(() => emit("close"), 300);
    }, props.duration);
});

onBeforeUnmount(() => {
    clearTimeout(timer);
});
</script>

<style scoped>
/* ── Slide animation ──────────────────────────────── */
.ms-toast-slide-enter-active {
    animation: toast-slide-in 0.3s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
}

.ms-toast-slide-leave-active {
    animation: toast-slide-out 0.3s cubic-bezier(0.06, 0.71, 0.55, 1) forwards;
}

@keyframes toast-slide-in {
    from {
        opacity: 0;
        transform: translateX(-100%);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes toast-slide-out {
    from {
        opacity: 1;
        transform: translateX(0);
    }

    to {
        opacity: 0;
        transform: translateX(-100%);
    }
}

/* ── Wrapper ──────────────────────────────────────── */
.ms-toast {
    display: inline-flex;
    align-items: stretch;
    height: 40px;
    border-radius: 4px;
    font-size: 13px;
    color: var(--text-primary-color, #212121);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    overflow: hidden;
    white-space: nowrap;
}

/* ── Left: solid color icon block (40px wide) ─────── */
.ms-toast__icon-block {
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.icon-toast {
    width: 20px;
    height: 20px;
    background-color: #fff;
    mask-size: cover;
    mask-repeat: no-repeat;
    mask-position: center;
    -webkit-mask-size: cover;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center;
}

/* ── Right: light bg + text ───────────────────────── */
.ms-toast__body {
    display: flex;
    align-items: center;
    padding: 0 16px 0 12px;
}

.ms-toast__text {
    line-height: 1;
}

/* ── Info ─────────────────────────────────────────── */
.ms-toast--info {
    border: 1px solid var(--live-chat-bg, #0073e6);
}

.ms-toast--info .ms-toast__icon-block {
    background-color: var(--live-chat-bg, #0073e6);
}

.ms-toast--info .ms-toast__body {
    background-color: #e5f0ff;
}

.icon-toast-info {
    mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='currentColor' xmlns='http://www.w3.org/2000/svg'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'/></svg>");
    -webkit-mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='currentColor' xmlns='http://www.w3.org/2000/svg'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'/></svg>");
}

/* ── Warning ──────────────────────────────────────── */
.ms-toast--warning {
    border: 1px solid var(--status-pending, #ff9900);
}

.ms-toast--warning .ms-toast__icon-block {
    background-color: var(--status-pending, #ff9900);
}

.ms-toast--warning .ms-toast__body {
    background-color: #fff3e0;
}

.icon-toast-warning {
    mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='currentColor' xmlns='http://www.w3.org/2000/svg'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'/></svg>");
    -webkit-mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='currentColor' xmlns='http://www.w3.org/2000/svg'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'/></svg>");
}

/* ── Success ──────────────────────────────────────── */
.ms-toast--success {
    border: 1px solid var(--primary, #34b057);
}

.ms-toast--success .ms-toast__icon-block {
    background-color: var(--primary, #34b057);
}

.ms-toast--success .ms-toast__body {
    background-color: var(--primary-bg, #eafbf2);
}

.icon-toast-success {
    mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='currentColor' xmlns='http://www.w3.org/2000/svg'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/></svg>");
    -webkit-mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='currentColor' xmlns='http://www.w3.org/2000/svg'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/></svg>");
}

/* ── Error ────────────────────────────────────────── */
.ms-toast--error {
    border: 1px solid var(--red-color, #ff6161);
}

.ms-toast--error .ms-toast__icon-block {
    background-color: var(--red-color, #ff6161);
}

.ms-toast--error .ms-toast__body {
    background-color: #ffebeb;
}

.icon-toast-error {
    mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='currentColor' xmlns='http://www.w3.org/2000/svg'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z'/></svg>");
    -webkit-mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='currentColor' xmlns='http://www.w3.org/2000/svg'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z'/></svg>");
}
</style>