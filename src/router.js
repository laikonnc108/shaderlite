import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Incomings from './views/Incomings.vue'
import Customers from './views/Customers.vue'
import Suppliers from './views/Suppliers.vue'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
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
  ]
})
