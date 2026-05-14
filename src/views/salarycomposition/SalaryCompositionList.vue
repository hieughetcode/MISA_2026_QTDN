<template>
    <div class="salary-list" @click="closeAllDropdowns">
        <!-- ── Header ─────────────────────────────────── -->
        <div class="page-header">
            <div class="page-header__title">Thành phần lương</div>
            <div class="page-header__actions">
                <button class="btn-sys-category" @click="$router.push('/salarycomposition/system-category')">
                    <div class="icon-category"></div>
                    Danh mục của hệ thống
                </button>
                <div class="combo-btn-wrap" @click.stop>
                    <button class="combo-btn__main" @click="openAddForm">
                        <span class="combo-btn__plus">+</span> Thêm
                    </button>
                    <div class="combo-btn__sep"></div>
                    <button class="combo-btn__arrow" @click="showAddDropdown = !showAddDropdown">
                        <div class="icon-chevron-white"></div>
                    </button>
                    <Transition name="chip-drop">
                        <div v-if="showAddDropdown" class="combo-dropdown">
                            <div class="combo-dropdown-item" @click="openAddForm(); showAddDropdown = false">Thêm mới</div>
                            <div class="combo-dropdown-item"
                                @click="$router.push('/salarycomposition/system-category'); showAddDropdown = false">
                                Kế thừa từ danh mục hệ thống
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>

        <!-- ── Toolbar ────────────────────────────────── -->
        <div class="page-toolbar">
            <div class="toolbar__left">
                <!-- Search -->
                <div class="search-wrap">
                    <div class="icon-search-sm"></div>
                    <input class="search-input" v-model="searchText" placeholder="Tìm kiếm"
                        @input="currentPage = 1" />
                </div>

                <!-- Trạng thái chip -->
                <div class="filter-chip" @click.stop="toggleChip('status')">
                    <span>Trạng thái: <b>{{ selectedStatusLabel }}</b></span>
                    <div class="icon-chevron-xs" :class="{ 'is-open': openChip === 'status' }"></div>
                    <Transition name="chip-drop">
                        <div v-if="openChip === 'status'" class="chip-menu" @click.stop>
                            <div v-for="opt in statusChipOptions" :key="String(opt.value)"
                                class="chip-menu-item" :class="{ 'is-selected': filterStatus === opt.value }"
                                @click="filterStatus = opt.value; openChip = null; currentPage = 1">
                                <div class="chip-check">
                                    <div v-if="filterStatus === opt.value" class="icon-check-sm"></div>
                                </div>
                                {{ opt.label }}
                            </div>
                        </div>
                    </Transition>
                </div>

                <!-- Đơn vị chip -->
                <div class="filter-chip wide" @click.stop="toggleChip('org')">
                    <span><b>{{ selectedOrgLabel }}</b></span>
                    <div class="icon-chevron-xs" :class="{ 'is-open': openChip === 'org' }"></div>
                    <Transition name="chip-drop">
                        <div v-if="openChip === 'org'" class="chip-menu wide-menu" @click.stop>
                            <div class="chip-menu-item" :class="{ 'is-selected': filterOrg === '' }"
                                @click="filterOrg = ''; openChip = null; currentPage = 1">
                                <div class="chip-check"><div v-if="filterOrg === ''" class="icon-check-sm"></div></div>
                                Tất cả đơn vị
                            </div>
                            <div v-for="org in organizations" :key="org.organizationId"
                                class="chip-menu-item" :class="{ 'is-selected': filterOrg === org.organizationId }"
                                @click="filterOrg = org.organizationId; openChip = null; currentPage = 1">
                                <div class="chip-check">
                                    <div v-if="filterOrg === org.organizationId" class="icon-check-sm"></div>
                                </div>
                                {{ org.organizationName }}
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>

            <div class="toolbar__right">
                <MsTooltip content="Bộ lọc" position="bottom">
                    <div class="icon-action-btn" :class="{ 'has-filter': hasActiveFilter }">
                        <div class="icon-filter"></div>
                    </div>
                </MsTooltip>
                <MsTooltip content="Cài đặt cột" position="bottom">
                    <div class="icon-action-btn" @click.stop="showColumnSetupPanel = true">
                        <div class="icon-col-setup"></div>
                    </div>
                </MsTooltip>
            </div>
        </div>

        <!-- ── Batch toolbar ──────────────────────────── -->
        <Transition name="batch-slide">
            <div v-if="selectedKeys.length > 0" class="batch-toolbar">
                <span class="batch-info">Đã chọn <strong>{{ selectedKeys.length }}</strong> bản ghi</span>
                <div class="batch-actions">
                    <button class="btn-batch" @click="batchStopTracking">Ngừng theo dõi</button>
                    <button class="btn-batch btn-batch--danger" @click="batchDelete">Xóa</button>
                </div>
            </div>
        </Transition>

        <!-- ── Grid ───────────────────────────────────── -->
        <div class="page-grid">
            <DxDataGrid ref="gridRef" :data-source="paginatedData" key-expr="compositionId"
                :show-borders="false" :hover-state-enabled="true" :row-alternation-enabled="false"
                :allow-column-resizing="true" column-resizing-mode="widget"
                :column-auto-width="false" height="100%"
                @selection-changed="onSelectionChanged"
                @row-dbl-click="onRowDblClick"
                @context-menu-preparing="onContextMenuPreparing">

                <DxSelection mode="multiple" show-check-boxes-mode="always" />
                <DxScrolling mode="standard" />
                <DxPaging :enabled="false" />

                <DxColumn v-for="col in visibleColumns" :key="col.field"
                    :data-field="col.field" :caption="col.caption"
                    :width="col.width" :min-width="col.minWidth || 80"
                    :fixed="col.fixed || false" :fixed-position="col.fixedPosition || undefined"
                    :cell-template="col.cellTemplate || undefined"
                    :calculate-cell-value="col.calculateCellValue || undefined"
                    :allow-sorting="col.allowSorting !== false"
                    :allow-resizing="col.allowResizing !== false" />

                <DxColumn caption="" :width="72" :fixed="true" fixed-position="right"
                    cell-template="actionsCell" :allow-sorting="false" :allow-resizing="false"
                    css-class="col-actions" />

                <!-- Cell templates -->
                <template #compositionTypeCell="{ data }">
                    <span class="cell-text">{{ COMPOSITION_TYPE_MAP[data.value] || '-' }}</span>
                </template>
                <template #compositionPropertyCell="{ data }">
                    <span class="badge" :class="data.value === 1 ? 'badge--red' : 'badge--green'">
                        {{ COMPOSITION_PROPERTY_MAP[data.value] }}
                    </span>
                </template>
                <template #compositionTaxableCell="{ data }">
                    <span :class="data.value === 1 ? 'cell-yes' : 'cell-muted'">
                        {{ COMPOSITION_TAXABLE_MAP[data.value] }}
                    </span>
                </template>
                <template #compositionValueTypeCell="{ data }">
                    <span class="cell-text">{{ COMPOSITION_VALUE_TYPE_MAP[data.value] || '-' }}</span>
                </template>
                <template #compositionValueCategoryCell="{ data }">
                    <span class="cell-text">{{ COMPOSITION_VALUE_CATEGORY_MAP[data.value] }}</span>
                </template>
                <template #compositionSourceTypeCell="{ data }">
                    <span class="badge" :class="data.value === 0 ? 'badge--blue' : 'badge--gray'">
                        {{ COMPOSITION_SOURCE_TYPE_MAP[data.value] }}
                    </span>
                </template>
                <template #compositionStatusCell="{ data }">
                    <span class="badge" :class="data.value === 0 ? 'badge--active' : 'badge--inactive'">
                        {{ COMPOSITION_STATUS_MAP[data.value] }}
                    </span>
                </template>
                <template #actionsCell="{ data }">
                    <div class="row-actions">
                        <MsTooltip content="Sửa" position="top">
                            <div class="row-btn" @click.stop="openEditForm(data.data)">
                                <div class="icon-edit"></div>
                            </div>
                        </MsTooltip>
                        <MsTooltip content="Xóa" position="top">
                            <div class="row-btn row-btn--del" @click.stop="confirmDeleteRow(data.data)">
                                <div class="icon-delete"></div>
                            </div>
                        </MsTooltip>
                    </div>
                </template>
            </DxDataGrid>
        </div>

        <!-- ── Footer / Pagination ────────────────────── -->
        <div class="page-footer">
            <span class="footer__total">Tổng số: <strong>{{ filteredData.length }}</strong></span>
            <div class="footer__pager">
                <span class="pager-label">Số dòng/trang</span>
                <div class="page-size-picker" @click.stop="showPageSizeMenu = !showPageSizeMenu">
                    <span>{{ pageSize }}</span>
                    <div class="icon-chevron-xs" :class="{ 'is-open': showPageSizeMenu }"></div>
                    <Transition name="chip-drop">
                        <div v-if="showPageSizeMenu" class="page-size-menu" @click.stop>
                            <div v-for="s in [25, 50, 100]" :key="s"
                                class="page-size-item" :class="{ 'is-selected': pageSize === s }"
                                @click.stop="pageSize = s; currentPage = 1; showPageSizeMenu = false">
                                {{ s }}
                            </div>
                        </div>
                    </Transition>
                </div>
                <span class="pager-range">{{ pageRangeText }}</span>
                <div class="pager-nav">
                    <button class="nav-btn" :disabled="currentPage <= 1" @click="currentPage = 1">
                        <div class="icon-nav-first"></div>
                    </button>
                    <button class="nav-btn" :disabled="currentPage <= 1" @click="currentPage--">
                        <div class="icon-nav-prev"></div>
                    </button>
                    <button class="nav-btn" :disabled="currentPage >= totalPages" @click="currentPage++">
                        <div class="icon-nav-next"></div>
                    </button>
                    <button class="nav-btn" :disabled="currentPage >= totalPages" @click="currentPage = totalPages">
                        <div class="icon-nav-last"></div>
                    </button>
                </div>
            </div>
        </div>

        <!-- ── Context Menu ───────────────────────────── -->
        <Teleport to="body">
            <div v-if="contextMenu.visible" class="ctx-overlay" @click="closeContextMenu"
                @contextmenu.prevent="closeContextMenu">
                <div class="ctx-menu" :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }" @click.stop>
                    <div class="ctx-item" @click="openEditForm(contextMenu.row); closeContextMenu()">
                        <div class="icon-edit ctx-icon"></div><span>Sửa</span>
                    </div>
                    <div class="ctx-item" @click="duplicateRow(contextMenu.row); closeContextMenu()">
                        <div class="icon-duplicate ctx-icon"></div><span>Nhân bản</span>
                    </div>
                    <div class="ctx-sep"></div>
                    <div v-if="contextMenu.row?.compositionStatus === 0" class="ctx-item"
                        @click="stopTrackingRow(contextMenu.row); closeContextMenu()">
                        <div class="icon-pause ctx-icon"></div><span>Ngừng theo dõi</span>
                    </div>
                    <div v-if="contextMenu.row?.compositionStatus === 1" class="ctx-item"
                        @click="restoreRow(contextMenu.row); closeContextMenu()">
                        <div class="icon-restore ctx-icon"></div><span>Sử dụng lại</span>
                    </div>
                    <div class="ctx-sep"></div>
                    <div class="ctx-item ctx-danger" @click="confirmDeleteRow(contextMenu.row); closeContextMenu()">
                        <div class="icon-delete ctx-icon"></div><span>Xóa</span>
                    </div>
                </div>
            </div>
        </Teleport>

        <!-- ── Delete Confirm Modal ───────────────────── -->
        <MsModal v-model="showDeleteModal" title="Xác nhận xóa" :width="440">
            <template #body>
                <div class="confirm-body">
                    <div class="icon-warn-lg"></div>
                    <div class="confirm-text">
                        <p>Bạn có chắc muốn xóa <strong>"{{ deleteTarget?.compositionName }}"</strong>?</p>
                        <p class="text-red">Thao tác này không thể hoàn tác.</p>
                    </div>
                </div>
            </template>
            <template #footer>
                <MsButton type="secondary" @click="showDeleteModal = false">Hủy</MsButton>
                <MsButton type="primary" class="btn-red" @click="executeDelete">Xóa</MsButton>
            </template>
        </MsModal>

        <!-- ── Form ───────────────────────────────────── -->
        <SalaryCompositionForm v-if="showForm" v-model="showForm"
            :item="editingItem" @save="handleSave" />

        <!-- ── Column Setup ───────────────────────────── -->
        <MsColumnSetup v-model="showColumnSetupPanel" :columns="columnDefs"
            @apply="applyColumnConfig" />

        <!-- ── Toasts ─────────────────────────────────── -->
        <div class="toast-stack">
            <MsToast v-for="t in toasts" :key="t.id" :type="t.type" :text="t.text" @close="removeToast(t.id)" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'
