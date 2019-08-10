<template>
  <section class="receipts bg-receipts minh90 p-3">
    <h1> فواتير العملاء - معاملات اليوم</h1>
<!--
<router-link  v-for="(supplier, idx) in today_suppliers_arr" 
:to="{name:'supplier_details', params: {id: supplier.id}}"  :key="idx" 
class="btn btn-lg btn-primary m-1 btn-block" :class="{'btn-danger':suppliers_headers_arr[supplier.id] > 0}">
  <span class="fa fa-receipt"></span> &nbsp; 
  عرض فواتير العميل - {{supplier.name}} 
  <span v-if="suppliers_headers_arr[supplier.id] > 0">
  - متبقي {{suppliers_headers_arr[supplier.id]}} طرد
  </span>
</router-link>
-->
  <table class="table table-striped table-sm pr-me1">
    <thead>
      <tr>
        <th>اسم العميل</th>
        <th>الاصناف الواردة</th>
        <th>اجمالي النوالين </th>
        <th>طرود متبقية</th>
        <th>الفواتير</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, idx) in today_suppliers_arr" :key='idx'>
        <td>
          {{row.supplier_name}}
        </td>

        <!--
          <td v-html="$options.filters.productsFilter(item.products_arr,'<br/> , ')"></td>
        <td> 
          <span class="text-danger" v-if="item.total_current_rest">{{item.total_current_rest}}</span>
        </td>
        -->
        <td>{{row.products_concat}}</td>
        <td>{{row.total_nolon}}</td>
        <td>{{row.sum_diff}}</td>
        <td>
          {{row.recp_paid}}
          <router-link class="nav-link " :to="{name:'supp_recp_details', params: {supplier_id: row.supplier_id}}">
          تعديل 
          </router-link>
        </td>
      </tr>

    </tbody>
  </table>
  </section>
</template>

<script >
import { InoutHeadCtrl } from '../ctrls/InoutHeadCtrl'

export default {
  name: 'suppliers-receipts',
  data () {
    return {
      today_suppliers_arr: [],
      inoutHeadCtrl: new InoutHeadCtrl()
    }
  },
  methods: {
    async refresh_all() {
      /*
      this.suppliers_headers_arr = await IncomingsHeaderDB.getDailySuppliers({day: this.store_day.iso})
      let ids = Object.keys(this.suppliers_headers_arr)
      this.suppliers_arr = await SuppliersDB.getAll(ids)
      */
      this.today_suppliers_arr = await this.inoutHeadCtrl.findDailySuppliers({day: this.$store.state.day.iso})
    }
  },
  components: {
  },
  mounted() {
    this.refresh_all()
  }
}
</script>