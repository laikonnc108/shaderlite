<template>
<section class="m-3">
  <section class="daily-receipts">
          <h2>فواتير اليومية</h2>
      <div class="table-responsive">
        <table class="table table-striped table-sm pr-me1">
          <thead>
            <tr>
              <th>اسم العميل</th>
              <th>الاصناف</th>
              <th>عدد الطرود</th>
              <th>البياعة</th>
              <th>العمولة</th>
              <th>بياعة + عمولة</th>
              <th>فرق الفاتورة</th>
              <th>النوالين</th>
              <th>مصاريف </th>
              <th>وهبة </th>
              <th>صافي </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in daily_receipts" :key='idx'>
              <td>
                <router-link class=" " :to="{name:'supp_recp_details', params: {supplier_id: item.supplier_id}}">
                {{item.supplier_name}}
                </router-link>
                <br/>
                <b style="color:#456">فاتورة {{'recp_status_'+ item.recp_paid | tr_label }}</b>
              </td>
              <td v-html="$options.filters.productsFilter(item.products_arr,'<br/> ')"></td>
              
              <td>{{ item.total_count }}</td>
              <!--
              <td> 
                <span class="text-danger" v-if="item.total_current_rest">{{item.total_current_rest}}</span>
              </td>
              -->
              <td>{{item.total_sell_comm | round }}</td>
              <td>{{item.recp_comm | round2}}</td>
              <td>{{ ( item.total_sell_comm + item.recp_comm ) | round2}}</td>
              <td >
                <span v-if="(item.out_sale_value - item.sale_value) > 0">+</span>
                {{ (item.out_sale_value - item.sale_value) | round2}}
              </td>
              
              <td>{{item.total_nolon | round}}</td>
              <td>{{item.recp_expenses | round}}</td>
              <td>{{item.recp_given }}</td>
              <td>{{item.net_value | round}}</td>
            </tr>
          </tbody>
        </table>
      </div>
  </section>
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
import { ReceiptsCtrl } from '../ctrls/ReceiptsCtrl'
import CashflowTable from '@/components/CashflowTable.vue'
export default {
  name: 'daily-moves',
  components: {
    CashflowTable
  },
  data(){
    return {
      cashflowCtrl: new CashflowCtrl(),
      receiptsCtrl: new ReceiptsCtrl(),
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
      this.daily_receipts = await this.receiptsCtrl.findAll({day: this.$store.state.day.iso })
    }
  },
  mounted() {
    this.refresh_all()
  }
}
</script>