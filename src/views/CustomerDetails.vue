<template>
  <section class="customer-details p-3 pr-me">
    <div class="p-1">
        <button class="btn btn-primary d-print-none pr-hideme" @click="$router.go(-1)">
            <span class="fa fa-arrow-right"></span> &nbsp;   العودة
        </button>
        <br class="pr-hideme"/>
<template v-if="true || print_mode" >
  <p class="pr-only" v-html="shader_configs['recp_header']"></p>
</template>
        <h3 class="d-inline-block ">كشف حساب / {{customer.name}}</h3>
        <table class="table table-bordered mt-1 pr-hideme" v-if=" ! customer.is_self">
            <tr>
            <th>تليفون البياع</th>
            <td>{{customer.phone}}</td>
            </tr>
            <tr>
            <th>عنوان البياع</th>
            <td>{{customer.address}}</td>
            </tr>
        </table>
      </div>
      
      <div class=" row d-print-none p-1 "  v-if="customer.is_self">
        <h3 class="text-center"> الزرع المتبقي في حساب المحل </h3>
        <br>
        <button v-for="(item, idx) in self_rest_products" :key="idx" 
        v-b-toggle.collapse_sell  @click="sell_rest = item"
        class="btn btn-lg btn-primary m-1 btn-block">
          <span class="fa fa-shopping-cart"></span> &nbsp; 
          {{item.product_name}}  - 
          عدد ({{item.count}}) - السعر التقديري {{item.amount}}
        </button>
      </div>
        <b-collapse id="collapse_sell" class="d-print-none p-1">
          <div class="entry-form">
          <form  @submit="sellRest" class="m-2">
            <div class="form-group row">
              <label  class="col-sm-2">السعر الفعلي</label>
              <div class="col-sm-10">
                <input v-model="sell_rest.actual_sale" class="form-control "  placeholder="ادخل مبلغ البيع">
              </div>
            </div>
            <div class="form-group row">
              <label  class="col-sm-2">ملاحظات</label>
              <div class="col-sm-10">
                <input v-model="sell_rest.notes" class="form-control " placeholder="ادخال الملاحظات">
              </div>
            </div>
            <button type="submit" class="btn btn-success" :disabled="! sell_rest.amount">تحصيل</button>
          </form>
          </div>
        </b-collapse>
    <hr/>
        <table class="table table-striped ">
          <thead>
            <tr>
              <th>التاريخ</th>
              <th>الحركة</th>
              <th>الصنف</th>
              <th>المبلغ</th>
              <th>باقي</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(trans, idx) in customer_trans" :key='idx'>
              <td>{{trans.day | arDate }}</td>
              <td>
                {{trans.trans_type | tr_label('trans_types')}}
                <span v-if="trans.trans_type === 'outgoing'"> 
                  - عدد {{trans.count | toAR }} 
                  - وزن {{trans.weight | toAR }}
                  - سعر {{trans.kg_price | toAR }}
                </span>
                <span v-if="trans.notes">- {{trans.notes}} </span> 
              </td>
              <td>{{trans.product_name}} </td>
              <td>{{trans.amount | toAR}}</td>
              <td>{{trans.debt_after | toAR}}</td>
              <td>
                
                <button class="btn text-danger pr-hideme" @click="removeLastTrans(trans)" v-if="idx == customer_trans.length - 1">
                  <span class="fa fa-archive "></span> 
                  <template v-if="! confirm_step[trans.id]"> حذف الحركة</template>
                  <template v-if="confirm_step[trans.id]"> تأكيد </template>
                </button>

              </td>
            </tr>
            <tr>
              <td></td>
              <td>رصيد المديونية الحالي</td>
              <td></td>
              <td>
                <b>{{customer.debt | toAR}}</b>
              </td>
            </tr>
          </tbody>
        </table>
  <button v-b-toggle.collapse_collect class="btn btn-success m-1 d-print-none">
    <span class="fa fa-credit-card"></span> &nbsp; 
    حركة نقدية : تحصيل / امانة 
  </button>

        <button class="btn btn-printo pr-hideme m-1" 
        @click="print_co();print_done()">
          <span class="fa fa-print"></span> طباعة
        </button>

  <!-- Element to collapse -->
  <b-collapse id="collapse_collect" class="d-print-none p-1">
    <div class="entry-form">
    <form  @submit="createCustomerTrans" class="m-2">
      <!-- todo get dynamic -->
      <b-form-group label="نوع الحركة">
        <b-form-radio-group  v-model="customer_trans_form.trans_type">
          <b-form-radio value="cust_collecting">تحصيل</b-form-radio>
          <b-form-radio value="cust_advance_pay">سلفة</b-form-radio>
          <b-form-radio value="cust_acc_rest">باقي حساب</b-form-radio>
          <b-form-radio value="cust_discount">خصم للتاجر</b-form-radio>
          |
          <b-form-radio value="cust_trust">امانة</b-form-radio>
          <b-form-radio value="repay_cust_trust">رد امانة</b-form-radio>
          |
          <b-form-radio value="rhn">رهن</b-form-radio>
          <b-form-radio value="p_rhn">رد رهن</b-form-radio>
        </b-form-radio-group>
      </b-form-group>

      <div class="form-group row">
        <label  class="col-sm-2">المبلغ</label>
        <div class="col-sm-10">
          <input v-model="customer_trans_form.amount" class="form-control "  placeholder="ادخل المبلغ ">
        </div>
      </div>
      <div class="form-group row">
        <label  class="col-sm-2">ملاحظات</label>
        <div class="col-sm-10">
          <input v-model="customer_trans_form.notes" class="form-control " placeholder="ادخال الملاحظات">
        </div>
      </div>

      <button  v-if="customer_trans_form.trans_type" type="submit" class="btn btn-success" :disabled="! valid_form">
        اضافة
      </button>
    </form>
    </div>
  </b-collapse>
  </section>
