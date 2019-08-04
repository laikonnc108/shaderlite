<template>
  <section class="products row">
    <div class="col-5 d-print-none">
    <br/>
    <div>
  <!-- Using modifiers -->
  <button v-b-toggle.collapse_form class="btn btn-primary m-1">ادخال صنف جديد
    &nbsp; <span class="fa fa-apple-alt"></span>
  </button>

  <!-- Element to collapse -->
  <b-collapse id="collapse_form" style="padding:25px;">
    <div class="entry-form">
    <form  @submit="SaveProduct">
      <div class="form-group row">
        <label  class="col-sm-2">اسم الصنف</label>
        <div class="col-sm-10">
          <input v-model="product_form.name" class="form-control "  placeholder="ادخل اسم الصنف">
        </div>
      </div>
      <!--
      <div class="form-group row" v-if="isBoth">
        <label  class="col-sm-2">نوع الصنف</label>
        <div class="col-sm-10">
          <input v-model="product_form.type" class="form-control " >
        </div>
      </div>
      -->

      <button type="submit" class="btn btn-success" :disabled="! product_form.name">اضافة</button>
    </form>
    </div>
  </b-collapse>
</div>
</div>

  <div class="col-7 p-3 col-print-10 pr-me">
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

    <br/>
    <h2 :class="{ 'text-danger': ! show_active }">
      <span v-if="show_active"> ادارة </span>
      <span v-if="! show_active"> ارشيف </span>
     الاصناف 
    </h2>

      <div class="table-responsive">
        <table class="table table-striped table-sm">
          <thead>
            <tr>
              <th> كود الصنف </th>
              <th>اسم الصنف</th>
              <th>ملاحظات</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in comp_products_arr" :key='idx' >
              <td>{{item.id}}</td>
              <td>{{item.name}}</td>
              <td>{{item.notes}}</td>
              <td class="d-print-none">
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

<script>
import { MyStoreMutations } from '../main'
import { ProductDAO, ProductsCtrl} from '../ctrls/ProductsCtrl'
export default {
  name: 'products',
  data() {
    return {
      products_arr: [],
      confirm_step: [],
      productsCtrl: new ProductsCtrl(),
      show_active: true,
      search_term: '',
      product_form: new ProductDAO(ProductDAO.INIT_DAO),
      //isBoth: getShaderConfigValue(this.$store.state , 'work_in') === 'both'
    }
  },
  methods: {
    async SaveProduct(evt){
      evt.preventDefault()
      try {
        await this.productsCtrl.save(this.product_form)
      } catch (error) {
        this.$bvToast.show('example-toast')
        return
      }
      
      this.product_form = new ProductDAO(ProductDAO.INIT_DAO)
      this.refresh_all()
    },
    async refresh_all() {
      // Save Active products
      let products_arr = await new ProductsCtrl().getProductsArr()
      this.$store.commit(MyStoreMutations.setProductsArr, products_arr)

      let soft_delete = this.show_active ? true : false;
      this.products_arr = await this.productsCtrl.findAll({},{softDelete: soft_delete})
    },
    async archive(id, restore = 'ARCHIVE') {
      if( this.confirm_step[id] ) {
        if(restore === 'RESTORE')
          await this.productsCtrl.resotreById(id)
        else
          await this.productsCtrl.deleteById(id)
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
    this.$root.$on('bv::collapse::state', (collapseId, show) => {
      if(collapseId == 'collapse_form') this.form_collabsed = ! show
    })
    this.refresh_all()
  },
  computed: {
    comp_products_arr: function () {
      return this.products_arr.filter( item => {
        return ((item.deleted_at == null) === this.show_active  && item.name.includes(this.search_term))
      })
    }
  },
}
</script>
