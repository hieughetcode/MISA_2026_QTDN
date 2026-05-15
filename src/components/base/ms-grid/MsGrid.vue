<template>
    <div class="ms-grid-wrapper">
        <div v-if="$slots.toolbarLeft || $slots.toolbarRight" class="ms-grid-toolbar">
            <div class="ms-grid-toolbar__left">
                <slot name="toolbarLeft" />
            </div>
            <div class="ms-grid-toolbar__right">
                <slot name="toolbarRight" />
            </div>
        </div>
        <Transition name="batch-slide">
            <div v-if="selectedCount > 0" class="ms-grid-batch">
                <span class="ms-grid-batch__info">Đã chọn <strong>{{ selectedCount }}</strong> bản ghi</span>
                <div class="ms-grid-batch__actions">
                    <slot name="batchActions" />
                </div>
            </div>
        </Transition>
        <div class="ms-grid-body">
            <DxDataGrid
                ref="gridRef"
                :data-source="data"
                :key-expr="keyExpr"
                :show-borders="false"
                :hover-state-enabled="true"
                :row-alternation-enabled="false"
                :allow-column-resizing="true"
                column-resizing-mode="widget"
                :column-auto-width="false"
                height="100%"
                @selection-changed="emit('selectionChanged', $event)"
                @row-dbl-click="emit('rowDblClick', $event)"
                @context-menu-preparing="emit('contextMenuPreparing', $event)"
            >
                <DxSelection v-if="selectable" mode="multiple" show-check-boxes-mode="always" />
                <DxScrolling mode="standard" />
                <DxPaging :enabled="false" />

                <DxColumn
                    v-for="col in columns"
                    :key="col.field"
                    :data-field="col.field"
                    :caption="col.caption"
                    :width="col.width"
                    :min-width="col.minWidth || 80"
                    :fixed="col.fixed || false"
                    :fixed-position="col.fixedPosition || undefined"
                    :cell-template="col.cellTemplate || (col.format || col.badge ? '__ms_auto__' : undefined)"
                    :calculate-cell-value="col.calculateCellValue || undefined"
                    :allow-sorting="col.allowSorting !== false"
                    :allow-resizing="col.allowResizing !== false"
                />

                <DxColumn
                    v-if="actionColumnWidth > 0"
                    caption=""
                    :width="actionColumnWidth"
                    :fixed="true"
                    fixed-position="right"
                    cell-template="actionsCell"
                    :allow-sorting="false"
                    :allow-resizing="false"
                    css-class="col-actions"
                />

                <template v-for="(_, slotName) in gridSlots" :key="slotName" #[slotName]="slotData">
                    <slot :name="slotName" v-bind="slotData ?? {}" />
                </template>
                <template #__ms_auto__="{ data }">
                    <GridAutoCell :col="colMap[data.column.dataField]" :value="data.value" />
                </template>
            </DxDataGrid>
        </div>

        <!-- Pagination footer -->
        <div class="ms-grid-footer">
            <span class="ms-grid-footer__total">Tổng số: <strong>{{ total }}</strong></span>
            <div class="ms-grid-footer__pager">
                <span class="ms-grid-footer__pager-label">Số dòng/trang</span>
                <div class="ms-grid-footer__size-picker" @click.stop="showPageSizeMenu = !showPageSizeMenu">
                    <span>{{ pageSize }}</span>
                    <div class="icon-chevron-xs" :class="{ 'is-open': showPageSizeMenu }"></div>
                    <Transition name="grid-drop">
                        <div v-if="showPageSizeMenu" class="ms-grid-footer__size-menu" @click.stop>
                            <div v-for="s in resolvedPageSizeOptions" :key="s"
                                class="ms-grid-footer__size-item" :class="{ 'is-selected': pageSize === s }"
                                @click.stop="onPageSizeChange(s)">
                                {{ s }}
                            </div>
                        </div>
                    </Transition>
                </div>
                <span class="ms-grid-footer__pager-range">{{ pageRangeText }}</span>
                <div class="ms-grid-footer__pager-nav">
                    <button class="ms-grid-footer__nav-btn" :disabled="currentPage <= 1" @click="emit('update:currentPage', 1)">
                        <div class="icon-nav-first"></div>
                    </button>
                    <button class="ms-grid-footer__nav-btn" :disabled="currentPage <= 1" @click="emit('update:currentPage', currentPage - 1)">
                        <div class="icon-nav-prev"></div>
                    </button>
                    <button class="ms-grid-footer__nav-btn" :disabled="currentPage >= totalPages" @click="emit('update:currentPage', currentPage + 1)">
                        <div class="icon-nav-next"></div>
                    </button>
                    <button class="ms-grid-footer__nav-btn" :disabled="currentPage >= totalPages" @click="emit('update:currentPage', totalPages)">
                        <div class="icon-nav-last"></div>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, useSlots } from 'vue'
