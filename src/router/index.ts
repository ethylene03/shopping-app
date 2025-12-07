import { refreshToken } from '@/api/authorization'
import { useAuthorizationStore } from '@/stores/authorization'
import LogIn from '@/views/authorization/LogIn.vue'
import SignUp from '@/views/authorization/SignUp.vue'
import CartPage from '@/views/cart/CartPage.vue'
import HomePage from '@/views/HomePage.vue'
import MyProducts from '@/views/my-products/MyProducts.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Login', component: LogIn },
    { path: '/signup', name: 'Signup', component: SignUp },
    { path: '/home', name: 'Home', component: HomePage, meta: { requiresAuth: true } },
    { path: '/cart', name: 'Cart', component: CartPage, meta: { requiresAuth: true } },
    {
      path: '/my-products',
      name: 'MyProducts',
      component: MyProducts,
      meta: { requiresAuth: true, role: 'SELLER' },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthorizationStore()

  if (!auth.isLoggedIn()) {
    const newToken = await refreshToken()

    if (!newToken && to.name !== 'Login' && to.name !== 'Signup') next({ name: 'Login' })
    else if (newToken) {
      auth.setUserDetails(newToken)
    }
  }

  if (to.meta.requiresAuth && !auth.isLoggedIn()) {
    next({ name: 'Login' })
    return
  }

  if (to.name === 'Login' && auth.isLoggedIn()) {
    next({ name: 'Home' })
    return
  }

  if (to.meta.role && auth.role !== to.meta.role) {
    next({ name: 'Home' })
    return
  }

  next()
})

export default router
