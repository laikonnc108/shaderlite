<template>
  <section class="incoming-resalah-form">

  <form  @submit="saveIncomings" class="p-4">
    <div class="form-group row">
      <label class="col-sm-2">التاريخ</label>
      <div class="col-sm-10">
        <input v-model="incomings_data.day" class="form-control" disabled>
      </div>
    </div>

    <div class="form-group row">
      <label  class="col-sm-2">العميل</label>
      <div class="col-sm-10">
        <select v-model="incomings_data.supplier_id" class="form-control"  >
        <option v-for="(supplier, idx) in active_suppliers" :key='idx' :value='supplier.id'>
          {{supplier.name}}
        </option>
      </select>
      </div>
    </div>

    <div class="form-group row">
      <label class="col-sm-2">الاصناف</label>
      <div class="col-sm-10">
      </div>
    </div>

    <div class="form-group row">
      <div class="col-sm-2"></div>
      <div class="col-sm-10 ">
        <div class="row product_area p-3">
          <label class="col-sm-2">الصنف</label>
          <div class="col-sm-5">
            <select v-model="incomings_data.product_select" class="form-control" placeholder="اختار الصنف">
            <option v-for="(product, index) in $store.state.products_arr" :key='index' :value='index'>
              {{product}}
            </option>
          </select>
          </div>
          <div class="col-sm-5">
            <input v-model="incomings_data.count" class="form-control" placeholder=" العدد">
          </div>
        </div>
      </div>
    </div>

    <div class="form-group row">
      <label class="col-sm-2">نولون</label>
      <div class="col-sm-10">
        <input v-model="incomings_data.nolon" class="form-control">
      </div>
    </div>

    <div class="form-group row">
      <label class="col-sm-2">وهبة</label>
      <div class="col-sm-10">
        <input v-model="incomings_data.given" class="form-control">
      </div>
    </div>

    <button type="submit" class="btn btn-success" :disabled="! valid_form">حفظ</button>
    
  </form>
  </section>
</template>

<script >
import { SuppliersCtrl } from '../ctrls/SuppliersCtrl';

export default {
  name: 'IncomingResalahForm',
  data () {
    return {
      incomings_data: {day: '', supplier_id: 0, products_arr: [], nolon: 0, given: 0 },
      active_suppliers: [],
    }
  },
  methods: {
    async saveIncomings(evt){
      evt.preventDefault()
      this.refresh_all()
    },
    async refresh_all(){
      this.refresh_incomings_data()
    },
    refresh_incomings_data() {
      this.incomings_data.day = this.$store.state.day.iso
    }
  },
  async mounted () {
    // console.log(this.$store.state.products_arr)
    let suppliersCtrl = new SuppliersCtrl()
    this.active_suppliers = await suppliersCtrl.findAll({},{softDelete: true})
    this.refresh_all()
  },
  computed: {
    valid_form: function() {
      return this.incomings_data.supplier_select && this.incomings_data.supplier_select.id &&
        this.incomings_data.product_select && this.incomings_data.product_select.id &&
        this.incomings_data.count
    },
  },
  components: {  }
}
</script>

<style >
.product_area {
  border: 3px dashed cadetblue;
  border-radius: 15px;
}
</style>