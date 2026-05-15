<template>
    <div class="page-shell" @click="closeAllDropdowns">
        <div class="salary-list">
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
                                <div class="combo-dropdown__item"
                                    @click="$router.push('/salarycomposition/system-category'); showAddDropdown = false">
                                    Chọn từ danh mục của hệ thống
                                </div>
                            </div>
                        </Transition>
                    </div>
                </div>
            </div>

            <!-- ── Grid (MsGrid handles DxDataGrid + pagination footer) ── -->
            <div class="page-grid">
                <MsGrid ref="msGridRef" :data="paginatedData" key-expr="compositionId" :columns="visibleColumns"
                    :total="filteredData.length" v-model:page-size="pageSize" v-model:current-page="currentPage"
                    :selectable="true" :action-column-width="72" :selected-count="selectedKeys.length"
                    @selection-changed="onSelectionChanged" @row-dbl-click="onRowDblClick"
                    @context-menu-preparing="onContextMenuPreparing">
                    <template #toolbarLeft>
                        <SearchBar v-model="searchText" placeholder="Tìm kiếm" />
                        <FilterChip label="Trạng thái" v-model="filterStatus" :options="statusChipOptions"
                            :is-open="openChip === 'status'" @toggle="toggleChip('status')" />
                        <FilterChip v-model="filterOrg" :options="orgChipOptions" :is-open="openChip === 'org'"
                            :wide="true" @toggle="toggleChip('org')" />
                    </template>

                    <template #toolbarRight>
                        <MsToolbarBtn icon="icon-filter" tooltip="Bộ lọc" :active="hasActiveFilter" />
                        <MsToolbarBtn icon="icon-col-setup" tooltip="Cài đặt cột"
                            @click.stop="showColumnSetupPanel = true" />
                    </template>

                    <template #batchActions>
                        <button class="btn-batch" @click="batchStopTracking">Ngừng theo dõi</button>
                        <button class="btn-batch btn-batch--danger" @click="batchDelete">Xóa</button>
                    </template>

                    <template #actionsCell="{ data }">
                        <div class="row-actions">
                            <MsTooltip content="Sửa" position="top">
                                <div class="row-actions__btn" @click.stop="openEditForm(data.data)">
                                    <div class="icon-edit"></div>
                                </div>
                            </MsTooltip>
                            <MsTooltip content="Xóa" position="top">
                                <div class="row-actions__btn row-actions__btn--del"
                                    @click.stop="confirmDeleteRow(data.data)">
                                    <div class="icon-delete"></div>
                                </div>
                            </MsTooltip>
                        </div>
                    </template>
                </MsGrid>
            </div>

            <!-- ── Context Menu ───────────────────────────── -->
            <ContextMenu :visible="contextMenu.visible" :x="contextMenu.x" :y="contextMenu.y" :items="ctxItems"
                @close="closeContextMenu" />

            <!-- ── Delete Confirm Modal ───────────────────── -->
            <MsModal v-model="showDeleteModal" title="Xác nhận xóa" :width="440">
                <template #body>
                    <div class="confirm-dialog__body">
                        <div class="icon-warn-lg"></div>
                        <div class="confirm-dialog__text">
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
            <SalaryCompositionForm v-if="showForm" v-model="showForm" :item="editingItem" :org-options="orgOptions"
                @save="handleSave" />

            <!-- ── Column Setup ───────────────────────────── -->
            <MsColumnSetup v-model="showColumnSetupPanel" :columns="columnDefs" @apply="applyColumnConfig" />

            <!-- ── Toasts ─────────────────────────────────── -->
            <ToastStack :toasts="toasts" @close="removeToast" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue'

import { useToast } from '@/composables/useToast.js'
import { useFilterChip } from '@/composables/useFilterChip.js'
import { usePagination } from '@/composables/usePagination.js'
import SearchBar from '@/components/shared/SearchBar.vue'
import FilterChip from '@/components/shared/FilterChip.vue'
import MsToolbarBtn from '@/components/shared/MsToolbarBtn.vue'
import MsGrid from '@/components/base/ms-grid/MsGrid.vue'
import MsButton from '@/components/base/ms-button/MsButton.vue'
import MsTooltip from '@/components/base/ms-tooltip/MsTooltip.vue'
import MsModal from '@/components/base/ms-popup/MsModal.vue'
import MsColumnSetup from '@/components/base/ms-column/MsColumnSetup.vue'
import ToastStack from '@/components/shared/ToastStack.vue'
import ContextMenu from '@/components/shared/ContextMenu.vue'
import SalaryCompositionForm from './SalaryCompositionForm.vue'

