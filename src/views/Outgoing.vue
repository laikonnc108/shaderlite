<template>
  <div class="out row ">
    <div class="col-5 bg-outgoing minh90 d-print-none" v-if="detailed === false">
    <br/>
    <!-- <img alt="Vue logo" src="../assets/logo.png"> 
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    
<ul class="nav nav-tabs">
  <li class="nav-item">
    <router-link class="nav-link" to="/">وارد اليوم</router-link>
  </li>
  <li class="nav-item">
    <a class="nav-link active" href="#">صادر اليوم</a>
  </li>
  <li class="nav-item">
    <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
  </li>

</ul>
-->

<div class="p-2" v-show="! selected_inc || ! selected_inc.product_id">
<button v-for="(incom, idx) in avilable_incomings" :key="idx" 
v-b-toggle.collapse2 
@click="selected_inc= incom"
class="btn btn-lg  m-1 btn-block" 
:class="{'btn-primary': incom.day === store_day.iso, 'btn-danger': incom.day !== store_day.iso}">
  <span class="fa fa-shopping-cart"></span> &nbsp; 
  {{incom.product_name}} - 
  زرع <b> {{incom.supplier_name}} </b> 
  <br/>
  متبقي ({{incom.diff}}) 
  <span v-if="incom.day !== store_day.iso"> -
وارد {{incom.day | arDate }}
  </span>
  
</button>
</div>


<div class="p-4" v-if="selected_inc && selected_inc.product_id">
  <h4 :class="{ 'text-danger':  outgoing_form.count > selected_inc.diff}">
    بيع {{outgoing_form.count}} من
      {{selected_inc.product_name}} - 
  زرع <b> {{selected_inc.supplier_name}} </b> - 
  متبقي ({{selected_inc.diff}}) 

  </h4>
    <form  @submit="saveOutgoing">
  <div class="form-group row">
    <label class="col-sm-2">التاريخ</label>
    <div class="col-sm-10">
      <input v-model="outgoing_form.day" class="form-control" disabled>
    </div>
  </div>

  <div class="form-group row">
    <label :class="{ 'text-danger':  outgoing_form.count > selected_inc.diff}" class="col-sm-2">عدد</label>
    <div class="col-sm-10">
      <input v-model="outgoing_form.count" class="form-control">
    </div>
  </div>

  <div class="form-group row">
    <label :class="{ 'text-danger':  outgoing_form.sell_comm > 10 }" class="col-sm-2">
      قيمة البياعة
    </label>
    <div class="col-sm-10">
      <input v-model="outgoing_form.sell_comm" class="form-control" placeholder="ادخل القيمة">
    </div>
  </div>

  <div class="form-group row">
    <label class="col-sm-2">وزن</label>
    <div class="col-sm-10">
      <input v-model="outgoing_form.weight" class="form-control" placeholder="ادخل القيمة">
    </div>
  </div>

  <div class="form-group row">
    <label :class="{ 'text-danger':  outgoing_form.kg_price > 99 }" class="col-sm-2">سعر الكيلو</label>
    <div class="col-sm-10">
      <input v-model="outgoing_form.kg_price" class="form-control" placeholder="ادخل القيمة">
    </div>
  </div>

<hr/>

  <div class="form-group row">
    <label  class="col-sm-2">الاجمالي</label>
    <div class="col-sm-10" >
      <button class="btn btn-success" type="button" v-if="false && ! outgoing_form.value_calc && valid_form " @click="outgoing_form.value_calc=true"> حساب الاجمالي </button>
      <div v-if="value_calc && valid_form">
        <span style="float: right"> {{value_calc_text}} &nbsp; = </span>
        <b style="float: right"> {{value_calc}} </b> &nbsp; جنيه
      </div>
    </div>
  </div>

  <div class="form-group row">
    <label for="notes1" class="col-sm-2">اسم البياع</label>
    <div class="col-sm-10">
      <select v-model="outgoing_form.customer_id" class="form-control"  >
        <option value="">كاش</option>
      <option v-for="(customer, idx) in active_customers" :key='idx' :value="customer.id">
        {{customer.name}}
      </option>
    </select>
    </div>
  </div>

  <div class="form-group row" v-if="outgoing_form.customer_select && outgoing_form.customer_select.id">
    <label  class="col-sm-2">تحصيل جزء</label>
    <div class="col-sm-10">
      <input v-model="outgoing_form.collecting" class="form-control" placeholder="ادخل قيمة التحصيل">
    </div>
  </div>
  
  <div class="form-group row">
    <label for="notes1" class="col-sm-2">ملاحظات</label>
    <div class="col-sm-10">
      <input v-model="outgoing_form.notes" class="form-control" id="notes1"  placeholder="ادخال الملاحظات">
    </div>
  </div>
  
  <button type="submit" class="btn btn-success" :disabled="! valid_form">اضافة</button> 
  &nbsp;&nbsp;
  <button class="btn btn-danger" type="button" @click="refresh_all"> الغاء </button>
</form>

</div>

