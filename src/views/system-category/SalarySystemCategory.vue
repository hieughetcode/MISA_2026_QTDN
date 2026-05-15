<template>
    <div class="page-shell" @click="closeAllDropdowns">
        <div class="sys-category">
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

        <!-- ── Grid (MsGrid handles DxDataGrid + pagination footer) ── -->
        <div class="page-grid">
            <MsGrid
                :data="paginatedData"
                key-expr="sysCompositionId"
                :columns="columns"
                :total="filteredData.length"
                v-model:page-size="pageSize"
                v-model:current-page="currentPage"
                :selectable="true"
                @selection-changed="onSelectionChanged"
            >
                <template #toolbarLeft>
                    <SearchBar v-model="searchText" placeholder="Tìm theo mã, tên danh mục..." />
                    <FilterChip
                        label="Loại"
                        v-model="filterType"
                        :options="typeChipOptions"
                        :is-open="openChip === 'type'"
                        @toggle="toggleChip('type')"
                    />
                </template>

                <template #toolbarRight>
                    <MsToolbarBtn icon="icon-filter" tooltip="Bộ lọc" :active="hasActiveFilter" />
                </template>

                <template #typeCell="{ data }">
                    <span class="cell-text">{{ COMPOSITION_TYPE_MAP[data.value] || '-' }}</span>
                </template>
                <template #propertyCell="{ data }">
                    <StatusBadge :variant="data.value === 1 ? 'red' : 'green'" :text="COMPOSITION_PROPERTY_MAP[data.value]" />
                </template>
                <template #taxableCell="{ data }">
                    <span :class="data.value === 1 ? 'cell-yes' : 'cell-muted'">
                        {{ COMPOSITION_TAXABLE_MAP[data.value] }}
                    </span>
                </template>
                <template #valueTypeCell="{ data }">
                    <span class="cell-text">{{ COMPOSITION_VALUE_TYPE_MAP[data.value] || '-' }}</span>
                </template>
            </MsGrid>
        </div>

        <!-- ── Toast ─────────────────────────────────── -->
        <ToastStack :toasts="toasts" @close="removeToast" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import { useToast } from '@/composables/useToast.js'
import { useFilterChip } from '@/composables/useFilterChip.js'
import { usePagination } from '@/composables/usePagination.js'
import SearchBar from '@/components/shared/SearchBar.vue'
import FilterChip from '@/components/shared/FilterChip.vue'
import StatusBadge from '@/components/shared/StatusBadge.vue'
import MsGrid from '@/components/base/ms-grid/MsGrid.vue'
import MsButton from '@/components/base/ms-button/MsButton.vue'
import MsToolbarBtn from '@/components/shared/MsToolbarBtn.vue'
import ToastStack from '@/components/shared/ToastStack.vue'

import { sysCompositions } from '@/mocks/data.js'
import {
    COMPOSITION_TYPE_MAP, COMPOSITION_VALUE_TYPE_MAP, COMPOSITION_PROPERTY_MAP,
    COMPOSITION_TAXABLE_MAP
} from '@/utils/constants.js'
import { toTypeChipOptions, filterByText } from '@/utils/formatter.js'

const router = useRouter()

const searchText = ref('')
const filterType = ref('')
const { openChip, toggleChip, closeAllChips } = useFilterChip()
const selectedKeys = ref([])
const { toasts, showToast, removeToast } = useToast()

// ── Column definitions ─────────────────────────────────────
const columns = [
    { field: 'sysCompositionCode', caption: 'Mã danh mục', width: 180, fixed: true, fixedPosition: 'left' },
    { field: 'sysCompositionName', caption: 'Tên danh mục', minWidth: 220 },
    { field: 'sysCompositionType', caption: 'Loại', width: 180, cellTemplate: 'typeCell' },
    { field: 'sysCompositionProperty', caption: 'Tính chất', width: 130, cellTemplate: 'propertyCell' },
    { field: 'sysCompIsTaxable', caption: 'Chịu thuế', width: 110, cellTemplate: 'taxableCell' },
    { field: 'sysCompValueType', caption: 'Kiểu giá trị', width: 140, cellTemplate: 'valueTypeCell' },
    { field: 'sysCompDescription', caption: 'Mô tả', minWidth: 200 },
]

const typeChipOptions = toTypeChipOptions()

const hasActiveFilter = computed(() => filterType.value !== '' || searchText.value !== '')


const filteredData = computed(() => {
    let result = filterByText(sysCompositions, searchText.value, ['sysCompositionCode', 'sysCompositionName'])
    if (filterType.value !== '' && filterType.value !== null) {
        result = result.filter(r => r.sysCompositionType === Number(filterType.value))
    }
    return result
})

const { currentPage, pageSize, paginatedData } = usePagination(filteredData, { resetOn: [searchText, filterType] })

const onSelectionChanged = (e) => {
    selectedKeys.value = e.selectedRowKeys
}

const closeAllDropdowns = () => { closeAllChips() }

const inheritSelected = () => {
    const count = selectedKeys.value.length
    showToast('success', `Đã thêm ${count} khoản lương vào danh sách`)
    setTimeout(() => router.push('/salarycomposition'), 800)
}

</script>

<style scoped>
/* ── Layout ──────────────────────────────────────── */
.sys-category { display: flex; flex-direction: column; height: 100%; overflow: hidden; font-size: 14px; background: #fff; border-radius: 8px; }

/* ── Header ──────────────────────────────────────── */
.page-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 20px; height: 52px; background: #fff;
    border-bottom: 1px solid var(--grid-border, #e0e0e0); flex-shrink: 0;
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

/* ── Icons ───────────────────────────────────────── */
.icon-arrow-left {
    width: 20px; height: 20px; background-color: var(--icon-border, #707070);
    mask-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'><line x1='19' y1='12' x2='5' y2='12'/><polyline points='12 19 5 12 12 5'/></svg>");
    mask-size: cover;
}

</style>
