<template>
    <button class="ms-button" :class="[
        `ms-button-${type}`,
        {
            'is-disabled': disabled,
            'icon-only': !hasText && icon && !rightIcon,
            'has-left-icon': !!icon,
            'has-right-icon': !!rightIcon || type === 'combo' || type === 'mixed'
        }
    ]" :disabled="disabled" @click="onClick">
        <div v-if="icon" class="button-icon ms-icon-left">
            <MsIcon :name="icon" />
        </div>

        <div class="button-text" v-if="hasText">
            <slot></slot>
        </div>

        <div v-if="type === 'combo'" class="combo-divider"></div>

        <div v-if="rightIcon || type === 'combo' || type === 'mixed'" class="button-icon ms-icon-right">
            <MsIcon :name="rightIcon || 'ic-chevron-down'" />
        </div>
    </button>
</template>

<script setup>
import { computed, useSlots } from 'vue';

// Khai báo các thuộc tính đầu vào (Props)
const props = defineProps({
    // Loại nút: 'primary', 'secondary', 'link', 'combo', 'mixed'
    type: {
        type: String,
        default: 'primary'
    },
    // Tên icon muốn hiển thị bên trái (VD: Nút Button with icon)
    icon: {
        type: String,
        default: ''
    },
    // Tên icon hiển thị bên phải (VD: Nút Combo, Mixed)
    rightIcon: {
        type: String,
        default: ''
    },
    // Trạng thái vô hiệu hóa
    disabled: {
        type: Boolean,
        default: false
    }
});

// Khai báo sự kiện đầu ra (Emits)
const emit = defineEmits(['click']);

// Kiểm tra xem component cha có truyền text vào <slot> hay không
const slots = useSlots();
const hasText = computed(() => {
    return !!slots.default;
});

// Xử lý logic click
const onClick = (event) => {
    if (!props.disabled) {
        emit('click', event);
    }
};
</script>

<style scoped>
.ms-button {
    min-width: 80px;
    height: 36px;
    padding: 0 16px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-family: inherit;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
    box-sizing: border-box;
    outline: none;
}

.ms-button.has-left-icon {
    padding-left: 12px;
}

.ms-button.has-right-icon {
    padding-right: 12px;
}

.ms-button.ms-button-combo {
    padding-right: 8px;
}

.ms-button:disabled,
.ms-button.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.button-icon {
    display: flex;
    align-items: center;
    justify-content: center;
}

.ms-button-primary,
.ms-button-combo,
.ms-button-mixed {
    background-color: var(--button-primary-normal-bg-color, #34b057);
    /* Enable */
    color: var(--button-primary-color, #fff);
}

/* Trạng thái Hover */
.ms-button-primary:hover:not(:disabled),
.ms-button-combo:hover:not(:disabled),
.ms-button-mixed:hover:not(:disabled) {
    background-color: var(--button-primary-hover-bg-color, #02B936);
}

/* Trạng thái Pressed */
.ms-button-primary:active:not(:disabled),
.ms-button-combo:active:not(:disabled),
.ms-button-mixed:active:not(:disabled) {
    background-color: var(--button-primary-active-bg-color, #198F3B);
}

/* Nút Secondary */
.ms-button-secondary {
    background-color: var(--button-primary-color, #fff);
    color: var(--text-primary-color, #212121);
    border: 1px solid var(--input-normal-border-color, #e0e0e0);
}

.ms-button-secondary:hover:not(:disabled) {
    background-color: var(--icon-bg-hover, #f2f2f2);
    color: var(--button-primary-hover-bg-color, #02B936);
    border-color: var(--button-primary-hover-border-color, #02B936);
}

.ms-button-secondary:active:not(:disabled) {
    background-color: var(--icon-bg-press, #ebebeb);
    color: var(--button-primary-active-bg-color, #198F3B);
    border-color: var(--button-primary-active-border-color, #198F3B);
}

/* Link button */
.ms-button-link {
    background-color: transparent;
    color: var(--button-primary-normal-bg-color, #34b057);
    min-width: unset;
    padding: 0 8px;
}

.ms-button-link:hover:not(:disabled) {
    color: var(--button-primary-hover-bg-color, #02B936);
    text-decoration: underline;
}

.ms-button-link:active:not(:disabled) {
    color: var(--button-primary-active-bg-color, #198F3B);
}

/* Vạch phân cách riêng cho Combo Button */
.combo-divider {
    width: 1px;
    height: 20px;
    background-color: rgba(255, 255, 255, 0.5);
    margin: 0 4px;
}

/* Nút chỉ có icon fallback */
.ms-button.icon-only {
    padding: 0;
    min-width: 36px;
    width: 36px;
    border-radius: 4px;
}
</style>