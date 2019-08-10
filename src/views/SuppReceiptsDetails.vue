<template>
  <section class="supp-receipts-details m-3">
    <h1>شاشة فواتير {{supplier.name}}</h1>
    <hr>
    <section class="row ">
      <div class=" col-6 " >
        <h3>اجماليات وارد اليوم {{store_day.arab}}</h3>
        <table class="table table-striped table-sm pr-me">
          <thead>
            <tr>
              <th>#</th>
              <th>الصنف</th>
              <th>عدد الطرود</th>
              <th>متبقي</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(incom, idx) in inc_headers" :key='idx' :class="{'text-danger':incom.current_count > 0}">
              <td></td>
              <td>{{incom.product_name}}</td>
              <td>{{incom.inc_count}}</td>
              <td>{{incom.diff}} - {{incom.recp_in_count}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class=" col-6" >
        <h3>اجماليات البيع من وارد اليوم </h3>
        <table class="table table-striped table-sm pr-me">
          <thead>
            <tr>
              <th>#</th>
              <th>الصنف</th>
              <th>عدد الطرود</th>
              <th>اجمالي الوزن</th>
              <th> سعر الكيلو
                (بيع)
              </th>
              <th>المبلغ</th>
            </tr>
          </thead>
          <draggable :list="outgoings_sums" :sort="false" 
          :group="{ name: 'outsums', pull: 'clone', put: false }" tag="tbody" :clone="clone">
            <tr v-for="(item, idx) in outgoings_sums" :key='idx'>
              <td></td>
              <td>{{item.product_name}}</td>
              <td>{{item.sum_count}}</td>
              <td>{{item.sum_weight}}</td>
              <td>{{item.kg_price}}</td>
              <td>{{item.sum_weight * item.kg_price }}</td>
            </tr>
            <tr>
              <td></td>
              <th>الاجمالي</th>
              <td></td>
              <td></td>
              <td></td>
              <td><b class="border-top border-primary"></b></td>
            </tr>
          </draggable>
        </table>
    <button  class="btn btn-primary" @click="addReceipt(1)" v-if="receipts_count == 0">
      انشاء فاتورة   &nbsp; <span class="fa fa-external-link-square-alt"></span>
    </button>
      </div>
    </section>
    <hr>
    <section class="row ">
      <div class="col-4"  v-if="receipts_count > 0">
        <h3>فاتورة 1</h3>
        <draggable
          class="dragArea list-group"
          :list="recp_one.recp_details"
          group="outsums"
          @change="recp_changed"
        >
          <div
            class="list-group-item"
            v-for="(element, idx) in recp_one.recp_details"
            :key="idx"
          >
            {{ element.product_name }} {{ element.count }} {{ element.kg_price }} {{ element.weight }}
          </div>
        </draggable>
      </div>

      <div class="col-4" v-if="receipts_count > 1">
        <h3>فاتورة 2</h3>
        <draggable
          class="dragArea list-group"
          :list="recp2_details"
          group="outsums"
        >
          <div
            class="list-group-item"
            v-for="(element, idx) in recp2_details"
            :key="idx"
          >
          
            {{ element.product_name }} {{ element.count }}
            <input v-model="element.count" class="form-control"  >

          </div>
        </draggable>
      </div>
    </section>

    <hr>

    <!-- Check Rest Items -->
    <div>
      <div v-for="(incom, idx) in inc_headers" :key='idx'>
        {{incom.product_name}} تم بيع {{incom.sold_count}} - تم انشاء فواتير بعدد {{incom.recp_in_count}}
      </div>
    </div>

  </section>
</template>

<script >
import { InoutHeadCtrl } from '../ctrls/InoutHeadCtrl'
import { ReceiptDAO, ReceiptsCtrl } from '../ctrls/ReceiptsCtrl'
import { OutgoingDAO, OutgoingsCtrl } from '../ctrls/OutgoingsCtrl'
import { SupplierDAO, SuppliersCtrl } from '../ctrls/SuppliersCtrl'
import draggable  from 'vuedraggable'

export default {
  name: 'supp-receipts-details',
  data () {
    return {
      store_day: this.$store.state.day,
      receipts_count: 0,
      supplier_id: this.$route.params.supplier_id,
      supplier: new SupplierDAO(),
      inoutHeadCtrl: new InoutHeadCtrl(),
      outgoingsCtrl: new OutgoingsCtrl(),
      receiptsCtrl: new ReceiptsCtrl(),
      outgoings_sums:[],
      inc_headers: [],
      recp_in_sums: {},
      recp_one: {recp_details: []},
      recp2_details: [],
      recp3_details: [],
    }
  },
  methods: {
    async refresh_all(){
      //this.outgoings_sums = await 
      this.outgoings_sums = await this.outgoingsCtrl.findSuppDaySums({supplier_id: this.supplier_id, day: this.store_day.iso})
      this.inc_headers = await this.inoutHeadCtrl.findAll({supplier_id: this.supplier_id, day: this.store_day.iso})
    },
    async recp_changed(){

    },
    async addReceipt(num){
      this.receipts_count += 1
      let all = this.outgoings_sums.map( dao => this.clone(dao))
      this.recp_one.recp_details = all
    },
    /**@param {OutgoingDAO} dao*/
    clone(dao){
      // Custom clone to return a new Element
      return {
          count: dao.sum_count,
          product_name: dao.product_name,
          product_id:  dao.product_id,
          kg_price: dao.kg_price,
          weight: dao.sum_weight
      }
    },
  },
  async mounted(){
    this.refresh_all()
    let suppliersCtrl = new SuppliersCtrl()
    this.supplier = await suppliersCtrl.findById(this.supplier_id)
    this.recp2_details.push({product_name: 'صنف عالي'})
  },
  watch: {
    /**@param {Array} arr */

    'recp_one.recp_details': async function(arr){

      this.inc_headers = await this.inoutHeadCtrl.findAll({supplier_id: this.supplier_id, day: this.store_day.iso})

      arr.forEach( item => {        
        let index = this.inc_headers.findIndex( _ => _.product_id === item.product_id )
        if(index >= 0){
          this.inc_headers[index].recp_in_count = this.inc_headers[index].recp_in_count ? parseInt(this.inc_headers[index].recp_in_count) : 0
          this.inc_headers[index].recp_in_count = this.inc_headers[index].recp_in_count + item.count
        }
      })
    }
  },
  components: {
    draggable
  },
}
</script>

<style scoped >

</style>
