<template>
  <section class="supp-receipts-details m-3">
  <section class="data-play pr-hideme">
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
        <div class="row detailed" v-b-modal.modal-nolons>
          <div class="col-6">
            <span class="btn text-primary">
            اجمالي نوالين اليوم
            </span>
          </div>
          <div class="col-6 btn text-primary">
            <span >
            {{ total_nolon| round2 }}
            </span>
            <span class="fa fa-table"></span>
            عرض النوالين
          </div>
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
              <td>{{item.kg_price | round2}}</td>
              <td>{{item.sum_weight * item.kg_price | round2}}</td>
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
        <h3 :class="{'text-danger': ! recp_1.id}">فاتورة 1 
            {{'recp_status_'+ recp_1.recp_paid | tr_label }}
            <span v-if="recp_1.printed"> - تم طباعتها    </span>
            <span v-if="! recp_1.id">( لم يتم الحفظ )</span>
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
        <div class="row-detail">
          <label> النولون</label>
          <span> {{recp_1.total_nolon | default0}} </span>
        </div>
        <div class="row-detail" v-if="recp_1.recp_expenses">
          <label> مصاريف الفاتورة</label>
          <span> {{recp_1.recp_expenses | default0}} </span>
        </div>
        <div class="row-detail">
          <label> عمولة الفاتورة</label>
          <span> {{recp_1.recp_comm | default0}} -<label> نسبة العمولة </label> ({{recp_1.comm_rate | default0}} % )</span>
        </div>
        <div class="row-detail">
          <label> وهبة الفاتورة</label>
          <span> {{recp_1.recp_given | round2}} </span>
        </div>
        <hr>
        <div class="row-detail">
          <label> صافي الفاتورة</label>
          <span> {{recp_1.net_value | round2}} </span>
        </div>
        <hr>
        <button  class="btn btn-success" v-b-modal.modal-recp @click="modal_recp = recp_1"> <span class="fa fa-edit"></span>
        تعديل / عرض  
        </button>&nbsp;
        <button  class="btn btn-primary" v-if="! recp_1.recp_paid" @click="setRecpPaid(recp_1, 1)">
          <span class="fa fa-money-check"></span>
        رصد    
        </button>&nbsp;
        <button  class="btn btn-primary" v-if="! recp_1.recp_paid" @click="setRecpPaid(recp_1, 2)">
          <span class="fa fa-money-bill"></span>
        صرف    
        </button> &nbsp;


      </div>

      <div class="receipt col-4 p-3" v-if="show_receipts[2]">
        <h3 :class="{'text-danger': ! recp_2.id}">فاتورة 2 
          {{'recp_status_'+ recp_2.recp_paid | tr_label }}
          <span v-if="recp_2.printed"> - تم طباعتها    </span>
          <span v-if="! recp_2.id">( لم يتم الحفظ )</span>
        </h3>
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
        <div class="row-detail" v-if="recp_2.total_nolon">
          <label> النولون</label>
          <span> {{recp_2.total_nolon | default0}} </span>
        </div>
        <div class="row-detail" v-if="recp_2.recp_expenses">
          <label> مصاريف الفاتورة</label>
          <span> {{recp_2.recp_expenses | default0}} </span>
        </div>
        <div class="row-detail">
          <label> عمولة الفاتورة</label>
          <span> {{recp_2.recp_comm | default0}} -<label> نسبة العمولة </label> ({{recp_2.comm_rate | default0}} % )</span>
        </div>
        <div class="row-detail">
          <label> وهبة الفاتورة</label>
          <span> {{recp_2.recp_given | round2}} </span>
        </div>
        <hr>
        <div class="row-detail">
          <label> صافي الفاتورة</label>
          <span> {{recp_2.net_value | round2}} </span>
        </div>
        <hr>
        <button  class="btn btn-success" v-b-modal.modal-recp @click="modal_recp = recp_2"> <span class="fa fa-edit"></span>
         تعديل / عرض 
        </button>&nbsp;
        <button  class="btn btn-primary" v-if="! recp_2.recp_paid" @click="setRecpPaid(recp_2, 1)">
          <span class="fa fa-money-check"></span>
        رصد    
        </button>&nbsp;
        <button  class="btn btn-primary" v-if="! recp_2.recp_paid" @click="setRecpPaid(recp_2, 2)">
          <span class="fa fa-money-bill"></span>
        صرف   
        </button> &nbsp;

      </div>

      <div class="receipt col-4 p-1 pb-3"  v-if="show_receipts[3]">
        <h3 :class="{'text-danger': ! recp_3.id}">فاتورة 3 {{'recp_status_'+ recp_3.recp_paid | tr_label }}
          <span class="pr-hideme" v-if="recp_3.printed">
            - تم طباعتها
          </span>
          <span v-if="! recp_3.id">( لم يتم الحفظ )</span>
        </h3>
        <draggable
          class="drag-area list-group " 
          :list="recp_3.details"
          group="outsums"
        >
          <div
            class="list-group-item"
            v-for="(element, idx) in recp_3.details"
            :key="idx"
          >
          
            {{ element.product_name }} عدد {{ element.count }} 
            وزن {{ element.weight }}
            بسعر {{ element.kg_price }} 
            
            <span class="fa fa-minus-circle" @click="remove_from_list(recp_3.details, idx)"
            style="color:red;float: left;"></span>
          </div>
        </draggable>
        <hr>
        <div class="row-detail" v-if="recp_3.total_nolon">
          <label> النولون</label>
          <span> {{recp_3.total_nolon | default0}} </span>
        </div>
        <div class="row-detail" v-if="recp_3.recp_expenses">
          <label> مصاريف الفاتورة</label>
          <span> {{recp_3.recp_expenses | default0}} </span>
        </div>
        <div class="row-detail">
          <label> عمولة الفاتورة</label>
          <span> {{recp_3.recp_comm | default0}} -<label> نسبة العمولة </label> ({{recp_3.comm_rate | default0}} % )</span>
        </div>
        <div class="row-detail">
          <label> وهبة الفاتورة</label>
          <span> {{recp_3.recp_given | round2}} </span>
        </div>
        <hr>
        <div class="row-detail">
          <label> صافي الفاتورة</label>
          <span> {{recp_3.net_value | round2}} </span>
        </div>
        <hr>
        <button  class="btn btn-success" v-b-modal.modal-recp @click="modal_recp = recp_3"> <span class="fa fa-edit"></span>
         تعديل / عرض 
        </button>&nbsp;
        <button  class="btn btn-primary" v-if="! recp_3.recp_paid" @click="setRecpPaid(recp_3, 1)">
          <span class="fa fa-money-check"></span>
        رصد    
        </button>&nbsp;
        <button  class="btn btn-primary" v-if="! recp_3.recp_paid" @click="setRecpPaid(recp_3, 2)">
          <span class="fa fa-money-bill"></span>
        صرف   
        </button> &nbsp;
      </div>

      <!-- end recps -->

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
  </section>

