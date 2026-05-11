<template>
    <div class="test-button-container"
        style="padding: 24px; display: flex; flex-direction: column; gap: 24px; background-color: #f4f5f8; min-height: 100vh;">
        <h2>Test Component MsButton (6 loại nút)</h2>

        <div class="button-row" style="display: flex; gap: 16px; align-items: center;">
            <span style="width: 150px; font-weight: bold;">1. Nút chính:</span>
            <MsButton type="primary">Button</MsButton>
            <MsButton type="primary" disabled>Button</MsButton>
        </div>

        <div class="button-row" style="display: flex; gap: 16px; align-items: center;">
            <span style="width: 150px; font-weight: bold;">2. Nút phụ:</span>
            <MsButton type="secondary">Button</MsButton>
            <MsButton type="secondary" disabled>Button</MsButton>
        </div>

        <div class="button-row" style="display: flex; gap: 16px; align-items: center;">
            <span style="width: 150px; font-weight: bold;">3. Link button:</span>
            <MsButton type="link">Button</MsButton>
            <MsButton type="link" disabled>Button</MsButton>
        </div>

        <div class="button-row" style="display: flex; gap: 16px; align-items: center;">
            <span style="width: 150px; font-weight: bold;">4. Combo Button:</span>
            <MsButton type="combo">Button</MsButton>
            <MsButton type="combo" disabled>Button</MsButton>
        </div>

        <div class="button-row" style="display: flex; gap: 16px; align-items: center;">
            <span style="width: 150px; font-weight: bold;">5. Button with icon:</span>
            <MsButton type="primary" icon="ic-add">Button</MsButton>
            <MsButton type="primary" icon="ic-add" disabled>Button</MsButton>
        </div>

        <div class="button-row" style="display: flex; gap: 16px; align-items: center;">
            <span style="width: 150px; font-weight: bold;">6. Mixed button:</span>
            <MsButton type="mixed" icon="ic-add" rightIcon="ic-chevron-down">Button</MsButton>
            <MsButton type="mixed" icon="ic-add" rightIcon="ic-chevron-down" disabled>Button</MsButton>
        </div>

        <div style="margin-top: 40px;">
            <h2>Test Component MsTextField (Các trạng thái Textbox)</h2>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
                <MsTextField label="Normal" required placeholder="Watermark..." />
                <MsTextField label="Focus" placeholder="Watermark..." focused />
                <MsTextField label="Error" placeholder="Watermark..." state="error"
                    errorMessage="<Tên trường> không được để trống" />

                <MsTextField label="Verifying" placeholder="misa.amis.vn" state="verifying" />
                <MsTextField label="Valid" placeholder="misa.amis.vn" state="valid" />
                <MsTextField label="Read Only" placeholder="misa.amis.vn" readonly />

                <MsTextField label="Hover" placeholder="Watermark..." hovered />
                <MsTextField label="Multi" isMulti v-model="multiTags" />
                <MsTextField label="Read Only (Multi)" isMulti :modelValue="['Mới', 'Đang chăm sóc']" readonly />

                <MsTextField label="Normal (Search)" placeholder="Watermark..." isSearch />
                <MsTextField label="Hover/Press (Search)" placeholder="Re chuột và Click vào icon" isSearch />
            </div>
        </div>

        <div style="margin-top: 40px;">
            <h2>Test Component MsDropdownList</h2>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; padding-bottom: 200px;">
                <MsDropdownList label="Normal (Có Search)" v-model="selectedCity" :options="cityOptions" />

                <MsDropdownList label="Đang tải dữ liệu" isLoading :options="[]" placeholder="Đang tải..." />

                <MsDropdownList label="Multi Select" isMulti v-model="selectedTags" :options="tagOptions"
                    placeholder="Chọn trạng thái" />

                <div>
                    <label style="font-size: 14px; font-weight: 500; margin-bottom: 4px; display:block">Action Menu
                        (Context)</label>
                    <MsDropdownList isActionMenu :options="actionOptions">
                        <template #trigger>
                            <MsButton type="secondary" rightIcon="ic-chevron-down">Tùy chọn</MsButton>
                        </template>
                    </MsDropdownList>
                </div>
            </div>
        </div>
        <!-- Inactive -->
        <MsCheckbox v-model="val" label="Inactive" />

        <!-- Active -->
        <MsCheckbox v-model="val" label="Active" />

        <!-- Disabled Inactive -->
        <MsCheckbox v-model="val" label="Disable Inactive" :disabled="true" />

        <!-- Disabled Active -->
        <MsCheckbox :model-value="true" label="Disable Active" :disabled="true" />

        <div style="margin-top: 40px;">
            <h2>Test Component MsRadio (Radio Button)</h2>
            <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap;">
                <!-- Inactive (click vào label "Active" để thấy nó bỏ chọn, và thử Hover/Press vào đây) -->
                <MsRadio v-model="radioVal" value="inactive" label="Inactive" />

                <!-- Active -->
                <MsRadio v-model="radioVal" value="active" label="Active" />

                <!-- Disabled Inactive -->
                <MsRadio v-model="radioVal" value="disabled_inactive" label="Disable Inactive" disabled />

                <!-- Disabled Active -->
                <MsRadio model-value="fixed_active" value="fixed_active" label="Disable Active" disabled />
            </div>
        </div>

        <div style="margin-top: 40px;">
            <h2>Test Component MsToggle (Toogle / Switch)</h2>
            <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap;">
                <!-- Off -->
                <MsToggle v-model="toggleVal" label="Off" />

                <!-- Disable Off -->
                <MsToggle :model-value="false" label="Disable Off" disabled />

                <!-- On -->
                <MsToggle :model-value="true" label="On" />

                <!-- Disable On -->
                <MsToggle :model-value="true" label="Disable On" disabled />
            </div>
        </div>

        <div style="margin-top: 40px;">
            <h2>Test Component MsToast (Toast Message)</h2>
            <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
                <MsToast type="info" text="Thông tin" />
                <MsToast type="warning" text="Cảnh báo" />
                <MsToast type="success" text="Thành công" />
                <MsToast type="error" text="Lỗi" />
            </div>

            <div style="margin-top: 16px; display: flex; gap: 8px;">
                <MsButton @click="triggerToast('info', 'Đây là thông báo thông tin')">Show Info Toast</MsButton>
                <MsButton @click="triggerToast('warning', 'Đây là thông báo cảnh báo')">Show Warning Toast</MsButton>
                <MsButton @click="triggerToast('success', 'Đây là thông báo thành công')">Show Success Toast</MsButton>
                <MsButton @click="triggerToast('error', 'Đây là thông báo lỗi')">Show Error Toast</MsButton>
            </div>
        </div>
    </div>

    <!-- Fixed container for dynamic toasts -->
    <div class="toast-fixed-container">
        <TransitionGroup name="toast-slide">
            <MsToast v-for="toast in activeToasts" :key="toast.id" :type="toast.type" :text="toast.text"
                @close="removeToast(toast.id)" />
        </TransitionGroup>
    </div>
