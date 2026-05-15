<template>
    <div class="page-shell">
    <MsModal :model-value="modelValue" :title="isEdit ? 'Sửa thành phần lương' : 'Thêm thành phần lương'"
        :width="700" @update:model-value="$emit('update:modelValue', $event)">

        <template #body>
            <form class="form-grid" @submit.prevent="handleSubmit">
                <!-- Row 1: Mã + Tên -->
                <div class="form-row">
                    <div class="form-col">
                        <MsTextField v-model="form.compositionCode" label="Mã thành phần" :required="true"
                            placeholder="VD: LCB_VP" :state="errors.compositionCode ? 'error' : 'normal'"
                            :errorMessage="errors.compositionCode" />
                    </div>
                    <div class="form-col">
                        <MsTextField v-model="form.compositionName" label="Tên thành phần" :required="true"
                            placeholder="VD: Lương cơ bản Văn phòng"
                            :state="errors.compositionName ? 'error' : 'normal'"
                            :errorMessage="errors.compositionName" />
                    </div>
                </div>

                <!-- Row 2: Đơn vị + Loại -->
                <div class="form-row">
                    <div class="form-col">
                        <MsDropdownList v-model="form.organizationId" label="Đơn vị áp dụng"
                            :options="orgOptions" placeholder="- Chọn đơn vị -" :isSearchable="true" />
                    </div>
                    <div class="form-col">
                        <MsDropdownList v-model="form.compositionType" label="Loại" :required="true"
                            :options="typeOptions" placeholder="- Chọn loại -" :isSearchable="false"
                            :state="errors.compositionType ? 'error' : 'normal'" />
                    </div>
                </div>

                <!-- Row 3: Tính chất + Chịu thuế -->
                <div class="form-row">
                    <div class="form-col">
                        <div class="form-field">
                            <label class="form-label">Tính chất <span class="required">*</span></label>
                            <div class="radio-group">
                                <MsRadio v-model="form.compositionProperty" :value="0" label="Thu nhập" />
                                <MsRadio v-model="form.compositionProperty" :value="1" label="Khấu trừ" />
                            </div>
                        </div>
                    </div>
                    <div class="form-col">
                        <div class="form-field">
                            <label class="form-label">Chịu thuế TNCN</label>
                            <MsToggle v-model="form.compositionIsTaxable" :true-value="1" :false-value="0"
                                label="Có tính thuế TNCN" />
                        </div>
                    </div>
                </div>

                <!-- Row 4: Kiểu giá trị + Cách tính -->
                <div class="form-row">
                    <div class="form-col">
                        <div class="form-field">
                            <label class="form-label">Kiểu giá trị</label>
                            <div class="radio-group">
                                <MsRadio v-model="form.compositionValueType" :value="1" label="Tiền cố định" />
                                <MsRadio v-model="form.compositionValueType" :value="4" label="Phần trăm (%)" />
                            </div>
                        </div>
                    </div>
                    <div class="form-col">
                        <div class="form-field">
                            <label class="form-label">Cách tính</label>
                            <div class="radio-group">
                                <MsRadio v-model="form.compositionValueCategory" :value="0" label="Nhập tay" />
                                <MsRadio v-model="form.compositionValueCategory" :value="1" label="Theo công thức" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Công thức (show when compositionValueCategory === 1) -->
                <Transition name="formula-expand">
                    <div v-if="form.compositionValueCategory === 1" class="form-row full">
                        <MsFormula v-model="form.compositionFormula" label="Công thức tính"
                            placeholder="VD: [LBH_ALL] * 0.08 hoặc [LCB_VP] * 1.5" />
                    </div>
                </Transition>

                <!-- Ghi chú -->
                <div class="form-row full">
                    <div class="form-field">
                        <label class="form-label">Ghi chú</label>
                        <textarea v-model="form.compositionDescription" class="form-textarea"
                            placeholder="Mô tả thêm về thành phần lương này..." rows="3"></textarea>
                    </div>
                </div>
            </form>
        </template>

        <template #footer>
            <MsButton type="secondary" @click="$emit('update:modelValue', false)">Hủy</MsButton>
            <MsButton type="secondary" @click="handleSaveAndContinue" v-if="!isEdit">
                Lưu &amp; Thêm tiếp
            </MsButton>
            <MsButton type="primary" @click="handleSubmit">
                {{ isEdit ? 'Cập nhật' : 'Lưu' }}
            </MsButton>
        </template>
    </MsModal>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

