import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/todoList',
    },
    {
      path: '/todoList',
      name: 'todoList',
      component: () => import('../views/todoList/index.vue')
    }
  ]
})

export default router
