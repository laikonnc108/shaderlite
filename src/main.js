import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import BootstrapVue from 'bootstrap-vue'

Vue.use(BootstrapVue)

Vue.config.productionTip = false

export * from './tools';

const {app} = require('electron').remote
const path = require('path')
console.log(app.getPath('userData'))
store.commit('setElectronData',{
  app_path: app.getAppPath(),
  curr_dir: path.resolve(__dirname, '..'),
  curr_dir2: path.dirname(app.getAppPath()),
  db_path: path.resolve(path.dirname(app.getAppPath()), './db/shaderlite.db'),
  env:process.env
})

var sqlite3 = require('sqlite3').verbose();
const dbFile = path.resolve(path.dirname(app.getAppPath()), './db/shaderlite.db')

var db = new sqlite3.Database(dbFile);
 
db.serialize(function() {
 
  var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
  for (var i = 0; i < 10; i++) {
      stmt.run("Ipsum " + i);
  }
  stmt.finalize();
  let lorem = []
  db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
      lorem.push(row.id + ": " + row.info);
  });
  store.commit('setLorem',lorem)
});
 
db.close();

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
