<template>
  <section class="suppliers row">
    <div class="col-5 d-print-none ">
    <br/>
<button v-b-toggle.collapse_form class="btn btn-primary mr-3">
  ادخال عميل جديد 
  &nbsp; <span class="fa fa-address-book"></span>
</button>


  <!-- Element to collapse -->
  <b-collapse id="collapse_form" style="padding:25px;">
    <div class="entry-form">
    <form  @submit="saveSupplier">
      <div class="form-group row">
        <label for="exampleInputEmail1" class="col-sm-2">اسم العميل</label>
        <div class="col-sm-10">
          <input v-model="supplier_form.name" class="form-control " id="exampleInputEmail1" placeholder="ادخل اسم العميل">
        </div>
      </div>

      <div class="form-group row">
        <label  class="col-sm-2">رقم التليفون</label>
        <div class="col-sm-10">
          <input v-model="supplier_form.phone" class="form-control"  placeholder="رقم التليفون" >
        </div>
      </div>

      <div class="form-group row">
        <label  class="col-sm-2">العنوان </label>
        <div class="col-sm-10">
          <input v-model="supplier_form.address" class="form-control"  placeholder="ادخل عنوان العميل" >
        </div>
      </div>

      <div class="form-group row">
        <label for="notes1" class="col-sm-2">ملاحظات</label>
        <div class="col-sm-10">
          <input v-model="supplier_form.notes" class="form-control " id="notes1"  placeholder="ادخال الملاحظات">
        </div>
      </div>

      <button type="submit" class="btn btn-success">
        <template v-if="! supplier_form.id"> اضافة</template>
        <template v-if="supplier_form.id"> حفظ </template>
      </button>
    </form>
    </div>
  </b-collapse>
  </div>

  <div class="col-7 col-print-10 pr-me">

    <div class="m-1">
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
      <input v-model="search_term" class="form-control "  :placeholder="custom_labels['search_suppliers']">
    </div>
    <br/>
  <h2 :class="{ 'text-danger': ! show_active }">
      <span v-if="show_active"> {{custom_labels['list']}} </span>
      <span v-if="! show_active"> {{custom_labels['archive']}} </span>
     {{custom_labels['suppliers']}} 
  </h2>
      <div class="table-responsive">
        <table class="table table-striped table-sm ">
          <thead>
            <tr>
              <th> الكود </th>
              <th>الاسم</th>
              <th>رقم التليفون </th>
              <th>الرصيد الحالي</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in comp_suppliers_arr" :key='idx' >
              <td>{{item.id}}</td>
              <td>
                <router-link class="nav-link " :to="{name:'supplier_details', params: {id: item.id}}">
                  {{item.name}}
                </router-link>
               </td>
              <td>{{item.phone}}</td>
              <td>{{item.sum_debt | toAR}}</td>
              <td class="d-print-none">
                <button class="btn text-danger" @click="archive(item.id)"  v-if="! item.deleted_at">
                  <span class="fa fa-archive "></span> 
                  <template v-if="! confirm_step[item.id]"> أرشفة</template>
                  <template v-if="confirm_step[item.id]"> تأكيد </template>
                </button>
                <button class="btn text-success" @click="archive(item.id, 'RESTORE')" v-if="item.deleted_at">
                  <span class="fa fa-undo "></span> 
                  <template v-if="! confirm_step[item.id]"> استرجاع</template>
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
          <button class="btn btn-printo pr-hideme" @click="vue_window.print()">
            <span class="fa fa-print"></span> طباعة
          </button>
  </div>
  </section>
</template>
<script >
import { SupplierDAO , SuppliersCtrl } from '../ctrls/SuppliersCtrl'

export default {
  name: 'suppliers',
  data () {
    return {
      supplier_form: new SupplierDAO(SupplierDAO.INIT_DAO),
      suppliersCtrl: new SuppliersCtrl(),
      suppliers_arr: [],
      search_term: '',
      show_active: true,
      confirm_step: [],
      form_collabsed: true,
      custom_labels: this.$store.state.custom_labels,
    }
  },
  methods: {
    async saveSupplier(evt) {
      evt.preventDefault()
      console.log(this.supplier_form)
      try {
        await this.suppliersCtrl.save(this.supplier_form)
      } catch (error) {
        console.error(error)
        this.$bvToast.show('example-toast')
        return
      }
      
      this.supplier_form = new SupplierDAO(SupplierDAO.INIT_DAO)
      this.refresh_all()
    },
    async edit(id) {
      let filtered_arr = this.suppliers_arr.filter( element =>{
        return element.id == id
      })
      this.supplier_form = new SupplierDAO(filtered_arr[0])
      // Show form only if collabsed
      if(this.form_collabsed) {
        this.$root.$emit('bv::toggle::collapse', 'collapse_form')
      }
    },
    async archive(id, restore = 'ARCHIVE') {
      if( this.confirm_step[id] ) {
        if(restore === 'RESTORE')
          await this.suppliersCtrl.resotreById(id)
        else
          await this.suppliersCtrl.deleteById(id)
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
      this.suppliers_arr = await this.suppliersCtrl.findAll({},{softDelete: soft_delete})
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
    comp_suppliers_arr: function () {
      return this.suppliers_arr.filter( item => {
        return ((item.deleted_at == null) === this.show_active  && item.name.includes(this.search_term))
      })
    }
  },
  components: {
  },
  watch:{
    'supplier_form.name': function(val){
      this.search_term = val
    }
  }
}
</script>