import MsModal from '@/components/base/ms-popup/MsModal.vue'
import MsTextField from '@/components/base/ms-input/MsTextField.vue'
import MsDropdownList from '@/components/base/ms-dropdown/MsDropdownList.vue'
import MsRadio from '@/components/base/ms-selection/MsRadio.vue'
import MsToggle from '@/components/base/ms-selection/MsToggle.vue'
import MsFormula from '@/components/base/ms-input/MsFormula.vue'
import MsButton from '@/components/base/ms-button/MsButton.vue'

import { COMPOSITION_TYPE_OPTIONS } from '@/utils/constants.js'

const props = defineProps({
    modelValue: { type: Boolean, default: false },
    item: { type: Object, default: null },
    orgOptions: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue', 'save'])

const isEdit = computed(() => !!props.item?.compositionId)

const defaultForm = () => ({
    compositionId: null,
    compositionCode: '',
    compositionName: '',
    organizationId: '',
    compositionType: null,
    compositionProperty: 0,
    compositionIsTaxable: 0,
    compositionValueType: 1,
    compositionValueCategory: 0,
    compositionFormula: '',
    compositionDescription: '',
    compositionStatus: 0,
    compositionSourceType: 1
})

const form = ref(defaultForm())
const errors = ref({})

watch(() => props.item, (item) => {
    if (item) {
        form.value = { ...defaultForm(), ...item }
    } else {
        form.value = defaultForm()
    }
    errors.value = {}
}, { immediate: true })

const typeOptions = COMPOSITION_TYPE_OPTIONS

const validate = () => {
    const e = {}
    if (!form.value.compositionCode?.trim()) e.compositionCode = 'Mã thành phần không được để trống'
    if (!form.value.compositionName?.trim()) e.compositionName = 'Tên thành phần không được để trống'
    if (form.value.compositionType === null || form.value.compositionType === undefined || form.value.compositionType === '') {
        e.compositionType = 'Vui lòng chọn loại'
    }
    errors.value = e
    return Object.keys(e).length === 0
}

const handleSubmit = () => {
    if (!validate()) return
    emit('save', { ...form.value })
}

const handleSaveAndContinue = () => {
    if (!validate()) return
    emit('save', { ...form.value })
    form.value = defaultForm()
    errors.value = {}
}
</script>

<style scoped>
.page-shell { height: 100%; padding: 12px 16px 16px; background: rgb(16, 24, 40); box-sizing: border-box; }

.form-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.form-row.full {
    grid-template-columns: 1fr;
}

.form-col {
    display: flex;
    flex-direction: column;
}

.form-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-label {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary-color, #212121);
}

.required {
    color: var(--red-color, #ff6161);
    margin-left: 2px;
}

.radio-group {
    display: flex;
    gap: 20px;
    align-items: center;
    height: 36px;
}

.form-textarea {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--input-normal-border-color, #e0e0e0);
    border-radius: 4px;
    font-size: 14px;
    font-family: inherit;
    color: var(--text-primary-color, #212121);
    resize: vertical;
    outline: none;
    transition: border-color 0.2s;
    box-sizing: border-box;
    min-height: 72px;
}

.form-textarea:focus {
    border-color: var(--input-active-border-color, #34b057);
}

.form-textarea::placeholder {
    color: var(--text-disable-color, #9e9e9e);
}

/* Formula expand animation */
.formula-expand-enter-active,
.formula-expand-leave-active {
    transition: all 0.25s ease;
    overflow: hidden;
}

.formula-expand-enter-from,
.formula-expand-leave-to {
    max-height: 0;
    opacity: 0;
    margin-top: 0;
}

.formula-expand-enter-to,
.formula-expand-leave-from {
    max-height: 200px;
    opacity: 1;
}
</style>