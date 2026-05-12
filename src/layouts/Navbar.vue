<template>
    <div class="navbar">
        <div class="navbar__left">
            <div class="navbar__left__logo">
                <div class="navbar__left__logo__background"></div>
                <MsTooltip class="navbar__left__logo__tooltip" content="Tất cả ứng dụng" position="bottom-start">
                    <div class="navbar__left__logo__luncher"></div>
                </MsTooltip>
                <div class="navbar__left__logo__icon"></div>
                <div class="navbar__left__logo__name">{{ appName }}</div>
            </div>

            <div class="navbar__left__search" title="Tìm kiếm">
                <div class="navbar__left__search__icon"></div>
                <input class="navbar__left__search__input" :placeholder="searchPlaceholder" v-model="searchQuery"
                    @keyup.enter="handleSearch" />
            </div>
        </div>

        <div class="navbar__right">
            <MsTooltip content="Giải pháp" position="bottom">
                <div class="navbar__right__item">
                    <div class="navbar__right__store__icon"></div>
                    <div class="navbar__right__store__count" v-if="storeCount > 0">{{ storeCount }}</div>
                </div>
            </MsTooltip>

            <MsTooltip content="MISA Ava AI" position="bottom">
                <div class="navbar__right__item">
                    <div class="navbar__right__chatbot__icon"></div>
                </div>
            </MsTooltip>

            <MsTooltip content="Thông báo" position="bottom">
                <div class="navbar__right__item">
                    <div class="navbar__right__notify__icon"></div>
                </div>
            </MsTooltip>

            <MsTooltip content="Mời tham gia MISA AMIS" position="bottom">
                <div class="navbar__right__item">
                    <div class="navbar__right__user__icon"></div>
                </div>
            </MsTooltip>

            <MsTooltip content="Tin nhắn" position="bottom">
                <div class="navbar__right__item">
                    <div class="navbar__right__chat__icon"></div>
                </div>
            </MsTooltip>

            <MsTooltip content="Thông báo" position="bottom">
                <div class="navbar__right__item">
                    <div class="navbar__right__notifibox__icon"></div>
                </div>
            </MsTooltip>

            <MsTooltip content="Trợ giúp" position="bottom">
                <div class="navbar__right__item">
                    <div class="navbar__right__help__icon"></div>
                </div>
            </MsTooltip>

            <MsTooltip content="Tính năng khác" position="bottom">
                <div class="navbar__right__item">
                    <div class="navbar__right__option__icon"></div>
                </div>
            </MsTooltip>

            <MsTooltip content="Kiến thức hữu ích" position="bottom">
                <div class="navbar__right__item">
                    <div class="navbar__right__knowledge__trigger__icon"></div>
                </div>
            </MsTooltip>

            <div class="navbar__right__item">
                <div class="navbar__right__avatar">PT</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import MsTooltip from '../components/base/ms-tooltip/MsTooltip.vue'

const appName = ref('Tiền lương')
const searchPlaceholder = ref('Tìm kiếm')
const searchQuery = ref('')
const storeCount = ref(2)

const handleSearch = () => {
    if (searchQuery.value.trim() !== '') {
        console.log('Đang tìm kiếm:', searchQuery.value)
    }
}
</script>

<style scoped>
.navbar {
    display: flex;
    justify-content: space-between;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 48px;
    background-color: #ffffff;
    border-bottom: 1px solid var(--grid-border);
    z-index: 10;
}

.navbar__left {
    height: 48px;
    display: flex;
}

