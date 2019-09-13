<template>
  <section class="supllier-details">
    <section class="supp-head m-3">

      <button class="btn btn-primary pr-hideme" @click="$router.go(-1)">العودة</button>
      <h2 class="d-inline-block mr-3 ">ملف العميل : {{supplier.name}}</h2> 
      <br>
      <div class="pr-mt-2"></div>
      <table class="table table-bordered mt-1 pr-hideme">
        <tr>
          <th>تليفون العميل</th>
          <td>{{supplier.phone}}</td>

          <th>عنوان العميل</th>
          <td>{{supplier.address}}</td>
        </tr>

      </table>
    </section>
    <section class="row">
      <div class="col-5">
        <router-link class="btn btn-primary mr-3" :to="{name:'supp_recp_details', params: {supplier_id: supplier.id}}">
         فواتير اليوم
        </router-link>
        <button v-b-toggle.collapse_pay class=" btn btn-success mr-2" >
          <span class="fa fa-money-bill-wave"></span> &nbsp; 
        اضافة فواتير سابقة / دفعات / تحصيلات
        </button>
        <!-- Element to collapse  <div class="m-2"></div>-->
      <b-collapse id="collapse_pay" style="padding:25px;" class="pr-hideme">
        <div class="entry-form">
        <form  @submit="addPayments">
          <b-form-group label="نوع الحركة">
            <b-form-radio-group  v-model="trans_form.trans_type">
              <b-form-radio value="supp_pre_payment">دفعة سابقة</b-form-radio>
              <b-form-radio value="supp_pre_recp">فاتورة سابقة</b-form-radio>
              <b-form-radio value="supp_collect">تحصيل</b-form-radio>
              <b-form-radio value="supp_payment">دفعة اليوم</b-form-radio>
              <b-form-radio value="supp_recp_expenses">مصروف فاتورة</b-form-radio>
            </b-form-radio-group>
          </b-form-group>

          <div class="form-group row">
            <label  class="col-sm-2">المبلغ</label>
            <div class="col-sm-10">
              <input v-model="trans_form.amount" class="form-control "  placeholder="ادخل المبلغ">
            </div>
          </div>
          <div class="form-group row" v-if="trans_form.trans_type === 'supp_pre_payment' || trans_form.trans_type === 'supp_pre_recp'">
            <label  class="col-sm-2">تاريخ</label>
            <div class="col-sm-10">
              <datetime v-model="trans_form.day" :auto="true" class="datetime" min-datetime="2018-01-01"></datetime>
            </div>
          </div>
          <div class="form-group row" >
            <label  class="col-sm-2">ملاحظات</label>
            <div class="col-sm-10">
              <input v-model="trans_form.notes" class="form-control " placeholder="ادخال الملاحظات">
            </div>
          </div>     
          <div class="form-group row" v-if=" trans_form.trans_type == 'supp_pre_recp'">
            <label  class="col-sm-2">عدد الطرود</label>
            <div class="col-sm-10">
              <input v-model="trans_form.count" class="form-control " placeholder="ادخال العدد">
            </div>
          </div>     
          <div class="form-group row" v-if=" trans_form.trans_type == 'supp_pre_recp'">
            <label  class="col-sm-2">الاصناف</label>
            <div class="col-sm-10">
              <input v-model="trans_form.products" class="form-control " placeholder=" ادخال اسماء الاصناف">
            </div>
          </div>     

          <button type="submit" class="btn btn-success" :disabled="! valid_payments_form ">
            <span v-if="trans_form.trans_type === 'supp_pre_payment' || trans_form.trans_type === 'supp_payment' || trans_form.trans_type === 'supp_recp_expensess'">اضافة دفعة</span>
            <span v-if="trans_form.trans_type === 'supp_pre_recp' ">اضافة الفاتورة</span>
            <span v-if=" trans_form.trans_type == 'supp_collect'">تحصيل مبلغ</span>
          </button>
          <button type="button" class="btn btn-danger mr-1"  v-b-toggle.collapse_pay >  اغلاق</button>
        </form>
        </div>
      </b-collapse>
    </div>
    <div class="col-7 table-responsive" >
      <h3 class="m-3">سجل دفعات العميل </h3>
        <table class="table table-striped pr-me">
          <thead>
            <tr>
              <th>م </th>
              <th>التاريخ</th>
              <th>الحركة</th>
              <th>المبلغ</th>
              <th>باقي</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(payment, idx) in supplier_trans" >
            <tr :key='idx' v-if="true || payment.trans_type == 'supp_payment'">
              <th>{{idx +1 | toAR }} </th>
              <td>{{payment.day | arDate }}</td>
              <td>
                {{payment.trans_type | tr_label('trans_types')}}
                <span v-if="payment.notes">- {{payment.notes}} </span>
              </td>
              <td>{{payment.amount | toAR}}</td>
              <td>{{payment.balance_after | toAR}}</td>
            </tr>
            </template>
            <tr>
              <td></td>
              <td>رصيد العميل الحالي</td>
              <td>
                <b>{{supplier.balance | toAR}}</b>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      </section>
      <h3 class="m-3">سجل فواتير العميل </h3>
        <table class="table table-striped pr-me">
          <thead>
            <tr>
              <th>م </th>
              <th>صافي الفاتورة</th>
              <th>عدد الطرود</th>
              <th>الاصناف</th>
              <th>التاريخ</th>
              <th>حالة الفاتورة</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(receipt, idx) in supplier_receipts" :key='idx'>
              <th>{{idx +1 | toAR }}</th>
              <td>
                {{receipt.net_value | round2 | toAR}}
              </td>
              <td>{{receipt.total_count | toAR}}</td>
              <td>{{receipt.products_arr | productsFilter }}</td>
              <td>{{receipt.day | arDate}}</td>
              <td>
                <span v-if="receipt.recp_paid == 1">رصد</span>
                <span v-if="receipt.recp_paid == 2">صرف</span>
              </td>
              <td> 
                <button class="btn text-danger" @click="removeRecpItself(receipt.id)" >
                  <span class="fa fa-archive "></span> 
                  <template v-if="! confirm_step_recp[receipt.id]"> حذف الفاتورة</template>
                  <template v-if="confirm_step_recp[receipt.id]"> تأكيد </template>
                </button>
              </td>

            </tr>
          </tbody>
        </table>
