<template>
  <section class="template m-3">
    <h2>المجاميع اليومية</h2>
      <div class="table-responsive">
        <table class="table table-striped table-sm pr-me1">
          <thead>
            <tr>
              <th>اليوم</th>
              <th>اجمالي صافي الفواتير</th>
              <th>اجمالي وهبة الكاتب</th>
              <th>مصاريف يومية</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in daily_totals" :key='idx'>
              <td>{{item.day | arDate }}</td>
              <td>{{item.recp_sum_net | round2 }}</td>
              <td>{{item.recp_sum_given | round2 }}</td>
              <td>{{item.sum_deducts | round2 }}</td>
            </tr>
          </tbody>
        </table>
      </div>
  </section>
</template>
<script>
import { MainMixin } from '../mixins/MainMixin'
import { knex } from '../main'

export default {
  name: 'daily-totals',
  data() {
    return {
      daily_totals: [],
      confirm_step: [],
      single: {},
    }
  },
  mixins:[MainMixin],
  methods: {
    async save(evt) {
      evt.preventDefault()
    },
    async refresh_all(){
      this.daily_totals = await knex('v_daily_sums').orderBy('day',"desc")
    }
  },
  async mounted() {
    this.refresh_all()
  },
}
</script>

