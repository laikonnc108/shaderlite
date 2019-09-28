import { bookshelf } from '../main'
import { store } from '../store'

export class ShaderConfigsCtrl {
  /**@type {import('bookshelf').Model} */
  model

  constructor() {
    this.model = require('../models/ShaderConfigsModel')(bookshelf)
  }
  
  async godada(){
    /**@type {import('bookshelf').ModelBase} */
    let tata = await this.model.forge({
        config_name: 'hamoda'
    }).save()

    console.log(tata.toJSON())
    console.log(tata.id)
  }

  findAll(filter = {}) {
    
    /*
    let all = await this.model.findAll()
    // OR
    let all = await this.model.collection().query(function(qb) {
      qb.where('shader_name', '=', 'nada')
    }).fetch()
    */
    return this.model.where(filter).fetchAll()
  }

  async getAppCongifs(){
    let all_configs = await this.findAll({shader_name: 'default',category:'config'})
    let configs_arr = []
    // Can do map 
    all_configs.forEach( element => {
      let config_value = (element.get('config_value') === 'true' || element.get('config_value') === 'false' ) ? JSON.parse(element.get('config_value')) : element.get('config_value')
      configs_arr[element.get('config_name')] = config_value
    });
    // Override with custom labels
    let custom_labels = await this.findAll({shader_name: store.state.app_config.shader_name, category:'config'})
    custom_labels.forEach( element => {
      let config_value = (element.get('config_value') === 'true' || element.get('config_value') === 'false' ) ? JSON.parse(element.get('config_value')) : element.get('config_value')
      configs_arr[element.get('config_name')] = config_value
    })
    console.log(configs_arr)
    return configs_arr
  }

  async getAppLabels(){

    let all_labels = await this.findAll({shader_name: 'default',category:'label'})
    let labels_arr = []
    // Can do map 
    all_labels.forEach( element => {
      labels_arr[element.get('config_name')] = element.get('config_value')
    });
    // Override with custom labels
    let custom_labels = await this.findAll({shader_name: store.state.app_config.shader_name ,category:'label'})
    custom_labels.forEach( element => {
      labels_arr[element.get('config_name')] = element.get('config_value')
    });
    return labels_arr
  }
}