<template>
<div class="incomings home row">
  <IncomingResalahForm class="col-6 bg-incoming minh90 d-print-none"
  @saved="refresh_all"
  v-if="! flags.detailed">
  </IncomingResalahForm>
  <div class="col-6 p-4 col-print-10 pr-me" >
  <br/>
  <b-alert :show="discard_success === false">
      لا يمكن حذف هذا الوارد 
      <b class="text-danger float-left " @click="discard_success = null">اغلاق x</b>
  </b-alert> 

  <h2>وارد اليوم {{store_day.arab}}</h2>
      <div class="table-responsive">
        <table class="table table-striped table-sm">
          <thead>
            <tr>
              <th>#</th>
              <th>العميل</th>
              <th>الصنف</th>
              <th>عدد الطرود</th>
              <th v-if="flags.detailed"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(incom, idx) in incomings_arr" :key='idx'>
              <td>{{incom.id}}</td>
              <td>{{incom.supplier_name}}</td>
              <td>{{incom.product_name}}</td>
              <td>{{incom.count}}</td>
              <td v-if="flags.detailed" class="d-print-none">
                <button class="btn text-danger" @click="discard(incom.id)" >
                  <span class="fa fa-archive "></span> 
                  <template v-if="! confirm_step[incom.id]"> حذف الوارد</template>
                  <template v-if="confirm_step[incom.id]"> تأكيد </template>
                </button>
              </td>
            </tr>
            <tr>
              <td></td>
              <th>المجموع</th>
              <td></td>
              
              <th>{{inc_sums.c_total_count}}</th>
            </tr>
          </tbody>
        </table>
        <button class="btn btn-primary pr-hideme" v-if="flags.detailed === false" @click="flags.detailed = true"> عرض التفاصيل </button>
        
        <button class="btn btn-printo pr-hideme"  v-if="flags.detailed" 
        @click="clipboard.writeText('وارد اليوم '+ store_day.iso);vue_window.print()">
          <span class="fa fa-print"></span> طباعة
        </button>
      </div> 
  </div>

</div>
</template>
<script>
import IncomingResalahForm from '@/components/IncomingResalahForm.vue'
import { IncomingsCtrl, IncomingDAO } from '../ctrls/IncomingsCtrl'

export default {
  name: 'incomings',
  data() {
    return {
      incomings_arr: [],
      store_day: this.$store.state.day,
      active_suppliers: [],
      incomingsCtrl: new IncomingsCtrl(),
      active_products: [],
      confirm_step: [],
      discard_success: null,
      flags:{detailed: false},
      incoming_form: new IncomingDAO(IncomingDAO.INIT_DAO) // set defaults 
    }
  },
  methods: {
    async refresh_all() {
      this.incoming_form.day = this.store_day.iso
      this.incomings_arr = await this.incomingsCtrl.findAll({day: this.store_day.iso})
    },
    async discard(id) {
      if( this.confirm_step[id] ) {
        // Discard Incoming
        this.discard_success = await this.incomingsCtrl.removeIncoming(id)
        this.confirm_step = []
        this.refresh_all()
      }
      else {
        this.confirm_step = []
        this.confirm_step[id] = true
      }
    }
  },
  async mounted() {
    this.refresh_all()
  },
  computed: {
    inc_sums: function() {
      let inc_sums ={c_total_count:0 , c_total_nolons: 0}
      this.incomings_arr.forEach( item => {
        inc_sums.c_total_count += item.count
      })
      return inc_sums
    }
  },
  components: {
    IncomingResalahForm
  }
}
</script>