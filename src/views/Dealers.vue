<template>
  <section class="dealers row">
    <div class="col-5 d-print-none " v-if="! flags.detailed">
      <br/>
<button v-b-toggle.collapse_form class="btn btn-primary mr-3">
  ادخال تعامل جديد 
  &nbsp; <span class="fa fa-address-book"></span>
</button>

  <!-- Element to collapse -->
  <b-collapse id="collapse_form" style="padding:25px;">
    <div class="entry-form">
    <form  @submit="saveDealer">
      <div class="form-group row">
        <label for="exampleInputEmail1" class="col-sm-2">الاسم </label>
        <div class="col-sm-10">
          <input v-model="dealer_form.name" class="form-control " id="exampleInputEmail1" placeholder="ادخل اسم العميل">
        </div>
      </div>

      <div class="form-group row">
        <label  class="col-sm-2">تليفون</label>
        <div class="col-sm-10">
          <input v-model="dealer_form.phone" class="form-control"  placeholder="رقم التليفون" >
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2">رصيد</label>
        <div class="col-sm-10">
          <input v-model="dealer_form.balance" :disabled="dealer_form.id"
          class="form-control"  placeholder="ادخل المبلغ">
        </div>
      </div>

      <div class="form-group row">
        <label for="notes1" class="col-sm-2">ملاحظات</label>
        <div class="col-sm-10">
          <input v-model="dealer_form.notes" class="form-control " id="notes1"  placeholder="ادخال الملاحظات">
        </div>
      </div>

      <button type="submit" class="btn btn-success">
        <template v-if="! dealer_form.id"> اضافة</template>
        <template v-if="dealer_form.id"> حفظ </template>
      </button>
    </form>
    </div>
  </b-collapse>
  </div>

  <div class="col-print-10 pr-me p-2" :class="{ 'col-7': ! flags.detailed , 'col-10':  flags.detailed }">

    <div class="m-1 pr-hideme">
      <br/>
      <button  class="btn btn-danger " @click="show_active=false;refresh_all()" v-if="show_active">
      عرض الارشيف
      &nbsp; <span class="fa fa-archive"></span>
    </button>
    <button  class="btn btn-success " @click="show_active=true;refresh_all()" v-if="! show_active">
      اغلاق الارشيف   &nbsp; <span class="fa fa-external-link-square-alt"></span>
    </button>
    

    </div>
    <div class="pr-hideme" >
      <br>
      <input v-model="search_term" class="form-control "  :placeholder="custom_labels['search_dealers']">
    </div>
    <br/>
  <h2 :class="{ 'text-danger': ! show_active }">
      <span v-if="show_active"> {{custom_labels['list']}} </span>
      <span v-if="! show_active"> {{custom_labels['archive']}} </span>
      المعاملات
  </h2>
      <div class="table-responsive">
        <table class="table table-striped table-sm ">
          <thead>
            <tr>
              <td></td>
              <th> الكود </th>
              <th>الاسم</th>
              <th>رقم التليفون </th>
              <th>الرصيد الحالي</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in comp_dealers_arr" :key='idx' >
              <td><input class="pr-hideme" :id="item.id" :value="item.id" type="checkbox" v-model="checkedItems" /></td>
              <td>{{item.id}}</td>
              <td>
                <router-link class="nav-link " :to="{name:'dealer_details', params: {id: item.id}}">
                  {{item.name}}
                </router-link>
               </td>
              <td>{{item.phone}}</td>
              <td>{{item.sum_debt |  toAR}}</td>
              <td class="d-print-none">
                <button class="btn text-danger" @click="archive(item.id)"  v-if="flags.detailed && ! item.deleted_at">
                  <span class="fa fa-archive "></span> 
                  <template v-if="! confirm_step[item.id]"> أرشفة</template>
                  <template v-if="confirm_step[item.id]"> تأكيد </template>
                </button>
                <button class="btn text-success" @click="archive(item.id, 'RESTORE')" v-if="item.deleted_at">
                  <span class="fa fa-undo "></span> 
                  <template v-if="! confirm_step[item.id]"> استرجاع</template>
                  <template v-if="confirm_step[item.id]"> تأكيد </template>
                </button>
                <button class="btn text-danger" @click="archive(item.id, 'PERMANENT')" v-if="item.deleted_at">
                  <span class="fa fa-undo "></span> 
                  <template v-if="! confirm_step[item.id]"> حذف نهائي</template>
                  <template v-if="confirm_step[item.id]"> تأكيد </template>
                </button>
                <button class="btn text-primary" @click="edit(item.id)">
                  تعديل
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

        <button class="btn btn-primary pr-hideme" v-if="flags.detailed === false" @click="flags.detailed= true"> عرض التفاصيل </button>
        
        <button class="btn btn-printo pr-hideme mr-2"  @click="print_co">
          <span class="fa fa-print"></span> طباعة
        </button>

         &nbsp;
        <button class="btn btn-primary pr-hideme" v-if="flags.detailed !== false" @click="flags.detailed= false"> العودة للعملاء </button>


  </div>
  </section>
