import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {store, MyStoreMutations} from './store'
import BootstrapVue from 'bootstrap-vue'

Vue.use(BootstrapVue)

// Import vue-datetime with specific loader for CSS files
import Datetime from 'vue-datetime'
import 'vue-datetime/dist/vue-datetime.css'
Vue.use(Datetime)

Vue.config.productionTip = false

const {app} = require('electron').remote
const path = require('path')

const dbFile = path.resolve(path.dirname(app.getAppPath()), './db/shaderlite.db')

store.commit('setElectronData',{
  app_path: app.getAppPath(),
  curr_dir: path.dirname(app.getAppPath()),
  db_path: dbFile,
  env:process.env
})

let sqlite_config = {
  client: 'sqlite3',
  connection: {
    filename: dbFile
  },
  useNullAsDefault: true
}

const knex = require('knex')(sqlite_config);
const bookshelf = require('bookshelf')(knex)
bookshelf.plugin(require('bookshelf-soft-delete'))

export { knex, sqlite_config, bookshelf, MyStoreMutations };
export * from './tools';
import {moment} from './tools'

Vue.filter('arDate' , function(date) {
  return moment(date).format('LL')
})

Vue.filter('tr_label' , function(string) {
  return (store.state.custom_labels[string])? store.state.custom_labels[string] : string
})

String.prototype.toAR= function() {
  return this.replace(/\d/g, d =>  '٠١٢٣٤٥٦٧٨٩'[d])
}

Vue.filter('toAR' , function(number) {
  let num = ( number || number === 0 ) ? parseFloat(number) : '--'
  return num.toLocaleString('ar-EG')
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
