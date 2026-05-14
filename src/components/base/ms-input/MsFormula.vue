<template>
    <div class="ms-formula-wrapper">
        <label v-if="label" class="ms-formula-label">
            {{ label }} <span v-if="required" class="ms-formula-required">*</span>
        </label>

        <div class="ms-formula-container" :class="{ 'is-focused': isFocused }">
            <textarea
                class="ms-formula-input"
                :value="modelValue"
                :placeholder="placeholder"
                :readonly="readonly"
                rows="3"
                spellcheck="false"
                @input="$emit('update:modelValue', $event.target.value)"
                @focus="isFocused = true"
                @blur="isFocused = false"
            ></textarea>
            <div class="ms-formula-hint">
                Dùng <code>[TÊN_KHOẢN]</code> để tham chiếu thành phần khác. Ví dụ: <code>[LCB_VP] * 0.08</code>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
    modelValue: { type: String, default: '' },
    label: { type: String, default: '' },
    required: { type: Boolean, default: false },
    placeholder: { type: String, default: 'Nhập công thức tính... VD: [LCB_VP] * 0.08' },
    readonly: { type: Boolean, default: false }
})
defineEmits(['update:modelValue'])

const isFocused = ref(false)
</script>

<style scoped>
.ms-formula-wrapper {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
}

.ms-formula-label {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary-color, #212121);
}

.ms-formula-required {
    color: var(--red-color, #ff6161);
    margin-left: 2px;
}

.ms-formula-container {
    border: 1px solid var(--input-normal-border-color, #e0e0e0);
    border-radius: 4px;
    background: #fafff8;
    transition: border-color 0.2s;
    overflow: hidden;
}

.ms-formula-container.is-focused {
    border-color: var(--input-active-border-color, #34b057);
}

.ms-formula-input {
    width: 100%;
    padding: 8px 12px;
    border: none;
    outline: none;
    background: transparent;
    font-size: 13px;
    font-family: 'Consolas', 'Courier New', monospace;
    color: var(--text-primary-color, #212121);
    resize: vertical;
    min-height: 68px;
    box-sizing: border-box;
    line-height: 1.6;
}

.ms-formula-input::placeholder {
    color: var(--text-disable-color, #9e9e9e);
    font-family: inherit;
}

.ms-formula-hint {
    padding: 4px 12px 6px;
    font-size: 11px;
    color: var(--text-secondary-color, #666);
    border-top: 1px dashed var(--input-normal-border-color, #e0e0e0);
    background: #f6fdf8;
}

.ms-formula-hint code {
    background: #e8f5e9;
    padding: 0 3px;
    border-radius: 2px;
    font-family: 'Consolas', monospace;
    color: var(--primary, #34b057);
}
</style>