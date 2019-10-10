<template>
  <section class="accounts minh90 p-3">
    <div class="pr-hideme">
      <h3 class="text-danger fa fa-eraser larger"
      @click="search_term = ''" v-if="search_term"></h3>
      <input v-model="search_term" class="form-control" :placeholder="custom_labels['search_customers']">
      <br/>
    </div>

    <h1>حسابات البائعين - معاملات اليوم</h1>
    <div class="row" v-for="(outgoing, idx) in fltrd_unique_daily_customers"  :key="idx">
    <router-link   
    :to="{name:'customer_details', params: {id: outgoing.customer_id}}"
    class="col-5 btn btn-lg m-2 btn-block text-primary d-print-none pr-hideme" >
       &nbsp; 
      عرض حساب البياع - {{outgoing.customer_name}} 

    </router-link>

        <button class="col-5 m-1 btn btn-lg d-print-none pr-hideme " 
        :class="{ 'btn-danger': ! printed_all[outgoing.customer_id], 'btn-primary': printed_all[outgoing.customer_id]}"
        @click="showOutModal(outgoing.customer_id)">
          <span class="fa fa-cash-register"></span>   &nbsp;  {{'kashf_cust' | tr_label}} اليوم 
        <span v-if="printed_all[outgoing.customer_id]" style="float:left">
          ( تمت طباعته )
        </span>
        </button>
</div>

     
    <!-- Modal TODO No dublicate -->
<b-modal id="modal-daily" size="xl" class="col-print-12"
hide-header hide-footer hide-header-close hide-backdrop>
<template>
  <p class="recp-header" v-html="shader_configs['recp_header']"></p>
</template>

<div class="row">
  <div class="col-5">
    <h4>
      تحريراً في {{outg_day | arDate }}
    </h4>
    <h4>
      <span style="font-size: .6em;">المطلوب من السيد/ </span> 
      <span style="font-size: 1.1em;">{{customer.name}}</span>
    </h4>
  </div>
  <div class="col-7">
    <h3 > {{'kashf_cust' | tr_label}} </h3>
    <h2 class="text-center" v-if="daily_out_trans[0]"> حساب سابق : {{ daily_out_trans[0].debt_was | toAR }}</h2>
  </div>
</div>

<img style="margin-top: -375px;float: right;margin-right: 30px;" width="150" class="pr-only"
src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAE1p7UH2Beo1u_bkhcxuJSnqfd3EHT00s84gev-DgYVrJ4a5h' />
<img style="margin-top: -375px;float: left;margin-left: 30px;" width="150" class="pr-only"
src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAE1p7UH2Beo1u_bkhcxuJSnqfd3EHT00s84gev-DgYVrJ4a5h' />

  <div class="table-responsive p-2 m-2" style="border: 2px solid #79ace0; border-radius: 12px;" > 
      <table class="table table-bordered table-sm pr-me-xx" >
        <thead>
          <tr>
            <th>المبلغ</th>
            <th>عدد </th>
            <th> وزن</th>
            <th>سعر </th>
            <th>صنف</th>
            <th>
              <span v-if="shader_configs['pay_arboon']">
              عربون
              </span>
              <span v-else>
                ملاحظات
              </span>
              </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in daily_out_trans" :key='idx'>
            <template v-if="item.trans_type == 'outgoing'">
              <td>{{ item.amount | toAR(true) }} </td>
              <td> {{ item.count | toAR }}</td>
              <td> {{ item.weight | toAR }}</td>
              <td> {{ item.kg_price | toAR(true) }}</td>
              <td>{{ item.product_name }} </td>
              <td >
                <b v-if="shader_configs['pay_arboon'] && item.notes">
                  عربون : 
                </b>
                {{item.notes }}
              </td>
            </template>
            <template v-if="item.trans_type == 'product_rahn'">
              <td>{{ item.amount | toAR(true) }} </td>
              <td> {{ item.count | toAR }}</td>
              <td> </td>
              <td> </td>
              <td> رهن {{ item.product_name }} </td>
              <td >
                {{item.notes }}
              </td>
            </template>
            <template v-if="false && item.trans_type == 'cust_in_collecting'">
              <td>( {{ item.amount | toAR(true) }} ) </td>
              <td> تنزيل</td>
              <td> </td>
            </template>
          </tr>
          <tr v-if="app_config.shader_name != 'nada'"
          :class="{'pr-hideme': !d_collect_form.amount }">
            <td ><input v-if="! d_collect_form.id" 
              v-model="d_collect_form.amount" class="form-control" placeholder="ادخل مبلغ التحصيل" >
              <span v-if="d_collect_form.id">({{d_collect_form.amount | toAR}})</span>
              </td>
            <td style="border: none !important;"> 
            {{'collect' | tr_label}}
            </td>

            <td style="border: none !important;">
                <button  v-if="d_collect_form.id"
                class="btn text-danger pr-hideme" @click="removeTrans(d_collect_form,true)" >
                  <span class="fa fa-archive "></span> 
                  <template v-if="! confirm_step[d_collect_form.id]"> حذف </template>
                  <template v-if="confirm_step[d_collect_form.id]"> تأكيد </template>
                </button>
            </td>
          </tr>
          <tr>
            <td >
              <b class="border-top border-primary">
                <span v-if="app_config.shader_name == 'magdy'">{{ sum_outgoings_val | ceil5 | toAR }} </span>
                <span v-else>{{ sum_outgoings_val | round | toAR }} </span>
              </b>
            </td>
            <td style="border: none !important;"> اجمالي </td>
          </tr>
        </tbody>
      </table>
      
      <span></span>

      <div class="m-2">
          <button class="btn btn-success pr-hideme" @click="modalSave" >
            <span class="fa fa-check "></span> &nbsp;
            حفظ
          </button>
          &nbsp;
          <button class="btn btn-printo pr-hideme" 
            @click="print_co();print_done(outg_day, customer.id);">
            <span class="fa fa-print"></span> طباعة
          </button>
           &nbsp;
          <button class="btn btn-danger pr-hideme" @click="$bvModal.hide('modal-daily');refresh_all();d_collect_form= {}" >
            <span class="fa fa-close "></span> &nbsp;
            اغلاق
          </button>
      </div>
  </div>
