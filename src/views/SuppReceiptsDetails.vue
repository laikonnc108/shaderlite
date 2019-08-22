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
        <hr>
        <div class="row detailed">
          <div class="col-6">اجمالي نوالين اليوم</div>
          <div class="col-6">{{ total_nolon| round2 }}</div>
        </div>
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
    <button  class="btn btn-primary" @click="addReceipt(1)" v-if="! show_receipts[1]">
      انشاء فاتورة   &nbsp; <span class="fa fa-external-link-square-alt"></span>
    </button>
      </div>
    </section>
    <hr>
    <section class="row ">
      <div class=" receipt col-4 p-3 "  v-if="show_receipts[1]">
        <h3>فاتورة 1 

            {{'recp_status_'+ recp_1.recp_paid | tr_label }}
        </h3>
        <draggable
          class="drag-area list-group"
          :list="recp_1.details"
          group="outsums"
          @change="recp_changed"
        >
          <div
            class="list-group-item"
            v-for="(element, idx) in recp_1.details"
            :key="idx"
          >
            {{ element.product_name }} عدد {{ element.count }} 
            وزن {{ element.weight }}
            بسعر {{ element.kg_price }} 
            <span class="fa fa-minus-circle" @click="remove_from_list(recp_1.details, idx)"
            style="color:red;float: left;"></span>
          </div>
        </draggable>
        <hr>
        <div>
          <span> النولون</span>
          <span> {{recp_1.total_nolon | default0}} </span>
        </div>
        <div>
          <span> مصاريف الفاتورة</span>
          <span> {{recp_1.recp_expenses | default0}} </span>
        </div>
        <div>
          <span> عمولة الفاتورة</span>
          <span> {{recp_1.recp_comm | default0}} </span>
        </div>
        <hr>
      <button  class="btn btn-success" v-b-modal.modal-recp @click="modal_recp = recp_1"> <span class="fa fa-edit"></span>
         تعديل   
      </button>&nbsp;
      <button  class="btn btn-primary" @click="setRecpPaid(recp_1, 1)"> <span class="fa fa-money-check"></span>
     رصد    
      </button>&nbsp;
      <button  class="btn btn-primary" @click="setRecpPaid(recp_1, 2)"> <span class="fa fa-money-bill"></span>
     صرف   
      </button> &nbsp;
      <button  class="btn btn-success"> <span class="fa fa-print"></span>
       طباعة    
      </button>

      </div>

      <div class="receipt col-4 p-3" v-if="show_receipts[2]">
        <h3>فاتورة 2 {{'recp_status_'+ recp_2.recp_paid | tr_label }}</h3>
        <draggable
          class="drag-area list-group " 
          :list="recp_2.details"
          group="outsums"
        >
          <div
            class="list-group-item"
            v-for="(element, idx) in recp_2.details"
            :key="idx"
          >
          
            {{ element.product_name }} عدد {{ element.count }} 
            وزن {{ element.weight }}
            بسعر {{ element.kg_price }} 
            
            <span class="fa fa-minus-circle" @click="remove_from_list(recp_2.details, idx)"
            style="color:red;float: left;"></span>
          </div>
        </draggable>

        <hr>
        <button  class="btn btn-success" v-b-modal.modal-recp @click="modal_recp = recp_2"> <span class="fa fa-edit"></span>
          تعديل   
        </button>&nbsp;
        <button  class="btn btn-primary"> <span class="fa fa-money-check"></span>
      رصد    
        </button>&nbsp;
        <button  class="btn btn-primary"> <span class="fa fa-money-bill"></span>
      صرف   
        </button> &nbsp;
        <button  class="btn btn-success"> <span class="fa fa-print"></span>
        طباعة    
        </button>

      </div>

      <div class="receipt col-4 p-1 pb-3"  v-if="show_receipts[3]">
        <h3>فاتورة 3 {{'recp_status_'+ recp_3.recp_paid | tr_label }}</h3>
        <draggable
          class="drag-area list-group"
          :list="recp_3.details"
          group="outsums"
          @change="recp_changed"
        >
          <div
            class="list-group-item"
            v-for="(element, idx) in recp_3.details"
            :key="idx"
          >
            {{ element.product_name }} {{ element.count }} {{ element.kg_price }} {{ element.weight }}
            <span class="fa fa-minus-circle" @click="remove_from_list(recp_3.details, idx)"
            style="color:red;float: left;"></span>
          </div>
        </draggable>
      </div>
      <button  class="btn btn-primary" @click="addReceipt(2)" v-if="show_receipts[1] && ! show_receipts[2]">
      اضافة فاتورة   &nbsp; <span class="fa fa-external-link-square-alt"></span>
      <br/>
        2
      </button>
      <button  class="btn btn-primary" @click="addReceipt(3)" v-if="show_receipts[2] && ! show_receipts[3]">
      اضافة فاتورة   &nbsp; <span class="fa fa-external-link-square-alt"></span>
      <br/>
        3
      </button> 
    </section>

    <hr>

    <!-- Check Rest Items -->
    <div>
      <div v-for="(incom, idx) in inc_headers" :key='idx' class="text-danger" >
        <span v-if="incom.sold_count != incom.recp_in_count "> <span class="fa fa-error"></span> &nbsp;
        صنف {{incom.product_name}} تم بيع {{incom.sold_count | default0 }} طرد  - تم انشاء فواتير بعدد {{incom.recp_in_count | default0}} طرد
        </span>
      </div>
    </div>

    <div class="mt-3">
      <button  class="btn btn-primary" @click="saveAll()"> <span class="fa fa-save"></span> &nbsp;
      حفظ الفواتير   
      </button> &nbsp;
      <button  class="btn btn-danger" @click="removeAll()"> <span class="fa fa-trash-alt"></span> &nbsp;
      حذف الفواتير   
      </button>
    </div>

    <!-- Modal -->
