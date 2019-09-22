<template>
  <section class="customer-details p-3 pr-me row">
    <div class="col-5 pr-hideme">
        <button class="btn btn-primary d-print-none pr-hideme" @click="$router.go(-1)">
            <span class="fa fa-arrow-right"></span> &nbsp;   العودة
        </button>
        <br />

        <h3 class="d-inline-block ">كشف مديونية / {{customer.name}}</h3>
        <table class="table table-bordered mt-1 pr-hideme" v-if=" ! customer.is_self">
            <tr>
              <th>تليفون </th>
              <td>{{customer.phone}}</td>
            </tr>
            <tr>
              <th>عنوان </th>
              <td>{{customer.address}}</td>
            </tr>
            <tr>
              <th>رقم بطاقة </th>
              <td>{{customer.nat_id}}</td>
            </tr>
        </table>



  <button v-b-toggle.collapse_collect class="btn btn-success m-1 d-print-none">
    <span class="fa fa-credit-card"></span> &nbsp; 
    حركة نقدية : تحصيل / امانة 
  </button> 

  <button @click="showOutModal()" class="btn btn-primary m-1 d-print-none">
    <span class="fa fa-table"></span> &nbsp; 
    عرض كشف مبيعات اليوم
  </button>


  <!-- Element to collapse -->
  <b-collapse id="collapse_collect" class="d-print-none p-1">
    <div class="entry-form">
    <form  @submit="createCustomerTrans" class="m-2">
      <!-- todo get dynamic 
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
      -->

      <div class="form-group row">
        <label  class="col-sm-2"> نوع الحركة </label>
        <div class="col-sm-10">
          <select v-model="customer_trans_form.trans_type" class="form-control"  >
            <option 
            :class="{ 'text-danger': trans_type.sum == '+' }"
            v-for="(trans_type, idx) in trans_types_opts" :key='idx' :value="trans_type.name">
              {{trans_type.ar_name}}
            </option>
          </select>
        </div>
      </div>

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
      </div>

      <div class="table-responsive col-7 " v-if="flags.modal_closed">

        <h1 class="pr-only">كشف مديونية  {{customer.name}}</h1>

        <table class="table table-striped ">
          <thead>
            <tr>
              <th>التاريخ</th>
              <th>مبلغ</th>
              <th>الحركة</th>              
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(trans, idx) in customer_trans" :key='idx'>
              <td>{{trans.day | arDate }}</td>
              <td>{{trans.amount | toAR}}</td>
              <td>
                {{trans.trans_type | tr_label('trans_types')}}
                <span v-if="trans.notes">- {{trans.notes}} </span> 
              </td>              
              <td>
                
                <button  v-if="trans.id"
                class="btn text-danger pr-hideme" @click="removeTrans(trans)" >
                  <span class="fa fa-archive "></span> 
                  <template v-if="! confirm_step[trans.id]"> حذف </template>
                  <template v-if="confirm_step[trans.id]"> تأكيد </template>
                </button>

                <button  v-if="trans.trans_type === 'sum_outgoing'"
                class="btn text-primary pr-hideme" @click="showOutModal(trans.day)" >
                  <span class="fa fa-table "></span> 
                  عرض الكشف
                </button>
              </td>
            </tr>
            <tr>
              <td></td>
              <td>رصيد المديونية الحالي</td>
              <td></td>
              <td>
                <b>{{customer.debt | toAR(true)}}</b>
              </td>
            </tr>
          </tbody>
        </table>
        <button class="btn btn-printo pr-hideme m-1" 
        @click="print_co()">
          <span class="fa fa-print"></span> طباعة كشف المديونية
        </button>
      </div>
      
    <!-- Modal TODO No dublicate -->
<b-modal id="modal-daily" size="xl" class="col-print-12"
hide-header hide-footer hide-header-close hide-backdrop>
<template>
  <p class="recp-header" v-html="shader_configs['recp_header']"></p>
</template>
<h4 class="text-center"> كشف حساب </h4>
<h4>
  تحريراً في {{outg_day | arDate }}
</h4>
<h4>
  <span style="font-size: .6em;">المطلوب من السيد/ </span> 
  <span style="font-size: 1.1em;">{{customer.name}}</span>
