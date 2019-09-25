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
      <div class="col-4 mt-3">
      <button  class="btn btn-primary " @click="show_daily='daily_expenses';" v-if="show_daily == 'daily_totals'">
        عرض المصاريف اليومية
        &nbsp; <span class="fa fa-money-bill"></span>
      </button>
      <button  class="btn btn-primary " @click="show_daily='daily_totals';daily_expenses = []" v-if="show_daily == 'daily_expenses'">
        عرض المجمعات اليومية   &nbsp; <span class="fa fa-calendar-alt"></span>
      </button>
      </div>
    </div>
    <section class="m-2" v-if="show_daily == 'daily_totals'">
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
      </section>
      <section class="m-2" v-if="show_daily == 'daily_expenses'">
        <h2>المصاريف اليومية</h2>
        <div v-if="daily_expenses.length == 0">
          <div class="row m-2">
            <template v-for="(item, idx) in expenses_items" class=" p-2 col-3">
              <span v-if="item.notes" :key='idx' class=" p-2 col-3">
                <input class="pr-hideme" :id="item.notes" :value="item.notes" type="checkbox" v-model="checkedItems" />
                {{item.notes}}
              </span>
            </template>
          </div>
            <button  class="btn btn-primary mr-2" @click="showSelected()" >
              عرض بنود المصروفات   &nbsp; <span class="fa fa-external-link-square-alt"></span>
            </button>
        </div>
        <div class="table-responsive" v-if="daily_expenses.length > 0">
          <table class="table table-striped table-sm pr-me-l">
            <thead>
              <tr>
                <th>اليوم</th>
                <th v-for="(item, idx) in checkedItems" :key='idx'>
                  {{item}}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(exp, idx) in daily_expenses" :key='idx'>
                <td>{{exp.day}}</td>
                <template v-for="(item, idx) in checkedItems" >
                  <td :key='idx'>
                    <span v-if="item == exp.notes">
                      {{exp.amount}}
                    </span>
                  </td>
                </template>
              </tr>
              <tr>
                <th>المجموع</th>
                <template v-for="(item, idx) in checkedItems" >
                  <th :key='idx'>
                    <span >
                      {{checkedTotals[item]}}
                    </span>
                  </th>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
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
      daily_expenses: [],
      checkedItems: [],
      confirm_step: [],
      expenses_items : [],
      single: {},
      from_day: '',
      to_day: '',
      max_datetime: '',
      show_daily: 'daily_totals'
    }
  },
  mixins:[MainMixin],
  methods: {
    async save(evt) {
      evt.preventDefault()
    },
    async refresh_all(){
      this.daily_totals = await knex('v_daily_sums').orderBy('day',"asc")
      this.expenses_items = await knex.raw(`SELECT DISTINCT(notes) notes from cashflow where state = 'expenses' group by notes HAVING COUNT(*) > 1`)
    },
    async showSelected(){
      let fromDateTime = DateTime.fromISO(this.from_day)
      let toDateTime = DateTime.fromISO(this.to_day)

      let sql = `select day, amount, notes from cashflow where state = 'expenses' and notes in
      ('${this.checkedItems.join("','")}')`
      if(fromDateTime && fromDateTime.toISODate()) sql += ` and day >= '${fromDateTime.toISODate()}'`
      if(toDateTime && toDateTime.toISODate()) sql += ` and day <= '${toDateTime.toISODate()}'`
      this.daily_expenses = await knex.raw(sql)
      console.log(this.daily_expenses)
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
    },
    checkedTotals: function(){
      let checkedTotals = {}
      this.checkedItems.forEach( item => {
        checkedTotals[item] = 0
      })
      console.log(checkedTotals)
      this.daily_expenses.forEach( one => {
        checkedTotals[one.notes] += one.amount
        console.log(one.notes, checkedTotals[one.notes] , one.amount)
      })
      return checkedTotals
    }
  }
}
</script>

