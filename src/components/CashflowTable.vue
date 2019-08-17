<template>
  <section class="cashflow-table">
      <div class="table-responsive">
        <table class="table table-striped table-sm">
          <thead>
            <tr>
              <th>التاريخ</th>
              <th>المبلغ</th>
              <th>
                <span v-if="flags.type =='out_cashflow'">الي </span>
                <span v-if="flags.type =='in_cashflow'" >من </span>
              </th>
              <th>نوع</th>
              <th>ملاحظات</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in cashflow_arr" :key='idx'>
              <td>{{item.day | arDate }}</td>
              <td>{{item.amount | toAR }}</td>
              <td>
                {{item.customer_name}}
                {{item.supplier_name}}
              </td>
              <td>{{$store.state.transtypes_arr[item.state]}}
                <span v-if="item.d_product"> - {{ item.d_product | productsFilter }}</span>
                <span v-if="item.outgoing_id"> - عدد {{ item.count }} - وزن {{ item.weight }} - سعر {{ item.kg_price }}
                  <span v-if="item.income_day !== $store.state.day.iso " class="text-danger"> 
                    <br>
                      <span class="fa fa-star text-primary"></span> الزرع وارد يوم {{item.income_day | arDate }}
                  </span>
                </span>
              </td>
              <td>{{item.notes}}</td>
              <td v-if="flags.can_remove">
                <button class="btn text-danger" @click="removeCashflow(item.id)" >
                  <span class="fa fa-archive "></span> 
                  <template v-if="! confirm_step[item.id]"> حذف الحركة</template>
                  <template v-if="confirm_step[item.id]"> تأكيد </template>
                </button>
              </td>
            </tr>
            <tr>
              <th>مجموع</th>
              <th>{{total_cash | round2 | toAR}}</th>
            </tr>
          </tbody>
        </table>
      </div>
  </section>
</template>
<script>
import { CashflowCtrl } from '../ctrls/CashflowCtrl'

export default {
  name: 'CashflowTable',
  props: {
    cashflow_arr: Array,
    flags: {
      type: Object,
      default(){
        return {}
      }
    }
  },
  data(){
    return {
      confirm_step:[],
      cashflowCtrl: new CashflowCtrl()
    }
  },
  methods: {
    async removeCashflow(cashflow_id) {
      if( this.confirm_step[cashflow_id] ) {
        await this.cashflowCtrl.deleteById(cashflow_id)
        this.$emit('refresh')
      }
      else {
        this.confirm_step = []
        this.confirm_step[cashflow_id] = true
      }
    },
  },
  mounted(){

  },
  computed: {
    total_cash : function() {
      let sum = 0
      this.cashflow_arr.forEach(item => {
        sum += parseFloat(item.amount)
      })
      return sum
    },
  },
}
</script>