</template>

<script >
import { CustomersCtrl, CustomerTransDAO } from '../ctrls/CustomersCtrl'
import { TransTypesCtrl } from '../ctrls/TransTypesCtrl'
import { CashflowDAO, CashflowCtrl } from '../ctrls/CashflowCtrl'
import { MainMixin } from '../mixins/MainMixin';
import { knex } from '../main';

export default {
  name: 'customer-details',
  data () {
    return {
      customer: {},
      customersCtrl: new CustomersCtrl(),
      transTypesCtrl: new TransTypesCtrl(),
      customer_trans_form: {trans_type:'+', amount: null , notes: null},
      customer_trans: [],
      self_rest_products: [],
      customer_id: this.$route.params.id,
      custom_labels: this.$store.state.custom_labels,
      transtypes_labels: this.$store.state.transtypes_arr,
      confirm_step: [],
      discard_success: false,
      sell_rest: {actual_sale: 0 , notes: ''}
    }
  },
  mixins: [MainMixin],
  methods: {
    async getCustomerDetails() {
      //let {dao, trans} = await this.customersCtrl.getCustomerDetails(this.customer_id)
      // TODO get trans dynamicly
      this.customer = await this.customersCtrl.findOne(this.customer_id)
      this.customer_trans = await this.customersCtrl.getCustomerTrans({id: this.customer_id, day: this.day.iso})
    },
    async removeLastTrans(trans) {
      if( this.confirm_step[trans.id] ) {
        this.discard_success = await this.customersCtrl.removeLastTrans(trans)
        this.confirm_step = []
        this.getCustomerDetails()
      }
      else {
        this.confirm_step = []
        this.confirm_step[trans.id] = true
      }
    },
    async print_done(){
      await knex.raw(`insert into customers_daily (customer_id, day, printed) values( ${this.customer_id} , '${this.day.iso}', 1)`)
    },
    async sellRest(evt) {
      evt.preventDefault()
      this.$root.$emit('bv::toggle::collapse', 'collapse_sell')
    },
    async createCustomerTrans(evt ) {
      evt.preventDefault()
      
      let selectedTrans = await this.transTypesCtrl.findOne({name: this.customer_trans_form.trans_type , category: 'customer_trans'})
      // create customer trans
      if(selectedTrans) {
        let cashflow_id = null
        if(selectedTrans.map_cashflow){
          // Create cashflow with trans
          let cashflowTrans = await this.transTypesCtrl.findOne({name: selectedTrans.map_cashflow , category: 'cashflow'})
          
          let newCashflow = new CashflowDAO({
            amount: this.customer_trans_form.amount,
            day: this.$store.state.day.iso,
            customer_id: this.customer_id,
          })

          newCashflow.transType = cashflowTrans
          let cashflowCtrl = new CashflowCtrl()
          cashflow_id = await cashflowCtrl.save(newCashflow)
        }

        let custtransDAO = new CustomerTransDAO(this.customer_trans_form)
        custtransDAO.day = this.$store.state.day.iso
        custtransDAO.customer_id = this.customer_id
        custtransDAO.cashflow_id = cashflow_id
        custtransDAO.transType = selectedTrans
        await this.customersCtrl.updateDebtByTrans(custtransDAO)
      }
      
      this.getCustomerDetails()
      this.customer_trans_form = {trans_type:'+', amount: null , notes: null}
      this.$root.$emit('bv::toggle::collapse', 'collapse_collect')
    }
  },
  components: { },
  mounted() {
    this.getCustomerDetails()
  },
  computed: {
    valid_form: function() {
      if(this.customer_trans_form.amount && parseFloat(this.customer_trans_form.amount) && this.customer_trans_form.trans_type){
        return true
      }
    }
  }
}
</script>