<b-modal id="modal-recp" size="xl" :title="' فاتورة' + modal_recp.serial" hide-footer hide-header-close>
  <div class="table-responsive p-2 m-2" style="border: 2px solid #79ace0; border-radius: 12px;" > 
      <table class="table table-bordered table-sm pr-me" >
        <thead>
          <tr>
            <th>الاجمالي</th>
            <th>عدد المباع</th>
            <th> الوزن</th>
            <th> </th>
            <th>سعر الكيلو
            </th>
            <th>الصنف</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in modal_recp.details" :key='idx'>
            <td>
              {{item.kg_price *  item.weight | round2 | toAR }}
            </td>
            <td >
              <input v-model="item.count" class="form-control"  v-if="! print_mode && ! modal_recp.recp_paid">
              <span v-if=" print_mode || modal_recp.recp_paid">{{item.count | toAR }}</span>
            </td>
            <td >
              <input v-model="item.weight" class="form-control"  v-if="! print_mode && ! modal_recp.recp_paid">
              <span v-if=" print_mode || modal_recp.recp_paid">{{item.weight | toAR }}</span>
            </td>
            <td>X</td>
            <td >
              <input v-model="item.kg_price" class="form-control"  v-if="! print_mode && ! modal_recp.recp_paid">
              <span v-if=" print_mode || modal_recp.recp_paid">{{item.kg_price | toAR }}</span>
            </td>
            <td >{{item.product_name}} 
              <button v-if=" ! print_mode && ! modal_recp.recp_paid" class="btn text-success" @click="removeRecpDetail(item.id)" >
                <span class="fa fa-remove "></span> 
                حذف
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="m-2">
          <button class="btn btn-primary" @click="$bvModal.hide('modal-recp')" >
            <span class="fa fa-check "></span> &nbsp;
            موافق
          </button>
      </div>
  </div>
</b-modal>

  </section>
</template>

<script >
import { InoutHeadCtrl } from '../ctrls/InoutHeadCtrl'
import { CashflowCtrl } from '../ctrls/CashflowCtrl'
import { ReceiptDAO, ReceiptsCtrl } from '../ctrls/ReceiptsCtrl'
import { OutgoingsCtrl } from '../ctrls/OutgoingsCtrl'
import { SupplierDAO, SuppliersCtrl } from '../ctrls/SuppliersCtrl'
import draggable  from 'vuedraggable'

