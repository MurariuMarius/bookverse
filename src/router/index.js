import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home'
import Login from '@/views/Login'
import Signup from '@/views/Signup'
import { authService } from '@/firebase/config'

const redirectIfAlreadyAuth = (to, from, next) => {
  let currentUser = authService.currentUser
  console.log('User', currentUser)
  if (currentUser) {
    next({ name: 'home' })
  } else {
    next()
  }
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup,
    beforeEnter: redirectIfAlreadyAuth
  },
  {
    path: '/login',
    name: 'login',
    component: Login, 
    beforeEnter: redirectIfAlreadyAuth
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
