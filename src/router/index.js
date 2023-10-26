import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home'
import Login from '@/views/Login'
import Signup from '@/views/Signup'
import Book from '@/views/Book'
import Profile from '@/views/Profile'
import ShoppingCart from '@/views/ShoppingCart'
import Checkout from '@/views/Checkout'

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
  {
    path: '/book/:ISBN',
    name: 'book',
    component: Book,
    props: true,
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
  },
  {
    path: '/cart',
    name: 'shoppingCart',
    component: ShoppingCart,
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: Checkout,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
