<template>
  <section class="accounts bg-accounts minh90 p-3">
    <h1>حسابات البائعين - معاملات اليوم</h1>
    
<router-link  v-for="(outgoing, idx) in unique_daily_customers"  :key="idx" 
:to="{name:'customer_details', params: {id: outgoing.customer_id}}"
class="btn btn-lg btn-primary m-1 btn-block">
  <span class="fa fa-cash-register"></span> &nbsp; 
  عرض حساب البياع - {{outgoing.customer_name}}
</router-link>

  </section>
</template>

<script >
// import { db } from '../main'
import { OutgoingsCtrl } from '../ctrls/OutgoingsCtrl'

export default {
  name: 'accounts',
  data () {
    return {
      unique_daily_customers: []
    }
  },
  methods: {
    async refresh_all () {
      let outgoingsCtrl = new OutgoingsCtrl()
      this.unique_daily_customers = await outgoingsCtrl.findDailyCustomers({day: this.$store.state.day.iso})
      console.log(this.unique_daily_customers)
    }
  },
  components: {
  },
  mounted() {
    this.refresh_all()
  }
}
</script>

<style scoped lang="scss">

</style>