import { compositions, organizations } from '@/mocks/data.js'
import {
    COMPOSITION_TYPE_MAP, COMPOSITION_VALUE_TYPE_MAP, COMPOSITION_PROPERTY_MAP,
    COMPOSITION_TAXABLE_MAP, COMPOSITION_VALUE_CATEGORY_MAP, COMPOSITION_SOURCE_TYPE_MAP,
    COMPOSITION_STATUS_MAP, COMPOSITION_STATUS_OPTIONS
} from '@/utils/constants.js'
import { getOrgName, toOrgOptions, filterByText } from '@/utils/formatter.js'

// ── State ─────────────────────────────────────────────────
const msGridRef = ref(null)
const searchText = ref('')
const filterStatus = ref('')
const filterOrg = ref('')
const { openChip, toggleChip, closeAllChips } = useFilterChip()
const showAddDropdown = ref(false)
const selectedKeys = ref([])
const showForm = ref(false)
const editingItem = ref(null)
const showDeleteModal = ref(false)
const deleteTarget = ref(null)
const showColumnSetupPanel = ref(false)
const { toasts, showToast, removeToast } = useToast()
const dataList = ref(compositions.map(c => ({ ...c })))

// ── Filter options ─────────────────────────────────────────
const statusChipOptions = COMPOSITION_STATUS_OPTIONS

const orgOptions = toOrgOptions(organizations)
const orgChipOptions = computed(() => [{ value: '', label: 'Tất cả đơn vị' }, ...orgOptions])

const hasActiveFilter = computed(() => filterStatus.value !== '' || filterOrg.value !== '' || searchText.value !== '')


// ── Column definitions ─────────────────────────────────────
const columnDefs = ref([
    { field: 'compositionCode', caption: 'Mã thành phần', width: 160, fixed: true, fixedPosition: 'left', visible: true, defaultVisible: true },
    { field: 'compositionName', caption: 'Tên thành phần', width: 240, visible: true, defaultVisible: true },
    { field: 'organizationId', caption: 'Đơn vị áp dụng', width: 220, visible: true, defaultVisible: true, calculateCellValue: (row) => getOrgName(row.organizationId, organizations) },
    { field: 'compositionType', caption: 'Loại thành phần', width: 170, visible: true, defaultVisible: true, format: (v) => COMPOSITION_TYPE_MAP[v] || '-' },
    { field: 'compositionProperty', caption: 'Tính chất', width: 120, visible: true, defaultVisible: true, badge: (v) => ({ variant: v === 1 ? 'red' : 'green', text: COMPOSITION_PROPERTY_MAP[v] }) },
    { field: 'compositionIsTaxable', caption: 'Chịu thuế', width: 130, visible: true, defaultVisible: true, format: (v) => COMPOSITION_TAXABLE_MAP[v], cellClass: (v) => v === 1 ? 'cell-yes' : 'cell-muted' },
    { field: 'compositionValueType', caption: 'Kiểu giá trị', width: 140, visible: true, defaultVisible: true, format: (v) => COMPOSITION_VALUE_TYPE_MAP[v] || '-' },
    { field: 'compositionValueCategory', caption: 'Cách tính', width: 120, visible: true, defaultVisible: true, format: (v) => COMPOSITION_VALUE_CATEGORY_MAP[v] },
    { field: 'compositionFormula', caption: 'Công thức', width: 250, visible: false, defaultVisible: false },
    { field: 'compositionDescription', caption: 'Ghi chú', width: 220, visible: true, defaultVisible: true },
    { field: 'compositionSourceType', caption: 'Nguồn', width: 130, visible: true, defaultVisible: true, badge: (v) => ({ variant: v === 0 ? 'blue' : 'gray', text: COMPOSITION_SOURCE_TYPE_MAP[v] }) },
    { field: 'compositionStatus', caption: 'Trạng thái', width: 150, visible: true, defaultVisible: true, badge: (v) => ({ variant: v === 0 ? 'active' : 'inactive', text: COMPOSITION_STATUS_MAP[v] }) },
])

const visibleColumns = computed(() => columnDefs.value.filter(c => c.visible))

// ── Data ───────────────────────────────────────────────────
const filteredData = computed(() => {
    let r = filterByText(dataList.value, searchText.value, ['compositionCode', 'compositionName'])
    if (filterStatus.value !== '') r = r.filter(x => x.compositionStatus === filterStatus.value)
    if (filterOrg.value !== '') r = r.filter(x => x.organizationId === filterOrg.value)
    return r
})

const { currentPage, pageSize, paginatedData } = usePagination(filteredData, { resetOn: [searchText, filterStatus, filterOrg] })

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

const ctxItems = computed(() => {
    const row = contextMenu.row
    return [
        { icon: 'icon-edit', label: 'Sửa', action: () => openEditForm(row) },
        { icon: 'icon-duplicate', label: 'Nhân bản', action: () => duplicateRow(row) },
        { divider: true },
        ...(row?.compositionStatus === 0
            ? [{ icon: 'icon-pause', label: 'Ngừng theo dõi', action: () => stopTrackingRow(row) }]
            : []),
        ...(row?.compositionStatus === 1
            ? [{ icon: 'icon-restore', label: 'Sử dụng lại', action: () => restoreRow(row) }]
            : []),
        { divider: true },
        { icon: 'icon-delete', label: 'Xóa', action: () => confirmDeleteRow(row), danger: true },
    ]
})

