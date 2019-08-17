<template>
<section class="m-3">
  <section class="inout-cashflow">
    <h2>تحصيلات اليوم</h2>
    <CashflowTable :cashflow_arr="cashflow_arr_in" 
    :flags="{type: 'cashflow_in'}" ></CashflowTable>

    <h2>مصروفات اليوم</h2>
    <CashflowTable :cashflow_arr="cashflow_arr_out" 
    :flags="{type: 'cashflow_out'}" ></CashflowTable>
  </section>
</section>
</template>

<script>
import { CashflowCtrl } from '../ctrls/CashflowCtrl'
import CashflowTable from '@/components/CashflowTable.vue'
export default {
  name: 'daily-moves',
  components: {
    CashflowTable
  },
  data(){
    return {
      cashflowCtrl: new CashflowCtrl(),
      daily_receipts: [],
      cashflow_arr_in: [],
      cashflow_arr_out: [],
      day_sums: {
        sum_collect: null,
        sum_oncredit: null, // oncredit outgoings and also on credit cashflows paid , acc_rest
        sum_exp_no_deduct: null
      }
    }
  },
  methods: {
    async refresh_all(){
      this.cashflow_arr_in = await this.cashflowCtrl.findAll({sum: '+', day: this.$store.state.day.iso})
      this.cashflow_arr_out = await this.cashflowCtrl.findAll({sum: '-', day: this.$store.state.day.iso})
    }
  },
  mounted() {
    this.refresh_all()
  }
}
</script>