</template>

<script setup>
import MsButton from '@/components/base/ms-button/MsButton.vue';
import MsTextField from '@/components/base/ms-input/MsTextField.vue';
import MsDropdownList from '@/components/base/ms-dropdown/MsDropdownList.vue';
import MsCheckbox from '@/components/base/ms-selection/MsCheckbox.vue';
import MsRadio from '@/components/base/ms-selection/MsRadio.vue';
import MsToggle from '@/components/base/ms-selection/MsToggle.vue';
import MsToast from '@/components/base/ms-popup/MsToast.vue';
import { ref } from 'vue';

const multiTags = ref(['Mới', 'Đang chăm sóc']);

const selectedCity = ref('haiphong');
const cityOptions = ref([
    { label: '- Không chọn -', value: '' },
    { label: 'Hà Nội', value: 'hanoi' },
    { label: 'TP. Hồ Chí Minh', value: 'hcm' },
    { label: 'Đà Nẵng', value: 'danang' },
    { label: 'Hải Phòng', value: 'haiphong' },
    { label: 'Hải Dương', value: 'haiduong' }
]);

const selectedTags = ref(['moi', 'dangchamsoc']);
const tagOptions = ref([
    { label: 'Mới', value: 'moi' },
    { label: 'Đang chăm sóc', value: 'dangchamsoc' },
    { label: 'Đủ điều kiện', value: 'dudieukien' },
    { label: 'Không đủ điều kiện', value: 'khongdudieukien' }
]);

const actionOptions = ref([
    { label: 'Kích hoạt tài khoản', value: 'active' },
    { label: 'Thông báo trên Mạng xã hội', value: 'social' },
    { label: 'Thông báo NV tự cập nhật hồ sơ', value: 'notify' },
    { divider: true },
    { label: 'In', value: 'print' },
    { label: 'Xuất khẩu', value: 'export', hasSub: true },
    { label: 'Nhập khẩu', value: 'import', hasSub: true },
    { divider: true },
    { label: 'Xóa', value: 'delete', danger: true }
]);

const radioVal = ref('active');
const toggleVal = ref(false);

const activeToasts = ref([]);
let toastId = 0;

const triggerToast = (type, text) => {
    const id = toastId++;
    activeToasts.value.push({ id, type, text });
    setTimeout(() => {
        removeToast(id);
    }, 3000); // Toast tự động tắt sau 3 giây
};

const removeToast = (id) => {
    activeToasts.value = activeToasts.value.filter(t => t.id !== id);
};
</script>

<style scoped>
.toast-fixed-container {
    position: fixed;
    top: 24px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    gap: 8px;
    z-index: 10000;
    align-items: center;
}

.toast-slide-enter-active,
.toast-slide-leave-active {
    transition: all 0.3s ease;
}

.toast-slide-enter-from,
.toast-slide-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}
</style>