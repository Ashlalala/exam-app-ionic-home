import { createRouter, createWebHistory } from '@ionic/vue-router';
import TabsPage from '../views/TabsPage.vue'

const routes = [

  {
    path: '/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: 'exams'
      },
      {
        path: 'exams',
        component: () => import('@/views/ExamsPage.vue'),
      },
      {
        path: 'profile',
        component: () => import('@/views/ProfilePage.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue')
      },
      {
        path: '/exams/:category',
        component: () => import('@/views/SubCatsPage.vue'),
      },
      {
        path: '/exams/:category/:subCategory',
        component: () => import('@/views/ExamSubCatsPage.vue')
      }
    ]
  },


]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
