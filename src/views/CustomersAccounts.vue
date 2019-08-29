<template>
  <section class="accounts bg-accounts minh90 p-3">
    <div class="pr-hideme">
      <h3 class="text-danger fa fa-eraser larger"
      @click="search_term = ''" v-if="search_term"></h3>
      <input v-model="search_term" class="form-control" :placeholder="custom_labels['search_customers']">
      <br/>
    </div>

    <h1>حسابات البائعين - معاملات اليوم</h1>
    
<router-link  v-for="(outgoing, idx) in fltrd_unique_daily_customers"  :key="idx" 
:to="{name:'customer_details', params: {id: outgoing.customer_id}}"
class="btn btn-lg btn-primary m-1 btn-block">
  <span class="fa fa-cash-register"></span> &nbsp; 
  عرض حساب البياع - {{outgoing.customer_name}} 
  <span v-if="printed_all[outgoing.customer_id]">
    ( تمت طباعته )
  </span>
</router-link>

  </section>
</template>

<script >
import { OutgoingsCtrl } from '../ctrls/OutgoingsCtrl'
import { knex } from '../main';
import { MainMixin } from '../mixins/MainMixin';

export default {
  name: 'accounts',
  data () {
    return {
      unique_daily_customers: [],
      printed_all: {}
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
  },
  components: {
  },
  computed:{
    fltrd_unique_daily_customers: function () {
      return this.unique_daily_customers.filter( item => {
        return (item.customer_name.includes(this.search_term) )
      })
    }
  },
  mounted() {
    this.refresh_all()
  }
}
</script>