import { DxDataGrid, DxColumn, DxSelection, DxScrolling, DxPaging } from 'devextreme-vue/data-grid'

import MsButton from '@/components/base/ms-button/MsButton.vue'
import MsTooltip from '@/components/base/ms-tooltip/MsTooltip.vue'
import MsModal from '@/components/base/ms-popup/MsModal.vue'
import MsToast from '@/components/base/ms-popup/MsToast.vue'
import MsColumnSetup from '@/components/base/ms-column/MsColumnSetup.vue'
import SalaryCompositionForm from './SalaryCompositionForm.vue'

import { compositions, organizations } from '@/mocks/data.js'
import {
    COMPOSITION_TYPE_MAP, COMPOSITION_VALUE_TYPE_MAP, COMPOSITION_PROPERTY_MAP,
    COMPOSITION_TAXABLE_MAP, COMPOSITION_VALUE_CATEGORY_MAP, COMPOSITION_SOURCE_TYPE_MAP,
    COMPOSITION_STATUS_MAP, COMPOSITION_STATUS_OPTIONS
} from '@/utils/constants.js'

// ── State ─────────────────────────────────────────────────
const gridRef = ref(null)
const searchText = ref('')
const filterStatus = ref('')
const filterOrg = ref('')
const openChip = ref(null)
const showAddDropdown = ref(false)
const showPageSizeMenu = ref(false)
const selectedKeys = ref([])
const showForm = ref(false)
const editingItem = ref(null)
const showDeleteModal = ref(false)
const deleteTarget = ref(null)
const showColumnSetupPanel = ref(false)
const toasts = ref([])
const dataList = ref(compositions.map(c => ({ ...c })))
const currentPage = ref(1)
const pageSize = ref(25)

