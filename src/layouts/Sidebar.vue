<template>
    <div class="sidebar" :class="{ 'sidebar-collapsed': isCollapsed }">
        <div class="sidebar_bg">
            <div class="sidebar__menu">
                <div v-for="(item, index) in menuItems" :key="index" class="sidebar__menu__item"
                    :class="{ 'sidebar__menu__item-active': item.isActive }" @click="setActiveMenu(index)"
                    @mouseenter="item.hasTooltip ? showItemTooltip(item, $event) : null"
                    @mouseleave="item.hasTooltip ? hideItemTooltip() : null">

                    <div class="sidebar__menu__item__icon" :class="item.iconClass"></div>

                    <div class="sidebar__menu__item__text">{{ item.name }}</div>

                    <div v-if="item.isNew" class="sidebar__menu__item__new__badge">New</div>

                    <div v-if="item.hasSubmenu" class="sidebar__menu__item__arrow"></div>
                </div>
            </div>

            <div class="sidebar__toggle-wrapper">
                <div class="sidebar__toggle" @click="toggleSidebar" @mouseenter="showToggleTooltip($event)"
                    @mouseleave="hideItemTooltip()">
                    <div class="sidebar__toggle__icon"></div>
                </div>
            </div>
        </div>
    </div>

    <Teleport to="body">
        <div v-if="itemTooltip.visible" class="sidebar-item-tooltip"
            :style="{ left: itemTooltip.x + 'px', top: itemTooltip.y + 'px' }">
            {{ itemTooltip.text }}
        </div>
    </Teleport>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'

const isCollapsed = ref(false)

const itemTooltip = reactive({ visible: false, x: 0, y: 0, text: '' })

const showItemTooltip = (item, event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    itemTooltip.text = item.name
    itemTooltip.x = rect.right + 8
    itemTooltip.y = rect.top + rect.height / 2
    itemTooltip.visible = true
}

const hideItemTooltip = () => {
    itemTooltip.visible = false
}

const showToggleTooltip = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    itemTooltip.text = isCollapsed.value ? 'Mở rộng' : 'Thu gọn'
    itemTooltip.x = rect.right + 8
    itemTooltip.y = rect.top + rect.height / 2
    itemTooltip.visible = true
}

const menuItems = ref([
    { name: 'Tổng quan', iconClass: 'icon-overview', isActive: false, hasTooltip: true },
    { name: 'Thành phần lương', iconClass: 'icon-salary-components', isActive: true, hasTooltip: true },
    { name: 'Mẫu bảng lương', iconClass: 'icon-salary-template', isActive: false, hasTooltip: true },
    { name: 'Dữ liệu tính lương', iconClass: 'icon-salary-data', isActive: false, hasSubmenu: true },
    { name: 'Tính lương', iconClass: 'icon-calc-salary', isActive: false, hasSubmenu: true },
    { name: 'Chi trả', iconClass: 'icon-payment', isActive: false, hasSubmenu: true },
    { name: 'Báo cáo', iconClass: 'icon-report', isActive: false, hasTooltip: true }
])

const setActiveMenu = (selectedIndex) => {
    menuItems.value.forEach((item, index) => {
        item.isActive = index === selectedIndex
    })
}

const toggleSidebar = async () => {
    isCollapsed.value = !isCollapsed.value
    localStorage.setItem('sidebarCollapsed', isCollapsed.value)

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
.sidebar.sidebar-collapsed .sidebar__menu__item__new__badge,
.sidebar.sidebar-collapsed .sidebar__menu__item__arrow {
    display: none;
}

.sidebar.sidebar-collapsed .sidebar__menu__item {
    width: 32px;
    height: 32px;
    padding: 0;
    margin: 0 auto 4px auto;
    justify-content: center;
    align-items: center;
}

.sidebar.sidebar-collapsed .sidebar__toggle__icon {
    transform: rotate(180deg);
}

.sidebar {
    position: absolute;
    top: 48px;
    left: 0;
    bottom: 0;
    width: 233px;
    background-color: #ffffff;
    border-right: 1px solid var(--grid-border, #e0e0e0);
    transition: width 0.3s ease;
    z-index: 8;
}

.sidebar_bg {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 16px 0px 0px 0px;
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
    height: 32px;
    margin: 0px 12px 4px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
    border-radius: 8px;
    padding: 8px 32px 8px 12px;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.sidebar__menu__item:hover {
    background-color: #E9EAEB;
}

.sidebar__menu__item:hover .sidebar__menu__item__text {}

.sidebar__menu__item-active {
    background-color: rgba(52, 176, 87, 0.12) !important;
}

.sidebar__menu__item-active .sidebar__menu__item__text {
    color: var(--color-primary-hover, #2a8c45) !important;
}

.sidebar__menu__item-active .sidebar__menu__item__icon,
.sidebar__menu__item-active .sidebar__menu__item__arrow {
    background-color: var(--color-primary-hover, #2a8c45) !important;
}

.sidebar__menu__item__icon {
    width: 20px;
    height: 20px;
    min-width: 20px;
    flex-shrink: 0;
    background-color: #757575;
    mask-image: url('/src/assets/icons/Icon.svg');
    mask-repeat: no-repeat;
}

.sidebar__menu__item__text {
    color: #424242;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    white-space: nowrap;
    overflow: hidden;
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
    top: 50%;
    transform: translateY(-50%);
    background-color: #9e9e9e;
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
.sidebar__toggle-wrapper {
    display: flex;
    justify-content: flex-end;
}

.sidebar.sidebar-collapsed .sidebar__toggle-wrapper {
    justify-content: center;
    padding: 0;
}

.sidebar.sidebar-collapsed .sidebar__toggle {
    width: 100%;
    height: 40px;
    border-width: 1px 0 0 0;
    border-radius: 0;
}

.sidebar.sidebar-collapsed .sidebar__toggle:hover {
    background-color: #ebebeb;
    border-radius: 0;
}

.sidebar.sidebar-collapsed .sidebar__toggle:active {
    background-color: #A8D9C8;
}

.sidebar__toggle {
    display: flex;
    width: 40px;
    height: 40px;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    cursor: pointer;
    transition: background-color 0.2s ease;
    flex-shrink: 0;
    border-style: solid;
    border-color: #E9EAEB;
    border-width: 1px 0 0 1px;
    border-radius: 8px 0 0;
}

.sidebar__toggle:hover {
    background-color: #ebebeb;
}

.sidebar__toggle__icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    mask-image: url("data:image/svg+xml,%3csvg%20width='20'%20height='20'%20viewBox='0%200%2020%2020'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M10.8333%205.83334H17.5M10.8333%2014.1667H17.5M14.1667%2010H17.5M2.5%2010H10.8333M2.5%2010L6.25%2013.75M2.5%2010L6.25%206.25001'%20stroke='%23717680'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/svg%3e");
    mask-repeat: no-repeat;
    mask-size: contain;
    background-color: rgb(112, 119, 133);
}

.sidebar__toggle:active {
    background-color: #A8D9C8;
}
</style>

<style>
/* Tooltip được Teleport ra body — không dùng scoped để áp dụng được */
.sidebar-item-tooltip {
    position: fixed;
    transform: translateY(-50%);
    background-color: #38393d;
    color: #ffffff;
    font-size: 13px;
    font-weight: 400;
    padding: 6px 12px;
    border-radius: 4px;
    white-space: nowrap;
    z-index: 99999;
    pointer-events: none;
}

.sidebar-item-tooltip::before {
    content: '';
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    border-width: 5px 6px 5px 0;
    border-style: solid;
    border-color: transparent #38393d transparent transparent;
}
</style>