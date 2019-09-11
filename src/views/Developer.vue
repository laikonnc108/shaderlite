<template>
<section class="home p-3">
  <div class="m-3">
    <h1 class="m-1 text-center">نظام وكالة الخضار والفاكهة</h1>
    <h2 class="text-danger"> اصدار رقم {{app_version}}</h2>
    <h3 class="text-danger" v-if="demo_till">* نسخة تجريبية حتي {{demo_till}}</h3>
    <h3 class="text-success" v-if="! demo_till">* نسخة مرخصة</h3>

    <section v-if=" working_db">
      <button class="btn btn-danger btn-lg" @click="remove_db()" >
        <span class="fa fa-database "></span> &nbsp;
        مسح قاعدة البيانات الموجودة
      </button>
    </section>
    <section v-else>
      <h3 >
        تم قراءة ملف نسخة قاعدة بيانات, تاريخ اخر تحديث له
        {{db_file.time_updated}}
      </h3>
      <button :disabled="! db_file.found" class="btn btn-primary btn-lg" @click="import_db()" >
        <span class="fa fa-database "></span> &nbsp;
        استيراد قاعدة البيانات
      </button>
      <pre>
        File: {{db_file.filename}}
        TO: {{ $store.state.electron_data.user_data_path }}
      </pre>
      <br/>
      <button v-if="removed_exists" class="btn btn-danger btn-lg" @click="restore_removed()" >
        <span class="fa fa-database "></span> &nbsp;
        استعادة ملف قاعدة البيانات الذي تم حذفه
      </button> &nbsp;


    </section>
     <br/>
      <button class="btn btn-secondary btn-lg" @click="reload_electron()" >
        <span class="fa fa-sync "></span> &nbsp;
        اعادة تشغيل البرنامج
      </button>
  </div>
  <div v-if="$store.state.electron_data.env.NODE_ENV == 'development' || (shader_configs['logged_in_user'] && shader_configs['logged_in_user'].user_type =='developer')">
    
    <!-- <img alt="Vue logo" src="../assets/logo.png"> 
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    -->
    <div>Check if 7z installed {{is_7z_ok}}</div>
    

    <pre>{{ $store.state.electron_data }}</pre>

      <h5 class="card-title">System printers </h5>
      <p class="card-text">{{printers}}</p>
      <a href="#" @click="check7z()" class="btn btn-primary">Go check7z</a> 
      <span>&nbsp;</span>
      <a href="#" @click="print_co()" class="btn btn-primary">print</a>
      <span>&nbsp;</span>
      <a href="#" @click="backup()" class="btn btn-primary">backup</a>
      <span>&nbsp;</span>
      <a href="#" @click="wb_backup()" class="btn btn-primary">wb backup</a>
      <span>&nbsp;</span>
      <a href="#" @click="wb_restore()" class="btn btn-primary">استيراد من الويب</a>
  </div>
</section>
</template>

<script >
import { sync_exec, knex } from '../main'
import { remote, clipboard } from 'electron'
import { MainMixin } from '../mixins/MainMixin'
import { ProductsCtrl } from '../ctrls/ProductsCtrl';
const fs = require('fs')

export default {
  name: 'home',
  data() {
    return {
      is_7z_ok: null,
      removed_exists: false,
      printers: [],
      working_db: false,
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
      let results = await knex.raw('PRAGMA integrity_check;')
      console.log("integrity_check : ",results)
      await new ProductsCtrl().findAll()
      this.working_db = true
    } catch (error) {
      let if_exists_outp = await sync_exec(`IF exist ${this.$store.state.electron_data.user_data_path}\\db\\shaderlite.db echo file_exists`)
      if(if_exists_outp.stdout.includes('file_exists')){
        this.removed_exists = true
      }

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
    async backup(){
      //const out = await sync_exec(`C:\\PROGRA~1\\7-Zip\\7z a D:\\zdevhome\\electron\\shaderlite\\db\\shaderlite.7z C:\\Users\\alrhma\\AppData\\Roaming\\shaderlite\\db\\shaderlite.db`)
      const out = await sync_exec(`copy ${this.$store.state.electron_data.user_data_path}\\db\\shaderlite.db D:\\zdevhome\\electron\\shaderlite\\db\\shaderlite.db`)
      
      console.log(out)
    },
    async wb_backup(){
      // await knex.destroy()
      const {stdout} = await sync_exec(`curl --upload-file ${this.$store.state.electron_data.user_data_path}\\db\\shaderlite.db https://transfer.sh/shaderlite.db`)
      clipboard.writeText(stdout)
      window.alert('تم نسخ رابط قاعدة البيانات '+stdout)
    },
    async wb_restore(){
      // await knex.destroy()
      let url = clipboard.readText()
      console.log(url)
      const {stdout,stderr} = await sync_exec(`curl ${url} --output ${this.$store.state.electron_data.user_data_path}\\db\\shaderlite.db`)
      this.reload_electron()
    },
    async import_db(){
      await sync_exec(`IF not exist ${this.$store.state.electron_data.user_data_path}\\db mkdir ${this.$store.state.electron_data.user_data_path}\\db NUL`)
      await sync_exec(`copy D:\\00_db\\${this.db_file.filename} ${this.$store.state.electron_data.user_data_path}\\db\\shaderlite.db`)
      if(window.confirm(' تم استيراد قاعدة البيانات بنجاح, سيتم اعادة تشغيل البرنامج')){
        this.reload_electron()
      }
    },
    async remove_db(){
      if(window.confirm('هل انت متأكد من مسح قاعدة البيانات الحالية')){
        await knex.destroy()
        await sync_exec(`del ${this.$store.state.electron_data.user_data_path}\\db\\_shaderlite.db`)
        let output = await sync_exec(`rename ${this.$store.state.electron_data.user_data_path}\\db\\shaderlite.db _shaderlite.db `)
        console.log('output', output)
        this.reload_electron()
      }
    },
    async restore_removed(){
      await knex.destroy()
      let remove = await sync_exec(`del ${this.$store.state.electron_data.user_data_path}\\db\\shaderlite.db`)
      console.log(remove)
      let output = await sync_exec(`rename ${this.$store.state.electron_data.user_data_path}\\db\\_shaderlite.db shaderlite.db `)
      console.log(output)
      this.reload_electron()
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