// ── Chips / dropdowns ──────────────────────────────────────
// useFilterChip đã tự đăng ký document listener cho openChip;
// closeAllDropdowns chỉ cần thêm việc đóng showAddDropdown
const closeAllDropdowns = () => { closeAllChips(); showAddDropdown.value = false }

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
    msGridRef.value?.clearSelection()
}

const batchDelete = () => {
    const count = selectedKeys.value.length
    dataList.value = dataList.value.filter(r => !selectedKeys.value.includes(r.compositionId))
    showToast('success', `Đã xóa ${count} bản ghi`)
    msGridRef.value?.clearSelection()
}

const applyColumnConfig = (cols) => { columnDefs.value = cols }

</script>

<style scoped>
/* ── Layout ──────────────────────────────────────── */
.salary-list {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    font-size: 14px;
    background: #fff;
    border-radius: 8px;
}

/* ── Header ──────────────────────────────────────── */
.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 46px;
    background: var(--ms-color-neutral-300, #e9eaeb);
    border-bottom: 1px solid var(--grid-border, #e0e0e0);
    flex-shrink: 0;
    padding: 0px 0px 12px 0px;
}

.page-header__title {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary-color, #212121);
}

.page-header__actions {
    display: flex;
    gap: 8px;
}

.btn-sys-category {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 32px;
    padding: 0 14px;
    background: #fff;
    border: 1px solid var(--ms-color--border, #c8c8c8);
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary-color, #212121);
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
}

.btn-sys-category:hover {
    background-color: var(--ms-color-bg-hover, #e9eaeb);
    border-color: var(--ms-icon-border, #c8c8c8);
}

.combo-btn-wrap {
    display: inline-flex;
    align-items: stretch;
    border-radius: 4px;
    overflow: visible;
    position: relative;
}

.combo-btn__main {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 32px;
    padding: 0 14px;
    background: var(--ms-color-primary, #0e9a62);
    color: #fff;
    border: none;
    border-radius: 8px 0 0 8px;
    margin-right: 0px !important;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.2s;
}

.combo-btn__main:hover {
    background: var(--ms-color-primary-hover, #0a724b);
}

.combo-btn__plus {
    font-size: 20px;
    line-height: 1;
    margin-top: -2px;
}

.combo-btn__sep {
    width: 1px;
    height: 20px;
    flex-shrink: 0;
    align-self: stretch;
}

.combo-btn__arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: var(--ms-color-primary, #0e9a62);
    color: #fff;
    border: none;
    border-radius: 0 8px 8px 0;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.2s;
}

.combo-btn__arrow:hover {
    background: var(--ms-color-primary-hover, #02b936);
}

.combo-dropdown {
    position: absolute;
    top: calc(100% + 4px);
    right: 0;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, .12);
    padding: 8px 0px 8px 0px;
    min-width: 220px;
    z-index: 1000;
}

.combo-dropdown__item {
    padding: 8px;
    font-size: 14px;
    cursor: pointer;
    border-radius: 8px;
    color: var(--text-primary-color, #212121);
    transition: background 0.15s;
    white-space: nowrap;
}

.combo-dropdown__item:hover {
    background: var(--ms-color-bg-hover, #e9eaeb);
}

/* ── Batch action buttons ────────────────────────── */
.btn-batch {
    height: 30px;
    padding: 0 14px;
    border-radius: 4px;
    border: 1px solid var(--input-normal-border-color, #e0e0e0);
    background: #fff;
    font-size: 13px;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.2s;
}

.btn-batch:hover {
    border-color: var(--primary, #34b057);
    color: var(--primary, #34b057);
}

.btn-batch--danger:hover {
    border-color: var(--red-color, #ff6161);
    color: var(--red-color, #ff6161);
}

/* ── Row actions ─────────────────────────────────── */
.row-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
    height: 100%;
}

.row-actions__btn {
    width: 26px;
    height: 26px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s;
}

.row-actions__btn:hover {
    background: var(--icon-bg-hover, #f2f2f2);
}

.row-actions__btn--del:hover {
    background: #fff0f0;
}

/* ── Confirm modal ───────────────────────────────── */
.confirm-dialog__body {
    display: flex;
    align-items: flex-start;
    gap: 14px;
}

.confirm-dialog__text p {
    margin: 0 0 6px;
    font-size: 14px;
    line-height: 1.5;
}

.text-red {
    color: var(--red-color, #ff6161);
    font-size: 13px !important;
}

:deep(.btn-red.ms-button-primary) {
    background-color: var(--red-color, #ff6161) !important;
}
</style>
