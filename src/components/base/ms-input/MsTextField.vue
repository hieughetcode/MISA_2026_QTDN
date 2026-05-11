<template>
    <div class="ms-textfield-wrapper">
        <label v-if="label" class="ms-textfield-label">
            {{ label }} <span v-if="required" class="ms-textfield-required">*</span>
        </label>

        <div class="ms-textfield-container" :class="[
            `state-${state}`,
            {
                'is-focused': isFocused || focused,
                'is-hovered': hovered,
                'is-readonly': readonly,
                'is-multi': isMulti,
                'is-search': isSearch
            }
        ]">
            <!-- Multi tags -->
            <div v-if="isMulti" class="ms-textfield-tags">
                <span v-for="(tag, index) in internalTags" :key="index" class="ms-textfield-tag">
                    {{ tag }}
                    <span v-if="!readonly" class="ms-textfield-tag-close" @click="removeTag(index)">
                        <div class="icon-close-tag"></div>
                    </span>
                </span>
                <input v-if="!readonly" class="ms-textfield-input"
                    :placeholder="internalTags.length === 0 ? placeholder : ''" @keydown.enter.prevent="addTag"
                    v-model="newTag" @focus="isFocused = true" @blur="isFocused = false" />
            </div>

            <!-- Normal input -->
            <input v-else class="ms-textfield-input" :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)" :placeholder="placeholder" :readonly="readonly"
                :disabled="readonly" @focus="isFocused = true" @blur="isFocused = false" />

            <!-- Right Icons -->
            <div v-if="isSearch" class="ms-textfield-action search-action">
                <div class="icon-search"></div>
            </div>
            <div v-else-if="state === 'error'" class="ms-textfield-icon">
                <div class="icon-error"></div>
            </div>
            <div v-else-if="state === 'valid'" class="ms-textfield-icon">
                <div class="icon-valid"></div>
            </div>
            <div v-else-if="state === 'verifying'" class="ms-textfield-icon">
                <div class="icon-verifying"></div>
            </div>
        </div>

        <!-- Error message -->
        <div v-if="state === 'error' && errorMessage" class="ms-textfield-error-text">
            {{ errorMessage }}
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    modelValue: { type: [String, Number, Array], default: '' },
    label: { type: String, default: '' },
    required: { type: Boolean, default: false },
    placeholder: { type: String, default: '' },
    // state: 'normal', 'error', 'valid', 'verifying'
    state: { type: String, default: 'normal' },
    errorMessage: { type: String, default: '' },
    readonly: { type: Boolean, default: false },
    isMulti: { type: Boolean, default: false },
    isSearch: { type: Boolean, default: false },
    // Props hỗ trợ demo để ép trạng thái mà không cần tương tác
    focused: { type: Boolean, default: false },
    hovered: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue']);

const isFocused = ref(false);
const newTag = ref('');
const internalTags = ref(Array.isArray(props.modelValue) ? [...props.modelValue] : []);

watch(() => props.modelValue, (newVal) => {
    if (props.isMulti && Array.isArray(newVal)) {
        internalTags.value = [...newVal];
    }
});

const addTag = () => {
    if (newTag.value.trim() !== '') {
        internalTags.value.push(newTag.value.trim());
        newTag.value = '';
        emit('update:modelValue', internalTags.value);
    }
};

const removeTag = (index) => {
    internalTags.value.splice(index, 1);
    emit('update:modelValue', internalTags.value);
};
</script>

<style scoped>
.ms-textfield-wrapper {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-family: inherit;
    width: 100%;
}

.ms-textfield-label {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary-color, #212121);
    margin-bottom: 2px;
}

