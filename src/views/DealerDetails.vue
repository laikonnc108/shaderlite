<template>
  <section class="row">
    <div class="col-5 pr-hideme">
    {{ dealer }}
    </div>
    <div class="col-7 table-responsive" >
      <h3 class="m-3">سجل المعاملات </h3>
        <table class="table table-striped pr-me">
          <thead>
            <tr>
              <th>م </th>
              <th>التاريخ</th>
              <th>الحركة</th>
              <th>المبلغ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(payment, idx) in dealer_trans" >
            <tr :key='idx' :class="{'text-danger':payment.sum =='-' }">
              <th>{{idx +1 | toAR }} </th>
              <td>{{payment.day | arDate }}</td>
              <td>
                {{payment.trans_type | tr_label('trans_types')}}
                <span v-if="payment.notes">- {{payment.notes}} </span>
              </td>
              <td>
                <span v-if="payment.sum=='-'">( {{payment.amount | toAR}} )</span>
                <span v-else> {{payment.amount | toAR}} </span>
              </td>
              <td>
                <button  v-if="payment.id"
                class="btn text-danger pr-hideme" @click="removeTrans(payment)" >
                  <span class="fa fa-archive "></span> 
                  <template v-if="! confirm_step[payment.id]"> حذف </template>
                  <template v-if="confirm_step[payment.id]"> تأكيد </template>
                </button>
              </td>
              <!--
              <td>{{payment.balance_after | toAR}}</td>
              -->
            </tr>
            </template>
            <tr>
              <td></td>
              <td></td>
              <td>الرصيد الحالي</td>
              <td>
                <b>{{ 0 | toAR}}</b>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  </section>
</template>

<script>
import { Settings, DateTime } from 'luxon'
import { TransTypesCtrl } from '../ctrls/TransTypesCtrl';
import { CashflowDAO, CashflowCtrl } from '../ctrls/CashflowCtrl';
import { MainMixin } from '../mixins/MainMixin';
import AlertDay from '@/components/AlertDay.vue'
import { DealersCtrl, DealerDAO } from '../ctrls/DealersCtrl';

Settings.defaultLocale = 'ar'
Settings.defaultZoneName = 'UTC'

export default {
  name: 'dealer-details',
  data(){
    return {
      dealer: new DealerDAO(DealerDAO.INIT_DAO),
      dealer_trans: [],
      dealer_id: this.$route.params.id,
      store_day: this.$store.state.day,
      confirm_step_recp: [],
      confirm_step: [],
      dealersCtrl: new DealersCtrl(),
      trans_form: {trans_type: 'dealer_add'},
    }
  },
  components:{
    AlertDay
  },
  mixins: [MainMixin],
  methods: {
    async refresh_all(){
      let {dao, trans} = await this.dealersCtrl.getDealerDetails(this.dealer_id)
      this.dealer = dao
      this.dealer_trans = trans
    }
  },
  mounted() {
    this.refresh_all()
  },
  computed: {}
}
</script>

<style>

</style>