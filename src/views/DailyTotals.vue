<template>
  <section class="template m-3">
    <h2>الفترة</h2>
    <div class="row">
      <div class="col-4">
          من
        <datetime v-model="from_day" 
        @input="change_day" 
        :auto="true"  class="datetime" 
        min-datetime="2019-01-01"
        :max-datetime="max_datetime">
        </datetime>
      </div>
      <div class="col-4">
        الي
        <datetime v-model="to_day" 
        @input="change_day" 
        :auto="true"  class="datetime" 
        min-datetime="2019-01-01"
        :max-datetime="max_datetime">
        </datetime>
      </div>
    </div>
    <h2>المجاميع اليومية</h2>
      <div class="table-responsive">
        <table class="table table-striped table-sm pr-me-l">
          <thead>
            <tr>
              <th>اليوم</th>
              <th> مشال </th>
              <th> دخان </th>
              <th>مصاريف </th>
              <th>عمولة </th>
              <th>واصل الفلاح </th>
              <th>خصوم الفلاح </th>
              <th>رهونات  </th>
              <th>رد الرهن</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in daily_totals" :key='idx'>
              <td>{{item.day | arDate }}</td>
              <td>{{item.recp_sum_given | round2 }}</td>
              <td>{{item.sum_given | round2 }}</td>
              <td>{{item.sum_deducts | round2 }}</td>
              <td>{{item.recp_sum_comm +item.out_sell_comm | round2 }}</td>
              <td>{{item.sum_supp_payment | round2 }}</td>
              <td>{{item.recp_sum_deducts | round2 }}</td>
              <td>{{item.sum_product_rahn | round2 }}</td>
              <td>{{item.sum_repay_rahn | round2 }}</td>
            </tr>
            <tr >
              <th>المجموع</th>
              <th>{{sum_totals.recp_sum_given | round}}</th>
              <th>{{sum_totals.sum_given | round}}</th>
              <th>{{sum_totals.sum_deducts | round}}</th>
              <th>{{sum_totals.sum_comm_plus_sell_comm | round}}</th>
              <th>{{sum_totals.sum_supp_payment | round}}</th>
              <th>{{sum_totals.recp_sum_deducts | round}}</th>
              <th>{{sum_totals.sum_product_rahn | round}}</th>
              <th>{{sum_totals.sum_repay_rahn | round}}</th>
              <th></th>
            </tr>
          </tbody>
        </table>
      </div>
        <button class="btn btn-printo pr-hideme"  @click="print_co">
          <span class="fa fa-print"></span> طباعة
        </button>
  </section>
</template>
<script>
import { MainMixin } from '../mixins/MainMixin'
import { knex } from '../main'
import { Settings, DateTime } from 'luxon'

Settings.defaultLocale = 'ar'
Settings.defaultZoneName = 'UTC'

export default {
  name: 'daily-totals',
  data() {
    return {
      daily_totals: [],
      confirm_step: [],
      single: {},
      from_day: '',
      to_day: '',
      max_datetime: ''
    }
  },
  mixins:[MainMixin],
  methods: {
    async save(evt) {
      evt.preventDefault()
    },
    async refresh_all(){
      this.daily_totals = await knex('v_daily_sums').orderBy('day',"asc")
    },
    async change_day(){
      let fromDateTime = DateTime.fromISO(this.from_day)
      let toDateTime = DateTime.fromISO(this.to_day)

      if( this.from_day && ! this.to_day) {
        this.daily_totals = await knex('v_daily_sums').where('day','>=',fromDateTime.toISODate()).orderBy('day',"asc")
      }
      else if ( this.from_day && this.to_day ) {
        this.daily_totals = await knex('v_daily_sums').where('day','>=',fromDateTime.toISODate())
        .andWhere('day','<=',toDateTime.toISODate()).orderBy('day',"asc")
      }
      //this.daily_totals = await knex('v_daily_sums').where('day','>',dateTime.toISODate()).orderBy('day',"asc")
    }
  },
  async mounted() {
    this.refresh_all()
  },
  computed: {
    sum_totals: function() {
      let sum_totals = {
        recp_sum_given: 0,
        sum_given: 0,
        sum_deducts: 0,
        sum_comm_plus_sell_comm: 0,
        sum_supp_payment: 0,
        recp_sum_deducts: 0,
        sum_product_rahn: 0,
        sum_repay_rahn: 0
      }
      this.daily_totals.forEach(one => {
        sum_totals.recp_sum_given += one.recp_sum_given
        sum_totals.sum_given += one.sum_given
        sum_totals.sum_deducts += one.sum_deducts
        sum_totals.sum_comm_plus_sell_comm += one.recp_sum_comm +one.out_sell_comm
        sum_totals.sum_supp_payment += one.sum_supp_payment
        sum_totals.recp_sum_deducts += one.recp_sum_deducts
        sum_totals.sum_product_rahn += one.sum_product_rahn
        sum_totals.sum_repay_rahn += one.sum_repay_rahn
      })  

      return sum_totals
    }
  }
}
</script>