export default {
  name: 'supp-receipts-details',
  data () {
    return {
      store_day: this.$store.state.day,
      show_receipts: {1: false, 2: false, 3: false},
      supplier_id: this.$route.params.supplier_id,
      supplier: new SupplierDAO(),
      inoutHeadCtrl: new InoutHeadCtrl(),
      outgoingsCtrl: new OutgoingsCtrl(),
      receiptsCtrl: new ReceiptsCtrl(),
      cashflowCtrl: new CashflowCtrl(),
      outgoings_sums:[],
      total_nolon: 0,
      inc_headers: [],
      recp_in_sums: {},
      recp_1: new ReceiptDAO({serial: 1, ...ReceiptDAO.INIT_DAO}),
      recp_2: new ReceiptDAO({serial: 2, ...ReceiptDAO.INIT_DAO}),
      recp_3: new ReceiptDAO({serial: 3, ...ReceiptDAO.INIT_DAO}),
      modal_recp: {},
      print_mode: false
    }
  },
  methods: {
    async refresh_all(){
      this.recp_1 = new ReceiptDAO({serial: 1, ...ReceiptDAO.INIT_DAO})
      this.recp_2 = new ReceiptDAO({serial: 2, ...ReceiptDAO.INIT_DAO})
      this.recp_3 = new ReceiptDAO({serial: 3, ...ReceiptDAO.INIT_DAO})

      this.show_receipts= {1: false, 2: false, 3: false}
      let {total_nolon} = await this.cashflowCtrl.getSupplierNolons({supplier_id: this.supplier_id, day: this.store_day.iso})
      this.total_nolon = total_nolon
      this.outgoings_sums = await this.outgoingsCtrl.findSuppDaySums({supplier_id: this.supplier_id, day: this.store_day.iso})
      this.inc_headers = await this.inoutHeadCtrl.findAll({supplier_id: this.supplier_id, day: this.store_day.iso})
      let receipts = await this.receiptsCtrl.findAll({supplier_id: this.supplier_id, day: this.store_day.iso})
      receipts.forEach(receipt => {
        this['recp_'+ receipt.serial] = receipt
        console.log(receipt)
        //this['recp_'+ receipt.serial].details = JSON.parse(receipt.details)
        this.show_receipts[receipt.serial] = true        
      })
      
    },
    async recp_changed(){

    },
    async removeAll(){
      if(this.recp_1.id)
        await this.receiptsCtrl.deleteById(this.recp_1.id)

      if(this.recp_2.id)
        await this.receiptsCtrl.deleteById(this.recp_2.id)

      if(this.recp_3.id)
        await this.receiptsCtrl.deleteById(this.recp_3.id)

      this.refresh_all()
    },
    setRecpPaid( receipt, recp_paid ) {
      receipt.recp_paid = recp_paid
      this.saveAll()
    },
    async saveAll(){

      if(this.recp_1.details.length > 0){
        let receipt = new ReceiptDAO({
          ...this.recp_1,
          day: this.store_day.iso,
          supplier_id: this.supplier_id,
        })
        await this.receiptsCtrl.save(receipt)
      } else if (this.recp_1.id) {
        await this.receiptsCtrl.deleteById(this.recp_1.id)
      }

      if(this.recp_2.details.length > 0){
        let receipt = new ReceiptDAO({
          ...this.recp_2,
          day: this.store_day.iso,
          supplier_id: this.supplier_id,
        })
        await this.receiptsCtrl.save(receipt)
      } else if (this.recp_2.id) {
        await this.receiptsCtrl.deleteById(this.recp_2.id)
      }

      if(this.recp_3.details.length > 0){
        let receipt = new ReceiptDAO({
          ...this.recp_3,
          day: this.store_day.iso,
          supplier_id: this.supplier_id,
        })
        await this.receiptsCtrl.save(receipt)
      } else if (this.recp_3.id) {
        await this.receiptsCtrl.deleteById(this.recp_3.id)
      }

      this.refresh_all()
    },
    async addReceipt(num){
      this.show_receipts[num] = true
      if(num == 1) {
        let all = this.outgoings_sums.map( dao => this.clone(dao))
        this.recp_1.details = all
        this.recp_1.total_nolon = this.total_nolon
      }
    },
    async watchit(){
      this.inc_headers = await this.inoutHeadCtrl.findAll({supplier_id: this.supplier_id, day: this.store_day.iso})

      this.recp_1.total_count = 0
      this.recp_1.details.forEach( item => {        
        let index = this.inc_headers.findIndex( _ => _.product_id === item.product_id )
        if(index >= 0){
          this.inc_headers[index].recp_in_count = this.inc_headers[index].recp_in_count ? parseInt(this.inc_headers[index].recp_in_count) : 0
          this.inc_headers[index].recp_in_count = this.inc_headers[index].recp_in_count + item.count
        }
        this.recp_1.total_count += parseInt(item.count)
      })

      this.recp_2.total_count = 0
      this.recp_2.details.forEach( item => {        
        let index = this.inc_headers.findIndex( _ => _.product_id === item.product_id )
        if(index >= 0){
          this.inc_headers[index].recp_in_count = this.inc_headers[index].recp_in_count ? parseInt(this.inc_headers[index].recp_in_count) : 0
          this.inc_headers[index].recp_in_count = this.inc_headers[index].recp_in_count + parseInt(item.count)
        }
        this.recp_2.total_count += parseInt(item.count)
      })
      
      this.recp_3.total_count = 0
      this.recp_3.details.forEach( item => {        
        let index = this.inc_headers.findIndex( _ => _.product_id === item.product_id )
        if(index >= 0){
          this.inc_headers[index].recp_in_count = this.inc_headers[index].recp_in_count ? parseInt(this.inc_headers[index].recp_in_count) : 0
          this.inc_headers[index].recp_in_count = this.inc_headers[index].recp_in_count + parseInt(item.count)
        }
        this.recp_3.total_count += parseInt(item.count)
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
          weight: dao.sum_weight,
          sell_comm: dao.sell_comm
      }
    },
  },
  async mounted(){
    this.refresh_all()
    let suppliersCtrl = new SuppliersCtrl()
    this.supplier = await suppliersCtrl.findById(this.supplier_id)
  },
  watch: {

    'recp_1.details':{
      handler: async function(){ this.watchit() },
      deep: true
    },
    'recp_2.details':{
      handler: async function(){ this.watchit() },
      deep: true
    },
    'recp_3.details':{
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
.drag-area{
  min-height: 4em;
  border: #2f92d8 1px dashed;
  border-radius: 10px;
  padding: 12px;
}
</style>
