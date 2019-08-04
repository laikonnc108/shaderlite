<template>
  <section class="incoming-resalah-form">
    <h1>incoming-resalah-form Component IncomingResalahForm</h1>
    <div v-for="(item, index) in $store.state.products_arr" :key="index">{{ index }} - {{item}}</div>
    
  </section>
</template>

<script >

export default {
  name: 'IncomingResalahForm',
  data () {
    return {}
  },
  firestore () {
    return {}
  },
  methods: {
  },
  async beforeMount () {
    // console.log(this.$store.state.products_arr)
  },
  components: {
  }
}
</script>