</h4>
<img style="margin-top: -75px;float: left;"
src='https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Noun_Project_vegetables_icon_1422990_cc.svg/110px-Noun_Project_vegetables_icon_1422990_cc.svg.png' />
<h4 class="text-center" v-if="daily_out_trans[0]"> حساب سابق : {{ daily_out_trans[0].debt_was | toAR }}</h4>
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
          </tr>
          <tr>
            <td ><input v-if="! customer_trans_form.id" 
              v-model="customer_trans_form.amount" class="form-control" placeholder="ادخل مبلغ التحصيل" >
              <span v-if="customer_trans_form.id">({{customer_trans_form.amount | toAR}})</span>
              </td>
            <td style="border: none !important;"> تنزيل </td>

            <td style="border: none !important;">
                <button  v-if="customer_trans_form.id"
                class="btn text-danger pr-hideme" @click="removeTrans(customer_trans_form)" >
                  <span class="fa fa-archive "></span> 
                  <template v-if="! confirm_step[customer_trans_form.id]"> حذف </template>
                  <template v-if="confirm_step[customer_trans_form.id]"> تأكيد </template>
                </button>
            </td>
          </tr>
          <tr>
            <td ><b class="border-top border-primary">{{ sum_outgoings_val | ceil5 | toAR }} </b></td>
            <td style="border: none !important;"> اجمالي </td>
          </tr>
        </tbody>
      </table>
      <span>
        
      </span>

      <div class="m-2">
          <button class="btn btn-primary pr-hideme" @click="modalSave" >
            <span class="fa fa-check "></span> &nbsp;
            موافق
          </button>
          &nbsp;
          <button class="btn btn-printo pr-hideme" 
            @click="print_co();print_done(outg_day)">
            <span class="fa fa-print"></span> طباعة
          </button>
      </div>
  </div>
</b-modal>
  </section>
</template>

<script >
import { CustomersCtrl, CustomerTransDAO } from '../ctrls/CustomersCtrl'
import { TransTypesCtrl } from '../ctrls/TransTypesCtrl'
import { CashflowDAO, CashflowCtrl } from '../ctrls/CashflowCtrl'
import { MainMixin } from '../mixins/MainMixin';
import { knex } from '../main';
import image from '../assets/vegetables.png'

export default {
  name: 'customer-details',
  data () {
    return {
      customer: {},
      customersCtrl: new CustomersCtrl(),
      transTypesCtrl: new TransTypesCtrl(),
      customer_trans_form: {id:null , trans_type:'cust_collecting', amount: null , notes: null},
      trans_types_opts : [],
      customer_trans: [],
      daily_out_trans: [],
      self_rest_products: [],
      customer_id: this.$route.params.id,
      transtypes_labels: this.$store.state.transtypes_arr,
      confirm_step: [],
      flags: {modal_closed: true },
      discard_success: false,
      sell_rest: {actual_sale: 0 , notes: ''},
      outg_day: {}
    }
  },
  mixins: [MainMixin],
  methods: {
    async getCustomerDetails() {
      //let {dao, trans} = await this.customersCtrl.getCustomerDetails(this.customer_id)
      // TODO get trans dynamicly
      this.customer = await this.customersCtrl.findOne(this.customer_id)
      this.customer_trans = await this.customersCtrl.getCustomerTrans({id: this.customer_id})
      this.trans_types_opts = await this.transTypesCtrl.findAll({category: 'customer_trans', optional: 3 })
    },
    async showOutModal(day = null){
      this.outg_day = day ? day : this.day.iso
      this.daily_out_trans = await this.customersCtrl.getDailyOutTrans({id: this.customer_id, day: this.outg_day})
      // TODO show incollect_trans amount
      let filtered_incollect = this.daily_out_trans.filter(item => item.trans_type === 'cust_in_collecting')
      if(filtered_incollect.length > 0){
        this.customer_trans_form.amount = Math.abs(filtered_incollect[0].amount)
        this.customer_trans_form.id = filtered_incollect[0].id
      }
      this.$bvModal.show('modal-daily')
    },
    async modalSave(evt){
      if(! this.customer_trans_form.id && this.customer_trans_form.amount ) {
        // await this.customersCtrl.removeCustomerTrans(this.customer_trans_form)
        this.customer_trans_form.trans_type = 'cust_in_collecting'
        await this.createCustomerTrans(evt)
      }

      this.$bvModal.hide('modal-daily')
    },
    async removeTrans(trans) {
      if( this.confirm_step[trans.id] ) {
        this.discard_success = await this.customersCtrl.removeCustomerTrans(trans)
        this.confirm_step = []
        this.getCustomerDetails()
      }
      else {
        this.confirm_step = []
        this.confirm_step[trans.id] = true
      }
    },
    async print_done(outg_day){
      await knex.raw(`insert into customers_daily (customer_id, day, printed) values( ${this.customer_id} , '${outg_day}', 1)`)
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
      this.customer_trans_form = {trans_type:'cust_collecting', amount: null , notes: null}
      this.$root.$emit('bv::toggle::collapse', 'collapse_collect')
    }
  },
  components: { },
  mounted() {
    this.getCustomerDetails()
    this.$root.$on('bv::modal::show', (bvEvent, modalId) => {
      if(modalId == 'modal-daily') this.flags.modal_closed = false
    })
    this.$root.$on('bv::modal::hide', (bvEvent, modalId) => {
      if(modalId == 'modal-daily') this.flags.modal_closed = true
    })
  },
  computed: {
    valid_form: function() {
      if(this.customer_trans_form.amount && parseFloat(this.customer_trans_form.amount) && this.customer_trans_form.trans_type){
        return true
      }
    },
    sum_outgoings_val: function() {
      let sum = 0
      this.daily_out_trans.forEach(item => {
        sum += parseFloat(item.amount)
      })
      return sum
    }
  }
}
</script>

