<template>
  <section class="cashflow-table">
    <div class="pr-hideme">
      <h3 class="text-danger fa fa-eraser larger"
      @click="search_term = ''" v-if="search_term"></h3>
      <input v-model="search_term" class="form-control" placeholder="بحث في حركات النقدية">
    </div>
    <br>
      <div class="table-responsive">
        <table class="table table-striped table-sm">
          <thead>
            <tr>

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
            <tr v-for="(item, idx) in fltrd_cashflow_arr" :key='idx'>
              <!--
              <td>{{item.day | arDate }}</td>
              -->
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
                  <template v-if="! confirm_step[item.id]"> </template>
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
import { MainMixin } from '../mixins/MainMixin'

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
  mixins:[MainMixin],
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
      this.fltrd_cashflow_arr.forEach(item => {
        sum += parseFloat(item.amount)
      })
      return sum
    },
    fltrd_cashflow_arr: function() {
      return this.cashflow_arr.filter( item => {
        return (
          (item.supplier_name && item.supplier_name.includes(this.search_term)) ||
          (item.customer_name && item.customer_name.includes(this.search_term)) ||
          (! this.search_term && ! item.supplier_name && ! item.customer_name)
        )
      })
    }
  },
}
</script>
