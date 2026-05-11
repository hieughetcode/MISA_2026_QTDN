<template>
    <label class="ms-checkbox" :class="{
        'ms-checkbox--checked': modelValue,
        'ms-checkbox--disabled': disabled,
    }">
        <span class="ms-checkbox__ripple">
            <span class="ms-checkbox__box">
                <svg v-if="modelValue" class="ms-checkbox__checkmark" viewBox="0 0 12 10" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5L4.5 8.5L11 1.5" stroke="white" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </span>
        </span>

        <input class="ms-checkbox__input" type="checkbox" :checked="modelValue" :disabled="disabled" v-bind="$attrs"
            @change="handleChange" />

        <span v-if="$slots.default || label" class="ms-checkbox__label">
            <slot>{{ label }}</slot>
        </span>
    </label>
</template>

<script>
export default {
    name: "MsCheckbox",

    inheritAttrs: false,

    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        label: {
            type: String,
            default: "",
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },

    emits: ["update:modelValue", "change"],

    methods: {
        handleChange(event) {
            if (this.disabled) return;
            this.$emit("update:modelValue", event.target.checked);
            this.$emit("change", event.target.checked);
        },
    },
};
</script>

<style scoped>
/* ── Base ─────────────────────────────────────────── */
.ms-checkbox {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
}

.ms-checkbox--disabled {
    cursor: not-allowed;
}

/* Hide native input */
.ms-checkbox__input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
}

/* ── Ripple (hover / press ring) ──────────────────── */
.ms-checkbox__ripple {
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
.ms-checkbox:not(.ms-checkbox--disabled):hover .ms-checkbox__ripple {
    background-color: var(--icon-bg-hover, #f2f2f2);
}

/* Press */
.ms-checkbox:not(.ms-checkbox--disabled):active .ms-checkbox__ripple {
    background-color: var(--icon-bg-press, #ebebeb);
}

/* ── Box ──────────────────────────────────────────── */
.ms-checkbox__box {
    width: 18px;
    height: 18px;
    border-radius: 3px;
    border: 1.75px solid var(--icon-border, #707070);
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.15s ease, border-color 0.15s ease;
    flex-shrink: 0;
}

/* Active (checked) */
.ms-checkbox--checked .ms-checkbox__box {
    background-color: var(--color-primary, #34b057);
    border-color: var(--color-primary, #34b057);
}

/* Disabled Inactive */
.ms-checkbox--disabled:not(.ms-checkbox--checked) .ms-checkbox__box {
    border-color: #c7c7c7;
    background-color: #ffffff;
}

/* Disabled Active */
.ms-checkbox--disabled.ms-checkbox--checked .ms-checkbox__box {
    background-color: #a8dbb8;
    border-color: #a8dbb8;
}

/* ── Checkmark SVG ────────────────────────────────── */
.ms-checkbox__checkmark {
    width: 12px;
    height: 10px;
    display: block;
}

/* ── Label ────────────────────────────────────────── */
.ms-checkbox__label {
    font-size: 14px;
    line-height: 1.4;
    color: var(--text-main, #212121);
    transition: color 0.15s ease;
}

.ms-checkbox--disabled .ms-checkbox__label {
    color: var(--text-placeholder, #9e9e9e);
}
</style>