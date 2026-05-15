<template>
    <div class="ms-dropdown-wrapper" :class="{ 'action-wrapper': isActionMenu }" ref="dropdownRef">
        <label v-if="label" class="ms-dropdown-label">{{ label }}</label>

        <!-- Nếu là dạng Context Menu (Chỉ hiển thị menu khi click phần tử trigger từ bên ngoài truyền vào slot) -->
        <div v-if="isActionMenu" class="ms-dropdown-action-trigger" @click="toggleDropdown">
            <slot name="trigger" :isOpen="isOpen"></slot>
        </div>

        <!-- Nếu là Combobox / Dropdown list thường -->
        <div v-else class="ms-dropdown-trigger" :class="{ 'is-open': isOpen, 'is-multi': isMulti }"
            @click="toggleDropdown">
            <!-- Multi tags -->
            <div v-if="isMulti" class="ms-dropdown-tags">
                <span v-if="internalValue.length === 0 && !isOpen" class="placeholder">{{ placeholder }}</span>
                <span v-for="(val, idx) in internalValue" :key="idx" class="ms-tag">
                    {{ getLabel(val) }}
                    <span class="ms-tag-close" @click.stop="removeOption(val)">
                        <div class="icon-close-tag"></div>
                    </span>
                </span>
                <input v-if="isOpen" class="ms-dropdown-search ms-dropdown-search-multi" v-model="searchText"
                    ref="searchInput" />
            </div>

            <!-- Single input (Searchable combobox) -->
            <div v-else class="ms-dropdown-input-wrapper">
                <input class="ms-dropdown-input" v-model="searchText" :placeholder="placeholder"
                    :readonly="!isSearchable" ref="searchInput" @focus="isOpen = true" />
            </div>

            <!-- Icons (Loading hoặc Chevron) -->
            <div class="ms-dropdown-actions">
                <div v-if="isLoading" class="icon-loading"></div>
                <div v-else class="icon-chevron" :class="{ 'is-rotated': isOpen }"></div>
            </div>
        </div>

        <!-- Dropdown Menu -->
        <Transition name="fade-down">
            <div v-if="isOpen" class="ms-dropdown-menu" :class="{ 'action-menu': isActionMenu }">
                <template v-for="(option, index) in displayOptions" :key="index">
                    <!-- Divider line -->
                    <div v-if="option.divider" class="ms-dropdown-divider"></div>

                    <!-- Normal Option -->
                    <div v-else class="ms-dropdown-item"
                        :class="{ 'is-selected': isSelected(option), 'is-danger': option.danger }"
                        @click="selectOption(option)">
                        <span class="item-text">{{ option.label }}</span>

                        <div v-if="isSelected(option) && (!isActionMenu || showCheckmark)" class="icon-check"></div>
                        <div v-if="option.hasSub" class="icon-chevron-right"></div>
                    </div>
                </template>

                <div v-if="displayOptions.length === 0" class="ms-dropdown-empty">
                    Không có dữ liệu
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
    modelValue: { type: [String, Number, Array], default: '' },
    options: { type: Array, default: () => [] }, // Array of { label, value, danger, divider, hasSub }
    label: { type: String, default: '' },
    placeholder: { type: String, default: '- Không chọn -' },
    isMulti: { type: Boolean, default: false },
    isLoading: { type: Boolean, default: false },
    isSearchable: { type: Boolean, default: true },
    isActionMenu: { type: Boolean, default: false }, // Dùng cho loại menu ngữ cảnh như hình Bảng màu
    showCheckmark: { type: Boolean, default: false } // Cho phép hiển thị dấu check ngay cả khi là Action Menu
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const searchText = ref('');
const searchInput = ref(null);
const dropdownRef = ref(null);

const internalValue = ref(props.isMulti ? (Array.isArray(props.modelValue) ? [...props.modelValue] : []) : props.modelValue);

// Cập nhật text hiển thị trên input khi chọn 1 option (cho single select)
const updateSearchText = () => {
    if (!props.isMulti && !props.isActionMenu) {
        const selected = props.options.find(o => o.value === internalValue.value);
        searchText.value = selected ? selected.label : '';
    } else {
        searchText.value = '';
    }
};

watch(() => props.modelValue, (newVal) => {
    internalValue.value = props.isMulti ? [...newVal] : newVal;
    updateSearchText();
}, { immediate: true, deep: true });

watch(isOpen, (newVal) => {
    if (!newVal) {
        updateSearchText(); // Reset lại text nếu đóng popup mà không chọn
    } else if (props.isSearchable && !props.isMulti && !props.isActionMenu) {
        searchText.value = ''; // Xóa text để gõ tìm kiếm khi mở
        setTimeout(() => searchInput.value?.focus(), 50);
    } else if (props.isMulti) {
        setTimeout(() => searchInput.value?.focus(), 50);
    }
});

const displayOptions = computed(() => {
    if (!searchText.value || props.isActionMenu) return props.options;
    return props.options.filter(o => !o.divider && o.label.toLowerCase().includes(searchText.value.toLowerCase()));
});

const isSelected = (option) => {
    if (props.isMulti) {
        return internalValue.value.includes(option.value);
    }
    return internalValue.value === option.value;
};

