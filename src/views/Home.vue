<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> 
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    -->
    Check if 7z installed {{is_7z_ok}}
  <div class="card" style="width: 18rem;">
    <div class="card-body">
      <h5 class="card-title">Card title</h5>
      <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
      <a href="#" @click="check7z()" class="btn btn-primary">Go somewhere</a>
    </div>
  </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import { sync_exec } from '../main'

export default {
  name: 'home',
  data() {
    return {
      is_7z_ok: null
    }
  },
  components: {
    HelloWorld
  },
  methods: {
    async check7z(){
      //var exec = require('child_process').exec
      try {
        const out = await sync_exec('C:\\PROGRA~1\\7-Zip\\7z -h ');
        // check 7z valid
        console.log(`${out}`);
        this.is_7z_ok = true
      } catch (error) {
        this.is_7z_ok = false
        console.error("7z Error: ", error)
      }
    }
  }
}
</script>
