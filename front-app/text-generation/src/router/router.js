import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import TextPage from '../views/TextPage.vue'
import SignIn from '../views/SignIn.vue'
import SignUp from '../views/SignUp.vue'
import UserProfile from '../views/UserProfile.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: HomePage,
      component: HomePage
    },
    {
      path: '/generation',
      name: TextPage,
      component: TextPage
    },
    {
      path: '/signup',
      name: SignUp,
      component: SignUp
    },
    {
      path: '/signin',
      name: SignIn,
      component: SignIn
    },
    {
      path: '/profile',
      name: UserProfile,
      component: UserProfile
    }
  ]
})

export default router