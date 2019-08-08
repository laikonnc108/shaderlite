<template>
  <section class="customer-details p-3 bg-accounts pr-me">
    <div class="p-1">
        <button class="btn btn-primary d-print-none" @click="$router.go(-1)">
            <span class="fa fa-arrow-right"></span> &nbsp;   العودة
        </button>
        <br/>
        <h3 class="d-inline-block ">حساب البائع : {{customer.name}}</h3>
        <table class="table table-bordered mt-1" v-if=" ! customer.is_self">
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
                {{/*custom_labels.trans[trans.trans_type]*/}}
                {{trans.trans_type | tr_label}}
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
                
                <button class="btn text-danger" @click="removeLastTrans(trans)" v-if="idx == customer_trans.length - 1">
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
        @click="vue_window.print()">
          <span class="fa fa-print"></span> طباعة
        </button>

  <!-- Element to collapse -->
  <b-collapse id="collapse_collect" class="d-print-none p-1">
    <div class="entry-form">
    <form  @submit="addCollecting" class="m-2">
      <b-form-group label="نوع الحركة">
        <b-form-radio-group  v-model="collect_form.sum">
          <b-form-radio value="+">تحصيل</b-form-radio>
          <b-form-radio value="-">سلفة</b-form-radio>
          <b-form-radio value="r">باقي حساب</b-form-radio>
          |
          <b-form-radio value="$">امانة</b-form-radio>
          <b-form-radio value="#">رد امانة</b-form-radio>
          |
          <b-form-radio value="rhn">رهن</b-form-radio>
          <b-form-radio value="p_rhn">رد رهن</b-form-radio>
        </b-form-radio-group>
      </b-form-group>

      <div class="form-group row">
        <label  class="col-sm-2">المبلغ</label>
        <div class="col-sm-10">
          <input v-model="collect_form.amount" class="form-control "  placeholder="ادخل المبلغ ">
        </div>
      </div>
      <div class="form-group row">
        <label  class="col-sm-2">ملاحظات</label>
        <div class="col-sm-10">
          <input v-model="collect_form.notes" class="form-control " placeholder="ادخال الملاحظات">
        </div>
      </div>

      <button  v-if="collect_form.sum" type="submit" class="btn btn-success" :disabled="! valid_form">
        <span v-if=" collect_form.sum =='-' || collect_form.sum =='r' || collect_form.sum =='#' || collect_form.sum == 'p_rhn'  ">دفع</span>
        <span v-if=" collect_form.sum =='+' || collect_form.sum =='$' || collect_form.sum == 'rhn' ">تحصيل</span>
      </button>
    </form>
    </div>
  </b-collapse>
  </section>
</template>

<script >
import { CustomersCtrl } from '../ctrls/CustomersCtrl'

export default {
  name: 'customer-details',
  data () {
    return {
      customer: {},
      customersCtrl: new CustomersCtrl(),
      collect_form: {sum:'+', amount: null},
      customer_trans: [],
      self_rest_products: [],
      customer_id: this.$route.params.id,
      custom_labels: this.$store.state.custom_labels,
      confirm_step: [],
      discard_success: false,
      sell_rest: {actual_sale: 0 , notes: ''}
    }
  },
  methods: {
    async getCustomerDetails() {
        //let {dao, trans} = await this.customersCtrl.getCustomerDetails(this.customer_id)

        this.customer = await this.customersCtrl.findOne(this.customer_id)
        this.customer_trans = await this.customersCtrl.getCustomerTrans(this.customer_id)
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
    async sellRest(evt) {
      evt.preventDefault()

      this.$root.$emit('bv::toggle::collapse', 'collapse_sell')
    },
    async addCollecting(evt ) {
      evt.preventDefault()
      
    }
  },
  components: {
  },
  mounted() {
    this.getCustomerDetails()
  },
  computed: {
    valid_form: function() {
      if(this.collect_form.amount && parseFloat(this.collect_form.amount) && this.collect_form.sum){
        return true
      }
    }
  }
}
</script>

