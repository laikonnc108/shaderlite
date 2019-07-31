<template>
  <section class="customers row">
        <div class="col-5 d-print-none">
    <br/>
<button @click="fresh_form" class="btn btn-primary m-1" v-if="form_collabsed">
  {{custom_labels['add_new_customer']}}
  &nbsp; <span class="fa fa-address-book"></span>
</button>
  <!-- Element to collapse -->
  <b-collapse id="collapse_form" style="padding:25px;">
    <div class="entry-form">
    <form  @submit="saveCustomer">

    <b-toast id="example-toast" title="حدث خطأ" static auto-hide-delay=2000 class="text-danger">
      {{'تم ادخال بائع بنفس الاسم'}}
    </b-toast>

      <div class="form-group row">
        <label class="col-sm-2">اسم البائع</label>
        <div class="col-sm-10">
          <input v-model="customer_form.name" class="form-control " placeholder="ادخل اسم البائع">
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2">تليفون</label>
        <div class="col-sm-10">
          <input v-model="customer_form.phone" class="form-control "  placeholder="التليفون">
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2">عنوان</label>
        <div class="col-sm-10">
          <input v-model="customer_form.address" class="form-control "  placeholder="ادخال العنوان">
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2">مبلغ المديونية</label>
        <div class="col-sm-10">
          <input v-model="customer_form.debt" :disabled="edit_id > 0"
          class="form-control"  placeholder="ادخل المبلغ">
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2">ملاحظات</label>
        <div class="col-sm-10">
          <input v-model="customer_form.notes" class="form-control "  placeholder="ادخال الملاحظات">
        </div>
      </div>
      <p class="text-danger" v-if="! edit_id"> سيتم اضافة البياع بمبلغ مديونية يساوي 
        <template v-if="! customer_form.debt"> 0 </template>
        <template v-if="customer_form.debt"> {{customer_form.debt}} </template>
         جنيه</p>

      <button type="submit" class="btn btn-success" :disabled="! valid_form">
        <template v-if="! edit_id"> اضافة</template>
        <template v-if="edit_id"> حفظ </template>
      </button>
      &nbsp;
      <button type="button" @click="fresh_form" class="btn btn-danger"> اغلاق </button>
    </form>
    </div>
  </b-collapse>
  </div>
  <div class="col-7 col-print-12 pr-me">
    
    <div class="m-1">
      <br/>
      <button  class="btn btn-danger " @click="show_active=false" v-if="show_active">
      عرض الارشيف
      &nbsp; <span class="fa fa-archive"></span>
    </button>
    <button  class="btn btn-success " @click="show_active=true" v-if="! show_active">
      اغلاق الارشيف   &nbsp; <span class="fa fa-external-link-square-alt"></span>
    </button>
    </div>
    <div class="pr-hideme" >
      <br>
      <input v-model="search_term" class="form-control "  :placeholder="custom_labels['search_customers']">
    </div>
    <br/>
  <h2 :class="{ 'text-danger': ! show_active }">
    <span v-if="show_active"> {{custom_labels['list']}} </span>
    <span v-if="! show_active"> {{custom_labels['archive']}} </span>
    {{custom_labels['customers']}}
  </h2>
      <div class="table-responsive">
        <table class="table table-striped table-sm">
          <thead>
            <tr>
              <th> كود </th>
              <th>اسم</th>
              <th v-if="! zm_mode" >التليفون</th>
              <th>مديونية</th>
              <th v-if=" zm_mode" width="25%">تحصيل</th>
              <th>ملاحظات</th>
              
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in comp_customers_arr" :key='idx' >
              <td>{{item.id}}</td>
              <td>
                <router-link class="nav-link" :to="{name:'customer_details', params: {id: item.id}}">
                {{item.name}}
                </router-link>
              </td>
              <td v-if="! zm_mode"  >{{item.phone}}</td>
              <td>{{item.debt | toAR }}</td>
              <td v-if=" zm_mode" >
                <span class="collect-box "></span>
              </td>
              <td>{{item.notes}}</td>

              <td v-if="! zm_mode" class="d-print-none">
                <button class="btn text-danger" @click="archive(item.id)" v-if="! item.deleted_at">
                  <span class="fa fa-archive "></span> 
                  <template v-if="! confirm_step[item.id]"> أرشفة</template>
                  <template v-if="confirm_step[item.id]"> تأكيد </template>
                </button>
                <button class="btn text-success" @click="archive(item.id, 'RESTORE')" v-if="item.deleted_at">
                  <span class="fa fa-undo "></span> 
                  <template v-if="! confirm_step[item.id]"> استرجاع</template>
                  <template v-if="confirm_step[item.id]"> تأكيد </template>
                </button>
                <button class="btn text-primary" @click="edit(item.id)" v-if="! item.deleted_at">
                  تعديل
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script >
import { CustomerDAO, CustomersCtrl} from '../ctrls/CustomersCtrl'
import { moment } from '../main'

export default {
  name: 'customers',
  data () {
    return {
      customer_form: new CustomerDAO(CustomerDAO.INIT_DAO),
      customersCtrl: new CustomersCtrl(),
      customers_arr: [],
      edit_id: 0,
      show_active: true,
      confirm_step: [],
      form_collabsed: true,
      zm_mode: false,
      search_term: '',
      custom_labels: this.$store.state.custom_labels,
      now_day: moment().format('LL'),
      now_hour: moment().format('hh:mm a')
    }
  },

  methods: {
    async refresh_all() {
      this.customers_arr = await this.customersCtrl.findAll()
    },
    fresh_form(){
      this.customer_form = new CustomerDAO(CustomerDAO.INIT_DAO)
      this.$root.$emit('bv::toggle::collapse', 'collapse_form')
    },
    async saveCustomer(evt) {
      evt.preventDefault()
      try {
        await this.customersCtrl.create(this.customer_form)
      } catch (error) {
        console.log(error.message)
        this.$bvToast.show('example-toast')
        return
      }
      
      this.customer_form = new CustomerDAO(CustomerDAO.INIT_DAO)
      this.refresh_all()
    },
    async edit(id) {
      this.edit_id = id
      let edit_customer_obj = this.customers_arr.filter( element =>{
        return element.id == id
      })
      this.customer_form = new CustomerDAO(edit_customer_obj[0])
      // Show form only if collabsed
      if(this.form_collabsed) {
        this.$root.$emit('bv::toggle::collapse', 'collapse_form')
      }
    },
    async archive(id, restore = 'ARCHIVE') {
      if( this.confirm_step[id] ) {
        if(restore === 'RESTORE')
          await this.customersCtrl.resotreById(id)
        else
          await this.customersCtrl.deleteById(id)
        this.confirm_step = []
        this.refresh_all()
      }
      else {
        this.confirm_step = []
        this.confirm_step[id] = true
      }
    },
  },
  async mounted() {
    // Listening to collapses state changes 
    this.$root.$on('bv::collapse::state', (collapseId, show) => {
      if(collapseId == 'collapse_form') this.form_collabsed = ! show
    })
    this.refresh_all()
  },
  computed: {
    comp_customers_arr: function () {
      return this.customers_arr.filter( item => {
        return ((item.deleted_at == null) === this.show_active  && item.name.includes(this.search_term))
      })
    },
    valid_form: function() {
      return this.customer_form.name
    },
  },
  components: {
  }
}
</script>
