import Vue from 'vue'
import Router from 'vue-router'

import Daily from './views/Daily.vue'
import Home from './views/Home.vue'
import Incomings from './views/Incomings.vue'
import Customers from './views/Customers.vue'
import Suppliers from './views/Suppliers.vue'
import Products from './views/Products.vue'
import CustomerDetails from './views/CustomerDetails.vue'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/asasy',
      name: 'home',
      component: Home
    },
    {
      path: '/daily',
      name: 'daily',
      component: Daily
    },
    {
      path: '/incomings',
      name: 'incomings',
      component: Incomings
    },
    {
      path: '/customers',
      name: 'customers',
      component: Customers
    },
    {
      path: '/suppliers',
      name: 'suppliers',
      component: Suppliers
    },
    {
      path: '/products',
      name: 'products',
      component: Products
    },
    {
      path: '/customer_details/:id',
      name: 'customer_details',
      component: CustomerDetails
    },
  ]
})
