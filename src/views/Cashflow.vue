<template>
  <section class="cashflow m-3 row">
  <div class="col-5">
    <button class="btn btn-success" v-b-toggle.collapse_cash >اضافة جديد </button>
    <br/>
    <br/>
      <b-collapse id="collapse_cash" class="m-1">
        <div class="entry-form">
        <form  @submit="addCashflow">
          <div class="form-group row" v-if="$route.name == 'out_cashflow'"> 
            <label class="col-sm-2" >نوع المصروف</label>
            <div class="col-sm-10">
            <select class="form-control " v-model="cashflow_form.state">
              <option value="expenses">مصروفات يومية</option>
              <option value="men_account">حساب الرجالة</option>
              <option value="act_pymnt">دفعات لا تخصم من الايراد</option>
              <option value="كاتب 1">كاتب 1</option>
              <option value="كاتب 2">كاتب 2</option>
              <option value="كاتب 3">كاتب 3</option>
              <option value="كاتب 4">كاتب 4</option>
              <option value="كاتب 5">كاتب 5</option>
            </select>
            </div>
          </div>

          <div class="form-group row">
            <label  class="col-sm-2">مبلغ ال{{ $route.name | tr_label }}</label>
            <div class="col-sm-10">
              <div v-if="cashflow_form.state === 'men_account'" class="m-1">
                عدد الطرود المباعة اليوم {{day_count}} X 
                <input v-model="men_rate" class=""  placeholder="بياعة الرجالة">
                <br>
              </div>
              <input v-model="cashflow_form.amount" class="form-control "  placeholder="ادخل المبلغ ">
            </div>
          </div>

          <div class="form-group row">
            <label  class="col-sm-2">ملاحظات</label>
            <div class="col-sm-10">
              <input v-model="cashflow_form.notes" class="form-control " placeholder="ادخال الملاحظات">
            </div>
          </div>     

          <button type="submit" class="btn btn-success" :disabled="! valid_form" >اضافة</button>
          &nbsp;
          <button type="button" @click="refresh_all()" class="btn btn-danger"> الغاء </button>
        </form>
        </div>
      </b-collapse>
    </div>
    <div class="col-7 p-0">
      <h1 v-if="this.$route.name == 'in_cashflow'"> 
        تحصيلات اليوم {{day.arab}}
      </h1>
      <h1 v-if="this.$route.name == 'out_cashflow'"> 
        مصروفات اليوم {{day.arab}}
      </h1>
      <br/>
      <CashflowTable :cashflow_arr="cashflow_arr" 
      :flags="{can_remove: true,type: $route.name}"
      @refresh="refresh_all"></CashflowTable>
    </div>
  </section>
</template>

<script>
import { CashflowCtrl , CashflowDAO } from '../ctrls/CashflowCtrl'
import { TransTypesCtrl } from '../ctrls/TransTypesCtrl';
import CashflowTable from '@/components/CashflowTable.vue'
import { MainMixin } from '../mixins/MainMixin'

export default {
  name: 'cashflow',
  data () {
    return {
      cashflow_arr: [],
      store_day: this.$store.state.day,
      cashflow_form: new CashflowDAO(CashflowDAO.INIT_DAO),
      cashflowCtrl: new CashflowCtrl(),
      day_count : 0,
      men_rate : 1.5,
    }
  },
  mixins:[MainMixin],
  methods: {
    async refresh_all() {
      this.cashflow_form = new CashflowDAO(CashflowDAO.INIT_DAO)
      // let states = null
      let sum = null
      // TODO get states manually
      if(this.$route.name == 'out_cashflow') {
        // states = ['given','expenses','nolon','payment','act_pymnt' ,'recp_paid','paid','acc_rest','repay_cust_trust','men_account','repay_cust_rahn','supp_payment','out_receipt']
        sum = '-'
      }
      else if(this.$route.name == 'in_cashflow') {
        this.cashflow_form.state = 'inc_collect'
        // states = ['collecting','outgoing_cash','supp_collect','cust_trust','cust_rahn','inc_collect'] 
        sum = '+'
      }
      this.cashflow_arr = await this.cashflowCtrl.findAll({sum: sum, day: this.$store.state.day.iso})
      /*
      this.cashflow_arr = await CashflowDB.getAll({
        // state:this.$route.name
        day: this.$store.state.day.iso,
        states: states
      })
      this.day_count = await DailyDB.getTodayCount(this.store_day.iso)
      */
      
    },
    async addCashflow(evt) {
      evt.preventDefault()
      let cashDAO = new CashflowDAO(this.cashflow_form)
      cashDAO.day = this.store_day.iso
      
      if(cashDAO.state && cashDAO.state.includes('كاتب')) {
        cashDAO.notes = cashDAO.state
        cashDAO.state = 'expenses'
      }
      let transTypesCtrl = new TransTypesCtrl()
      let cashTrans = await transTypesCtrl.findOne({name: cashDAO.state , category: 'cashflow' })
      cashDAO.sum = cashTrans.sum

      await this.cashflowCtrl.save(cashDAO)
      this.$root.$emit('bv::toggle::collapse', 'collapse_cash')
      this.cashflow_form = new CashflowDAO(CashflowDAO.INIT_DAO)
      this.refresh_all()
      /*
      cashDAO.state = (this.cashflow_form.state) ? this.cashflow_form.state : this.$route.name
      if(cashDAO.state === 'collecting')
        cashDAO.state = 'inc_collect'
      
      if(this.$route.name == 'expenses')
      cashDAO.sum = '-'

      await CashflowDB.addNew(cashDAO)
      this.$root.$emit('bv::toggle::collapse', 'collapse_cash')
      this.cashflow_form = {}
      this.refresh_all()
      */
    }
  },
  components: {
    CashflowTable
  },
  mounted() {
    this.refresh_all()
  },
  updated() {
    // this.refresh_all()
  },
  computed: {
    /*
    comp_cashflow_arr : async function() {
      return await CashflowDB.getAll({state:'collecting'})
    }
    */
    valid_form: function() {
      if(this.cashflow_form.amount && parseFloat(this.cashflow_form.amount) ){
        console.log(parseFloat(this.cashflow_form.amount))
        return true
      }
    }
  },
  watch : {
    "$route": function() {
      this.refresh_all()
    },
    "cashflow_form.state": function(val) {
      if(val === 'men_account') {
        this.cashflow_form.amount = this.day_count * this.men_rate
      }
    },
    men_rate: function(newval) {
      this.cashflow_form.amount = this.day_count * newval
    }
  }
}
</script>
