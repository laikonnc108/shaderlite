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

Vue.filter('tr_label' , function(string, collection) {
  console.log(collection, store.state.transtypes_arr)
  if(! collection)
    return (store.state.custom_labels[string])? store.state.custom_labels[string] : string
  else if (collection == 'trans_types')
    return (store.state.transtypes_arr[string])? store.state.transtypes_arr[string] : string
})

String.prototype.toAR= function() {
  return this.replace(/\d/g, d =>  '٠١٢٣٤٥٦٧٨٩'[d])
}

Vue.filter('toAR' , function(number) {
  let num = ( number || number === 0 ) ? parseFloat(number) : '--'
  return num.toLocaleString('ar-EG')
})

function testJSON(text){
  if (typeof text!=="string" || parseInt(text) >= 0){
      return false;
  }
  try{
      JSON.parse(text);
      return true;
  }
  catch (error){
      return false;
  }
}

Vue.filter('productsFilter' , function(products, separator = ' , ') {

  let only_prod_names = []

  if(testJSON(products)) {
    let all_products = JSON.parse(products)
    all_products.forEach(prod => {
      only_prod_names.push(prod.product)
    });
    return only_prod_names.join(separator)
  } 
  else if(products.indexOf(',') > -1) {
    let products_ids = products.split(',')
    products_ids.forEach(id => {
      only_prod_names.push(store.state.products_arr[id])
    })
    return only_prod_names.join(separator)
  }
  else if (parseInt(products) > 0) {
    return store.state.products_arr[parseInt(products)]
  }
  else {
    return products
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
