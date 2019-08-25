<template>
  <section class="template m-3">
    TEMPLATE
  </section>
</template>
<script>
import { MainMixin } from '../mixins/MainMixin'

export default {
  name: 'template',
  data() {
    return {
      all: [],
      confirm_step: [],
      single: {},
    }
  },
  mixins:[MainMixin],
  methods: {
    async save(evt) {
      evt.preventDefault()
    },
    async refresh_all(){

    }
  },
  async mounted() {
    this.refresh_all()
  },
}
</script>