<!-- Nolons Modal -->
<b-modal id="modal-nolons"  
 hide-footer hide-header-close hide-backdrop>
  <template slot="modal-title">
    عرض نوالين اليوم للفلاح
  </template>
  <table class="table table-striped table-sm pr-me">
    <thead>
      <tr>
        <th>المبلغ</th>
        <th>الصنف الوارد</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, idx) in today_nolons" :key='idx'>
        <td>{{item.amount}}</td>
        <td><span v-if="item.d_product"> - {{ item.d_product | productsFilter }}</span></td>
        <td>
          <input v-model="item.amount" class="form-control"  >
        </td>
      </tr>
    </tbody>
  </table>

  <div class="m-2">
    <button class="btn btn-success pr-hideme" @click="$bvModal.hide('modal-nolons');saveNolons()" >
      <span class="fa fa-check "></span> &nbsp;
      حفظ
    </button>
  </div>
</b-modal>
    <!-- Modal -->
<b-modal id="modal-recp" size="xl" class="col-print-12" hide-header
 hide-footer hide-header-close hide-backdrop>
<template v-if="true || print_mode">
  <p v-html="shader_configs['recp_header']"></p>
</template>
<h4 class="text-center"> فاتورة 
  <span class="pr-hideme">
    ({{modal_recp.serial}})
  </span>

</h4>
<h4 class="pr-me ">
  تحريراً في {{day.arab }}
  <br/>
  المطلوب من السيد/ {{supplier.name}}
