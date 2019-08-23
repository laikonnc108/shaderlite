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
              <th>فرق فواتير</th>
              <th>نوالين</th>
              <th>مصاريف فواتير</th>
              <th>وهبة الكاتب</th>
              <th>صافي فواتير</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in daily_receipts" :key='idx'>
              <td>
                <router-link class=" " :to="{name:'supp_recp_details', params: {supplier_id: item.supplier_id}}">
                {{item.supplier_name}}
                </router-link>
                <br/>
                <span style="color:#456" v-for="(recp_paid, index) in receiptsSepStatus(item.concat_recp_paid)" :key="index">
                فاتورة {{'recp_status_'+ recp_paid | tr_label }} 
                  <span v-if="index+1 != receiptsSepStatus(item.concat_recp_paid).length"><br/></span>
                </span>
              </td>
              <td v-html="$options.filters.productsFilter(item.products_concat,'<br/> ')"></td>
              
              <td>{{ item.sum_total_count }}</td>
              <!--
              <td> 
                <span class="text-danger" v-if="item.total_current_rest">{{item.total_current_rest}}</span>
              </td>
              -->
              <td>{{item.sum_sell_comm | round2 }}</td>
              <td>{{item.sum_recp_comm | round2}}</td>
              <td>{{ ( item.sum_sell_comm + item.sum_recp_comm ) | round2}}</td>
              <td >
                <span v-if="(item.sum_out_value - item.sum_sale_value) > 0">+</span>
                {{ (item.sum_out_value - item.sum_sale_value) | round2}}
              </td>
              
              <td>{{item.sum_total_nolon | round2}}</td>
              <td>{{item.sum_recp_expenses | round2}}</td>
              <td>{{item.sum_recp_given | round2 }}</td>
              <td>{{item.sum_net_value | round2}}</td>
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
      this.daily_receipts = await this.receiptsCtrl.findDailyReceipts({day: this.$store.state.day.iso })
    },
    receiptsSepStatus(concat_recp_paid) {
      if(concat_recp_paid)
        return concat_recp_paid.split(',')
      else
        return []
    }
  },
  mounted() {
    this.refresh_all()
  }
}
</script>