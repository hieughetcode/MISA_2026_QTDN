import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import SalaryCompositionList from '@/views/salarycomposition/SalaryCompositionList.vue'
import SalarySystemCategory from '@/views/system-category/SalarySystemCategory.vue'

const router = createRouter({
  //Chỉnh url dạng / thay vì dạng #/
  history: createWebHistory(),
  routes: [
    {
      /*
      * Route ngoài cùng (route gốc) -> gán với component MainLayout
      * Tất cả các route sẽ được gán với component MainLayout
      */
      path: '/',
      component: MainLayout,
      redirect: '/salarycomposition',
      /*
      * Định nghĩa route con : /salarycomposition sử dụng SalaryCompositionList
      * Vue Router hiển thị MainLayout trước rồi lấy SalaryCompositionList nhét thẳng MainLayout
      */
      children: [
        {
          //Màn hình danh sách lương -> mặc định
          path: 'salarycomposition',
          name: 'SalaryCompositionList',
          component: SalaryCompositionList,
        },
        {
          //Màn hình danh mục lương của hệ thống
          path: 'salarycomposition/system-category',
          name: 'SalarySystemCategory',
          component: SalarySystemCategory,
        }
      ]
    }
  ]
})

export default router
