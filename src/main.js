import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import BootstrapVue from 'bootstrap-vue'


Vue.use(BootstrapVue)

Vue.config.productionTip = false

const {app} = require('electron').remote
const path = require('path')

store.commit('setElectronData',{
  app_path: app.getAppPath(),
  curr_dir: path.dirname(app.getAppPath()),
  db_path: path.resolve(path.dirname(app.getAppPath()), './db/shaderlite.db'),
  env:process.env
})

//var sqlite3 = require('sqlite3').verbose();
const dbFile = path.resolve(path.dirname(app.getAppPath()), './db/shaderlite.db')

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

export { knex, sqlite_config, bookshelf };
export * from './tools';

/*
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
*/

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
