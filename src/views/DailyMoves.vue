<template>
<section class="m-3">
  <section class="daily-receipts">
    
    <div class="pr-hideme">
      <h3 class="text-danger fa fa-eraser larger"
      @click="search_term = ''" v-if="search_term"></h3>
      <input v-model="search_term" class="form-control" :placeholder="custom_labels['search_receipts']">
      <br>
    </div>
    
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
            <tr v-for="(item, idx) in fltrd_daily_receipts" :key='idx'>
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
              
              <td>{{item.sum_total_nolon | round2 }}</td>
              <td>{{item.sum_recp_expenses | round2 }}</td>
              <td>{{item.sum_recp_given | round2 }}</td>
              <td>{{item.sum_net_value | round2 }}</td>
            </tr>
            <tr>
              <td></td>
              <th>المجموع</th>
              <td></td>
              <td></td>
              <td></td>
              <td>{{recp_sums.sum_comms | round2 }}</td>
              <th>
                <span v-if="recp_sums.sum_diffs  > 0">+</span>
                {{recp_sums.sum_diffs | round2 }}
              </th>
              <th>{{recp_sums.sum_nolons_sum | round2 }}</th>
              <td></td>
              <th>{{recp_sums.sum_givens | round2 }}</th>
            </tr>
          </tbody>
        </table>
      </div>
  </section>
  <hr>
    <div>
      <h4>اجمالي فواتير الرصد فقط : {{recp_sums.sum_rasd_net | round }}</h4>
    </div>

  <hr>
    <div>
      <h4>اجمالي ايرادات اليوم : {{recp_sums.sum_income | round2}}</h4>
    </div>

  <hr>
    <div>
      <h4>اجمالي مصروفات تخصم من ايراد اليوم : {{daily_totals.sum_deducts | round2}}</h4>
    </div>
  <hr>
    <div>
      <h4>صافي الايراد اليومي : {{ (recp_sums.sum_income - daily_totals.sum_deducts) | round2}}</h4>
    </div>
  <hr>
  <section class="inout-cashflow">
    <h2>تحصيلات اليوم</h2>
    <CashflowTable :cashflow_arr="cashflow_arr_in" 
    :flags="{type: 'cashflow_in'}" ></CashflowTable>

    <h2>مصروفات اليوم</h2>
    <CashflowTable :cashflow_arr="cashflow_arr_out" 
    :flags="{type: 'cashflow_out'}" ></CashflowTable>
  </section>

    <button class="btn btn-printo pr-hideme" 
      @click="clipboard.writeText('كشف يومية '+day.iso);print_co()">
      <span class="fa fa-print"></span> طباعة
    </button>

</section>
</template>

<script>
import { CashflowCtrl } from '../ctrls/CashflowCtrl'
import { ReceiptsCtrl } from '../ctrls/ReceiptsCtrl'
import CashflowTable from '@/components/CashflowTable.vue'
import { MainMixin } from '../mixins/MainMixin'
import { knex } from '../main'

export default {
  name: 'daily-moves',
  components: {
    CashflowTable
  },
  mixins: [MainMixin],
  data(){
    return {
      cashflowCtrl: new CashflowCtrl(),
      receiptsCtrl: new ReceiptsCtrl(),
      daily_receipts: [],
      daily_totals: {},
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
      // TODO MOVE
      this.daily_totals = await knex('v_daily_sums').where('day', this.day.iso).first()
      
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
  },
  computed: {
    fltrd_daily_receipts: function(){
      return this.daily_receipts.filter( item => {
        return (item.supplier_name.includes(this.search_term) )
      })
    },
    recp_sums: function() {
      let recp_sums = { 
        sum_count:0 ,
        sum_diffs:0 ,
        sum_nolons: 0 ,
        sum_net: 0 , 
        sum_rasd_net: 0 ,
        sum_income: 0 ,
        sum_comms: 0 ,
        sum_givens: 0
      }
      this.daily_receipts.forEach( recp => {
        recp_sums.sum_count += parseInt(recp.sum_total_count)
        recp_sums.sum_diffs += ( recp.sum_out_value - recp.sum_sale_value )
        recp_sums.sum_nolons += recp.sum_total_nolon
        recp_sums.sum_net += recp.sum_net_value
        recp_sums.sum_income += recp.sum_sell_comm + recp.sum_recp_comm + ( recp.sum_out_value - recp.sum_sale_value )
        recp_sums.sum_comms += recp.sum_sell_comm + recp.sum_recp_comm 
        recp_sums.sum_givens += recp.sum_recp_given
        recp_sums.sum_rasd_net += recp.sum_rasd_net
      })
      return recp_sums
    },
  }
}
</script>