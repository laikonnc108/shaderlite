<template>
<div class="incomings home row">
  
  <IncomingResalahForm class="col-6 bg-incoming minh90 d-print-none"
  @saved="refresh_all"
  v-if="! flags.detailed">
  </IncomingResalahForm>

  <div class=" p-4 col-print-10 pr-me" :class="{ 'col-6': ! flags.detailed , 'col-11':  flags.detailed }" >

    <div class="pr-hideme">
      <h3 class="text-danger fa fa-eraser larger"
      @click="search_term = ''" v-if="search_term"></h3>
      <input v-model="search_term" class="form-control" :placeholder="custom_labels['search_incomings']">
    </div>
    
  <br/>
  <b-alert :show="discard_success === false">
      لا يمكن حذف هذا الوارد 
      <b class="text-danger float-left " @click="discard_success = null">اغلاق x</b>
  </b-alert> 

  <h2>وارد اليوم {{day.arab}}</h2>
      <div class="table-responsive">
        <table class="table table-striped table-sm">
          <thead>
            <tr>
              <th>#</th>
              <th>العميل</th>
              <th>الصنف</th>
              <th>عدد الطرود</th>
              <th v-if="flags.detailed">نولون </th>
              <th v-if="flags.detailed">
                {{'given' | tr_label}}
              </th>
              <th v-if="flags.detailed"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(incom, idx) in fltrd_incomings_arr" :key='idx'>
              <td>{{incom.id}}</td>
              <td>
                <router-link v-if="incom.supplier_name" :to="{name:'supplier_details', params: {id: incom.supplier_id}}" >
                  {{incom.supplier_name}}
                </router-link>
              </td>
              <td>{{incom.product_name}}</td>
              <td>{{incom.count}}</td>
              <td v-if="flags.detailed">{{incom.nolon}}</td>
              <td v-if="flags.detailed">{{incom.given}}</td>
              <td v-if="flags.detailed" class="d-print-none">
                <button class="btn text-danger" @click="discard(incom.id)" >
                  <span class="fa fa-archive "></span> 
                  <template v-if="! confirm_step[incom.id]"> حذف </template>
                  <template v-if="confirm_step[incom.id]"> تأكيد </template>
                </button>
              </td>
            </tr>
            <tr v-if="! search_term">
              <td></td>
              <th>المجموع</th>
              <td></td>
              
              <th>{{inc_sums.c_total_count}}</th>
            </tr>
          </tbody>
        </table>

        <button class="btn btn-primary pr-hideme" v-if="flags.detailed === false" @click="flags.detailed= true"> عرض التفاصيل </button>
        
        <button class="btn btn-printo pr-hideme"  @click="print_co">
          <span class="fa fa-print"></span> طباعة
        </button>

         &nbsp;
        <button class="btn btn-primary pr-hideme" v-if="flags.detailed !== false" @click="flags.detailed= false"> العودة للوارد </button>
      </div> 
  </div>

</div>
</template>
<script>
import IncomingResalahForm from '@/components/IncomingResalahForm.vue'
import { IncomingsCtrl, IncomingDAO } from '../ctrls/IncomingsCtrl'
import { MainMixin } from '../mixins/MainMixin'

export default {
  name: 'incomings',
  data() {
    return {
      incomings_arr: [],
      active_suppliers: [],
      incomingsCtrl: new IncomingsCtrl(),
      active_products: [],
      confirm_step: [],
      discard_success: null,
      flags:{detailed: false},
      incoming_form: new IncomingDAO(IncomingDAO.INIT_DAO) // set defaults 
    }
  },
  mixins:[MainMixin],
  methods: {
    async refresh_all() {
      this.incoming_form.day = this.day.iso
      this.incomings_arr = await this.incomingsCtrl.findAll({day: this.day.iso})
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
    },
    fltrd_incomings_arr: function () {
      return this.incomings_arr.filter( item => {
        return (item.supplier_name.includes(this.search_term) || item.product_name.includes(this.search_term))
      })
    },
  },
  components: {
    IncomingResalahForm
  }
}
</script>
