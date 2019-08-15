import Vue from 'vue'
import Router from 'vue-router'

import Daily from './views/Daily.vue'
import Home from './views/Home.vue'
import Incomings from './views/Incomings.vue'
import Customers from './views/Customers.vue'
import Suppliers from './views/Suppliers.vue'
import Products from './views/Products.vue'
import CustomerDetails from './views/CustomerDetails.vue'
import Outgoing from './views/Outgoing.vue'
import SuppliersReceipts from './views/SuppliersReceipts.vue'
import SupplierDetails from './views/SupplierDetails.vue'
import SuppReceiptsDetails from './views/SuppReceiptsDetails.vue'
import CustomersAccounts from './views/CustomersAccounts.vue'
import Cashflow from './views/Cashflow.vue'
import DailyMoves from './views/DailyMoves.vue'
import Users from './views/Users.vue'

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
      path: '/suppliers_receipts',
      name: 'suppliers_receipts',
      component: SuppliersReceipts
    },
    {
      path: '/supplier_details',
      name: 'supplier_details',
      component: SupplierDetails
    },
    {
      path: '/daily_moves',
      name: 'daily_moves',
      component: DailyMoves
    },
    {
      path: '/supp_recp_details',
      name: 'supp_recp_details',
      component: SuppReceiptsDetails
    },
    {
      path: '/customers_accounts',
      name: 'customers_accounts',
      component: CustomersAccounts
    },
    {
      path: '/outgoing',
      name: 'outgoing',
      component: Outgoing
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
      path: '/users',
      name: 'users',
      component: Users
    },
    {
      path: '/customer_details/:id',
      name: 'customer_details',
      component: CustomerDetails
    },
    {
      path: '/out_cashflow',
      name: 'out_cashflow',
      component: Cashflow
    },
    {
      path: '/in_cashflow',
      name: 'in_cashflow',
      component: Cashflow
    },
  ]
})
