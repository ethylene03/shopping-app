import { refreshToken } from '@/api/authorization'
import { useAuthorizationStore } from '@/stores/authorization'
import { useCheckoutStore } from '@/stores/checkout'
import LogIn from '@/views/authorization/LogIn.vue'
import SignUp from '@/views/authorization/SignUp.vue'
import CartPage from '@/views/cart/CartPage.vue'
import CheckoutPage from '@/views/cart/CheckoutPage.vue'
import HomePage from '@/views/HomePage.vue'
import OrderDetails from '@/views/orders/OrderDetails.vue'
import OrdersPage from '@/views/orders/OrdersPage.vue'
import SellerOrdersPage from '@/views/seller/OrdersPage.vue'
import ProductsPage from '@/views/seller/ProductsPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Login', component: LogIn },
    { path: '/signup', name: 'Signup', component: SignUp },
    { path: '/home', name: 'Home', component: HomePage, meta: { requiresAuth: true } },
    { path: '/orders', name: 'Orders', component: OrdersPage, meta: { requiresAuth: true } },
    {
      path: '/orders/:id',
      name: 'OrderDetails',
      component: OrderDetails,
      meta: { requiresAuth: true },
    },
    { path: '/cart', name: 'Cart', component: CartPage, meta: { requiresAuth: true } },
    {
      path: '/cart/checkout',
      name: 'Checkout',
      component: CheckoutPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/seller/products',
      name: 'Seller Products',
      component: ProductsPage,
      meta: { requiresAuth: true, role: 'SELLER' },
    },
    {
      path: '/seller/orders',
      name: 'Seller Orders',
      component: SellerOrdersPage,
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

  if (to.name === 'Checkout') {
    const checkoutStore = useCheckoutStore()
    const items = checkoutStore.getItems()

    if (items.length === 0) {
      next({ name: 'Cart' })
      return
    }
  }

  next()
})

export default router