</div>
<!-- conditional class col-6 -->
<div class="p-3 col-print-12 pr-me" :class="{ 'col-7': ! detailed , 'col-10':  detailed }">

  <div class="m-3  ">
  <h2>بيع اليوم {{store_day.arab}}</h2>
      <div class="table-responsive">
        <table class="table table-striped table-sm pr-me">
          <thead>
            <tr>
              <th>#</th>

              <th>زرع العميل</th>
              <th>عدد</th>
              <th>الصنف</th>
              <th v-if="detailed ">وارد يوم</th>
              <th>اسم البياع</th>
              
              <th v-if="detailed ">بياعة </th>
              <th v-if="detailed ">مبلغ البياعة </th>
              
              <th >الوزن</th>
              <th>السعر</th>
              <th>المبلغ</th>
              <th v-if="detailed ">ملاحظات</th>
              <th v-if="detailed "></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in outgoings_arr" :key='idx'>
              <td>{{item.id}}</td>

              <td>{{item.supplier_name}}</td>
              <td>{{item.count }}</td>
              <td>{{item.product_name}}</td>
              <td v-if="detailed ">{{item.income_day | arDate}}</td>
              <td>{{item.customer_name}}</td>
              
              <td v-if="detailed ">{{item.sell_comm}}</td>
              <td v-if="detailed ">{{item.sell_comm * item.count}}</td>
              
              <td>{{item.weight}}</td>
              <td>{{item.kg_price}}</td>
              <td>{{item.value_calc}}</td>
              <td v-if="detailed ">{{item.notes}}</td>
              <td v-if="detailed" class="d-print-none">
                <button class="btn text-danger" @click="discard(item.id)" >
                  <span class="fa fa-archive "></span> 
                  <template v-if="! confirm_step[item.id]"> حذف المبيع</template>
                  <template v-if="confirm_step[item.id]"> تأكيد </template>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <button class="btn btn-primary pr-hideme" v-if="detailed === false" @click="show_details()"> عرض التفاصيل </button>
        
        <button class="btn btn-printo pr-hideme" v-if="detailed !== false" 
        @click="clipboard.writeText('بيع اليوم '+store_day.iso);vue_window.print()">
          <span class="fa fa-print"></span> طباعة
        </button>
        &nbsp;
        <button class="btn btn-primary pr-hideme" v-if="detailed !== false" @click="detailed= false"> العودة للبيع </button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { InoutHeadCtrl } from '../ctrls/InoutHeadCtrl'
import { OutgoingDAO, OutgoingsCtrl } from '../ctrls/OutgoingsCtrl'
import { CustomersCtrl } from '../ctrls/CustomersCtrl';

export default {
  name: 'outgoings',

  data() {
    return {
      outgoings_arr: [],
      active_customers: [],
      inoutHeadCtrl: new InoutHeadCtrl(),
      outgoingsCtrl: new OutgoingsCtrl(),
      customersCtrl: new CustomersCtrl(),
      store_day: this.$store.state.day,
      avilable_incomings: [],
      selected_inc: {},
      outgoing_form: new OutgoingDAO({ day: this.$store.state.day.iso, ...OutgoingDAO.INIT_DAO}),
      detailed: false,
      confirm_step: [],
      discard_success: false
    }
  },
  computed: {
    value_calc_text: function () {
      if(this.outgoing_form.count && 
      this.outgoing_form.sell_comm &&
      this.outgoing_form.weight &&
      this.outgoing_form.kg_price)
      return `(${this.outgoing_form.count} * ${this.outgoing_form.sell_comm}) + (${this.outgoing_form.weight} * ${this.outgoing_form.kg_price})`
    },
    value_calc: function () {
      if(this.outgoing_form.count && 
      this.outgoing_form.sell_comm &&
      this.outgoing_form.weight &&
      this.outgoing_form.kg_price) {
        // this.outgoing_form.parseTypes()
        // only parse count
        // this.outgoing_form.count = parseInt(this.outgoing_form.count)
        let sell_comm_value = this.outgoing_form.count * this.outgoing_form.sell_comm
        let weight = this.outgoing_form.weight 
        let kg_price = this.outgoing_form.kg_price

        return sell_comm_value + ( weight * kg_price)
      }
      else return false
    },
    valid_form: function () {
      return this.outgoing_form.count > 0 && this.outgoing_form.count <= this.selected_inc.diff &&
      this.outgoing_form.sell_comm > 0 && this.outgoing_form.sell_comm <= 10 &&
      this.outgoing_form.weight > 0 &&
      this.outgoing_form.kg_price > 0
    }
  },
  methods: {
    async saveOutgoing(evt){
      evt.preventDefault()
      this.outgoing_form.value_calc = this.value_calc
      this.outgoing_form.income_day = this.selected_inc.day
      this.outgoing_form.supplier_id = this.selected_inc.supplier_id
      this.outgoing_form.product_id = this.selected_inc.product_id
      this.outgoing_form.sell_comm_value = this.outgoing_form.count * this.outgoing_form.sell_comm
      await this.outgoingsCtrl.saveOutgoingData(this.outgoing_form)

      this.refresh_all()
    },
    async discard(id) {
      if( this.confirm_step[id] ) {
        this.discard_success = await this.outgoingsCtrl.deleteById(id)
        this.confirm_step = []

        this.refresh_all()
      }
      else {
        this.confirm_step = []
        this.confirm_step[id] = true
      }
    },
    show_details() {
      this.detailed = true
    },
    async refresh_all() {
      this.avilable_incomings = await this.inoutHeadCtrl.findAll({diff: '> 0', day: this.$store.state.day.iso})
      this.active_customers = await this.customersCtrl.findAll({},{softDelete: true})
      this.outgoings_arr = await this.outgoingsCtrl.findAll({day: this.store_day.iso})
      this.outgoing_form = new OutgoingDAO({ day: this.$store.state.day.iso, ...OutgoingDAO.INIT_DAO})
      this.selected_inc = {}
    }
  },
  async mounted() {
    this.refresh_all()
  }
}
</script>