import { useClickOutside } from '@/composables/useClickOutside.js'
import { DxDataGrid, DxColumn, DxSelection, DxScrolling, DxPaging } from 'devextreme-vue/data-grid'
import GridAutoCell from './GridAutoCell.vue'

const props = defineProps({
    data: { type: Array, required: true },
    keyExpr: { type: String, required: true },
    columns: { type: Array, required: true },
    total: { type: Number, required: true },
    pageSize: { type: Number, default: 25 },
    currentPage: { type: Number, default: 1 },
    selectable: { type: Boolean, default: true },
    pageSizeOptions: { type: Array, default: null },
    actionColumnWidth: { type: Number, default: 0 },
    selectedCount: { type: Number, default: 0 },
})

const emit = defineEmits([
    'update:pageSize',
    'update:currentPage',
    'selectionChanged',
    'rowDblClick',
    'contextMenuPreparing',
])

const slots = useSlots()
const GRID_OWN_SLOTS = new Set(['toolbarLeft', 'toolbarRight', 'batchActions'])
const gridSlots = computed(() =>
    Object.fromEntries(Object.entries(slots).filter(([name]) => !GRID_OWN_SLOTS.has(name)))
)

const colMap = computed(() => Object.fromEntries(props.columns.map(c => [c.field, c])))

const gridRef = ref(null)
const showPageSizeMenu = ref(false)

const resolvedPageSizeOptions = computed(() => props.pageSizeOptions ?? [25, 50, 100])
const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

const pageRangeText = computed(() => {
    const p = Math.min(props.currentPage, totalPages.value)
    const start = (p - 1) * props.pageSize + 1
    const end = Math.min(p * props.pageSize, props.total)
    if (props.total === 0) return '0 - 0'
    return `${start} - ${end}`
})

const onPageSizeChange = (s) => {
    emit('update:pageSize', s)
    emit('update:currentPage', 1)
    showPageSizeMenu.value = false
}

const closeMenu = () => { showPageSizeMenu.value = false }
useClickOutside(closeMenu)

const clearSelection = () => {
    gridRef.value?.instance?.clearSelection()
}

defineExpose({ gridRef, clearSelection })
</script>

<style scoped>
.ms-grid-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
}

.ms-grid-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 7px 20px;
    background: #fff;
    border-bottom: 1px solid var(--grid-border, #e0e0e0);
    gap: 8px;
    height: 56px;
    flex-shrink: 0;
}

.ms-grid-toolbar__left { display: flex; align-items: center; gap: 8px; flex: 1; }
.ms-grid-toolbar__right { display: flex; align-items: center; gap: 2px; }

.ms-grid-batch {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 20px;
    background: #fff8e1;
    border-bottom: 1px solid #ffe082;
    flex-shrink: 0;
}

.ms-grid-batch__info { font-size: 13px; }
.ms-grid-batch__actions { display: flex; gap: 8px; }

.batch-slide-enter-active,
.batch-slide-leave-active { transition: all 0.2s ease; overflow: hidden; }
.batch-slide-enter-from,
.batch-slide-leave-to { opacity: 0; max-height: 0; }
.batch-slide-enter-to,
.batch-slide-leave-from { max-height: 48px; }

.ms-grid-body {
    flex: 1;
    overflow: hidden;
    position: relative;
}

/* ── Footer ──────────────────────────────────────── */
.ms-grid-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    height: 40px;
    background: #fff;
    border-top: 1px solid var(--grid-border, #e0e0e0);
    flex-shrink: 0;
}

