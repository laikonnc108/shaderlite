<template>
  <section class="supp-receipts-details">
    <h1>src-views-supp-receipts-details Component</h1>
  </section>
</template>

<script >
import { InoutHeadCtrl } from '../ctrls/InoutHeadCtrl'
import { ReceiptDAO, ReceiptsCtrl } from '../ctrls/ReceiptsCtrl'

export default {
  name: 'supp-receipts-details',
  data () {
    return {
      store_day: this.$store.state.day,
      supplier_id: this.$route.params.id,
      inoutHeadCtrl: new InoutHeadCtrl(),
      receiptsCtrl: new ReceiptsCtrl(),
    }
  },
  methods: {
  },
  components: {
  }
}
</script>

<style scoped >

</style>