// ── Filter options ─────────────────────────────────────────
const statusChipOptions = COMPOSITION_STATUS_OPTIONS

const selectedStatusLabel = computed(() => {
    const opt = statusChipOptions.find(o => o.value === filterStatus.value)
    return opt ? opt.label : 'Tất cả'
})

const selectedOrgLabel = computed(() => {
    if (!filterOrg.value) return 'Tất cả đơn vị'
    const org = organizations.find(o => o.organizationId === filterOrg.value)
    return org ? org.organizationName : 'Tất cả đơn vị'
})

const hasActiveFilter = computed(() => filterStatus.value !== '' || filterOrg.value !== '' || searchText.value !== '')

// ── Column definitions ─────────────────────────────────────
const getOrgName = (row) => {
    const org = organizations.find(o => o.organizationId === row.organizationId)
    return org ? org.organizationName : row.organizationId
}

const columnDefs = ref([
    { field: 'compositionCode', caption: 'Mã thành phần', width: 160, fixed: true, fixedPosition: 'left', visible: true, defaultVisible: true },
    { field: 'compositionName', caption: 'Tên thành phần', width: 240, visible: true, defaultVisible: true },
    { field: 'organizationId', caption: 'Đơn vị áp dụng', width: 220, visible: true, defaultVisible: true, calculateCellValue: getOrgName },
    { field: 'compositionType', caption: 'Loại', width: 160, visible: true, defaultVisible: true, cellTemplate: 'compositionTypeCell' },
    { field: 'compositionProperty', caption: 'Tính chất', width: 120, visible: true, defaultVisible: true, cellTemplate: 'compositionPropertyCell' },
    { field: 'compositionIsTaxable', caption: 'Chịu thuế', width: 100, visible: true, defaultVisible: true, cellTemplate: 'compositionTaxableCell' },
    { field: 'compositionValueType', caption: 'Kiểu giá trị', width: 140, visible: true, defaultVisible: true, cellTemplate: 'compositionValueTypeCell' },
    { field: 'compositionValueCategory', caption: 'Cách tính', width: 120, visible: true, defaultVisible: true, cellTemplate: 'compositionValueCategoryCell' },
    { field: 'compositionFormula', caption: 'Công thức', width: 250, visible: false, defaultVisible: false },
    { field: 'compositionDescription', caption: 'Ghi chú', width: 220, visible: true, defaultVisible: true },
    { field: 'compositionSourceType', caption: 'Nguồn', width: 130, visible: true, defaultVisible: true, cellTemplate: 'compositionSourceTypeCell' },
    { field: 'compositionStatus', caption: 'Trạng thái', width: 150, visible: true, defaultVisible: true, cellTemplate: 'compositionStatusCell' },
])

