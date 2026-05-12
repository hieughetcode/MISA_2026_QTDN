<template>
    <label class="ms-toggle" :class="{ 'ms-toggle--checked': isChecked, 'ms-toggle--disabled': disabled }">
        <input type="checkbox" class="ms-toggle__input" :checked="isChecked" :disabled="disabled" @change="handleChange"
            v-bind="$attrs" />
        <span class="ms-toggle__track">
            <span class="ms-toggle__handle"></span>
        </span>
        <span v-if="label || $slots.default" class="ms-toggle__label">
            <slot>{{ label }}</slot>
        </span>
    </label>
</template>

<script setup>
import { computed } from "vue";

defineOptions({
    name: "MsToggle",
    inheritAttrs: false,
});

const props = defineProps({
    modelValue: { type: [Boolean, String, Number], default: false },
    trueValue: { type: [Boolean, String, Number], default: true },
    falseValue: { type: [Boolean, String, Number], default: false },
    label: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "change"]);

const isChecked = computed(() => props.modelValue === props.trueValue);

const handleChange = (event) => {
    if (props.disabled) return;
    const val = event.target.checked ? props.trueValue : props.falseValue;
    emit("update:modelValue", val);
    emit("change", val);
};
</script>

<style scoped>
.ms-toggle {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
}

.ms-toggle--disabled {
    cursor: not-allowed;
}

.ms-toggle__input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
}

/* Track - Thanh nền trượt */
.ms-toggle__track {
    position: relative;
    display: inline-block;
    width: 36px;
    height: 20px;
    background-color: var(--text-disable-color, #9e9e9e);
    /* Trạng thái Off */
    border-radius: 10px;
    transition: background-color 0.25s ease;
    flex-shrink: 0;
}

/* Handle - Hình tròn di chuyển */
.ms-toggle__handle {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    background-color: var(--text-white-primary-color, #ffffff);
    border-radius: 50%;
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

/* -- Trạng thái On (Checked) -- */
.ms-toggle--checked .ms-toggle__track {
    background-color: var(--primary, #34b057);
}

.ms-toggle--checked .ms-toggle__handle {
    transform: translateX(16px);
}

/* -- Trạng thái Disable Off -- */
.ms-toggle--disabled:not(.ms-toggle--checked) .ms-toggle__track {
    background-color: var(--input-disable-border, #e1e1e1);
}

.ms-toggle--disabled:not(.ms-toggle--checked) .ms-toggle__handle {
    background-color: #f5f5f5;
    box-shadow: none;
    border: 1px solid var(--grid-border-color, #e0e0e0);
    box-sizing: border-box;
}

/* -- Trạng thái Disable On -- */
.ms-toggle--disabled.ms-toggle--checked .ms-toggle__track {
    background-color: var(--button-primary-disabled-bg-color, rgba(52, 176, 87, 0.6));
}

.ms-toggle--disabled.ms-toggle--checked .ms-toggle__handle {
    box-shadow: none;
}

/* -- Nhãn (Label) -- */
.ms-toggle__label {
    font-size: 14px;
    line-height: 1.4;
    color: var(--text-primary-color, #212121);
    transition: color 0.15s ease;
}

.ms-toggle--disabled .ms-toggle__label {
    color: var(--text-disable-color, #9e9e9e);
}
</style>