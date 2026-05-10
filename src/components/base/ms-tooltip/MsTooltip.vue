<template>
    <div class="ms-tooltip-wrapper" @mouseenter="isVisible = true" @mouseleave="isVisible = false">
        <slot></slot>

        <div v-if="isVisible" class="ms-tooltip-content" :class="position">
            {{ content }}
            <div class="ms-tooltip-arrow"></div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    content: {
        type: String,
        required: true
    },
    // Vị trí hiển thị: 'bottom' (mặc định), 'top', 'left', 'right'
    position: {
        type: String,
        default: 'bottom'
    }
})

const isVisible = ref(false)
</script>

<style scoped>
/* Container của Tooltip */
.ms-tooltip-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

/* Tooltip-box */
.ms-tooltip-content {
    position: absolute;
    background-color: #38393D;
    color: #FFFFFF;
    font-size: 13px;
    padding: 6px 12px;
    border-radius: 4px;
    white-space: nowrap;
    /* Không cho rớt dòng nếu text ngắn */
    z-index: 9999;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    pointer-events: none;
}

/* Định vị Tooltip hiển thị ở dưới phần tử */
.ms-tooltip-content.bottom {
    top: calc(100% + 6px);
    /* Mũi tên cao 6px, đặt calc(100% + 6px) để đầu mũi tên vừa chạm sát mép icon */
    left: 50%;
    transform: translateX(-50%);
}

/* --- BIẾN THỂ: BOTTOM-START (phù hợp cho nút ở sát màn hình tránh dính viền)*/
.ms-tooltip-content.bottom-start {
    top: calc(100% + 6px);
    left: -4px;
    /* Neo lề trái, nhích nhẹ 4px cho đỡ dính viền màn hình */
    transform: none;
    /* Tắt tính năng tự động căn giữa */
}

/* Arrow Tooltip */
.ms-tooltip-content.bottom-start .ms-tooltip-arrow {
    border-width: 0 6px 6px 6px;
    border-color: transparent transparent #38393D transparent;
    top: -5px;
    /* Nhích xuống 1px để đè lên box, xóa vệt hở */
    left: 12px;
    transform: translateX(-50%);
}

/* Arrow Tooltip*/
.ms-tooltip-arrow {
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
}

/* Mũi tên cho Tooltip Bottom */
.ms-tooltip-content.bottom .ms-tooltip-arrow {
    border-width: 0 6px 6px 6px;
    border-color: transparent transparent #38393D transparent;
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
}

/* --- ĐỊNH VỊ: TOP (BÊN TRÊN) --- */
.ms-tooltip-content.top {
    bottom: calc(100% + 6px);
    /* Đẩy hộp lên trên phần tử gốc 6px */
    left: 50%;
    transform: translateX(-50%);
}

.ms-tooltip-content.top .ms-tooltip-arrow {
    border-width: 6px 6px 0 6px;
    /* Tạo hình tam giác chỉ xuống dưới */
    border-color: #38393D transparent transparent transparent;
    bottom: -5px;
    /* Kéo mũi tên xuống dưới đáy hộp */
    left: 50%;
    transform: translateX(-50%);
}
</style>