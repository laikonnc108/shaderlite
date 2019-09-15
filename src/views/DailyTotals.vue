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
              <th>اجمالي صافي الفواتير</th>
              <th>اجمالي وهبة الكاتب</th>
              <th>مصاريف يومية</th>
              <th>العمولات </th>
              <th>البياعات </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in daily_totals" :key='idx'>
              <td>{{item.day | arDate }}</td>
              <td>{{item.recp_sum_net | round2 }}</td>
              <td>{{item.recp_sum_given | round2 }}</td>
              <td>{{item.sum_deducts | round2 }}</td>
              <td>{{item.recp_sum_comm | round2 }}</td>
              <td>{{item.out_sell_comm | round2 }}</td>
            </tr>
          </tbody>
        </table>
      </div>
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
}
</script>