const visibleColumns = computed(() => columnDefs.value.filter(c => c.visible))

// ── Data ───────────────────────────────────────────────────
const filteredData = computed(() => {
    let r = dataList.value
    const q = searchText.value.trim().toLowerCase()
    if (q) r = r.filter(x => x.compositionCode?.toLowerCase().includes(q) || x.compositionName?.toLowerCase().includes(q))
    if (filterStatus.value !== '') r = r.filter(x => x.compositionStatus === filterStatus.value)
    if (filterOrg.value !== '') r = r.filter(x => x.organizationId === filterOrg.value)
    return r
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredData.value.length / pageSize.value)))

const paginatedData = computed(() => {
    const p = Math.min(currentPage.value, totalPages.value)
    const start = (p - 1) * pageSize.value
    return filteredData.value.slice(start, start + pageSize.value)
})

const pageRangeText = computed(() => {
    const p = Math.min(currentPage.value, totalPages.value)
    const start = (p - 1) * pageSize.value + 1
    const end = Math.min(p * pageSize.value, filteredData.value.length)
    if (filteredData.value.length === 0) return '0 - 0'
    return `${start} - ${end}`
})

// ── Grid events ────────────────────────────────────────────
const onSelectionChanged = (e) => { selectedKeys.value = e.selectedRowKeys }
const onRowDblClick = (e) => openEditForm(e.data)

// ── Context menu ───────────────────────────────────────────
const contextMenu = reactive({ visible: false, x: 0, y: 0, row: null })

const onContextMenuPreparing = (e) => {
    if (e.row?.rowType !== 'data') return
    e.items = []
    contextMenu.x = e.event?.clientX || 0
    contextMenu.y = e.event?.clientY || 0
    contextMenu.row = e.row.data
    contextMenu.visible = true
    e.event?.preventDefault?.()
}
const closeContextMenu = () => { contextMenu.visible = false }

// ── Chips / dropdowns ──────────────────────────────────────
const toggleChip = (name) => { openChip.value = openChip.value === name ? null : name }
const closeAllDropdowns = () => { openChip.value = null; showAddDropdown.value = false; showPageSizeMenu.value = false }

onMounted(() => document.addEventListener('click', closeAllDropdowns))
onUnmounted(() => document.removeEventListener('click', closeAllDropdowns))

// ── CRUD ───────────────────────────────────────────────────
const openAddForm = () => { editingItem.value = null; showForm.value = true }
const openEditForm = (item) => { editingItem.value = { ...item }; showForm.value = true }

const handleSave = (item) => {
    if (item.compositionId) {
        const i = dataList.value.findIndex(r => r.compositionId === item.compositionId)
        if (i !== -1) dataList.value[i] = { ...item }
        showToast('success', `Đã cập nhật "${item.compositionName}"`)
    } else {
        dataList.value.unshift({ ...item, compositionId: 'comp-' + Date.now(), compositionSourceType: 1, compositionStatus: 0 })
        showToast('success', `Đã thêm "${item.compositionName}"`)
    }
    showForm.value = false
}

