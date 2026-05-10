<template>
    <div class="app-container">
        <Sidebar />
        <Navbar />
        <div class="content">
            <router-view />
        </div>
    </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue'
import Navbar from './Navbar.vue'
</script>

<style scoped>
.content {
    position: absolute;
    top: 48px;
    left: 220px;
    right: 0px;
    bottom: 0px;
    background: url(https://amisplatform.misacdn.net/images/imagesapps/recruit/background_default1.jpg);
    transition: left 0.3s ease;
    overflow-y: auto;
}
</style>

<style>
/* Tách ra style thường để tránh lỗi biên dịch */
body.sidebar-collapsed .content {
    left: 60px !important;
}
</style>