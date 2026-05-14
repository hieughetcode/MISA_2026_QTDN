<template>
    <div class="sys-category" @click="closeAllDropdowns">
        <!-- ── Header ─────────────────────────────────── -->
        <div class="page-header">
            <div class="page-header__left">
                <div class="btn-back" @click="$router.push('/salarycomposition')">
                    <div class="icon-arrow-left"></div>
                </div>
                <div class="page-header__title">Danh mục thành phần lương hệ thống</div>
            </div>
            <div class="page-header__actions">
                <MsButton type="primary" :disabled="selectedKeys.length === 0"
                    @click="inheritSelected">
                    <span class="btn-plus">+</span> Thêm vào danh sách ({{ selectedKeys.length }})
                </MsButton>
            </div>
        </div>

        <!-- ── Toolbar ────────────────────────────────── -->
        <div class="page-toolbar">
            <div class="toolbar__left">
                <!-- Search -->
                <div class="search-wrap">
                    <div class="icon-search-sm"></div>
                    <input class="search-input" v-model="searchText"
                        placeholder="Tìm theo mã, tên danh mục..." @input="currentPage = 1" />
                </div>

                <!-- Loại chip -->
                <div class="filter-chip" @click.stop="toggleChip('type')">
                    <span>Loại: <b>{{ selectedTypeLabel }}</b></span>
                    <div class="icon-chevron-xs" :class="{ 'is-open': openChip === 'type' }"></div>
                    <Transition name="chip-drop">
                        <div v-if="openChip === 'type'" class="chip-menu" @click.stop>
                            <div v-for="opt in typeChipOptions" :key="String(opt.value)"
                                class="chip-menu-item" :class="{ 'is-selected': filterType === opt.value }"
                                @click="filterType = opt.value; openChip = null; currentPage = 1">
                                <div class="chip-check">
                                    <div v-if="filterType === opt.value" class="icon-check-sm"></div>
                                </div>
                                {{ opt.label }}
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
            </div>
        </div>

        <!-- ── Grid ───────────────────────────────────── -->
        <div class="page-grid">
            <DxDataGrid :data-source="paginatedData" key-expr="sysCompositionId"
                :show-borders="false" :hover-state-enabled="true"
                :allow-column-resizing="true" column-resizing-mode="widget"
                height="100%"
                @selection-changed="onSelectionChanged">

                <DxSelection mode="multiple" show-check-boxes-mode="always" />
                <DxScrolling mode="standard" />
                <DxPaging :enabled="false" />

                <DxColumn data-field="sysCompositionCode" caption="Mã danh mục" :width="180"
                    :fixed="true" fixed-position="left" />
                <DxColumn data-field="sysCompositionName" caption="Tên danh mục" :min-width="220" />
                <DxColumn data-field="sysCompositionType" caption="Loại" :width="180"
                    cell-template="typeCell" />
                <DxColumn data-field="sysCompositionProperty" caption="Tính chất" :width="130"
                    cell-template="propertyCell" />
                <DxColumn data-field="sysCompIsTaxable" caption="Chịu thuế" :width="110"
                    cell-template="taxableCell" />
                <DxColumn data-field="sysCompValueType" caption="Kiểu giá trị" :width="140"
                    cell-template="valueTypeCell" />
                <DxColumn data-field="sysCompDescription" caption="Mô tả" :min-width="200" />

                <template #typeCell="{ data }">
                    <span class="cell-text">{{ COMPOSITION_TYPE_MAP[data.value] || '-' }}</span>
                </template>
                <template #propertyCell="{ data }">
                    <span class="badge" :class="data.value === 1 ? 'badge--red' : 'badge--green'">
                        {{ COMPOSITION_PROPERTY_MAP[data.value] }}
                    </span>
                </template>
                <template #taxableCell="{ data }">
                    <span :class="data.value === 1 ? 'cell-yes' : 'cell-muted'">
                        {{ COMPOSITION_TAXABLE_MAP[data.value] }}
                    </span>
                </template>
                <template #valueTypeCell="{ data }">
                    <span class="cell-text">{{ COMPOSITION_VALUE_TYPE_MAP[data.value] || '-' }}</span>
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

        <!-- ── Toast ─────────────────────────────────── -->
        <div class="toast-stack">
            <MsToast v-for="t in toasts" :key="t.id" :type="t.type" :text="t.text"
                @close="removeToast(t.id)" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { DxDataGrid, DxColumn, DxSelection, DxScrolling, DxPaging } from 'devextreme-vue/data-grid'

