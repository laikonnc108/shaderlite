<template>
  <div
    v-if="day.iso != day.should_be"
    class="p-1 m-1 alerty" 
    >
      اليومية المفترضة{{day.should_be | arDate }}
      <br/>
       مختلفة عن يومية المعاملة النقدية
  </div>
</template>
<script>
import { MainMixin } from '../mixins/MainMixin'

export default {
  name: 'AlertDay',
  props: {

  },
  mixins:[MainMixin],
  data(){
    return {

    }
  },
  methods: {

  },
  mounted(){
    console.log(this.day)
  },

}
</script>
