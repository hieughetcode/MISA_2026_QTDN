import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import SalaryCompositionList from '../views/salary-composition/SalaryCompositionList.vue'

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
          path: 'salarycomposition',
          name: 'SalaryCompositionList',
          component: SalaryCompositionList,
        }
      ]
    }
  ]
})

export default router