</h4>

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
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in modal_recp.details" :key='idx'>
            <td>
              {{item.kg_price *  item.weight | round2 | toAR }}
            </td>
            <td >
              <input v-if="! print_mode && ! modal_recp.recp_paid" v-model="item.count" class="form-control"  >
              <span v-else>{{item.count | toAR }}</span>
            </td>
            <td >
              <input v-if="! print_mode && ! modal_recp.recp_paid" v-model="item.weight" class="form-control"  >
              <span v-else>{{item.weight | toAR }}</span>
            </td>
            <td>X</td>
            <td >
              <input v-if="! print_mode && ! modal_recp.recp_paid" v-model="item.kg_price" class="form-control"  >
              <span v-else> {{item.kg_price | toAR }}</span>
            </td>
            <td >{{item.product_name}} </td>
            <td>
              <span class="fa fa-minus-circle pr-hideme" @click="remove_from_list(modal_recp.details, idx)"
              style="color:red;float: left;"></span>
            </td>
          </tr>
          <tr>
            <td ><b class="border-top border-primary">{{modal_recp.sale_value | round2 | toAR }} </b></td>
            <td colspan="6" style="border: none !important;"></td>
          </tr>
          <tr>
            <td colspan="2" style="border: none !important;"></td>
            <td >
              <input v-if="! print_mode && ! modal_recp.recp_paid" v-model="modal_recp.comm_rate" class="form-control"  >
            </td>
            <td></td>
            <th>
              <span class="pr-hideme">
               نسبة العمولة {{modal_recp.comm_rate }}%  
               </span>
            </th>
            <td>( {{modal_recp.recp_comm | round2 | toAR }} )</td>
            <th style="border: none !important;">عمولة</th>
          </tr>
          <tr v-if="modal_recp.total_nolon">
            <td colspan="5" style="border: none !important;"></td>
            <td ><b >( {{modal_recp.total_nolon | round2 | toAR }} )</b></td>
            <td  style="border: none !important;">نولون</td>
          </tr>
          <tr v-if="modal_recp.recp_expenses">
            <td colspan="5" style="border: none !important;"></td>
            <td ><b >( {{modal_recp.recp_expenses | round2 | toAR }} )</b></td>
            <td  style="border: none !important;">مبالغ اخري</td>
          </tr>
          <tr>
            <td colspan="2" style="border: none !important;"></td>
            <td >
              <input v-if="! print_mode && ! modal_recp.recp_paid" 
              v-model="modal_recp.recp_given" class="form-control" placeholder="ادخل مبلغ الوهبة" >
            </td>
            <td></td>
            <td></td>
            <td>( {{modal_recp.recp_given | round2 | toAR }} )</td>
            <th style="border: none !important;">مشال</th>
          </tr>

          <tr>
            <td style="border: none !important;"></td>
            <td style="border: none !important;">صافي الفاتورة</td>
            <td ><b class="border-top border-primary">{{modal_recp.net_value | round2 | toAR }} </b></td>
            
          </tr>
        </tbody>
      </table>

      <div class="m-2">
          <button class="btn btn-primary pr-hideme" @click="$bvModal.hide('modal-recp')" >
            <span class="fa fa-check "></span> &nbsp;
            موافق
          </button>
          &nbsp;
          <button class="btn btn-printo pr-hideme" 
            @click="modal_recp.printed = 1 ;saveAll();print_co()">
            <span class="fa fa-print"></span> طباعة
          </button>
      </div>
  </div>
</b-modal>

  </section>
</template>