const confirmDeleteRow = (item) => { deleteTarget.value = item; showDeleteModal.value = true }

const executeDelete = () => {
    dataList.value = dataList.value.filter(r => r.compositionId !== deleteTarget.value.compositionId)
    if (currentPage.value > totalPages.value) currentPage.value = Math.max(1, totalPages.value)
    showToast('success', `Đã xóa "${deleteTarget.value.compositionName}"`)
    showDeleteModal.value = false; deleteTarget.value = null
}

const duplicateRow = (item) => {
    const copy = { ...item, compositionId: 'comp-' + Date.now(), compositionCode: item.compositionCode + '_COPY', compositionName: item.compositionName + ' (Sao chép)' }
    const i = dataList.value.findIndex(r => r.compositionId === item.compositionId)
    dataList.value.splice(i + 1, 0, copy)
    showToast('success', 'Đã nhân bản thành phần lương')
}

const stopTrackingRow = (item) => {
    const r = dataList.value.find(x => x.compositionId === item.compositionId)
    if (r) r.compositionStatus = 1
    showToast('info', `Đã ngừng theo dõi "${item.compositionName}"`)
}

const restoreRow = (item) => {
    const r = dataList.value.find(x => x.compositionId === item.compositionId)
    if (r) r.compositionStatus = 0
    showToast('success', `Đã khôi phục "${item.compositionName}"`)
}

const batchStopTracking = () => {
    selectedKeys.value.forEach(id => { const r = dataList.value.find(x => x.compositionId === id); if (r) r.compositionStatus = 1 })
    showToast('info', `Đã ngừng theo dõi ${selectedKeys.value.length} bản ghi`)
    gridRef.value?.instance?.clearSelection()
}

const batchDelete = () => {
    const count = selectedKeys.value.length
    dataList.value = dataList.value.filter(r => !selectedKeys.value.includes(r.compositionId))
    if (currentPage.value > totalPages.value) currentPage.value = Math.max(1, totalPages.value)
    showToast('success', `Đã xóa ${count} bản ghi`)
    gridRef.value?.instance?.clearSelection()
}

const applyColumnConfig = (cols) => { columnDefs.value = cols }

// ── Toast ──────────────────────────────────────────────────
let tid = 0
const showToast = (type, text) => { toasts.value.push({ id: ++tid, type, text }) }
const removeToast = (id) => { toasts.value = toasts.value.filter(t => t.id !== id) }
</script>

<style scoped>
/* ── Layout ──────────────────────────────────────── */
.salary-list { display: flex; flex-direction: column; height: 100%; overflow: hidden; font-size: 14px; }

