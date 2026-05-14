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
    background: #f4f5f8;
    top: 48px;
    left: 220px;
    right: 0px;
    bottom: 0px;
    transition: left 0.3s ease;
    overflow-y: auto;
}
</style>

<style>
body.sidebar-collapsed .content {
    left: 60px !important;
}
</style>