<script >
import { InoutHeadCtrl } from '../ctrls/InoutHeadCtrl'
import { CashflowCtrl, CashflowDAO } from '../ctrls/CashflowCtrl'
import { ReceiptDAO, ReceiptsCtrl } from '../ctrls/ReceiptsCtrl'
import { OutgoingsCtrl } from '../ctrls/OutgoingsCtrl'
import { SupplierDAO, SuppliersCtrl } from '../ctrls/SuppliersCtrl'
import draggable  from 'vuedraggable'
import { MainMixin } from '../mixins/MainMixin';
import { TransTypesCtrl } from '../ctrls/TransTypesCtrl';

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
      today_nolons: [],
      recp_in_sums: {},
      recp_default_comm_rate: this.$store.state.shader_configs['recp_comm'] ? parseFloat(this.$store.state.shader_configs['recp_comm']) : 0 ,
      recp_1: new ReceiptDAO({}),
      recp_2: new ReceiptDAO({}),
      recp_3: new ReceiptDAO({}),
      modal_recp: {},
      print_mode: false,
    }
  },
  mixins: [MainMixin],
  methods: {
    async refresh_all(){
      let recp_default_comm_rate = this.shader_configs['recp_comm'] ? parseFloat(this.shader_configs['recp_comm']) : 0 
      this.recp_1 = new ReceiptDAO({serial: 1, comm_rate: this.recp_default_comm_rate, ...ReceiptDAO.INIT_DAO})
      this.recp_2 = new ReceiptDAO({serial: 2, comm_rate: this.recp_default_comm_rate, ...ReceiptDAO.INIT_DAO})
      this.recp_3 = new ReceiptDAO({serial: 3, comm_rate: this.recp_default_comm_rate, ...ReceiptDAO.INIT_DAO})

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

      this.today_nolons = await this.cashflowCtrl.findAll({supplier_id: this.supplier_id, day: this.day.iso, state: 'nolon'})
      
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
    async setRecpPaid( receipt, recp_paid ) {
      receipt.recp_paid = recp_paid
      if(recp_paid == 2 ){
        let cashflowDAO = new CashflowDAO({
          day: this.day.iso,
          supplier_id: this.supplier_id,
          amount: receipt.net_value,
          d_product: receipt.products_arr
        })
        let transType = await new TransTypesCtrl().findOne({name: 'recp_paid', category: 'cashflow'})
        cashflowDAO.transType = transType
        await this.cashflowCtrl.save(cashflowDAO)
      }
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
    async saveNolons(){
      this.today_nolons.forEach(async (nolonCashflow) => {
        await this.cashflowCtrl.save(nolonCashflow)
      })
      this.refresh_all()
    },
    async addReceipt(num){
      this.show_receipts[num] = true
      if(num == 1) {
        let all = this.outgoings_sums.map( dao => this.clone(dao))
        this.recp_1.details = all
        this.recp_1.total_nolon = this.total_nolon
        // console.log(this.recp_1)
        this.modal_recp = this['recp_'+ num]
        this.$bvModal.show('modal-recp')
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
    /**@param {ReceiptDAO} dao*/
    calc_receipt(dao) {
      let sale_value = 0
      dao.details.forEach(detail => {
        sale_value += parseFloat(detail.weight) * parseFloat(detail.kg_price)
      })

      dao.sale_value = sale_value
      // TODO INIT VALUES
      dao.comm_rate = dao.comm_rate ? dao.comm_rate : 0
      dao.recp_comm = ( dao.comm_rate / 100 ) * sale_value
      dao.recp_expenses = dao.recp_expenses ? dao.recp_expenses : 0
      dao.recp_given = dao.recp_given ? dao.recp_given : 0 
      dao.net_value = sale_value - dao.recp_comm - dao.recp_given - dao.recp_expenses - dao.total_nolon
      // console.log("dao after ",sale_value , dao.recp_comm , dao.recp_given , dao.recp_expenses - dao.total_nolon)
    }
  },
  async mounted(){
    console.log('shader_configs', this.$store.state.shader_configs)
    this.refresh_all()
    let suppliersCtrl = new SuppliersCtrl()
    this.supplier = await suppliersCtrl.findById(this.supplier_id)
  },
  watch: {
    modal_recp: {
      /**@param {ReceiptDAO} dao*/
      handler: async function(dao) {
        this.calc_receipt(dao)
      },
      deep: true
    },
    recp_1: {
      handler: async function(dao){ this.calc_receipt(dao) },
      deep: true
    },
    recp_2: {
      handler: async function(dao){ this.calc_receipt(dao) },
      deep: true
    },
    recp_3: {
      handler: async function(dao){ this.calc_receipt(dao) },
      deep: true
    },
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

<style >
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
.row-detail label{
  font-weight: bold;
}
@media print {
  .modal-xl {
    margin: 0 !important;
    width: 100%;
    max-width: 100%;
  }
}
</style>
