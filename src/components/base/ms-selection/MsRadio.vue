<template>
    <label class="ms-radio" :class="{
        'ms-radio--checked': isChecked,
        'ms-radio--disabled': disabled,
    }">
        <span class="ms-radio__ripple">
            <span class="ms-radio__box">
                <span v-if="isChecked" class="ms-radio__dot"></span>
            </span>
        </span>

        <input class="ms-radio__input" type="radio" :value="value" :checked="isChecked" :disabled="disabled"
            v-bind="$attrs" @change="handleChange" />

        <span v-if="$slots.default || label" class="ms-radio__label">
            <slot>{{ label }}</slot>
        </span>
    </label>
</template>

<script setup>
import { computed } from "vue";

defineOptions({
    name: "MsRadio",
    inheritAttrs: false,
});

const props = defineProps({
    modelValue: { type: [String, Number, Boolean], default: "" },
    value: { type: [String, Number, Boolean], required: true },
    label: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "change"]);

const isChecked = computed(() => props.modelValue === props.value);

const handleChange = () => {
    if (props.disabled) return;
    emit("update:modelValue", props.value);
    emit("change", props.value);
};
</script>

<style scoped>
/* ── Base ─────────────────────────────────────────── */
.ms-radio {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
}

.ms-radio--disabled {
    cursor: not-allowed;
}

/* Hide native input */
.ms-radio__input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
}

/* ── Ripple (hover / press ring) ──────────────────── */
.ms-radio__ripple {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    flex-shrink: 0;
    transition: background-color 0.15s ease;
}

/* Hover – only on non-disabled */
.ms-radio:not(.ms-radio--disabled):hover .ms-radio__ripple {
    background-color: var(--icon-bg-hover, #f2f2f2);
}

/* Press */
.ms-radio:not(.ms-radio--disabled):active .ms-radio__ripple {
    background-color: var(--icon-bg-press, #ebebeb);
}

/* ── Box ──────────────────────────────────────────── */
.ms-radio__box {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 1.75px solid var(--icon-border, #707070);
    background-color: var(--text-white-primary-color, #ffffff);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.15s ease;
    flex-shrink: 0;
}

/* Active (checked) */
.ms-radio--checked .ms-radio__box {
    border-color: var(--primary, #34b057);
}

/* Disabled Inactive */
.ms-radio--disabled:not(.ms-radio--checked) .ms-radio__box {
    border-color: var(--input-disable-border, #e1e1e1);
    background-color: var(--text-white-primary-color, #ffffff);
}

/* Disabled Active */
.ms-radio--disabled.ms-radio--checked .ms-radio__box {
    border-color: var(--button-primary-disabled-border-color, rgba(52, 176, 87, 0.6));
}

/* ── Dot ──────────────────────────────────────────── */
.ms-radio__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--primary, #34b057);
    transition: background-color 0.15s ease;
}

/* Disabled Active Dot */
.ms-radio--disabled.ms-radio--checked .ms-radio__dot {
    background-color: var(--button-primary-disabled-bg-color, rgba(52, 176, 87, 0.6));
}

/* ── Label ────────────────────────────────────────── */
.ms-radio__label {
    font-size: 14px;
    line-height: 1.4;
    color: var(--text-primary-color, #212121);
    transition: color 0.15s ease;
}

.ms-radio--disabled .ms-radio__label {
    color: var(--text-disable-color, #9e9e9e);
}
</style>