.ms-grid-footer__total { font-size: 13px; color: var(--text-secondary-color, #666); }
.ms-grid-footer__pager { display: flex; align-items: center; gap: 10px; }
.ms-grid-footer__pager-label { font-size: 13px; color: var(--text-secondary-color, #666); }

.ms-grid-footer__size-picker {
    position: relative; display: inline-flex; align-items: center; gap: 4px;
    height: 28px; padding: 0 8px;
    border: 1px solid var(--input-normal-border-color, #e0e0e0);
    border-radius: 4px; cursor: pointer; font-size: 13px; background: #fff;
    transition: border-color 0.2s;
}
.ms-grid-footer__size-picker:hover { border-color: var(--primary, #34b057); }

.ms-grid-footer__size-menu {
    position: absolute; bottom: calc(100% + 4px); right: 0;
    background: #fff; border: 1px solid var(--grid-border, #e0e0e0);
    border-radius: 4px; box-shadow: 0 -4px 12px rgba(0,0,0,.1);
    padding: 4px; min-width: 80px; z-index: 1000;
}

.ms-grid-footer__size-item {
    padding: 6px 12px; font-size: 13px; cursor: pointer; border-radius: 4px; text-align: center;
}
.ms-grid-footer__size-item:hover { background: var(--primary-bg, #eafbf2); }
.ms-grid-footer__size-item.is-selected { color: var(--primary, #34b057); background: var(--primary-bg, #eafbf2); }

.ms-grid-footer__pager-range { font-size: 13px; color: var(--text-primary-color, #212121); min-width: 64px; text-align: center; }
.ms-grid-footer__pager-nav { display: flex; align-items: center; gap: 2px; }

.ms-grid-footer__nav-btn {
    width: 28px; height: 28px; border-radius: 4px;
    border: 1px solid var(--input-normal-border-color, #e0e0e0);
    background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all 0.15s; padding: 0;
}
.ms-grid-footer__nav-btn:hover:not(:disabled) { border-color: var(--primary, #34b057); background: var(--primary-bg, #eafbf2); }
.ms-grid-footer__nav-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── Icons ───────────────────────────────────────── */
.icon-nav-first {
    width: 14px; height: 14px; background-color: var(--icon-border, #707070);
    mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'><polyline points='11 17 6 12 11 7'/><polyline points='18 17 13 12 18 7'/></svg>");
    mask-size: cover;
}
.icon-nav-prev {
    width: 14px; height: 14px; background-color: var(--icon-border, #707070);
    mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'><polyline points='15 18 9 12 15 6'/></svg>");
    mask-size: cover;
}
.icon-nav-next {
    width: 14px; height: 14px; background-color: var(--icon-border, #707070);
    mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'><polyline points='9 18 15 12 9 6'/></svg>");
    mask-size: cover;
}
.icon-nav-last {
    width: 14px; height: 14px; background-color: var(--icon-border, #707070);
    mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'><polyline points='13 17 18 12 13 7'/><polyline points='6 17 11 12 6 7'/></svg>");
    mask-size: cover;
}

/* ── Transition ──────────────────────────────────── */
.grid-drop-enter-active, .grid-drop-leave-active { transition: opacity 0.15s, transform 0.15s; }
.grid-drop-enter-from, .grid-drop-leave-to { opacity: 0; transform: translateY(-6px); }
</style>

<style>
/* DevExtreme global overrides — scoped by .ms-grid-wrapper */
.ms-grid-wrapper .dx-datagrid { font-family: inherit; font-size: 13px; border: none; }
.ms-grid-wrapper .dx-datagrid-headers {
    background-color: var(--grid-header-bg, #f6f6f6);
    border-bottom: 1px solid var(--grid-border, #e0e0e0);
}
.ms-grid-wrapper .dx-datagrid-headers .dx-datagrid-table .dx-row > td {
    background-color: var(--grid-header-bg, #f6f6f6);
    color: var(--text-secondary-color, #666);
    font-weight: 600; font-size: 13px;
    padding: 0 10px;
    border-right: 1px solid var(--grid-border, #e0e0e0);
    border-bottom: none; height: 40px;
}
.ms-grid-wrapper .dx-datagrid-rowsview .dx-row > td {
    padding: 0 10px;
    border-right: 1px solid var(--grid-border, #e0e0e0);
    border-bottom: 1px solid var(--grid-border, #e0e0e0);
    vertical-align: middle; color: var(--text-primary-color, #212121);
    font-size: 13px; height: 40px;
}
.ms-grid-wrapper .dx-datagrid-rowsview .dx-row:hover > td { background-color: #f8fffe; }
.ms-grid-wrapper .dx-datagrid-rowsview .dx-selection > td,
.ms-grid-wrapper .dx-datagrid-rowsview .dx-selection:hover > td { background-color: #eafbf2 !important; }
.ms-grid-wrapper .dx-checkbox-checked .dx-checkbox-icon,
.ms-grid-wrapper .dx-checkbox-indeterminate .dx-checkbox-icon {
    background-color: var(--primary, #34b057); border-color: var(--primary, #34b057);
}
.ms-grid-wrapper .dx-datagrid-header-panel { display: none; }
.ms-grid-wrapper .dx-datagrid-borders > .dx-datagrid-headers,
.ms-grid-wrapper .dx-datagrid-borders > .dx-datagrid-rowsview { border-left: none; border-right: none; }
.ms-grid-wrapper .col-actions .dx-datagrid-text-content { display: none; }
</style>
