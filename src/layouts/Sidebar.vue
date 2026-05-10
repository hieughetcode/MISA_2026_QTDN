<template>
    <div class="sidebar" :class="{ 'sidebar-collapsed': isCollapsed }">
        <div class="sidebar_bg">
            <div class="sidebar__menu">
                <div v-for="(item, index) in menuItems" :key="index" class="sidebar__menu__item"
                    :class="{ 'sidebar__menu__item-active': item.isActive }" @click="setActiveMenu(index)">

                    <div class="sidebar__menu__item__icon" :class="item.iconClass"></div>

                    <div class="sidebar__menu__item__text">{{ item.name }}</div>

                    <div v-if="item.isNew" class="sidebar__menu__item__new__badge">New</div>

                    <div v-if="item.hasSubmenu" class="sidebar__menu__item__arrow"></div>
                </div>
            </div>

            <MsTooltip position="top" :content="isCollapsed ? 'Mở rộng' : 'Mở rộng'" class="sidebar__toggle-wrapper">
                <div class="sidebar__toggle" @click="toggleSidebar">
                    <div class="sidebar__toggle__icon"></div>
                    <div class="sidebar__toggle__text">Thu gọn</div>
                </div>
            </MsTooltip>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import MsTooltip from '@/components/base/ms-tooltip/MsTooltip.vue'

const isCollapsed = ref(false)

const menuItems = ref([
    { name: 'Tổng quan', iconClass: 'icon-overview', isActive: false },
    { name: 'Thành phần lương', iconClass: 'icon-salary-components', isActive: true }, // Đang active màu xanh
    { name: 'Mẫu bảng lương', iconClass: 'icon-salary-template', isActive: false },
    { name: 'Dữ liệu tính lương', iconClass: 'icon-salary-data', isActive: false, hasSubmenu: true },
    { name: 'Tính lương', iconClass: 'icon-calc-salary', isActive: false, hasSubmenu: true },
    { name: 'Chi trả', iconClass: 'icon-payment', isActive: false, hasSubmenu: true },
    { name: 'Báo cáo', iconClass: 'icon-report', isActive: false },
    { name: 'Thiết lập', iconClass: 'icon-settings', isActive: false, hasSubmenu: true }
])

const setActiveMenu = (selectedIndex) => {
    menuItems.value.forEach((item, index) => {
        item.isActive = index === selectedIndex
    })
}

const toggleSidebar = async () => {
    isCollapsed.value = !isCollapsed.value
    localStorage.setItem('sidebarCollapsed', isCollapsed.value)

    // Đợi Vue cập nhật class trên DOM của component xong rồi mới tác động lên body
    await nextTick()

    if (isCollapsed.value) {
        document.body.classList.add('sidebar-collapsed')
    } else {
        document.body.classList.remove('sidebar-collapsed')
    }
}

onMounted(() => {
    const storedState = localStorage.getItem('sidebarCollapsed')
    if (storedState === 'true') {
        isCollapsed.value = true
        document.body.classList.add('sidebar-collapsed')
    }
})
</script>

<style scoped>
/* ================= CSS Thu gọn ================= */
.sidebar.sidebar-collapsed {
    width: 60px;
}

.sidebar.sidebar-collapsed .sidebar__menu__item__text,
.sidebar.sidebar-collapsed .sidebar__toggle__text,
.sidebar.sidebar-collapsed .sidebar__menu__item__new__badge,
.sidebar.sidebar-collapsed .sidebar__menu__item__arrow {
    display: none;
}

/* Đảm bảo căn giữa tuyệt đối cho Icon Menu khi thu gọn */
.sidebar.sidebar-collapsed .sidebar__menu__item {
    width: 40px;
    height: 40px;
    /* Cố định chiều cao bằng chiều rộng tạo hình vuông */
    padding: 0;
    /* Xóa sạch padding */
    margin: 0 auto 8px auto;
    /* Dùng margin auto để tự động căn giữa item trong khung 60px */
    justify-content: center;
    /* Căn giữa theo chiều ngang */
    align-items: center;
    /* Căn giữa theo chiều dọc */
}

/* Đảm bảo căn giữa tuyệt đối cho Nút Thu gọn */
.sidebar.sidebar-collapsed .sidebar__toggle {
    width: 40px;
    height: 40px;
    padding: 0;
    margin: 0 auto;
    justify-content: center;
    align-items: center;
    align-self: center;
    /* Đảm bảo nút luôn căn giữa tuyệt đối trong mọi trường hợp */
}

.sidebar.sidebar-collapsed .sidebar__toggle__icon {
    transform: rotate(180deg);
    margin: 0;
}