</b-modal>
  </section>
</template>

<script >
import { OutgoingsCtrl } from '../ctrls/OutgoingsCtrl'
import { knex } from '../main';
import { MainMixin } from '../mixins/MainMixin';
import { CustomersCtrl, CustomerTransDAO } from '../ctrls/CustomersCtrl';
import { CashflowCtrl, CashflowDAO } from '../ctrls/CashflowCtrl';
import { TransTypesCtrl } from '../ctrls/TransTypesCtrl';

export default {
  name: 'accounts',
  data () {
    return {
      unique_daily_customers: [],
      printed_all: {},
      outg_day: {},
      daily_out_trans: [],
      customer: {},
      d_collect_form: {id:null , trans_type:'cust_collecting', amount: null , notes: null},
      confirm_step: [],
      customersCtrl: new CustomersCtrl(),
      transTypesCtrl: new TransTypesCtrl()
    }
  },
  mixins: [MainMixin],
  methods: {
    async refresh_all () {
      let outgoingsCtrl = new OutgoingsCtrl()
      let printed = await knex.raw(`select customer_id, printed from customers_daily where day ='${this.day.iso}'`)
      printed.forEach(one => {
        if(one.printed === 1)
          this.printed_all[one.customer_id] = (one.printed == 1)
      });
      this.unique_daily_customers = await outgoingsCtrl.findDailyCustomers({day: this.$store.state.day.iso})
    },
    async showOutModal(customer_id){
      this.customer = await this.customersCtrl.findOne(customer_id)
      this.outg_day = this.day.iso
      this.daily_out_trans = await this.customersCtrl.getDailyOutTrans({id: customer_id, day: this.outg_day})
      let filtered_incollect = this.daily_out_trans.filter(item => item.trans_type === 'cust_in_collecting')
      if(filtered_incollect.length > 0){
        this.d_collect_form.amount = Math.abs(filtered_incollect[0].amount)
        this.d_collect_form.id = filtered_incollect[0].id
        this.d_collect_form.customer_id = filtered_incollect[0].customer_id
      }
      this.$bvModal.show('modal-daily')
    },
    async modalSave(evt){
      if(! this.d_collect_form.id && this.d_collect_form.amount ) {
        this.d_collect_form.trans_type = 'cust_in_collecting'
        await this.createCustomerTrans(evt)
      }
      await this.showOutModal(this.customer.id)
    },
    async removeTrans(trans, in_kashf = false) {
      if( this.confirm_step[trans.id] ) {
        this.discard_success = await this.customersCtrl.removeCustomerTrans(trans)
        this.confirm_step = []
        if(in_kashf) {
          this.d_collect_form = {}
          this.showOutModal(this.customer.id)
        }
      }
      else {
        this.confirm_step = []
        this.confirm_step[trans.id] = true
      }
    },
    async createCustomerTrans(evt ) {
      evt.preventDefault()
      
      let selectedTrans = await this.transTypesCtrl.findOne({name: this.d_collect_form.trans_type , category: 'customer_trans'})
      // create customer trans
      if(selectedTrans) {
        let cashflow_id = null
        if(selectedTrans.map_cashflow){
          // Create cashflow with trans
          let cashflowTrans = await this.transTypesCtrl.findOne({name: selectedTrans.map_cashflow , category: 'cashflow'})
          
          let newCashflow = new CashflowDAO({
            amount: this.d_collect_form.amount,
            day: this.$store.state.day.iso,
            customer_id: this.customer.id,
          })

          newCashflow.transType = cashflowTrans
          let cashflowCtrl = new CashflowCtrl()
          cashflow_id = await cashflowCtrl.save(newCashflow)
        }

        let custtransDAO = new CustomerTransDAO(this.d_collect_form)
        custtransDAO.day = this.$store.state.day.iso
        custtransDAO.customer_id = this.customer.id
        custtransDAO.cashflow_id = cashflow_id
        custtransDAO.transType = selectedTrans
        await this.customersCtrl.updateDebtByTrans(custtransDAO)
      }
      this.d_collect_form = {trans_type:'cust_collecting', amount: null , notes: null}
      this.showOutModal(this.customer.id)
    },
    async print_done(outg_day, customer_id){
      try {
        await knex.raw(`insert into customers_daily (customer_id, day, printed) values( ${customer_id} , '${outg_day}', 1)`)
      } catch (error) {
        error
      }
    },
  },
  components: {
  },
  computed:{
    fltrd_unique_daily_customers: function () {
      return this.unique_daily_customers.filter( item => {
        if(item.customer_name)
          return (item.customer_name.includes(this.search_term) )
      })
    },
    sum_outgoings_val: function() {
      let sum = 0
      this.daily_out_trans.forEach(item => {
        sum += parseFloat(item.amount)
      })
      return sum
    }
  },
  mounted() {
    this.refresh_all()
  }
}
</script>

