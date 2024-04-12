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
        component: () => import('@/views/CatsPage.vue'),
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
        path: 'exams/:category',
        component: () => import('@/views/SubCatsPage.vue'),
      },
      {
        path: 'exams/:category/:subCategory',
        component: () => import('@/views/ExamSubCatsPage.vue')
      },
      {
        path: 'exams/:category/:subCategory/create',
        component: () => import('@/views/ExamCreatePage.vue')
      },
      {
        path: '/profile/completed',
        component: () => import('@/views/CompletedExamsPage.vue'),
      },
      {
        path: '/profile/completed/:examId',
        component: () => import('@/views/CompletedExamPage.vue'),
      },

      {
        path: '/exam/:examId/',
        component: () => import('@/views/ExamPage.vue'),
      },
      {
        path: '/exam/:examId/edit',
        component: () => import('@/views/ExamEditPage.vue')
      },
    ]
  },


  {
    path: '/exam/:examId/take',
    component: () => import('@/views/ExamTakePage.vue')
  },


 

  {
    path: '/users/',
    component: () => import('@/views/ExamTakePage.vue'),
  },
  {
    path: '/users/:id',
    component: () => import('@/views/ExamTakePage.vue')
  }

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