<div class="m-3">اجمالي فواتير الرصد فقط = <b>{{supp_recps_sums.total_rasd | round2 | toAR}}</b> </div>
        <div class="text-center">
          <button class="btn btn-printo pr-hideme" @click="vue_window.print()">
            <span class="fa fa-print"></span> طباعة 
          </button>
        </div>

  </section>
</template>

<script>
import { Settings, DateTime } from 'luxon'
import { SupplierDAO, SuppliersCtrl, SupplierTransDAO } from '../ctrls/SuppliersCtrl'
import { ReceiptsCtrl, ReceiptDAO } from '../ctrls/ReceiptsCtrl'
import { TransTypesCtrl } from '../ctrls/TransTypesCtrl';
import { CashflowDAO, CashflowCtrl } from '../ctrls/CashflowCtrl';

Settings.defaultLocale = 'ar'
Settings.defaultZoneName = 'UTC'

export default {
  name: 'supllier-details',
  data(){
    return {
      supplier: new SupplierDAO(SupplierDAO.INIT_DAO),
      supplier_trans: [],
      supplier_receipts: [],
      supplier_id: this.$route.params.id,
      store_day: this.$store.state.day,
      confirm_step_recp: [],
      suppliersCtrl: new SuppliersCtrl(),
      trans_form: {trans_type: 'supp_payment'},
    }
  },
  methods: {
    async refresh_all(){
      let {dao, trans} = await this.suppliersCtrl.getSupplierDetails(this.supplier_id)
      console.log(trans)
      this.supplier = dao
      this.supplier_trans = trans
      this.supplier_receipts = await new ReceiptsCtrl().findAll({supplier_id: this.supplier.id})
    },
    async addPayments(evt){
      evt.preventDefault()

      if(this.trans_form.day) {
        this.trans_form.day = DateTime.fromISO(this.trans_form.day).toISODate()
      }
      else {
        this.trans_form.day = this.store_day.iso
      }
      let transTypesCtrl = new TransTypesCtrl()
      let selectedTrans = await transTypesCtrl.findOne({name: this.trans_form.trans_type , category: 'supplier_trans'})
      console.log(selectedTrans)
      if(selectedTrans) {
        let cashflow_id = null
        if(selectedTrans.map_cashflow){
          // Create cashflow with trans
          let cashflowTrans = await transTypesCtrl.findOne({name: selectedTrans.map_cashflow , category: 'cashflow'})

          let newCashflow = new CashflowDAO({
            amount: this.trans_form.amount,
            day: this.trans_form.day,
            supplier_id: this.supplier_id,
          })

          newCashflow.transType = cashflowTrans
          cashflow_id = await new CashflowCtrl().save(newCashflow)
        }

        let suppTransDAO = new SupplierTransDAO(this.trans_form)
        suppTransDAO.supplier_id = this.supplier_id
        suppTransDAO.cashflow_id = cashflow_id
        suppTransDAO.transType = selectedTrans
        await this.suppliersCtrl.updateBalanceByTrans(suppTransDAO)
      }
      /*
      if(this.trans_form.sum === '+' ) {
        this.trans_form.amount = parseFloat(this.trans_form.amount)
        let cashflowDAO = new CashflowDAO(CashflowDAO.SUPP_COLLECT_DAO)
        cashflowDAO.amount = this.trans_form.amount
        cashflowDAO.day = this.store_day.iso
        this.trans_form.day = this.store_day.iso
        cashflowDAO.actor_id = this.supplier.id
        cashflowDAO.actor_name = this.supplier.name

        this.trans_form.cashflow_id = await CashflowDB.addNew(cashflowDAO)
      }
      else if ( this.trans_form.sum === '--') {

        let cashflowDAO = new CashflowDAO(CashflowDAO.SUPP_PAY_DAO)
        cashflowDAO.amount = parseFloat( this.trans_form.amount )
        this.trans_form.amount = - parseFloat(this.trans_form.amount)
        cashflowDAO.day = this.store_day.iso
        this.trans_form.day = this.store_day.iso
        cashflowDAO.actor_id = this.supplier.id
        cashflowDAO.actor_name = this.supplier.name

        this.trans_form.cashflow_id = await CashflowDB.addNew(cashflowDAO)
      }
      else if ( this.trans_form.sum === '-r') {
        
        let cashflowDAO = new CashflowDAO(CashflowDAO.OUT_RECEIPT_DAO)
        cashflowDAO.amount = parseFloat( this.trans_form.amount )
        this.trans_form.amount = - parseFloat(this.trans_form.amount)
        cashflowDAO.day = this.store_day.iso
        this.trans_form.day = this.store_day.iso
        cashflowDAO.actor_id = this.supplier.id
        cashflowDAO.actor_name = this.supplier.name

        this.trans_form.cashflow_id = await CashflowDB.addNew(cashflowDAO)
      }
      else if (this.trans_form.sum === 'supp_pre_recp') {
        console.log(this.trans_form)
        let recp = new ReceiptDAO()
        recp.day = this.trans_form.day
        recp.total_count = parseInt(this.trans_form.count)
        recp.products_arr = this.trans_form.products
        recp.net_value = this.trans_form.amount
        recp.supplier_id = this.supplier.id
        recp.supplier_name = this.supplier.name
        recp.recp_paid = 1
        // await ReceiptsDB.addNew(recp)
      }
      else {
        this.trans_form.amount = parseFloat(this.trans_form.amount)
      }
      */

      if(this.trans_form.trans_type !== 'supp_pre_recp' ) {
        //await SuppliersDB.updateBalance(this.supplier_id, this.trans_form)
      }
        
      if (this.trans_form.trans_type == 'supp_pre_recp') {
        let recp = new ReceiptDAO({
          day: this.trans_form.day,
          total_count: parseInt(this.trans_form.count),
          products_arr: this.trans_form.products,
          net_value: this.trans_form.amount,
          supplier_id: this.supplier_id,
          recp_paid: 1
        })
        console.log()
        await new ReceiptsCtrl().save(recp)
      }
      
      this.trans_form = {}
      this.$root.$emit('bv::toggle::collapse', 'collapse_pay')
      this.refresh_all()
    },
  },
  mounted() {
    this.refresh_all()
  },
  computed: {
    supp_recps_sums: function() {
      let supp_recps_sums = {total_rasd: 0 }
      this.supplier_receipts.forEach(item =>{
        if(item.recp_paid == 1)
          supp_recps_sums.total_rasd += parseFloat(item.net_value)
      })
      // this.receipt.sale_value = sum
      return supp_recps_sums
    },
    valid_payments_form: function() {

      if(this.trans_form.trans_type && this.trans_form.amount && parseFloat(this.trans_form.amount)) {
        if(this.trans_form.trans_type == 'supp_pre_payment' && ! this.trans_form.day)
          return false
        else 
          return true
      }
      return false

    }
  }
}
</script>
