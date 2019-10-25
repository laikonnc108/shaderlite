<template>
  <section class="receipts bg-receipts minh90 p-3">
    <div class="pr-hideme">
      <h3 class="text-danger fa fa-eraser larger" @click="search_term = ''" v-if="search_term"></h3>
      <input
        v-model="search_term"
        class="form-control"
        :placeholder="custom_labels['search_suppliers']"
      />
      <br />
    </div>

    <h1>فواتير الرصد للعملاء</h1>
    <table class="table table-striped table-sm pr-me-l">
      <thead>
        <tr>
          <th>اسم العميل</th>
          <th>الاصناف</th>
          <th>عدد الطرود</th>
          <th>صافي الفاتورة</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in fltrd_rasd_recps_arr" :key="idx">
          <td>
            <router-link
              class="nav-link"
              :to="{name:'supplier_details', params: {id: row.supplier_id}}"
            >{{row.supplier_name}}</router-link>
          </td>

          <td width="25%">{{row.products_arr| productsFilter}}</td>
          <td>{{row.total_count}}</td>
          <td>{{row.net_value | round }}</td>
          <td>
            <div v-if="row.day != day.iso" class="text-danger">وارد {{row.day | arDate }}</div>
            <router-link
              class="nav-link"
              :to="{name:'supp_recp_details', params: {supplier_id: row.supplier_id, day: row.day}}"
            >عرض الفواتير</router-link>
          </td>
        </tr>
        <tr v-if="! search_term">
          <th>اجمالي</th>
          <td></td>
          <td></td>
          <th>{{totals.total_net | round}}</th>
          <td></td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
<script >
import { ReceiptsCtrl } from "../ctrls/ReceiptsCtrl";
import { MainMixin } from "../mixins/MainMixin";

export default {
  name: "ctg-receipts",
  data() {
    return {
      rasd_recps_arr: [],
      receiptsCtrl: new ReceiptsCtrl()
    };
  },
  mixins: [MainMixin],
  methods: {
    async refresh_all() {
      this.rasd_recps_arr = await this.receiptsCtrl.findAll({ recp_paid: 1 });
    }
  },
  components: {},
  computed: {
    totals() {
      let totals = { total_net: 0 };
      this.rasd_recps_arr.forEach(one => {
        totals.total_net += one.net_value;
      });
      return totals;
    },
    fltrd_rasd_recps_arr: function(){
      return this.rasd_recps_arr.filter( item => {
        return (item.supplier_name.includes(this.search_term))
      })
    }
  },
  mounted() {
    this.refresh_all();
  }
};
</script>