/* Khối Logo */
.navbar__left__logo {
    position: relative;
    width: 210px;
    height: 48px;
    padding-left: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    /* Dùng gap thay vì margin để căn đều các phần tử */
    background-image: url(https://amisplatform.misacdn.net/apps/recruit/navbar-bg-event.7d974ba87d2e462e.svg);
    background-position: left;
    background-repeat: no-repeat;
    background-size: cover;
    transition: width 0.3s ease, padding-left 0.3s ease;
}

.navbar__left__logo__background {
    background-image: url(https://testcdnamisapp.misacdn.net/apps/payroll/static/img/bg_logo2.bdcd400.png);
    background-position: bottom;
    background-repeat: no-repeat;
    background-size: contain;
    height: 48px;
    width: 210px;
    position: absolute;
    bottom: 0px;
    left: 0;
    z-index: 1;
    padding-left: 4px;
    transition: width 0.3s ease;
}

/* Đưa lớp bọc tooltip lên trên background để nhận diện hover mượt mà */
.navbar__left__logo__tooltip {
    z-index: 3;
}

.navbar__left__logo__luncher {
    background: url('/src/assets/icons/Icon.svg') no-repeat -28px -477px;
    width: 16px;
    height: 16px;
    margin-left: 4px;
    margin-right: 4px;
}

.navbar__left__logo__icon {
    background-image: url(https://testcdnamisapp.misacdn.net/apps/payroll/static/logos/icon-payroll-logo.svg?v=1.0.0);
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    width: 32px;
    height: 32px;
    z-index: 3;
}

.navbar__left__logo__name {
    color: #1f1f1f;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    user-select: none;
    z-index: 3;
    cursor: pointer;
}

/* Khối Search */
.navbar__left__search {
    height: 48px;
    display: flex;
    align-items: center;
    position: relative;
    margin-left: 8px;
}

.navbar__left__search__icon {
    width: 24px;
    height: 24px;
    mask-image: url(https://amisplatform.misacdn.net/apps/recruit/assets/images/ICON.svg);
    -webkit-mask-image: url(https://amisplatform.misacdn.net/apps/recruit/assets/images/ICON.svg);
    mask-position: -311px -1105px;
    -webkit-mask-position: -311px -1105px;
    position: absolute;
    top: 14px;
    left: 8px;
    background-color: var(--icon-border);
}

.navbar__left__search__input {
    height: 32px;
    width: 276px;
    background-color: var(--bg-main);
    color: var(--text-main);

    border-radius: 4px;
    border: none;
    outline: none;
    padding-left: 40px;
    caret-color: var(--text-main);
}

.navbar__left__search__input::placeholder {
    color: var(--text-placeholder);
}

/* Khối bên phải */
.navbar__right {
    display: flex;
    align-items: center;
    padding-right: 16px;
}

.navbar__right__item {
    position: relative;
    width: 32px;
    height: 32px;
    margin: 0px 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 50%;
}

.navbar__right__item:hover {
    background-color: #0000001a;
}

.navbar__right__chatbot__icon {
    background: url(https://testcdnamisapp.misacdn.net/apps/payroll/static/img/payroll_agent-d_2srbQV.png) center no-repeat;
    background-size: cover;
    height: 24px;
    width: 24px;
}

.navbar__right__store__icon {
    width: 20px;
    height: 20px;
    background-image: url("https://cdnstore.misacdn.net/lib/static/cs-icon-store.svg");
}

.navbar__right__notify__icon {
    background: url('/src/assets/icons/Icon.svg') no-repeat -338px -596px;
    width: 20px;
    height: 20px;
}

.navbar__right__user__icon {
    width: 24px;
    height: 24px;
    background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTEuNSIgY3k9IjUuNSIgcj0iMy41IiBzdHJva2U9IiM3NTc1NzUiIHN0cm9rZS13aWR0aD0iMiIvPgo8cGF0aCBkPSJNMy41MDYyOSAxNS43NDEzTDMuMTA2NTIgMTYuMjk2NUMxLjM5MTk2IDE4LjY3NzggMy4wOTM2OCAyMiA2LjAyODA0IDIySDE1Ljk3MkMxOC45MDYzIDIyIDIwLjYwOCAxOC42Nzc4IDE4Ljg5MzUgMTYuMjk2NUwxOC40OTM3IDE1Ljc0MTNDMTYuODAyNCAxMy4zOTIyIDE0LjA4NDUgMTIgMTEuMTg5OSAxMkgxMC44MTAxQzcuOTE1NTMgMTIgNS4xOTc2MSAxMy4zOTIyIDMuNTA2MjkgMTUuNzQxM1oiIHN0cm9rZT0iIzc1NzU3NSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHBhdGggZD0iTTIxIDVWN1Y5IiBzdHJva2U9IiMyQ0EwMUMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxwYXRoIGQ9Ik0xOSA3SDIxSDIzIiBzdHJva2U9IiMyQ0EwMUMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo=");
}

.navbar__right__chat__icon {
    width: 24px;
    height: 24px;
    background-image: url("data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M12%203C7.02944%203%203%207.02945%203%2012C3%2013.7499%203.49992%2015.3827%204.36396%2016.7645L3%2021L7.23545%2019.636C8.6173%2020.5001%2010.2501%2021%2012%2021C16.9706%2021%2021%2016.9706%2021%2012C21%207.02945%2016.9706%203%2012%203Z'%20fill='url(%23paint0_linear_5024_37369)'%20stroke='url(%23paint1_linear_5024_37369)'%20stroke-miterlimit='10'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M13.0986%2012.0001C13.0986%2012.6069%2012.6068%2013.0988%2012%2013.0988C11.3932%2013.0988%2010.9014%2012.6069%2010.9014%2012.0001C10.9014%2011.3934%2011.3932%2010.9015%2012%2010.9015C12.6068%2010.9015%2013.0986%2011.3934%2013.0986%2012.0001Z'%20fill='white'/%3e%3cpath%20d='M17.4932%2012.0001C17.4932%2012.6069%2017.0013%2013.0988%2016.3945%2013.0988C15.7878%2013.0988%2015.2959%2012.6069%2015.2959%2012.0001C15.2959%2011.3934%2015.7878%2010.9015%2016.3945%2010.9015C17.0013%2010.9015%2017.4932%2011.3934%2017.4932%2012.0001Z'%20fill='white'/%3e%3cpath%20d='M8.7041%2012.0001C8.7041%2012.6069%208.21222%2013.0988%207.60547%2013.0988C6.99872%2013.0988%206.50684%2012.6069%206.50684%2012.0001C6.50684%2011.3934%206.99872%2010.9015%207.60547%2010.9015C8.21222%2010.9015%208.7041%2011.3934%208.7041%2012.0001Z'%20fill='white'/%3e%3cdefs%3e%3clinearGradient%20id='paint0_linear_5024_37369'%20x1='12'%20y1='3'%20x2='12'%20y2='21'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20stop-color='%235B7CFF'/%3e%3cstop%20offset='1'%20stop-color='%23214BF5'/%3e%3c/linearGradient%3e%3clinearGradient%20id='paint1_linear_5024_37369'%20x1='12'%20y1='3'%20x2='12'%20y2='21'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20stop-color='%235B7CFF'/%3e%3cstop%20offset='1'%20stop-color='%23214BF5'/%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e");
}

.navbar__right__notifibox__icon {
    width: 21px;
    height: 21px;
    background-image: url("https://amisplatform.misacdn.net/apps/recruit/assets/images/ICON.svg");
    background-position: -2px -634px;
}

.navbar__right__help__icon {
    width: 20px;
    height: 20px;
    background-image: url("https://amisplatform.misacdn.net/apps/recruit/assets/images/ICON.svg");
    background-position: -74px -610px;
}

.navbar__right__option__icon {
    width: 20px;
    height: 20px;
    background-image: url("https://amisplatform.misacdn.net/apps/recruit/assets/images/ICON.svg");
    background-position: -50px -610px;
}

.navbar__right__knowledge__trigger__icon {
    width: 32px;
    height: 32px;
    border-radius: 16px;
    background-position: center;
    background-size: 24px;
    background-repeat: no-repeat;
    cursor: pointer;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxwYXRoIGQ9Ik0zIDEwVjIxIiBzdHJva2U9IiNGRkFBMkIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+DQo8cGF0aCBkPSJNMyAxMEMzLjA2NjY3IDkuNjY2NjcgMy41NiA5IDUgOSIgc3Ryb2tlPSIjRkZBQTJCIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPg0KPHBhdGggZD0iTTIxIDEwQzIwLjkzMzMgOS42NjY2NyAyMC40NCA5IDE5IDkiIHN0cm9rZT0iI0ZGQUEyQiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik0yMSAxMFYyMSIgc3Ryb2tlPSIjRkZBQTJCIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPg0KPHBhdGggZD0iTTMgMjFDNC4zNjgxNyAyMC4yMSA1LjkyMDE3IDE5Ljc5NDIgNy41IDE5Ljc5NDJDOS4wNzk4MyAxOS43OTQyIDEwLjYzMTggMjAuMjEgMTIgMjFDMTMuMzY4MiAyMC4yMSAxNC45MjAyIDE5Ljc5NDIgMTYuNSAxOS43OTQyQzE4LjA3OTggMTkuNzk0MiAxOS42MzE4IDIwLjIxIDIxIDIxIiBzdHJva2U9IiNGRkFBMkIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+DQo8cGF0aCBkPSJNOS42IDEyLjA3MTRDOC45MjgzOCAxMS41NzY3IDguNDMyMjcgMTAuODg3IDguMTgxOTUgMTAuMDk5OUM3LjkzMTYzIDkuMzEyOTEgNy45Mzk3OCA4LjQ2ODQ3IDguMjA1MjYgNy42ODYyNUM4LjQ3MDc1IDYuOTA0MDIgOC45ODAxIDYuMjIzNjYgOS42NjExNiA1Ljc0MTU1QzEwLjM0MjIgNS4yNTk0MyAxMS4xNjA1IDUgMTIgNUMxMi44Mzk1IDUgMTMuNjU3OCA1LjI1OTQzIDE0LjMzODggNS43NDE1NUMxNS4wMTk5IDYuMjIzNjYgMTUuNTI5MyA2LjkwNDAyIDE1Ljc5NDcgNy42ODYyNUMxNi4wNjAyIDguNDY4NDcgMTYuMDY4NCA5LjMxMjkxIDE1LjgxODEgMTAuMDk5OUMxNS41Njc3IDEwLjg4NyAxNS4wNzE2IDExLjU3NjcgMTQuNCAxMi4wNzE0QzE0LjA4NzcgMTIuMzc1MSAxMy44NTI1IDEyLjc0NjcgMTMuNzEzNSAxMy4xNTYyQzEzLjU3NDUgMTMuNTY1NyAxMy41MzU2IDE0LjAwMTYgMTMuNiAxNC40Mjg2QzEzLjYgMTQuODQ1MyAxMy40MzE0IDE1LjI0NSAxMy4xMzE0IDE1LjUzOTdDMTIuODMxMyAxNS44MzQ0IDEyLjQyNDMgMTYgMTIgMTZDMTEuNTc1NyAxNiAxMS4xNjg3IDE1LjgzNDQgMTAuODY4NiAxNS41Mzk3QzEwLjU2ODYgMTUuMjQ1IDEwLjQgMTQuODQ1MyAxMC40IDE0LjQyODZDMTAuNDY0NCAxNC4wMDE2IDEwLjQyNTUgMTMuNTY1NyAxMC4yODY1IDEzLjE1NjJDMTAuMTQ3NSAxMi43NDY3IDkuOTEyMzUgMTIuMzc1MSA5LjYgMTIuMDcxNFoiIHN0cm9rZT0iI0ZGQUEyQiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik0xMC4xNjAyIDEyLjg1NzJIMTMuODQwMiIgc3Ryb2tlPSIjRkZBQTJCIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+DQo8cGF0aCBkPSJNMTIgMkwxMiAxIiBzdHJva2U9IiNGRkFBMkIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+DQo8cGF0aCBkPSJNNyA0TDYuMDQ0OTkgMy43MDM0NCIgc3Ryb2tlPSIjRkZBQTJCIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPg0KPHBhdGggZD0iTTE2Ljk5OTggNEwxNy45NTQ4IDMuNzAzNDQiIHN0cm9rZT0iI0ZGQUEyQiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjwvc3ZnPg0K);
}

.navbar__right__avatar {
    width: 32px;
    height: 32px;
    background-color: #A855F7;
    /* Màu nền tím như hình */
    color: #FFFFFF;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
}

.navbar__right__store__count {
    display: flex;
    background-color: red;
    color: white;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: -2px;
    right: -4px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    font-size: 10px;
    font-weight: 700;
}
</style>
