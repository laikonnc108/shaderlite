<template>
  <section class="supp-receipts-details m-3">
    <h1>شاشة فواتير {{supplier.name}} لليوم</h1>
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
              <td>{{incom.diff}} </td>
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
    <button  class="btn btn-primary" @click="addReceipt()" v-if="receipts_count == 0">
      انشاء فاتورة   &nbsp; <span class="fa fa-external-link-square-alt"></span>
    </button>
      </div>
    </section>
    <hr>
    <section class="row ">
      <div class=" receipt col-4 p-2 pb-3"  v-if="receipts_count > 0">
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
            {{ element.product_name }} عدد {{ element.count }} 
            وزن {{ element.weight }}
            بسعر {{ element.kg_price }} 
            <span class="fa fa-minus-circle" @click="remove_from_list(recp_one.recp_details, idx)"
            style="color:red;float: left;"></span>
          </div>
        </draggable>
        <hr>
      <button  class="btn btn-primary"> <span class="fa fa-money-check"></span>
     رصد    &nbsp; 
      </button>&nbsp;
      <button  class="btn btn-primary"> <span class="fa fa-money-bill"></span>
     صرف   &nbsp; 
      </button>
      </div>

      <div class="receipt col-4 p-1 p-b-3" v-if="receipts_count > 1">
        <h3>فاتورة 2</h3>
        <draggable
          class="dragArea list-group"
          :list="recp_two.recp_details"
          group="outsums"
        >
          <div
            class="list-group-item"
            v-for="(element, idx) in recp_two.recp_details"
            :key="idx"
          >
          
            {{ element.product_name }} {{ element.count }}
            

            <span class="fa fa-minus-circle" @click="remove_from_list(recp_two.recp_details, idx)"
            style="color:red;float: left;"></span>
            <div>
              <input v-model="element.count" class="form-control"  >
            </div>
          </div>
        </draggable>
      </div>
      <div class="receipt col-4 p-1 pb-3"  v-if="receipts_count > 2">
        <h3>فاتورة 3</h3>
        <draggable
          class="dragArea list-group"
          :list="recp_three.recp_details"
          group="outsums"
          @change="recp_changed"
        >
          <div
            class="list-group-item"
            v-for="(element, idx) in recp_three.recp_details"
            :key="idx"
          >
            {{ element.product_name }} {{ element.count }} {{ element.kg_price }} {{ element.weight }}
            <span class="fa fa-minus-circle" @click="remove_from_list(recp_three.recp_details, idx)"
            style="color:red;float: left;"></span>
          </div>
        </draggable>
      </div>
    <button  class="btn btn-primary" @click="addReceipt()" v-if="receipts_count > 0 && receipts_count < 3">
     اضافة فاتورة   &nbsp; <span class="fa fa-external-link-square-alt"></span>
     <br/>
     {{receipts_count + 1}} 
    </button>
    </section>

    <hr>

    <!-- Check Rest Items -->
    <div>
      <div v-for="(incom, idx) in inc_headers" :key='idx'>
        {{incom.product_name}} تم بيع {{incom.sold_count | default0 }} طرد  - تم انشاء فواتير بعدد {{incom.recp_in_count | default0}} طرد
      </div>
    </div>

    <div class="mt-3">
    <button  class="btn btn-primary" @click="saveAll()"> <span class="fa fa-save"></span> &nbsp;
     حفظ الفواتير   
    </button>
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
      recp_two: {recp_details: []},
      recp_three: {recp_details: []},
    }
  },
  methods: {
    async refresh_all(){
      //this.outgoings_sums = await 
      this.outgoings_sums = await this.outgoingsCtrl.findSuppDaySums({supplier_id: this.supplier_id, day: this.store_day.iso})
      this.inc_headers = await this.inoutHeadCtrl.findAll({supplier_id: this.supplier_id, day: this.store_day.iso})
      let receipts = await this.receiptsCtrl.findAll({supplier_id: this.supplier_id, day: this.store_day.iso})
      receipts.forEach(receipt => {
        this.recp_one.recp_details = JSON.parse(receipt.details)
      })
      
    },
    async recp_changed(){

    },
    async saveAll(){
      console.log(this.recp_one)
      if(this.recp_one.recp_details.length > 0){
        let receipt1 = new ReceiptDAO({})
        receipt1.day = this.store_day.iso
        receipt1.supplier_id = this.supplier_id
        receipt1.details = JSON.stringify(this.recp_one.recp_details)
        this.receiptsCtrl.save(receipt1)
      }
    },
    async addReceipt(){
      this.receipts_count += 1
      if(this.receipts_count == 1) {
        let all = this.outgoings_sums.map( dao => this.clone(dao))
        this.recp_one.recp_details = all
      }
    },
    async watchit(){
      this.inc_headers = await this.inoutHeadCtrl.findAll({supplier_id: this.supplier_id, day: this.store_day.iso})

      this.recp_one.recp_details.forEach( item => {        
        let index = this.inc_headers.findIndex( _ => _.product_id === item.product_id )
        if(index >= 0){
          this.inc_headers[index].recp_in_count = this.inc_headers[index].recp_in_count ? parseInt(this.inc_headers[index].recp_in_count) : 0
          this.inc_headers[index].recp_in_count = this.inc_headers[index].recp_in_count + item.count
        }
      })

      this.recp_two.recp_details.forEach( item => {        
        let index = this.inc_headers.findIndex( _ => _.product_id === item.product_id )
        if(index >= 0){
          this.inc_headers[index].recp_in_count = this.inc_headers[index].recp_in_count ? parseInt(this.inc_headers[index].recp_in_count) : 0
          this.inc_headers[index].recp_in_count = this.inc_headers[index].recp_in_count + parseInt(item.count)
        }
      })

      this.recp_three.recp_details.forEach( item => {        
        let index = this.inc_headers.findIndex( _ => _.product_id === item.product_id )
        if(index >= 0){
          this.inc_headers[index].recp_in_count = this.inc_headers[index].recp_in_count ? parseInt(this.inc_headers[index].recp_in_count) : 0
          this.inc_headers[index].recp_in_count = this.inc_headers[index].recp_in_count + parseInt(item.count)
        }
      })
    },
    /**@param {Array} list */
    remove_from_list(list, id) {
      list.splice(id, 1)
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
    this.recp_two.recp_details.push({product_name: 'صنف عالي'})
  },
  watch: {

    'recp_one.recp_details':{
      handler: async function(){ this.watchit() },
      deep: true
    },
    'recp_two.recp_details':{
      handler: async function(){ this.watchit() },
      deep: true
    },
    'recp_three.recp_details':{
      handler: async function(){ this.watchit() },
      deep: true
    },
  },
  components: {
    draggable
  },
}
</script>

<style scoped >
.receipt {
  background-color: #cee;
  border-radius: 10px;
}
</style>