/* ── Header ──────────────────────────────────────── */
.page-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 20px; height: 52px; background: #fff;
    border-bottom: 1px solid var(--grid-border-color, #e0e0e0); flex-shrink: 0;
}
.page-header__title { font-size: 20px; font-weight: 700; color: var(--text-primary-color, #212121); }
.page-header__actions { display: flex; align-items: center; gap: 8px; }

/* Secondary button with icon */
.btn-sys-category {
    display: inline-flex; align-items: center; gap: 6px;
    height: 36px; padding: 0 14px;
    background: #fff; border: 1px solid var(--input-normal-border-color, #e0e0e0);
    border-radius: 4px; font-size: 14px; font-weight: 500;
    color: var(--text-primary-color, #212121); cursor: pointer;
    transition: all 0.2s; font-family: inherit;
}
.btn-sys-category:hover { border-color: var(--primary, #34b057); color: var(--primary, #34b057); background: #f8fffe; }

/* Combo button */
.combo-btn-wrap { display: inline-flex; align-items: stretch; border-radius: 4px; overflow: visible; position: relative; }
.combo-btn__main {
    display: inline-flex; align-items: center; gap: 4px;
    height: 36px; padding: 0 14px;
    background: var(--primary, #34b057); color: #fff;
    border: none; border-radius: 4px 0 0 4px;
    font-size: 14px; font-weight: 500; cursor: pointer; font-family: inherit;
    transition: background 0.2s;
}
.combo-btn__main:hover { background: var(--button-primary-hover-bg-color, #02b936); }
.combo-btn__plus { font-size: 18px; line-height: 1; margin-right: 2px; }
.combo-btn__sep { width: 1px; background: rgba(255,255,255,0.4); flex-shrink: 0; }
.combo-btn__arrow {
    display: inline-flex; align-items: center; justify-content: center;
    width: 32px; height: 36px;
    background: var(--primary, #34b057); color: #fff;
    border: none; border-radius: 0 4px 4px 0;
    cursor: pointer; font-family: inherit; transition: background 0.2s;
}
.combo-btn__arrow:hover { background: var(--button-primary-hover-bg-color, #02b936); }

.combo-dropdown {
    position: absolute; top: calc(100% + 4px); right: 0;
    background: #fff; border: 1px solid var(--grid-border-color, #e0e0e0);
    border-radius: 4px; box-shadow: 0 4px 16px rgba(0,0,0,.12);
    padding: 6px; min-width: 220px; z-index: 1000;
}
.combo-dropdown-item {
    padding: 8px 14px; font-size: 14px; cursor: pointer; border-radius: 4px;
    color: var(--text-primary-color, #212121); transition: background 0.15s;
}
.combo-dropdown-item:hover { background: var(--primary-bg, #eafbf2); }

/* ── Toolbar ─────────────────────────────────────── */
.page-toolbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 7px 20px; background: #fff;
    border-bottom: 1px solid var(--grid-border-color, #e0e0e0); flex-shrink: 0; gap: 8px;
}
.toolbar__left { display: flex; align-items: center; gap: 8px; flex: 1; }
.toolbar__right { display: flex; align-items: center; gap: 2px; }

/* Search input */
.search-wrap {
    display: flex; align-items: center; gap: 6px;
    width: 220px; height: 32px; padding: 0 10px;
    border: 1px solid var(--input-normal-border-color, #e0e0e0);
    border-radius: 4px; background: #fff; transition: border-color 0.2s;
}
.search-wrap:focus-within { border-color: var(--primary, #34b057); }
.search-input { flex: 1; border: none; outline: none; font-size: 13px; background: transparent; font-family: inherit; }
.search-input::placeholder { color: var(--text-disable-color, #9e9e9e); }

/* Filter chips */
.filter-chip {
    position: relative; display: inline-flex; align-items: center; gap: 6px;
    height: 32px; padding: 0 10px;
    border: 1px solid var(--input-normal-border-color, #e0e0e0);
    border-radius: 4px; background: #fff; cursor: pointer;
    font-size: 13px; color: var(--text-primary-color, #212121);
    white-space: nowrap; transition: border-color 0.2s; user-select: none;
}
.filter-chip:hover { border-color: var(--primary, #34b057); }
.filter-chip.wide { min-width: 160px; }

.chip-menu {
    position: absolute; top: calc(100% + 4px); left: 0;
    background: #fff; border: 1px solid var(--grid-border-color, #e0e0e0);
    border-radius: 4px; box-shadow: 0 4px 16px rgba(0,0,0,.12);
    padding: 6px; min-width: 160px; z-index: 1000; max-height: 280px; overflow-y: auto;
}
.chip-menu.wide-menu { min-width: 260px; }
.chip-menu-item {
    display: flex; align-items: center; gap: 8px;
    padding: 7px 12px; font-size: 13px; cursor: pointer; border-radius: 4px;
    color: var(--text-primary-color, #212121); transition: background 0.15s;
}
.chip-menu-item:hover { background: var(--primary-bg, #eafbf2); }
.chip-menu-item.is-selected { color: var(--primary, #34b057); background: var(--primary-bg, #eafbf2); }
.chip-check { width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

/* Icon action buttons */
.icon-action-btn {
    width: 32px; height: 32px; border-radius: 4px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background 0.15s;
}
.icon-action-btn:hover { background: var(--icon-bg-hover, #f2f2f2); }
.icon-action-btn.has-filter .icon-filter { background-color: var(--primary, #34b057); }

/* ── Batch toolbar ───────────────────────────────── */
.batch-toolbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 6px 20px; background: #fff8e1;
    border-bottom: 1px solid #ffe082; flex-shrink: 0;
}
.batch-info { font-size: 13px; }
.batch-actions { display: flex; gap: 8px; }
.btn-batch {
    height: 30px; padding: 0 14px; border-radius: 4px;
    border: 1px solid var(--input-normal-border-color, #e0e0e0);
    background: #fff; font-size: 13px; cursor: pointer; font-family: inherit; transition: all 0.2s;
}
.btn-batch:hover { border-color: var(--primary, #34b057); color: var(--primary, #34b057); }
.btn-batch--danger:hover { border-color: var(--red-color, #ff6161); color: var(--red-color, #ff6161); }

/* ── Grid ────────────────────────────────────────── */
.page-grid { flex: 1; overflow: hidden; position: relative; }

/* ── Footer ──────────────────────────────────────── */
.page-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 20px; height: 40px; background: #fff;
    border-top: 1px solid var(--grid-border-color, #e0e0e0); flex-shrink: 0;
}
.footer__total { font-size: 13px; color: var(--text-secondary-color, #666); }
.footer__pager { display: flex; align-items: center; gap: 10px; }
.pager-label { font-size: 13px; color: var(--text-secondary-color, #666); }
.page-size-picker {
    position: relative; display: inline-flex; align-items: center; gap: 4px;
    height: 28px; padding: 0 8px;
    border: 1px solid var(--input-normal-border-color, #e0e0e0);
    border-radius: 4px; cursor: pointer; font-size: 13px; background: #fff;
    transition: border-color 0.2s;
}
.page-size-picker:hover { border-color: var(--primary, #34b057); }
.page-size-menu {
    position: absolute; bottom: calc(100% + 4px); right: 0;
    background: #fff; border: 1px solid var(--grid-border-color, #e0e0e0);
    border-radius: 4px; box-shadow: 0 -4px 12px rgba(0,0,0,.1);
    padding: 4px; min-width: 80px; z-index: 1000;
}
.page-size-item {
    padding: 6px 12px; font-size: 13px; cursor: pointer; border-radius: 4px; text-align: center;
}
.page-size-item:hover { background: var(--primary-bg, #eafbf2); }
.page-size-item.is-selected { color: var(--primary, #34b057); background: var(--primary-bg, #eafbf2); }
.pager-range { font-size: 13px; color: var(--text-primary-color, #212121); min-width: 64px; text-align: center; }

/* Nav buttons */
.pager-nav { display: flex; align-items: center; gap: 2px; }
.nav-btn {
    width: 28px; height: 28px; border-radius: 4px;
    border: 1px solid var(--input-normal-border-color, #e0e0e0);
    background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all 0.15s; padding: 0;
}
.nav-btn:hover:not(:disabled) { border-color: var(--primary, #34b057); background: var(--primary-bg, #eafbf2); }
.nav-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── Row actions ─────────────────────────────────── */
.row-actions { display: flex; align-items: center; justify-content: center; gap: 2px; height: 100%; }
.row-btn {
    width: 26px; height: 26px; border-radius: 4px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background 0.15s;
}
.row-btn:hover { background: var(--icon-bg-hover, #f2f2f2); }
.row-btn--del:hover { background: #fff0f0; }

/* ── Context menu ────────────────────────────────── */
.ctx-overlay { position: fixed; inset: 0; z-index: 3000; }
.ctx-menu {
    position: fixed; background: #fff;
    border: 1px solid var(--grid-border-color, #e0e0e0);
    border-radius: 6px; box-shadow: 0 4px 20px rgba(0,0,0,.14);
    padding: 6px; min-width: 200px; z-index: 3001;
}
.ctx-item {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 12px; font-size: 14px; border-radius: 4px;
    color: var(--text-primary-color, #212121); cursor: pointer; transition: background 0.15s;
}
.ctx-item:hover { background: var(--primary-bg, #eafbf2); }
.ctx-danger { color: var(--red-color, #ff6161); }
.ctx-danger:hover { background: #fff0f0; }
.ctx-sep { height: 1px; background: var(--grid-border-color, #e0e0e0); margin: 4px 0; }
.ctx-icon { width: 16px; height: 16px; flex-shrink: 0; }

/* ── Confirm modal ───────────────────────────────── */
.confirm-body { display: flex; align-items: flex-start; gap: 14px; }
.confirm-text p { margin: 0 0 6px; font-size: 14px; line-height: 1.5; }
.text-red { color: var(--red-color, #ff6161); font-size: 13px !important; }
:deep(.btn-red.ms-button-primary) { background-color: var(--red-color, #ff6161) !important; }

/* ── Badges ──────────────────────────────────────── */
.badge {
    display: inline-flex; align-items: center; padding: 2px 8px;
    border-radius: 10px; font-size: 12px; font-weight: 500; white-space: nowrap;
}
.badge--active { background: #e8f5e9; color: #2e7d32; }
.badge--inactive { background: #f5f5f5; color: #757575; }
.badge--green { background: #e8f5e9; color: #2e7d32; }
.badge--red { background: #ffebee; color: #c62828; }
.badge--blue { background: #e3f2fd; color: #1565c0; }
.badge--gray { background: #f5f5f5; color: #616161; }
.cell-text { font-size: 13px; }
.cell-yes { color: var(--primary, #34b057); font-size: 13px; }
.cell-muted { color: var(--text-secondary-color, #666); font-size: 13px; }

/* ── Toast ───────────────────────────────────────── */
.toast-stack {
    position: fixed; bottom: 24px; left: 24px; z-index: 9999;
    display: flex; flex-direction: column; gap: 8px; pointer-events: none;
}

/* ── Transitions ─────────────────────────────────── */
.chip-drop-enter-active, .chip-drop-leave-active { transition: opacity 0.15s, transform 0.15s; }
.chip-drop-enter-from, .chip-drop-leave-to { opacity: 0; transform: translateY(-6px); }
.batch-slide-enter-active, .batch-slide-leave-active { transition: all 0.2s ease; overflow: hidden; }
.batch-slide-enter-from, .batch-slide-leave-to { opacity: 0; max-height: 0; padding-top: 0; padding-bottom: 0; }
.batch-slide-enter-to, .batch-slide-leave-from { max-height: 48px; }

/* ── Icons ───────────────────────────────────────── */
.icon-category {
    width: 16px; height: 16px; background-color: var(--icon-border, #707070);
    mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'><path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'/><path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'/></svg>");
    mask-size: cover; flex-shrink: 0;
}
.btn-sys-category:hover .icon-category { background-color: var(--primary, #34b057); }
.icon-chevron-white {
    width: 16px; height: 16px; background-color: #fff;
    mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5' xmlns='http://www.w3.org/2000/svg'><polyline points='6 9 12 15 18 9'/></svg>");
    mask-size: cover;
}
.icon-chevron-xs {
    width: 14px; height: 14px; background-color: var(--icon-border, #707070);
    mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5' xmlns='http://www.w3.org/2000/svg'><polyline points='6 9 12 15 18 9'/></svg>");
    mask-size: cover; transition: transform 0.2s; flex-shrink: 0;
}
.icon-chevron-xs.is-open { transform: rotate(180deg); }
.icon-search-sm {
    width: 16px; height: 16px; flex-shrink: 0; background-color: var(--text-disable-color, #9e9e9e);
    mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'><circle cx='11' cy='11' r='8'/><line x1='21' y1='21' x2='16.65' y2='16.65'/></svg>");
    mask-size: cover;
}
.icon-check-sm {
    width: 14px; height: 14px; background-color: var(--primary, #34b057);
    mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'><polyline points='20 6 9 17 4 12'/></svg>");
    mask-size: cover;
}
.icon-filter {
    width: 17px; height: 17px; background-color: var(--icon-border, #707070);
    mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'><polygon points='22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3'/></svg>");
    mask-size: cover;
}
.icon-col-setup {
    width: 17px; height: 17px; background-color: var(--icon-border, #707070);
    mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'><line x1='8' y1='6' x2='21' y2='6'/><line x1='8' y1='12' x2='21' y2='12'/><line x1='8' y1='18' x2='21' y2='18'/><line x1='3' y1='6' x2='3.01' y2='6'/><line x1='3' y1='12' x2='3.01' y2='12'/><line x1='3' y1='18' x2='3.01' y2='18'/></svg>");
    mask-size: cover;
}
.icon-edit {
    width: 15px; height: 15px; background-color: var(--icon-border, #707070);
    mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'><path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'/><path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'/></svg>");
    mask-size: cover;
}
.icon-delete {
    width: 15px; height: 15px; background-color: var(--red-color, #ff6161);
    mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'><polyline points='3 6 5 6 21 6'/><path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2'/></svg>");
    mask-size: cover;
}
.icon-duplicate {
    width: 15px; height: 15px; background-color: var(--icon-border, #707070);
    mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'><rect x='9' y='9' width='13' height='13' rx='2' ry='2'/><path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'/></svg>");
    mask-size: cover;
}
.icon-pause {
    width: 15px; height: 15px; background-color: var(--icon-border, #707070);
    mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='currentColor' xmlns='http://www.w3.org/2000/svg'><rect x='6' y='4' width='4' height='16'/><rect x='14' y='4' width='4' height='16'/></svg>");
    mask-size: cover;
}
.icon-restore {
    width: 15px; height: 15px; background-color: var(--primary, #34b057);
    mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'><polyline points='1 4 1 10 7 10'/><path d='M3.51 15a9 9 0 1 0 .49-4.69L1 10'/></svg>");
    mask-size: cover;
}
.icon-warn-lg {
    width: 44px; height: 44px; flex-shrink: 0; background-color: #f59e0b;
    mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='currentColor' xmlns='http://www.w3.org/2000/svg'><path d='M12 2L1 21h22L12 2zm0 3.5L20.5 19h-17L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z'/></svg>");
    mask-size: cover;
}
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
</style>

<style>
/* DevExtreme overrides */
.salary-list .dx-datagrid { font-family: inherit; font-size: 13px; border: none; }
.salary-list .dx-datagrid-headers { background-color: var(--grid-header-bg, #f6f6f6); border-bottom: 1px solid var(--grid-border-color, #e0e0e0); }
.salary-list .dx-datagrid-headers .dx-datagrid-table .dx-row > td {
    background-color: var(--grid-header-bg, #f6f6f6);
    color: var(--text-secondary-color, #666);
    font-weight: 600; font-size: 13px;
    padding: 0 10px;
    border-right: 1px solid var(--grid-border-color, #e0e0e0);
    border-bottom: none; height: 40px;
}
.salary-list .dx-datagrid-rowsview .dx-row > td {
    padding: 0 10px;
    border-right: 1px solid var(--grid-border-color, #e0e0e0);
    border-bottom: 1px solid var(--grid-border-color, #e0e0e0);
    vertical-align: middle; color: var(--text-primary-color, #212121);
    font-size: 13px; height: 40px;
}
.salary-list .dx-datagrid-rowsview .dx-row:hover > td { background-color: #f8fffe; }
.salary-list .dx-datagrid-rowsview .dx-selection > td,
.salary-list .dx-datagrid-rowsview .dx-selection:hover > td { background-color: #eafbf2 !important; }
.salary-list .dx-checkbox-checked .dx-checkbox-icon,
.salary-list .dx-checkbox-indeterminate .dx-checkbox-icon {
    background-color: var(--primary, #34b057); border-color: var(--primary, #34b057);
}
.salary-list .dx-datagrid-header-panel { display: none; }
.salary-list .dx-datagrid-borders > .dx-datagrid-headers,
.salary-list .dx-datagrid-borders > .dx-datagrid-rowsview { border-left: none; border-right: none; }
.salary-list .col-actions .dx-datagrid-text-content { display: none; }
</style>