import MsButton from '@/components/base/ms-button/MsButton.vue'
import MsTooltip from '@/components/base/ms-tooltip/MsTooltip.vue'
import MsToast from '@/components/base/ms-popup/MsToast.vue'

import { sysCompositions } from '@/mocks/data.js'
import {
    COMPOSITION_TYPE_MAP, COMPOSITION_VALUE_TYPE_MAP, COMPOSITION_PROPERTY_MAP,
    COMPOSITION_TAXABLE_MAP, COMPOSITION_TYPE_OPTIONS
} from '@/utils/constants.js'

const router = useRouter()

const searchText = ref('')
const filterType = ref('')
const openChip = ref(null)
const showPageSizeMenu = ref(false)
const selectedKeys = ref([])
const toasts = ref([])
const currentPage = ref(1)
const pageSize = ref(25)

const typeChipOptions = [
    { value: '', label: 'Tất cả' },
    ...COMPOSITION_TYPE_OPTIONS
]

const selectedTypeLabel = computed(() => {
    const opt = typeChipOptions.find(o => o.value === filterType.value)
    return opt ? opt.label : 'Tất cả'
})

const hasActiveFilter = computed(() => filterType.value !== '' || searchText.value !== '')

const filteredData = computed(() => {
    let result = sysCompositions
    const q = searchText.value.trim().toLowerCase()
    if (q) {
        result = result.filter(r =>
            r.sysCompositionCode?.toLowerCase().includes(q) ||
            r.sysCompositionName?.toLowerCase().includes(q)
        )
    }
    if (filterType.value !== '' && filterType.value !== null) {
        result = result.filter(r => r.sysCompositionType === Number(filterType.value))
    }
    return result
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

const onSelectionChanged = (e) => {
    selectedKeys.value = e.selectedRowKeys
}

const toggleChip = (name) => { openChip.value = openChip.value === name ? null : name }
const closeAllDropdowns = () => { openChip.value = null; showPageSizeMenu.value = false }

onMounted(() => document.addEventListener('click', closeAllDropdowns))
onUnmounted(() => document.removeEventListener('click', closeAllDropdowns))

const inheritSelected = () => {
    const count = selectedKeys.value.length
    showToast('success', `Đã thêm ${count} khoản lương vào danh sách`)
    setTimeout(() => router.push('/salarycomposition'), 800)
}

let toastId = 0
const showToast = (type, text) => {
    const id = ++toastId
    toasts.value.push({ id, type, text })
}
const removeToast = (id) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
}
</script>

<style scoped>
/* ── Layout ──────────────────────────────────────── */
.sys-category { display: flex; flex-direction: column; height: 100%; overflow: hidden; font-size: 14px; }

/* ── Header ──────────────────────────────────────── */
.page-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 20px; height: 52px; background: #fff;
    border-bottom: 1px solid var(--grid-border-color, #e0e0e0); flex-shrink: 0;
}
.page-header__left { display: flex; align-items: center; gap: 10px; }
.page-header__title { font-size: 17px; font-weight: 700; color: var(--text-primary-color, #212121); }
.page-header__actions { display: flex; gap: 8px; }

.btn-back {
    width: 32px; height: 32px; border-radius: 4px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background 0.15s;
}
.btn-back:hover { background: var(--icon-bg-hover, #f2f2f2); }

.btn-plus { font-size: 16px; line-height: 1; margin-right: 2px; }

/* ── Toolbar ─────────────────────────────────────── */
.page-toolbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 7px 20px; background: #fff;
    border-bottom: 1px solid var(--grid-border-color, #e0e0e0); flex-shrink: 0; gap: 8px;
}
.toolbar__left { display: flex; align-items: center; gap: 8px; flex: 1; }
.toolbar__right { display: flex; align-items: center; gap: 2px; }

/* Search */
.search-wrap {
    display: flex; align-items: center; gap: 6px;
    width: 260px; height: 32px; padding: 0 10px;
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

.chip-menu {
    position: absolute; top: calc(100% + 4px); left: 0;
    background: #fff; border: 1px solid var(--grid-border-color, #e0e0e0);
    border-radius: 4px; box-shadow: 0 4px 16px rgba(0,0,0,.12);
    padding: 6px; min-width: 180px; z-index: 1000; max-height: 280px; overflow-y: auto;
}
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

/* ── Grid ────────────────────────────────────────── */
.page-grid { flex: 1; overflow: hidden; }

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

.pager-nav { display: flex; align-items: center; gap: 2px; }
.nav-btn {
    width: 28px; height: 28px; border-radius: 4px;
    border: 1px solid var(--input-normal-border-color, #e0e0e0);
    background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all 0.15s; padding: 0;
}
.nav-btn:hover:not(:disabled) { border-color: var(--primary, #34b057); background: var(--primary-bg, #eafbf2); }
.nav-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── Badges ──────────────────────────────────────── */
.badge {
    display: inline-flex; align-items: center; padding: 2px 8px;
    border-radius: 10px; font-size: 12px; font-weight: 500; white-space: nowrap;
}
.badge--green { background: #e8f5e9; color: #2e7d32; }
.badge--red { background: #ffebee; color: #c62828; }
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

/* ── Icons ───────────────────────────────────────── */
.icon-arrow-left {
    width: 20px; height: 20px; background-color: var(--icon-border, #707070);
    mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'><line x1='19' y1='12' x2='5' y2='12'/><polyline points='12 19 5 12 12 5'/></svg>");
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
.sys-category .dx-datagrid { font-family: inherit; font-size: 13px; border: none; }
.sys-category .dx-datagrid-headers { background-color: var(--grid-header-bg, #f6f6f6); border-bottom: 1px solid var(--grid-border-color, #e0e0e0); }
.sys-category .dx-datagrid-headers .dx-datagrid-table .dx-row > td {
    background-color: var(--grid-header-bg, #f6f6f6);
    color: var(--text-secondary-color, #666);
    font-weight: 600; font-size: 13px;
    padding: 0 10px;
    border-right: 1px solid var(--grid-border-color, #e0e0e0);
    border-bottom: none; height: 40px;
}
.sys-category .dx-datagrid-rowsview .dx-row > td {
    padding: 0 10px;
    border-right: 1px solid var(--grid-border-color, #e0e0e0);
    border-bottom: 1px solid var(--grid-border-color, #e0e0e0);
    vertical-align: middle; color: var(--text-primary-color, #212121);
    font-size: 13px; height: 40px;
}
.sys-category .dx-datagrid-rowsview .dx-row:hover > td { background-color: #f8fffe; }
.sys-category .dx-datagrid-rowsview .dx-selection > td,
.sys-category .dx-datagrid-rowsview .dx-selection:hover > td { background-color: #eafbf2 !important; }
.sys-category .dx-checkbox-checked .dx-checkbox-icon,
.sys-category .dx-checkbox-indeterminate .dx-checkbox-icon {
    background-color: var(--primary, #34b057); border-color: var(--primary, #34b057);
}
.sys-category .dx-datagrid-header-panel { display: none; }
.sys-category .dx-datagrid-borders > .dx-datagrid-headers,
.sys-category .dx-datagrid-borders > .dx-datagrid-rowsview { border-left: none; border-right: none; }
</style>