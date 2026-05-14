<template>
    <Teleport to="body">
        <Transition name="column-setup-slide">
            <div v-if="modelValue" class="column-setup-backdrop" @click.self="$emit('update:modelValue', false)">
                <div class="column-setup-panel">
                    <div class="column-setup-header">
                        <span class="column-setup-title">Cài đặt cột hiển thị</span>
                        <div class="column-setup-close" @click="$emit('update:modelValue', false)">
                            <div class="icon-close"></div>
                        </div>
                    </div>

                    <div class="column-setup-body">
                        <div class="column-setup-hint">
                            Kéo thả để sắp xếp thứ tự. Bật/tắt để ẩn/hiện cột.
                        </div>

                        <VueDraggableNext v-model="localColumns" handle=".drag-handle" item-key="field" class="column-list">
                            <template #item="{ element }">
                                <div class="column-item" :class="{ 'is-pinned': element.fixed }">
                                    <div class="drag-handle" title="Kéo để sắp xếp">
                                        <div class="icon-drag"></div>
                                    </div>
                                    <div class="column-item-name">{{ element.caption }}</div>
                                    <MsToggle
                                        :model-value="element.visible"
                                        :disabled="element.fixed"
                                        :true-value="true"
                                        :false-value="false"
                                        @update:model-value="toggleColumn(element, $event)"
                                    />
                                </div>
                            </template>
                        </VueDraggableNext>
                    </div>

                    <div class="column-setup-footer">
                        <button class="btn-reset" @click="resetToDefault">Đặt lại mặc định</button>
                        <div class="footer-actions">
                            <button class="btn-cancel" @click="$emit('update:modelValue', false)">Hủy</button>
                            <button class="btn-apply" @click="applyChanges">Áp dụng</button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import MsToggle from '@/components/base/ms-selection/MsToggle.vue'

const props = defineProps({
    modelValue: { type: Boolean, default: false },
    columns: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue', 'apply'])

const localColumns = ref([])

watch(() => props.columns, (cols) => {
    localColumns.value = cols.map(c => ({ ...c }))
}, { immediate: true, deep: true })

watch(() => props.modelValue, (v) => {
    if (v) localColumns.value = props.columns.map(c => ({ ...c }))
})

const toggleColumn = (col, val) => {
    col.visible = val
}

const resetToDefault = () => {
    localColumns.value = props.columns.map(c => ({ ...c, visible: c.defaultVisible ?? true }))
}

const applyChanges = () => {
    emit('apply', localColumns.value.map((c, i) => ({ ...c, order: i })))
    emit('update:modelValue', false)
}
</script>

<style scoped>
.column-setup-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1500;
    display: flex;
    justify-content: flex-end;
}

.column-setup-panel {
    width: 340px;
    height: 100%;
    background: #fff;
    box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12);
    display: flex;
    flex-direction: column;
}

.column-setup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    height: 52px;
    border-bottom: 1px solid var(--grid-border-color, #e0e0e0);
    flex-shrink: 0;
}

.column-setup-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary-color, #212121);
}

.column-setup-close {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s;
}

.column-setup-close:hover {
    background: var(--icon-bg-hover, #f2f2f2);
}

.icon-close {
    width: 18px;
    height: 18px;
    background-color: var(--icon-border, #707070);
    mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' xmlns='http://www.w3.org/2000/svg'><line x1='18' y1='6' x2='6' y2='18'/><line x1='6' y1='6' x2='18' y2='18'/></svg>");
    mask-size: cover;
}

.column-setup-body {
    flex: 1;
    overflow-y: auto;
    padding: 12px 0;
}

.column-setup-hint {
    font-size: 12px;
    color: var(--text-secondary-color, #666);
    padding: 0 16px 8px;
}

.column-list {
    display: flex;
    flex-direction: column;
}

.column-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 16px;
    transition: background 0.15s;
    border-radius: 4px;
    margin: 1px 8px;
}

.column-item:hover {
    background: var(--bg-main, #f2f2f2);
}

.column-item.is-pinned {
    opacity: 0.65;
}

.drag-handle {
    cursor: grab;
    display: flex;
    align-items: center;
    padding: 2px;
    border-radius: 3px;
    color: var(--icon-border, #707070);
}

.drag-handle:active {
    cursor: grabbing;
}

.icon-drag {
    width: 18px;
    height: 18px;
    background-color: var(--text-secondary-color, #666);
    mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='currentColor' xmlns='http://www.w3.org/2000/svg'><circle cx='9' cy='6' r='1.5'/><circle cx='15' cy='6' r='1.5'/><circle cx='9' cy='12' r='1.5'/><circle cx='15' cy='12' r='1.5'/><circle cx='9' cy='18' r='1.5'/><circle cx='15' cy='18' r='1.5'/></svg>");
    mask-size: cover;
}

.column-item-name {
    flex: 1;
    font-size: 13px;
    color: var(--text-primary-color, #212121);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.column-setup-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-top: 1px solid var(--grid-border-color, #e0e0e0);
    flex-shrink: 0;
}

.footer-actions {
    display: flex;
    gap: 8px;
}

.btn-reset {
    background: none;
    border: none;
    color: var(--primary, #34b057);
    font-size: 13px;
    cursor: pointer;
    padding: 6px 8px;
    border-radius: 4px;
    font-family: inherit;
}

.btn-reset:hover {
    background: var(--primary-bg, #eafbf2);
}

.btn-cancel,
.btn-apply {
    height: 32px;
    padding: 0 16px;
    border-radius: 4px;
    font-size: 13px;
    cursor: pointer;
    font-family: inherit;
    border: 1px solid var(--input-normal-border-color, #e0e0e0);
    background: #fff;
    color: var(--text-primary-color, #212121);
    transition: all 0.2s;
}

.btn-cancel:hover {
    border-color: var(--primary, #34b057);
    color: var(--primary, #34b057);
}

.btn-apply {
    background: var(--primary, #34b057);
    border-color: var(--primary, #34b057);
    color: #fff;
}

.btn-apply:hover {
    background: var(--button-primary-hover-bg-color, #02b936);
    border-color: var(--button-primary-hover-bg-color, #02b936);
}

/* Slide-in from right */
.column-setup-slide-enter-active,
.column-setup-slide-leave-active {
    transition: opacity 0.25s;
}

.column-setup-slide-enter-active .column-setup-panel,
.column-setup-slide-leave-active .column-setup-panel {
    transition: transform 0.25s ease;
}

.column-setup-slide-enter-from,
.column-setup-slide-leave-to {
    opacity: 0;
}

.column-setup-slide-enter-from .column-setup-panel,
.column-setup-slide-leave-to .column-setup-panel {
    transform: translateX(100%);
}
</style>