/* ================= CSS Mở rộng (Mặc định) ================= */
.sidebar {
    position: absolute;
    top: 48px;
    left: 0;
    bottom: 0;
    width: 220px;
    background-color: #161a17;
    background-image: url(https://amisplatform.misacdn.net/apps/recruit/event-sidebar.b836f9e63b28d1c0.png);
    background-position: bottom left;
    background-repeat: no-repeat;
    background-size: 100% auto;
    transition: width 0.3s ease;
    z-index: 8;
}

.sidebar_bg {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 24px 0px 16px 0px;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
}

.sidebar__menu {
    flex: 1;
    overflow-y: auto;
}

.sidebar__menu::-webkit-scrollbar {
    display: none;
}

.sidebar__menu__item {
    height: 36px;
    margin: 0px 12px 8px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    /* Tự động tạo khoảng cách đều 8px giữa icon, text và các badge/arrow */
    position: relative;
    border-radius: 8px;
    padding: 8px 32px 8px 12px;
    /* Tăng padding phải để tránh chữ đè lên mũi tên */
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.sidebar__menu__item:hover {
    background-color: rgba(52, 176, 87, .25);
}

.sidebar__menu__item:hover .sidebar__menu__item__text {
    color: #ffffff;
}

.sidebar__menu__item:hover .sidebar__menu__item__icon,
.sidebar__menu__item:hover .sidebar__menu__item__arrow {
    background-color: #ffffff;
}

.sidebar__menu__item-active {
    background-color: var(--color-primary, #34b057) !important;
}

.sidebar__menu__item-active .sidebar__menu__item__text {
    color: #ffffff !important;
}

.sidebar__menu__item-active .sidebar__menu__item__icon,
.sidebar__menu__item-active .sidebar__menu__item__arrow {
    background-color: #ffffff !important;
}

/* ================= Các thành phần bên trong Menu Item ================= */
.sidebar__menu__item__icon {
    width: 20px;
    height: 20px;
    min-width: 20px;
    flex-shrink: 0;
    /* Quan trọng: Ngăn không cho icon bị bóp méo khi màn hình hẹp */
    background-color: #c5ccd5;
    mask-image: url('/src/assets/icons/Icon.svg');
    mask-repeat: no-repeat;
}

.sidebar__menu__item__text {
    color: #c5ccd5;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    white-space: nowrap;
    overflow: hidden;
    /* Cắt chữ nếu quá dài */
    text-overflow: ellipsis;
    flex: 1;
    margin-bottom: 4px;
}

.sidebar__menu__item__arrow {
    width: 16px;
    height: 16px;
    min-width: 16px;
    flex-shrink: 0;
    position: absolute;
    right: 6px;
    /* Neo cố định mũi tên sát lề phải của khối item */
    top: 50%;
    transform: translateY(-50%);
    /* Giữ cho mũi tên luôn được căn giữa theo chiều dọc */
    background-color: #c5ccd5;
    mask-image: url('/src/assets/icons/Icon.svg');
    mask-position: -186px -781px;
}



/* ================= Khu vực Tọa độ Icon ================= */
.icon-overview {
    mask-position: -1px -778px;
}

.icon-salary-components {
    mask-position: -121px -778px;
}

.icon-salary-template {
    mask-position: -102px -779px;
}

.icon-salary-data {
    mask-position: -22px -778px;
}

.icon-calc-salary {
    mask-position: -41px -778px;
}

.icon-payment {
    mask-position: -62px -778px;
}

.icon-report {
    mask-position: -82px -779px;
}

.icon-settings {
    mask-position: -141px -778px;
}

/* ================= Nút Thu Gọn ================= */
.sidebar__toggle {
    display: flex;
    height: 40px;
    align-items: center;
    justify-content: center;
    width: 172px;
    /* Thu gọn chiều rộng của nút cho vừa với nội dung */
    padding: 0 16px;
    /* Thêm khoảng trống 2 bên để nút trông cân đối */
    margin: 0 auto;
    /* Căn giữa nút trong Sidebar */
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.1);
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.sidebar__toggle-wrapper {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    /* Ép phần tử con giãn hết chiều ngang */
}

.sidebar__toggle:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

.sidebar__toggle__icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    mask-image: url('/src/assets/icons/Icon.svg');
    mask-position: -162px -779px;
    background-color: #c5ccd5;
}

.sidebar__toggle__text {
    color: #c5ccd5;
    font-size: 14px;
    font-weight: 500;
    margin-left: 8px;
    white-space: nowrap;
    margin-bottom: 2px;
}

.sidebar__toggle:hover .sidebar__toggle__text {
    color: #ffffff;
}

.sidebar__toggle:hover .sidebar__toggle__icon {
    background-color: #ffffff;
}
</style>