const getLabel = (val) => {
    const opt = props.options.find(o => o.value === val);
    return opt ? opt.label : val;
};

const selectOption = (option) => {
    if (props.isMulti) {
        const index = internalValue.value.indexOf(option.value);
        if (index > -1) {
            internalValue.value.splice(index, 1);
        } else {
            internalValue.value.push(option.value);
        }
        emit('update:modelValue', internalValue.value);
        searchText.value = '';
        searchInput.value?.focus();
    } else {
        internalValue.value = option.value;
        emit('update:modelValue', option.value);
        isOpen.value = false;
    }
};

const removeOption = (val) => {
    const index = internalValue.value.indexOf(val);
    if (index > -1) {
        internalValue.value.splice(index, 1);
        emit('update:modelValue', internalValue.value);
    }
};

const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
};

// Click outside để đóng
const handleClickOutside = (event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        isOpen.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.ms-dropdown-wrapper {
    position: relative;
    font-family: inherit;
    display: inline-flex;
    flex-direction: column;
    gap: 4px;
}

.ms-dropdown-wrapper:not(.action-wrapper) {
    width: 100%;
}

.ms-dropdown-label {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary-color, #212121);
    margin-bottom: 2px;
}

.ms-dropdown-action-trigger {
    display: inline-flex;
    cursor: pointer;
}

.ms-dropdown-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid var(--input-normal-border-color, #e0e0e0);
    border-radius: 8px;
    min-height: 30px;
    background: var(--text-white-primary-color, #ffffff);
    cursor: pointer;
    transition: border-color 0.2s;
    padding: 0 12px;
    box-sizing: border-box;
    width: 100%;
}

.ms-dropdown-trigger:hover,
.ms-dropdown-trigger.is-open {
    border-color: var(--input-active-border-color, #34b057);
}

/* Input */
.ms-dropdown-input-wrapper {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    overflow: hidden;
}

.ms-dropdown-input {
    width: 100%;
    height: 30px;
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
    color: var(--text-primary-color, #212121);
    cursor: pointer;
}

.ms-dropdown-input::placeholder {
    color: var(--text-disable-color, #9e9e9e);
}

.is-open .ms-dropdown-input {
    cursor: text;
}

/* Tags */
.ms-dropdown-tags {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding: 4px 0;
    align-items: center;
    min-height: 28px;
}

.placeholder {
    color: var(--text-disable-color, #9e9e9e);
    font-size: 14px;
}

.ms-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--bg-main, #f2f2f2);
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 13px;
    color: var(--text-primary-color, #212121);
}

.ms-tag-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: 50%;
}

.ms-tag-close:hover {
    background-color: var(--input-normal-border-color, #e0e0e0);
}

.ms-dropdown-search-multi {
    border: none;
    outline: none;
    flex: 1;
    min-width: 50px;
    background: transparent;
    font-size: 14px;
}

/* Actions */
.ms-dropdown-actions {
    display: flex;
    align-items: center;
    margin-left: 8px;
    flex-shrink: 0;
}

/* Menu */
.ms-dropdown-menu {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;

    width: max-content;
    min-width: 100%;

    background: var(--text-white-primary-color, #ffffff);
    border: 1px solid var(--input-normal-border-color, #e0e0e0);
    border-radius: 4px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

    padding: 8px 0px;
    box-sizing: border-box;

    z-index: 1000;
    max-height: 250px;
    overflow-y: auto;
}

/* Items */
.ms-dropdown-item {
    padding: 8px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    font-size: 14px;
    color: var(--text-primary-color, #212121);
    transition: background 0.2s;
    border-radius: 4px;
}

.ms-dropdown-item:hover {
    background-color: var(--ms-color-bg-hover, #f5f5f5);
}

.ms-dropdown-item.is-selected {
    color: var(--primary, #34b057);
    background-color: #CDEADF;
}

.ms-dropdown-item.is-danger {
    color: var(--red-color, #ff6161);
}

.ms-dropdown-divider {
    height: 1px;
    background-color: var(--input-normal-border-color, #e0e0e0);
    margin: 4px 0;
}

.ms-dropdown-empty {
    padding: 8px 16px;
    font-size: 14px;
    color: var(--text-disable-color, #9e9e9e);
    text-align: center;
}

/* Transitions */
.fade-down-enter-active,
.fade-down-leave-active {
    transition: opacity 0.2s, transform 0.2s;
}

.fade-down-enter-from,
.fade-down-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

/* Icons */
.icon-chevron {
    width: 20px;
    height: 20px;
    background-color: var(--icon-border, #707070);
    mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'><polyline points='6 9 12 15 18 9'></polyline></svg>");
    mask-size: cover;
    transition: transform 0.2s;
}

.icon-chevron.is-rotated {
    transform: rotate(180deg);
}

.icon-check {
    width: 20px;
    height: 20px;
    background-color: var(--primary, #34b057);
    mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'><polyline points='20 6 9 17 4 12'></polyline></svg>");
    mask-size: cover;
}

.icon-chevron-right {
    width: 16px;
    height: 16px;
    background-color: var(--icon-border, #707070);
    mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'><polyline points='9 18 15 12 9 6'></polyline></svg>");
    mask-size: cover;
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

.icon-loading {
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
</style>
