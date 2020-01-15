<template>
  <section class="template m-3">
    <h2>اجماليات المصروفات</h2>
    <div class="table-responsive m-4">
      <table class="table table-striped table-sm pr-me-l">
        <thead>
          <tr>
            <th>اليوم</th>
            <th v-for="(item, idx) in ex_items" :key='idx'>
              {{item.name | tr_label('trans_types')}}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(exp, idx) in daily_expenses" :key='idx'>
            <th style="white-space: nowrap;">{{exp.day | arDate(app_config.shader_name)}}</th>
            <template v-for="(item, idx) in ex_items" >
              <td :key='idx'>
                <span v-if="exp[item.name]">
                  {{exp[item.name]}}
                </span>
              </td>
            </template>
          </tr>
          <tr>
            <th>المجموع</th>
            <template v-for="(item, idx) in ex_items" >
              <th :key='idx'>
                <span >
                  {{exTotals[item.name]}}
                </span>
              </th>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
<script>
import { MainMixin } from '../mixins/MainMixin'
import { knex, moment } from '../main'
import { Settings, DateTime } from 'luxon'
import { CashflowCtrl } from '../ctrls/CashflowCtrl'

Settings.defaultLocale = 'ar'
Settings.defaultZoneName = 'UTC'

export default {
  name: 'daily-expenses',
  data() {
    return {
      daily_expenses: [],
      days: [],
      ex_items: [],
      cashflowCtrl: new CashflowCtrl()
    }
  },
  mixins:[MainMixin],
  methods: {
    async save(evt) {
      evt.preventDefault()
    },
    async refresh_all(){
      this.ex_items = await this.cashflowCtrl.getExItems();
      console.log(this.ex_items)
      let daily_ex_by_day = {}
      // pivoting cols to rows
      let daily_ex = await knex.raw(`
        select day, state, sum(amount) sum from cashflow where state in 
        ( select name from trans_types where category = 'cashflow' and sum = '-' and map_cashflow= 'ex' )
        GROUP by day, state 
      `);
      daily_ex.map( item => {
        daily_ex_by_day[item.day] = { ...daily_ex_by_day[item.day],day: item.day, [item.state]: item.sum}
      });
      //daily_ex_by_day.forEach(one => { console.log(one); this.daily_expenses.push(one)} )
      Object.keys(daily_ex_by_day).forEach( day => {
        this.daily_expenses.push(daily_ex_by_day[day])
      })
    },
    async change_today_date(date){
      console.log(date)
    },
    async showSelected(){
     
    },
    async change_day(){

    }
  },
  async mounted() {
    this.refresh_all()
  },
  computed: {
    exTotals: function(){
      let exTotals = {}

      this.ex_items.forEach( item => {
        exTotals[item.name] = 0
      })
      console.log(exTotals)
      this.daily_expenses.forEach( one => {
        Object.keys( one ).forEach( k => {
          exTotals[k] += one[k]
        })
        //exTotals[one.notes] += one[item.name]
      })
      return exTotals
    }
  }
}
</script>