</template>
<script >
import { DealerDAO , DealersCtrl } from '../ctrls/DealersCtrl'
import { MainMixin } from '../mixins/MainMixin';

export default {
  name: 'dealers',
  data () {
    return {
      dealer_form: new DealerDAO(DealerDAO.INIT_DAO),
      dealersCtrl: new DealersCtrl(),
      dealers_arr: [],
      checkedItems: [],
      search_term: '',
      show_active: true,
      confirm_step: [],
      form_collabsed: true,
      flags: {detailed: false, show_sum_debt: false},
      sum_debt: 0,
    }
  },
  mixins: [MainMixin],
  methods: {
    async saveDealer(evt) {
      evt.preventDefault()
      try {
        await this.dealersCtrl.save(this.dealer_form)
      } catch (error) {
        console.error(error)
        this.$bvToast.show('example-toast')
        return
      }  
      this.dealer_form = new DealerDAO(DealerDAO.INIT_DAO)
      this.refresh_all()
    },
    setSelected() {
      this.dealers_arr = this.dealers_arr.filter(item => this.checkedItems.includes(item.id))
    },
    async edit(id) {
      let filtered_arr = this.dealers_arr.filter( element =>{
        return element.id == id
      })
      this.dealer_form = new DealerDAO(filtered_arr[0])

      // Show form only if collabsed
      if(this.form_collabsed) {
        this.$root.$emit('bv::toggle::collapse', 'collapse_form')
      }
    },
    async archive(id, restore = 'ARCHIVE') {
      if( this.confirm_step[id] ) {
        if(restore === 'RESTORE')
          await this.dealersCtrl.resotreById(id)
        else if (restore === 'PERMANENT'){
          await this.dealersCtrl.permenentDeleteById(id)
        }
        else
          await this.dealersCtrl.deleteById(id)
        this.confirm_step = []
        this.refresh_all()
      }
      else {
        this.confirm_step = []
        this.confirm_step[id] = true
      }
    },
    async refresh_all() {
      let soft_delete = this.show_active ? true : false;
      this.dealers_arr = await this.dealersCtrl.findAll({},{
        softDelete: soft_delete, 
        orderByBalance: true
      })
      let {sum_debt} = await this.dealersCtrl.sumDebt()
      this.sum_debt = sum_debt
    }
  },
  async mounted() {
    /// Listening to collapses state changes 
    this.$root.$on('bv::collapse::state', (collapseId, show) => {
      if(collapseId == 'collapse_form') this.form_collabsed = ! show
    })
    this.refresh_all()
  },
  computed: {
    comp_dealers_arr: function () {
      return this.dealers_arr.filter( item => {
        return ((item.deleted_at == null) === this.show_active  && item.name.includes(this.search_term))
      })
    }
  },
  components: {
  },
  watch:{
    'dealer_form.name': function(val){
      this.search_term = val
    }
  }
}
</script>