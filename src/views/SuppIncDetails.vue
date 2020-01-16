<template>
  <section class="supllier-details">
    <section class="supp-head m-3">
        <router-link class="btn btn-primary m-2" :to="{name:'supplier_details', params: {id: supplier.id}}">
         ملف العميل
        </router-link>
      <h2 class="d-inline-block mr-3 ">زرع العميل : {{supplier.name}}</h2> 
      <br>
      <div class="pr-mt-2"></div>
    </section>

    <div class="m-3  ">
  <h2>تفاصيل زرع العميل</h2>
      <div class="table-responsive">
        <table class="table table-striped table-sm pr-me">
          <thead>
            <tr>
              <th>#</th>
              <th>بيع يوم</th>
              <th>وارد يوم</th>
              <th>عدد</th>
              <th>الصنف</th>
              <th>اسم البياع</th>
              <th >الوزن</th>
              <th>السعر</th>
              <th>ملاحظات</th>

            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in supp_outgoings_arr" :key='idx'>
              <td>{{item.id}}</td>
              <td>{{item.day | arDate }}</td>
              <td>{{item.income_day | arDate}}</td>
              <td>{{item.count }}</td>
              <td>{{item.product_name}}</td>
              <td>
                <router-link v-if="item.customer_id" :to="{name:'customer_details', params: {id: item.customer_id}}" >
                  {{item.customer_name}}
                </router-link>
              </td>
              
              <td>{{item.weight}}</td>
              <td>{{item.kg_price}}</td>
              <td>{{item.notes}}</td>
            </tr>
          </tbody>
        </table>

        <button 
        class="btn btn-printo pr-hideme" 
        @click="print_co()"
        >
          <span class="fa fa-print"></span> طباعة
        </button>

      </div>
    </div>

  </section>
</template>

<script>
import { Settings, DateTime } from 'luxon'
import { SupplierDAO, SuppliersCtrl } from '../ctrls/SuppliersCtrl'
import { OutgoingsCtrl } from '../ctrls/OutgoingsCtrl'

import { MainMixin } from '../mixins/MainMixin';

Settings.defaultLocale = 'ar'
Settings.defaultZoneName = 'UTC'

export default {
  name: 'supllier-details',
  data(){
    return {
      search_term: '',
      supplier: new SupplierDAO(SupplierDAO.INIT_DAO),
      supp_outgoings_arr: [],
      supplier_id: this.$route.params.supplier_id,
      suppliersCtrl: new SuppliersCtrl(),
      outCtrl: new OutgoingsCtrl(),
    }
  },
  mixins: [MainMixin],
  methods: {
    async refresh_all(){
      let {dao} = await this.suppliersCtrl.getSupplierDetails(this.supplier_id)
      this.supplier = dao
      this.supp_outgoings_arr = await this.outCtrl.findAll({supplier_id: this.supplier_id});
    },
  },
  mounted() {
    this.refresh_all()
  },
  computed: {

  }
}
</script>
