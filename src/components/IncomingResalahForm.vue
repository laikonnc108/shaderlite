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
        <div class="product-row p-1" v-for="(product, index) in incomings_data.products_arr" :key='index' >
           عدد {{product.count}} - {{all_products[product.id]}} 
        </div>
      </div>
    </div>

    <div class="form-group row">
      <div class="col-sm-2"></div>
      <div class="col-sm-10 ">
        <div class="row product_area p-3">
          <label class="col-sm-2">الصنف</label>
          <div class="col-sm-5">
            <select v-model="product_data.id" class="form-control" placeholder="اختار الصنف">
            <option v-for="(product, index) in all_products" :key='index' :value='index'>
              {{product}}
            </option>
          </select>
          </div>
          <div class="col-sm-5">
            <input v-model="product_data.count" class="form-control" placeholder=" العدد">
          </div>
          <div class="p-4">
            <button type="button" class="btn btn-primary" 
            :disabled="! valid_product" @click="add_product" >اضافة الصنف</button>
            &nbsp;
            <button type="button" @click="product_data= {}" class="btn btn-danger"> الغاء </button>
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
    &nbsp;
    <button type="button" @click="fresh_form" class="btn btn-danger"> الغاء </button>
    
  </form>
  </section>
</template>

<script >
import { SuppliersCtrl } from '../ctrls/SuppliersCtrl';
import { IncomingsCtrl,IncomingsData } from '../ctrls/IncomingsCtrl'
export default {
  name: 'IncomingResalahForm',
  data () {
    return {
      incomings_data: new IncomingsData({day: this.$store.state.day.iso }),
      active_suppliers: [],
      incomingsCtrl: new IncomingsCtrl(),
      all_products: this.$store.state.products_arr,
      product_data: {id: 0 , count: null}
    }
  },
  methods: {
    async saveIncomings(evt){
      evt.preventDefault()
      let ids = await this.incomingsCtrl.saveIncomingsData(this.incomings_data)
      this.fresh_form()
      this.$emit('saved')
    },
    add_product() {
      if(this.product_data.id && parseInt(this.product_data.count) > 0 )
        this.incomings_data.products_arr.push(this.product_data)
      this.product_data = {id: 0 , count: null}
    },
    fresh_form() {
      this.incomings_data = new IncomingsData({day: this.$store.state.day.iso })
      this.product_data = {id: 0 , count: null}
    }
  },
  async mounted () {
    // console.log(this.$store.state.products_arr)
    let suppliersCtrl = new SuppliersCtrl()
    this.active_suppliers = await suppliersCtrl.findAll({},{softDelete: true})
    this.fresh_form()
  },
  computed: {
    valid_form: function() {
      return this.incomings_data.supplier_id && this.incomings_data.products_arr.length > 0 && 
      ( ! this.product_data.id && ! this.product_data.count)
    },
    valid_product: function() {
      return this.product_data.id && this.product_data.count
    }
  }
}
</script>

<style >
.product_area {
  border: 3px dashed cadetblue;
  border-radius: 15px;
}
.product-row {
  font-weight: bold;
  font-size: 1.2em;
  border-bottom: 2px dashed cadetblue;
}
.product-row:last-child {
  border-bottom: none;
}
</style>