.ms-textfield-required {
    color: var(--red-color, #ff6161);
    margin-left: 2px;
}

.ms-textfield-container {
    display: flex;
    align-items: center;
    border: 1px solid var(--input-normal-border-color, #e0e0e0);
    border-radius: 4px;
    min-height: 36px;
    background: var(--text-white-primary-color, #ffffff);
    transition: border-color 0.2s;
    box-sizing: border-box;
    overflow: hidden;
}

.ms-textfield-container:hover:not(.is-readonly),
.ms-textfield-container.is-hovered {
    border-color: var(--input-hover-border-color, #34b057);
}

.ms-textfield-container.is-focused {
    border-color: var(--input-active-border-color, #34b057);
}

.ms-textfield-container.state-error {
    border-color: var(--input-error-border-color, #ff6161);
}

.ms-textfield-container.state-valid,
.ms-textfield-container.state-verifying {
    border-color: var(--input-active-border-color, #34b057);
}

.ms-textfield-container.is-readonly {
    background-color: var(--input-disable-bg-color, #ebebeb);
    border-color: var(--input-disable-border, #e1e1e1);
}

.ms-textfield-input {
    flex: 1;
    height: 34px;
    border: none;
    outline: none;
    padding: 0 12px;
    font-size: 14px;
    background: transparent;
    color: var(--text-primary-color, #212121);
    width: 100%;
}

.ms-textfield-input::placeholder {
    color: var(--text-disable-color, #9e9e9e);
}

.ms-textfield-input:disabled {
    cursor: not-allowed;
}

.ms-textfield-error-text {
    font-size: 12px;
    color: var(--red-color, #ff6161);
    margin-top: 2px;
}

/* -- Icons -- */
.ms-textfield-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    flex-shrink: 0;
}

.ms-textfield-action {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    cursor: pointer;
    transition: background 0.2s;
    flex-shrink: 0;
}

.ms-textfield-action:hover {
    background-color: var(--icon-bg-hover, #f2f2f2);
}

.ms-textfield-action:active {
    background-color: var(--icon-bg-press, #ebebeb);
}

/* Sử dụng Inline SVG Mask để đảm bảo hiển thị đúng trên mọi môi trường */
.icon-search {
    width: 20px;
    height: 20px;
    background-color: var(--icon-border, #707070);
    mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'><circle cx='11' cy='11' r='8'></circle><line x1='21' y1='21' x2='16.65' y2='16.65'></line></svg>");
    mask-size: cover;
}

.icon-error {
    width: 20px;
    height: 20px;
    background-color: var(--red-color, #ff6161);
    mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'><circle cx='12' cy='12' r='10'></circle><line x1='12' y1='8' x2='12' y2='12'></line><line x1='12' y1='16' x2='12.01' y2='16'></line></svg>");
    mask-size: cover;
}

.icon-valid {
    width: 20px;
    height: 20px;
    background-color: var(--primary, #34b057);
    mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'><path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'></path><polyline points='22 4 12 14.01 9 11.01'></polyline></svg>");
    mask-size: cover;
}

.icon-verifying {
    width: 18px;
    height: 18px;
    border: 2px solid var(--grid-border-color, #e0e0e0);
    border-top: 2px solid var(--primary, #34b057);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* -- Tags for Multi -- */
.ms-textfield-tags {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    flex-wrap: wrap;
    width: 100%;
}

.ms-textfield-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--bg-main, #f2f2f2);
    color: var(--text-primary-color, #212121);
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 13px;
}

.is-readonly .ms-textfield-tag {
    background: var(--grid-border-color, #e0e0e0);
}

.ms-textfield-tag-close {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 16px;
    height: 16px;
}

.icon-close-tag {
    width: 12px;
    height: 12px;
    background-color: var(--icon-border, #707070);
    mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'><line x1='18' y1='6' x2='6' y2='18'></line><line x1='6' y1='6' x2='18' y2='18'></line></svg>");
    mask-size: cover;
}

.icon-close-tag:hover {
    background-color: var(--red-color, #ff6161);
}

.ms-textfield-tags .ms-textfield-input {
    flex: 1;
    min-width: 60px;
    height: 24px;
    padding: 0 4px;
}
</style>
