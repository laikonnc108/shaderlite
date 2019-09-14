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
          <span class="fa fa-cash-register"></span>   &nbsp;   كشف مبيعات اليوم
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
<h4 class="text-center"> كشف حساب </h4>
<h4>
  تحريراً في {{outg_day | arDate }}
</h4>
<h4>
  <span style="font-size: .6em;">المطلوب من السيد/ </span> 
  <span style="font-size: 1.1em;">{{customer.name}}</span>
</h4>
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
            <td>{{ item.amount | toAR(true) }}</td>
            <td> {{ item.count | toAR }}</td>
            <td> {{ item.weight | toAR }}</td>
            <td> {{ item.kg_price | toAR(true) }}</td>
            <td>{{item.product_name}} </td>
            <td >
              <b v-if="shader_configs['pay_arboon'] && item.notes">
                عربون : 
              </b>
              {{item.notes }}
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
          <button class="btn btn-primary pr-hideme" @click="$bvModal.hide('modal-daily');refresh_all()" >
            <span class="fa fa-check "></span> &nbsp;
            موافق
          </button>
          &nbsp;
          <button class="btn btn-printo pr-hideme" 
            @click="print_co();print_done(outg_day, customer.id);">
            <span class="fa fa-print"></span> طباعة
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
import { CustomersCtrl } from '../ctrls/CustomersCtrl';

export default {
  name: 'accounts',
  data () {
    return {
      unique_daily_customers: [],
      printed_all: {},
      outg_day: {},
      daily_out_trans: [],
      customer: {}
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
      this.customer = await new CustomersCtrl().findOne(customer_id)
      this.outg_day = this.day.iso
      this.daily_out_trans = await new CustomersCtrl().getDailyOutTrans({id: customer_id, day: this.outg_day})
      this.$bvModal.show('modal-daily')
    },
    async print_done(outg_day, customer_id){
      try {
        await knex.raw(`insert into customers_daily (customer_id, day, printed) values( ${customer_id} , '${outg_day}', 1)`)
      } catch (error) {
        
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

