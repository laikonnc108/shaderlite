<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> 
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    -->

      {{breeds}}
    
    Check if 7z installed {{is_7z_ok}}
    <pre>
      {{ $store.state.electron_data }}
      {{ $store.state.lorem }}
    </pre>
  <div class="card" style="width: 18rem;">
    <div class="card-body">
      <h5 class="card-title">System printers </h5>
      <p class="card-text">{{printers}}</p>
      <a href="#" @click="check7z()" class="btn btn-primary">Go somewhere</a> 
      <span>&nbsp;</span>
      <a href="#" @click="addUser()" class="btn btn-primary">Add User</a>
    </div>
  </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import { sync_exec, knex } from '../main'
import { remote } from 'electron'

const fs = require('fs')
const axios = require('axios')

export default {
  name: 'home',
  data() {
    return {
      is_7z_ok: null,
      breeds: null,
      printers: []
    }
  },
  components: {
    HelloWorld
  },
  async mounted() {
    const res = await axios.get('https://jsonplaceholder.typicode.com/todos/1')
    this.breeds = res.data
    let lorem = await knex('lorem').select().limit(10);
    let text = ''
    lorem.map(_=>{
      text += JSON.stringify(_)
    })
    console.log(lorem,text)
    this.$store.commit('setLorem',text)
  },
  methods: {
    async addUser(){
      /*
      await UsersCTRL.addNew({username:"abido",password:"arika",nono: "no"})
      */
    },
    async check7z(){
      
      //var exec = require('child_process').exec
      try {
        const out = await sync_exec('C:\\PROGRA~1\\7-Zip\\7z -h ');
        // check 7z valid
        console.log(out.stdout);
        this.is_7z_ok = true
        const contents = remote.getCurrentWebContents()
        this.printers = contents.getPrinters()
        // contents.print({silent: false })
        // contents.printToPDF(options, callback)
        contents.printToPDF({/*pageSize:"A5"*/}, (error, data) => {
          if (error) throw error
          fs.writeFile('D:/tmp/print.pdf', data, (error) => {
            if (error) throw error
            console.log('Write PDF successfully.')
          })
        })
      } catch (error) {
        this.is_7z_ok = false
        console.error("7z Error: ", error)
      }
    }
  }
}
</script>
