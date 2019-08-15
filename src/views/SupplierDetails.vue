<template>
  <section class="supllier-details">
    <section class="supp-head m-3">

      <button class="btn btn-primary pr-hideme" @click="$router.go(-1)">العودة</button>
      <h2 class="d-inline-block mr-3 ">ملف العميل : {{supplier.name}}</h2> 
      <br>
      <div class="pr-mt-2"></div>
      <table class="table table-bordered mt-1 pr-hideme">
        <tr>
          <th>تليفون العميل</th>
          <td>{{supplier.phone}}</td>

          <th>عنوان العميل</th>
          <td>{{supplier.address}}</td>
        </tr>

      </table>
    </section>
    <div class="table-responsive" >
      <h3 class="m-3">سجل دفعات العميل </h3>
        <table class="table table-striped pr-me">
          <thead>
            <tr>
              <th>م </th>
              <th>التاريخ</th>
              <th>الحركة</th>
              <th>المبلغ</th>
              <th>باقي</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(payment, idx) in supplier_trans" >
            <tr :key='idx' v-if="payment.trans_type == 'payment'">
              <th>{{idx +1 | toAR }} </th>
              <td>{{payment.day | arDate }}</td>
              <td>
                {{payment.trans_type}}
                <span v-if="payment.notes">- {{payment.notes}} </span>
              </td>
              <td>{{payment.amount | toAR}}</td>
              <td>{{payment.balance_after | toAR}}</td>
            </tr>
            </template>
            <tr>
              <td></td>
              <td>رصيد العميل الحالي</td>
              <td>
                <b>{{supplier.balance | toAR}}</b>
              </td>
            </tr>
          </tbody>
        </table>

      <h3 class="m-3">سجل فواتير العميل </h3>
        <table class="table table-striped pr-me">
          <thead>
            <tr>
              <th>م </th>
              <th>صافي الفاتورة</th>
              <th>عدد الطرود</th>
              <th>الاصناف</th>
              <th>التاريخ</th>
              <th>حالة الفاتورة</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(receipt, idx) in supplier_receipts" :key='idx'>
              <th>{{idx +1 | toAR }}</th>
              <td>
                {{receipt.net_value | round2 | toAR}}
              </td>
              <td>{{receipt.total_count | toAR}}</td>
              <td>{{receipt.products_arr | productsFilter }}</td>
              <td>{{receipt.day | arDate}}</td>
              <td>
                <span v-if="receipt.recp_paid == 1">رصد</span>
                <span v-if="receipt.recp_paid == 2">صرف</span>
              </td>
              <td> 
                <button class="btn text-danger" @click="removeRecpItself(receipt.id)" >
                  <span class="fa fa-archive "></span> 
                  <template v-if="! confirm_step_recp[receipt.id]"> حذف الفاتورة</template>
                  <template v-if="confirm_step_recp[receipt.id]"> تأكيد </template>
                </button>
              </td>

            </tr>
          </tbody>
        </table>
<div class="m-3">اجمالي فواتير الرصد فقط = <b>{{supp_recps_sums.total_rasd | round2 | toAR}}</b> </div>
        <div class="text-center">
          <button class="btn btn-printo pr-hideme" @click="vue_window.print()">
            <span class="fa fa-print"></span> طباعة 
          </button>
        </div>
    </div>

  </section>
</template>

<script>
import { SupplierDAO, SuppliersCtrl } from '../ctrls/SuppliersCtrl';
import { ReceiptsCtrl } from '../ctrls/ReceiptsCtrl';
export default {
  name: 'supllier-details',
  data(){
    return {
      supplier: new SupplierDAO(SupplierDAO.INIT_DAO),
      supplier_trans: [],
      supplier_receipts: [],
      supplier_id: this.$route.params.id,
      store_day: this.$store.state.day,
      confirm_step_recp: [],
      suppliersCtrl: new SuppliersCtrl()
    }
  },
  methods: {
    async refresh_all(){
      let {dao, trans} = await this.suppliersCtrl.getSupplierDetails(this.supplier_id)
      this.supplier = dao
      this.supplier_trans = trans
      let receiptsCtrl = new ReceiptsCtrl()
      this.supplier_receipts = await receiptsCtrl.findAll({supplier_id: this.supplier_id})
    }
  },
  mounted() {
    this.refresh_all()
  },
  computed: {
      supp_recps_sums: function() {
      let supp_recps_sums = {total_rasd: 0 }
      this.supplier_receipts.forEach(item =>{
        if(item.recp_paid == 1)
          supp_recps_sums.total_rasd += parseFloat(item.net_value)
      })
      // this.receipt.sale_value = sum
      return supp_recps_sums
    },
  }
}
</script>
