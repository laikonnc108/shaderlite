<template>
<section class="home p-3">
  <div class="m-3">
    <h1 class="m-3">نظام مدير يومية الشادر</h1>
    <h2 class="text-danger"> اصدار رقم {{app_version}}</h2>
    <br/>
    <h3 class="text-danger" v-if="demo_till">* نسخة تجريبية حتي {{demo_till}}</h3>
    <h3 class="text-success" v-if="! demo_till">* نسخة مرخصة</h3>
    <h3 >
      تم قراءة ملف قاعدة بيانات, تاريخ اخر تحديث له
      {{db_file.time_updated}}
    </h3>
      <pre>
        {{db_file.filename}}
        {{ $store.state.electron_data.user_data_path }}
      </pre>
      <button :disabled="! db_file.found" class="btn btn-primary btn-lg" @click="import_db()" >
        <span class="fa fa-database "></span> &nbsp;
        استيراد قاعدة البيانات
      </button>
      &nbsp;
      <button class="btn btn-secondary btn-lg" @click="reload_electron()" >
        <span class="fa fa-sync "></span> &nbsp;
        اعادة تشغيل البرنامج
      </button>
  </div>
  <div v-if="shader_configs['logged_in_user'] && shader_configs['logged_in_user'].user_type =='developer'">
    
    <!-- <img alt="Vue logo" src="../assets/logo.png"> 
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    -->
    <div>Check if 7z installed {{is_7z_ok}}</div>
    

    <pre>{{ $store.state.electron_data }}</pre>
  <div class="card" style="width: 18rem;">
    <div class="card-body">
      <h5 class="card-title">System printers </h5>
      <p class="card-text">{{printers}}</p>
      <a href="#" @click="check7z()" class="btn btn-primary">Go somewhere</a> 
      <span>&nbsp;</span>
      <a href="#" @click="addUser()" class="btn btn-primary">Add User</a>
      <a href="#" @click="reload_electron()" class="btn btn-primary">Reload</a>
      <a href="#" @click="print_co()" class="btn btn-primary">print</a>
      <a href="#" @click="backup()" class="btn btn-primary">backup</a>
    </div>
  </div>
  </div>
</section>
</template>

<script >
import { sync_exec, knex } from '../main'
import { remote } from 'electron'
import { MainMixin } from '../mixins/MainMixin'
const fs = require('fs')

export default {
  name: 'home',
  data() {
    return {
      is_7z_ok: null,
      printers: [],
      db_file:{found: false, time_updated: null, filename:null},
      app_version: remote.app.getVersion(),
      demo_till: ''
    }
  },
  mixins: [MainMixin],
  components: {
  },
  async mounted() {
    /*
    let all = await ShaderConfigsModel.where({shader_name:'nada', category:'label'}).fetchAll()
    console.log(all)
    const res = await axios.get('https://jsonplaceholder.typicode.com/todos/1')
    this.breeds = res.data
    */
    //const out = await sync_exec(`dir D:\\00_db`)
    try {
      await knex.raw('select * from products')
    } catch (error) {
      const fs = require('fs');
      const moment = require('moment')
      moment.locale('ar')
      let lastModifiedDay = ''
      fs.readdir('D:\\00_db', async (err, files) => {
        files.forEach(file => {
          let fileday = (file.split(/-(.+)/)[1]) ? file.split(/-(.+)/)[1].split('.')[0] : null
          if(fileday > lastModifiedDay) {
            lastModifiedDay = fileday

            this.db_file.filename = file
            this.db_file.found = true

            let {mtimeMs} = fs.statSync('D:\\00_db'+ '\\'+ this.db_file.filename)
            this.db_file.time_updated = moment(mtimeMs).format('LLL')
          }
        })
      })
    }
  },
  methods: {
    async addUser(){
      /*
      await UsersCTRL.addNew({username:"abido",password:"arika",nono: "no"})
      */
    },
    async backup(){
      //const out = await sync_exec(`C:\\PROGRA~1\\7-Zip\\7z a D:\\zdevhome\\electron\\shaderlite\\db\\shaderlite.7z C:\\Users\\alrhma\\AppData\\Roaming\\shaderlite\\db\\shaderlite.db`)
      const out = await sync_exec(`copy C:\\Users\\alrhma\\AppData\\Roaming\\shaderlite\\db\\shaderlite.db D:\\zdevhome\\electron\\shaderlite\\db\\shaderlite.db`)
      console.log(out)
    },
    async import_db(){
      await sync_exec(`IF not exist ${this.$store.state.electron_data.user_data_path}\\db mkdir ${this.$store.state.electron_data.user_data_path}\\db NUL`)
      await sync_exec(`copy D:\\00_db\\${this.db_file.filename} ${this.$store.state.electron_data.user_data_path}\\db\\shaderlite.db`)
      window.alert('تم استيراد قاعدة البيانات بنجاح')
    },
    reload_electron(){
      remote.getCurrentWindow().reload();
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
        contents.print({silent: true })
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
